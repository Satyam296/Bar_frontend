"use client"
import { useState, useRef, useEffect } from "react"
import { Calendar, QrCode, Scissors, LogOut, User, Check, Clock, Star, ArrowUp, Camera, X, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Html5Qrcode } from "html5-qrcode"
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
  const [isScanning, setIsScanning] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)

  const scannerRef = useRef<HTMLElement>(null)
  const bookingsRef = useRef<HTMLElement>(null)
  const html5QrRef = useRef<Html5Qrcode | null>(null)
  

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
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${BACKEND_URL}/api/v1/admin/loyalty-leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const token = localStorage.getItem("adminToken")
      await axios.post(`${BACKEND_URL}/api/v1/admin/add-points`, {
        userId: pendingCustomer._id,
        points: pointsToAdd,
        serviceAmount
      }, {
        headers: { Authorization: `Bearer ${token}` },
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

  const stopCamera = async () => {
    try {
      if (html5QrRef.current) {
        const state = html5QrRef.current.getState()
        if (state === 2) await html5QrRef.current.stop()
        html5QrRef.current.clear()
        html5QrRef.current = null
      }
    } catch {}
    setCameraActive(false)
    setIsScanning(false)
  }

  const handleQrSuccess = async (decodedText: string) => {
    const qrText = decodedText.trim()
    console.log("Scanned QR Code:", qrText)

    setScanSuccess(true)
    setIsScanning(false)
    await stopCamera()

    try {
      const token = localStorage.getItem("adminToken")
      const verifyRes = await axios.post(`${BACKEND_URL}/api/v1/admin/check`, { qrContent: qrText }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (verifyRes.data.valid && verifyRes.data.customer) {
        setPendingCustomer(verifyRes.data.customer)
        setShowAmountCard(true)
        setQrResult("")
      } else {
        setQrResult("❌ " + (verifyRes.data.message || "Invalid QR code"))
        setTimeout(() => { setQrResult(""); setScanSuccess(false) }, 2000)
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setQrResult("❌ Customer not found in database")
      } else if (err.response?.status === 400) {
        setQrResult("❌ Invalid QR code format")
      } else {
        setQrResult("❌ QR verification failed - Server error")
      }
      setTimeout(() => { setQrResult(""); setScanSuccess(false) }, 2000)
    }
  }

  const startCamera = async () => {
    try {
      await stopCamera()
      const scanner = new Html5Qrcode("qr-reader")
      html5QrRef.current = scanner

      await scanner.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: undefined, aspectRatio: 1.0, disableFlip: false },
        handleQrSuccess,
        () => {}
      )

      setCameraActive(true)
      setIsScanning(true)
      setScanSuccess(false)
    } catch (err) {
      console.error("Camera failed:", err)
      setQrResult("❌ Camera access denied. Please allow camera permissions.")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const scanner = new Html5Qrcode("qr-file-reader")
      const result = await scanner.scanFile(file, true)
      scanner.clear()
      await handleQrSuccess(result)
    } catch {
      setQrResult("❌ Could not read QR code from image. Try again with a clearer photo.")
      setTimeout(() => setQrResult(""), 3000)
    }

    e.target.value = ""
  }

  useEffect(() => {
    return () => { stopCamera() }
  }, [])

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
                QR Scanner
              </CardTitle>
              <CardDescription className="text-gray-400">
                Take a photo of customer's QR code or use live camera
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo Capture - Primary Method */}
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  id="qr-photo-capture"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="qr-photo-capture"
                  className="flex items-center justify-center gap-3 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-lg cursor-pointer transition-colors text-lg"
                >
                  <Camera className="h-6 w-6" />
                  Take Photo of QR Code
                </label>
                <p className="text-center text-gray-500 text-xs">Fastest method — opens your camera, snap the QR, done</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="text-gray-500 text-sm">or use live scanner</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              {/* Live Camera Scanner - Secondary */}
              <div className="relative bg-black rounded-lg border-2 border-dashed border-gray-700 overflow-hidden" style={{ minHeight: cameraActive ? '300px' : '0px' }}>
                <div id="qr-reader" className="w-full" />

                {scanSuccess && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-ping">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <div id="qr-file-reader" className="hidden"></div>

              <div className="flex flex-col sm:flex-row gap-2">
                {!cameraActive ? (
                  <Button
                    onClick={startCamera}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Scan className="h-4 w-4 mr-2" /> Start Live Scanner
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    <Scan className="h-4 w-4 mr-2 animate-pulse" />
                    Scanning...
                  </Button>
                )}
              </div>

              {qrResult && (
                <div className="text-center py-3 px-4 rounded-lg bg-red-900/20 border border-red-500/30">
                  <p className="text-red-400 font-medium">{qrResult}</p>
                </div>
              )}

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