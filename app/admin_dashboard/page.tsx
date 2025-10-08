"use client"
import { useState, useRef, useEffect } from "react"
import { Calendar, QrCode, Scissors, LogOut, User, Check, Clock, Star, ArrowUp, Camera, X, RotateCcw, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import axios from "axios"
import jsQR from "jsqr"
import { BACKEND_URL } from "@/components/config"
import useAdminAuth from "@/hooks/useAdminAuth"

interface Booking {
  id: string;
  name: string;
  preferred_time: string;
  preferred_date: string;
  done: boolean;
  isLoyal: boolean;
  points: number;
  status: "done" | "pending" | "confirmed";
  phone?: string;
}

interface WeeklyData {
  day: string;
  bookings: number;
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function BarberDashboard() {
  useAdminAuth()
  const [bookingList, setBookingList] = useState<Booking[]>([])
  const [money, setMoney] = useState(0)
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const router = useRouter()
  const dateRef = useRef<HTMLInputElement>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [qrResult, setQrResult] = useState("")
  const [scannedCustomer, setScannedCustomer] = useState<Booking | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [leaderboard, setLeaderboard] = useState<{ name: string; point: number }[]>([])
  const [showAmountCard, setShowAmountCard] = useState(false)
  const [amountInput, setAmountInput] = useState("")
  const [pendingCustomer, setPendingCustomer] = useState<any>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [currentCameraId, setCurrentCameraId] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)

  const scannerRef = useRef<HTMLElement>(null)
  const bookingsRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  

  // Fetch bookings when date changes
  useEffect(() => {
    all_names()
  }, [selectedDate])

  // Calculate total revenue for selected date
  const calculateRevenue = () => {
    let total = 0
    bookingList.forEach((booking) => {
      if (booking.done && booking.preferred_date === selectedDate) {
        total += 0 // revenue logic removed for now
      }
    })
    setMoney(total)
  }

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/admin/loyalty-leaderboard`);
      setLeaderboard(res.data.leaderboard.map((user: any) => ({
        name: user.name,
        point: parseInt(user.point || 0)
      })));
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Fetch all bookings
  const all_names = async () => {
    const dates = dateRef.current?.value || selectedDate
    const token = localStorage.getItem("adminToken")

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/all`,
        { date: dates },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const bookings = response.data.message.map((b: any) => ({
        id: b._id,
        name: b.name,
        preferred_time: b.preferred_time,
        preferred_date: b.preferred_date,
        done: b.done || false,
        isLoyal: b.isLoyal || false,
        points: parseInt(b.points || "0"),
        status: b.done ? "done" : "pending"
      }))
      setBookingList(bookings)
    } catch (error) {
      console.error("Booking fetch failed:", error)
    }
  }

  // Handle amount submission
  const handleAmountSubmit = async () => {
    if (!pendingCustomer) return;

    const serviceAmount = parseFloat(amountInput)
    if (isNaN(serviceAmount) || serviceAmount <= 0) {
      setQrResult("❌ Invalid amount entered.")
      setShowAmountCard(false)
      return
    }

    const pointsToAdd = Math.floor(serviceAmount * 0.1)

    try {
      await axios.post(`${BACKEND_URL}/api/v1/admin/add-points`, { 
        userId: pendingCustomer._id,
        points: pointsToAdd,
        serviceAmount
      })

      const updatedCustomer = {
        ...pendingCustomer,
        points: parseInt(pendingCustomer.point || "0") + pointsToAdd,
        done: true,
        status: "done"
      }

      setScannedCustomer(updatedCustomer)
      setQrResult(`✅ ${pendingCustomer.name} earned +${pointsToAdd} points!`)
      all_names()
      await fetchLeaderboard();
      
    } catch (err) {
      console.error("Failed to add points", err)
      setQrResult("❌ Failed to add points")
    }

    setShowAmountCard(false)
    setAmountInput("")
    setPendingCustomer(null)
  }

  // Get available cameras
  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      setAvailableCameras(videoDevices)
      return videoDevices
    } catch (err) {
      console.error("Error getting cameras:", err)
      return []
    }
  }

  // Camera controls
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      const stream = videoRef.current.srcObject
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      setCameraActive(false)
      setIsScanning(false)
    }
  }

  const startCamera = async (facingMode: "user" | "environment" = "environment", deviceId?: string) => {
    try {
      stopCamera() // Stop any existing camera

      // Always use back camera on mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const preferredFacingMode = isMobile ? "environment" : facingMode;

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: deviceId ? undefined : preferredFacingMode,
          deviceId: deviceId ? { exact: deviceId } : undefined,
          aspectRatio: { ideal: 1 } // Better for QR scanning
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraActive(true)
        setIsScanning(true)
        setScanSuccess(false)
        
        // Get the actual device ID being used
        const videoTrack = stream.getVideoTracks()[0]
        if (videoTrack) {
          setCurrentCameraId(videoTrack.getSettings().deviceId || "")
        }
        
        // Update available cameras
        await getCameras()
      }
    } catch (err) {
      console.error("Camera access denied:", err)
      setQrResult("❌ Camera access denied. Please allow camera permissions.")
      // Fallback to basic constraints if specific camera fails
      if (deviceId || facingMode !== "user") {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
          })
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream
            await videoRef.current.play()
            setCameraActive(true)
            setIsScanning(true)
          }
        } catch (fallbackErr) {
          console.error("Fallback camera also failed:", fallbackErr)
          setQrResult("❌ Cannot access camera. Please check permissions.")
        }
      }
    }
  }

  // Switch between front and back camera
  const switchCamera = async () => {
    const cameras = await getCameras()
    
    if (cameras.length <= 1) {
      // If only one camera, toggle between user and environment
      const newFacingMode = facingMode === "user" ? "environment" : "user"
      setFacingMode(newFacingMode)
      await startCamera(newFacingMode)
      return
    }

    // If multiple cameras, cycle through them
    const currentIndex = cameras.findIndex(cam => cam.deviceId === currentCameraId)
    const nextIndex = (currentIndex + 1) % cameras.length
    const nextCamera = cameras[nextIndex]
    
    setCurrentCameraId(nextCamera.deviceId)
    await startCamera("environment", nextCamera.deviceId)
  }

  // QR Scanner Logic - IMPROVED
  const scanQRCode = async () => {
    if (!isScanning) return;

    const context = canvasRef.current?.getContext("2d", { willReadFrequently: true })
    const video = videoRef.current
    if (!video || !context || !canvasRef.current || video.readyState !== 4) return

    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const qrCode = jsQR(imageData.data, canvas.width, canvas.height)

    if (qrCode) {
      const qrText = qrCode.data.trim()
      console.log("Scanned QR Code:", qrText)

      // Visual feedback
      setScanSuccess(true)
      setIsScanning(false)

      try {
        const verifyRes = await axios.post(`${BACKEND_URL}/api/v1/admin/check`, { qrContent: qrText })
        console.log("Verification response:", verifyRes.data)

        if (verifyRes.data.valid && verifyRes.data.customer) {
          const customer = verifyRes.data.customer
          console.log("Customer found:", customer)
          
          // Set pending customer to show amount input card
          setPendingCustomer(customer)
          setShowAmountCard(true)
          setQrResult("") // Clear any previous errors
          stopCamera()
        } else {
          console.log("Invalid QR code")
          setQrResult("❌ " + (verifyRes.data.message || "Invalid QR code"))
          setTimeout(() => {
            setQrResult("")
            setIsScanning(true) // Resume scanning
            setScanSuccess(false)
          }, 2000)
        }
      } catch (err: any) {
        console.error("QR verification failed:", err)
        if (err.response?.status === 404) {
          setQrResult("❌ Customer not found in database")
        } else if (err.response?.status === 400) {
          setQrResult("❌ Invalid QR code format")
        } else {
          setQrResult("❌ QR verification failed - Server error")
        }
        setTimeout(() => {
          setQrResult("")
          setIsScanning(true) // Resume scanning
          setScanSuccess(false)
        }, 2000)
      }
    }
  }

  useEffect(() => {
    let interval: any
    if (cameraActive && isScanning) {
      interval = setInterval(scanQRCode, 500) // Faster scanning on mobile
    }
    return () => clearInterval(interval)
  }, [cameraActive, isScanning])

  // Clear scanned customer
  const clearScannedCustomer = () => {
    setScannedCustomer(null);
    setQrResult("");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-orange-900/20 bg-black/95 backdrop-blur px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-600 to-orange-800">
            <Scissors className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">Samir Salon</span>
            <span className="ml-2 text-sm text-orange-400">Admin</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-orange-900/20">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                <AvatarFallback className="bg-orange-600 text-white">A</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-900 border-orange-900/20" align="end">
            <DropdownMenuItem className="hover:bg-orange-900/20 text-white">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-orange-900/20 text-white">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <main className="space-y-8 p-4 md:p-6">
        {/* Amount Input Card Modal */}
        {showAmountCard && pendingCustomer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border-orange-900/20 w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Enter Service Amount</CardTitle>
                  <CardDescription className="text-gray-400">
                    For customer: {pendingCustomer.name}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowAmountCard(false)
                    setPendingCustomer(null)
                    setAmountInput("")
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium text-gray-300">
                    Service Amount (₹)
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    autoFocus
                  />
                </div>
                {amountInput && !isNaN(parseFloat(amountInput)) && (
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">
                      Points to be added: <span className="text-orange-400 font-semibold">
                        {Math.floor(parseFloat(amountInput) * 0.1)} points
                      </span>
                    </p>
                  </div>
                )}
                <Button 
                  onClick={handleAmountSubmit}
                  disabled={!amountInput || isNaN(parseFloat(amountInput)) || parseFloat(amountInput) <= 0}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Add Points
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <section ref={scannerRef} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-white">QR Scanner</h2>
            <div className="flex gap-2">
              {cameraActive && availableCameras.length > 1 && (
                <Button onClick={switchCamera} variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-900/20 hidden md:flex">
                  <RotateCcw className="h-4 w-4 mr-2" /> Switch Camera
                </Button>
              )}
              {cameraActive && (
                <Button onClick={stopCamera} variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-900/20">
                  <ArrowUp className="h-4 w-4 mr-2" /> Stop
                </Button>
              )}
            </div>
          </div>
          <Card className="bg-gray-900 border-orange-900/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Live QR Scanner
              </CardTitle>
              <CardDescription className="text-gray-400">
                {cameraActive 
                  ? "Point camera at QR code to scan" 
                  : "Click 'Start Scanner' to begin scanning"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scanner Container with Overlay */}
              <div className="relative bg-black rounded-lg border-2 border-dashed border-orange-600 overflow-hidden">
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover rounded-lg"
                  style={{ 
                    transform: facingMode === "user" ? 'scaleX(-1)' : 'none',
                    minHeight: '300px'
                  }}
                />
                
                {/* Scanner Overlay */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Scanning Frame */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-orange-400 rounded-lg shadow-lg">
                      {/* Corner borders */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-orange-400 rounded-tl"></div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-orange-400 rounded-tr"></div>
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-orange-400 rounded-bl"></div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-orange-400 rounded-br"></div>
                      
                      {/* Scanning Animation */}
                      {isScanning && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-orange-400 animate-pulse shadow-lg shadow-orange-400/50"></div>
                      )}
                    </div>
                    
                    {/* Success Animation */}
                    {scanSuccess && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-ping">
                          <Check className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Instructions */}
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-white bg-black/50 px-3 py-1 rounded-full text-sm inline-block">
                        📱 Position QR code within frame
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Placeholder when camera is off */}
                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4">
                    <div className="w-24 h-24 bg-orange-900/20 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-orange-600/50">
                      <Camera className="h-12 w-12 opacity-50" />
                    </div>
                    <p className="text-center text-lg mb-2">QR Code Scanner</p>
                    <p className="text-center text-sm text-gray-500 mb-4">
                      Scan customer QR codes to add loyalty points
                    </p>
                  </div>
                )}
              </div>
              
              <canvas ref={canvasRef} width={640} height={480} className="hidden"></canvas>
              
              <div className="flex flex-col sm:flex-row gap-2">
                {!cameraActive ? (
                  <Button 
                    onClick={() => startCamera("environment")} 
                    className="bg-orange-600 hover:bg-orange-700 text-white py-3 text-base"
                    size="lg"
                  >
                    <Camera className="h-5 w-5 mr-2" /> Start Scanner
                  </Button>
                ) : (
                  <div className="flex gap-2 w-full">
                    <Button 
                      onClick={() => setIsScanning(!isScanning)} 
                      variant={isScanning ? "default" : "outline"}
                      className={isScanning 
                        ? "bg-green-600 hover:bg-green-700 text-white flex-1" 
                        : "border-orange-600 text-orange-400 hover:bg-orange-900/20 flex-1"
                      }
                    >
                      {isScanning ? (
                        <>
                          <Scan className="h-4 w-4 mr-2 animate-pulse" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Scan className="h-4 w-4 mr-2" />
                          Resume Scan
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Results */}
              {scannedCustomer && (
                <Card className="bg-gray-900 border-green-900/20 mt-4 animate-in fade-in duration-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                      <CardTitle className="text-green-400 text-lg font-bold">Points Added!</CardTitle>
                      <CardDescription className="text-gray-400">Customer scanned successfully</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearScannedCustomer}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-green-600 text-white">
                          {scannedCustomer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-semibold">{scannedCustomer.name}</p>
                        <p className="text-green-400 font-medium">Total Points: {scannedCustomer.points}</p>
                        <p className="text-gray-400 text-sm">Phone: {scannedCustomer.phone}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="border-green-600 text-green-400">
                        Status: Done
                      </Badge>
                      <Button 
                        variant="outline" 
                        className="border-orange-600 text-orange-400 hover:bg-orange-900/20"
                        onClick={() => {
                          clearScannedCustomer();
                          startCamera("environment");
                        }}
                      >
                        Scan Another
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {qrResult && (
                <div className={`p-4 rounded-lg text-center animate-in fade-in duration-300 ${
                  qrResult.includes('✅') 
                    ? 'bg-green-900/20 border border-green-600/30 text-green-400' 
                    : 'bg-red-900/20 border border-red-600/30 text-red-400'
                }`}>
                  <p className="font-medium">{qrResult}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <footer className="mt-10 p-6 bg-gray-900 border-t border-orange-900/20 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">🏆 Loyalty Leaderboard</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {leaderboard.length === 0 && <p className="text-gray-400">No loyal customers yet.</p>}
            {leaderboard.map((user, idx) => (
              <div key={idx} className="flex justify-between px-4 py-2 bg-black/40 rounded-md border border-orange-800">
                <span className="text-white font-medium">{idx + 1}. {user.name}</span>
                <span className="text-orange-400 font-bold">{user.point} pts</span>
              </div>
            ))}
          </div>
        </footer>
      </main>
    </div>
  )
}