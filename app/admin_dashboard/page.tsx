"use client"
import { useState, useRef, useEffect } from "react"
import { Calendar, QrCode, Scissors, LogOut, User, Check, Clock, Star, ArrowUp, Camera, X, RotateCcw } from "lucide-react"
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
    }
  }

  const startCamera = async (facingMode: "user" | "environment" = "environment", deviceId?: string) => {
    try {
      stopCamera() // Stop any existing camera

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: deviceId ? undefined : facingMode,
          deviceId: deviceId ? { exact: deviceId } : undefined
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraActive(true)
        
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
      // Fallback to basic constraints if specific camera fails
      if (deviceId || facingMode !== "user") {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true })
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream
            await videoRef.current.play()
            setCameraActive(true)
          }
        } catch (fallbackErr) {
          console.error("Fallback camera also failed:", fallbackErr)
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

  // QR Scanner Logic
  const scanQRCode = async () => {
    const context = canvasRef.current?.getContext("2d", { willReadFrequently: true })
    const video = videoRef.current
    if (!video || !context || !canvasRef.current) return

    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const qrCode = jsQR(imageData.data, canvas.width, canvas.height)

    if (qrCode) {
      const qrText = qrCode.data.trim()
      console.log("Scanned QR Code:", qrText)

      try {
        const verifyRes = await axios.post(`${BACKEND_URL}/api/v1/admin/check`, { qrContent: qrText })
        console.log("Verification response:", verifyRes.data)

        if (verifyRes.data.user) {
          const customer = verifyRes.data.user
          setPendingCustomer(customer)
          setShowAmountCard(true)
          stopCamera()

        } else {
          setQrResult("❌ Invalid QR code or customer not found")
        }
      } catch (err) {
        console.error("QR verification failed", err)
        setQrResult("❌ Invalid or expired QR code")
      }
      stopCamera()
    }
  }

  useEffect(() => {
    let interval: any
    if (cameraActive) interval = setInterval(scanQRCode, 1000)
    return () => clearInterval(interval)
  }, [cameraActive])

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
      <main className="space-y-8 p-6">
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
            <h2 className="text-3xl font-bold text-white">QR Scanner</h2>
            <div className="flex gap-2">
              {cameraActive && availableCameras.length > 1 && (
                <Button onClick={switchCamera} variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-900/20">
                  <RotateCcw className="h-4 w-4 mr-2" /> Switch Camera
                </Button>
              )}
              {cameraActive && (
                <Button onClick={stopCamera} variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-900/20">
                  <ArrowUp className="h-4 w-4 mr-2" /> Stop Camera
                </Button>
              )}
            </div>
          </div>
          <Card className="bg-gray-900 border-orange-900/20">
            <CardHeader>
              <CardTitle className="text-white">Live QR Scanner</CardTitle>
              <CardDescription className="text-gray-400">
                {scannedCustomer ? `Scanning for: ${scannedCustomer.name}` : "Click 'Start Camera' to scan QR"}
                {availableCameras.length > 1 && " - Use back camera for better scanning"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video bg-black rounded-lg border-2 border-dashed border-orange-600 relative">
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover rounded-lg"
                  style={{ transform: facingMode === "user" ? 'scaleX(-1)' : 'none' }}
                />
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Camera className="h-16 w-16 opacity-50" />
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} width={640} height={480} className="hidden"></canvas>
              <div className="flex gap-2">
                {!cameraActive && (
                  <Button onClick={() => startCamera("environment")} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Camera className="h-4 w-4 mr-1" /> Start Camera
                  </Button>
                )}
              </div>
              {scannedCustomer && (
                <Card className="bg-gray-900 border-orange-900/20 mt-4">
                  <CardHeader>
                    <CardTitle className="text-orange-400 text-lg font-bold">Points Added!</CardTitle>
                    <CardDescription className="text-gray-400">Customer scanned successfully</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{scannedCustomer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-semibold">{scannedCustomer.name}</p>
                        <p className="text-green-400 font-medium">Total Points: {scannedCustomer.points}</p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Badge variant="outline" className="border-green-600 text-green-400">
                        Status: Done
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
              {qrResult && <p className="text-center text-orange-400 mt-4">{qrResult}</p>}
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