"use client"
import { useState, useRef, useEffect } from "react"
import { Calendar, QrCode, Scissors, LogOut, User, Check, Clock, Star, ArrowUp, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import axios from "axios"
import jsQR from "jsqr"
import { BACKEND_URL } from "@/components/config"


const SERVICE_PRICES = {
  "Classic Cut": 35,
  "Fade & Taper": 40,
  "Beard Trim": 25,
  "Hot Towel Shave": 45,
  "Hair & Beard Combo": 60,
  "Kid's Cut": 25
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function BarberDashboard() {
  const [bookingList, setBookingList] = useState([])
  const [money, setMoney] = useState(0)
  const [weeklyData, setWeeklyData] = useState([])
  const router = useRouter()
  const dateRef = useRef(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [qrResult, setQrResult] = useState("")
  const [scannedCustomer, setScannedCustomer] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  const scannerRef = useRef(null)
  const bookingsRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)

  // Fetch bookings when date changes
  useEffect(() => {
    all_names()
  }, [selectedDate])

  // Calculate revenue whenever bookings change
  useEffect(() => {
    calculateRevenue()
  }, [bookingList, selectedDate])

  // Fetch weekly analytics
  useEffect(() => {
    const fetchWeeklyAnalytics = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/admin/weekly-bookings`)
        const bookings = res.data.bookings

        const dayCount = {
          Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0,
        }

        bookings.forEach((b) => {
          if (b.preferred_date) {
            const bookingDate = new Date(b.preferred_date)
            const dayIndex = bookingDate.getDay()
            const dayName = weekdays[dayIndex]
            dayCount[dayName]++
          }
        })

        const data = Object.entries(dayCount).map(([day, count]) => ({
          day,
          bookings: count,
        }))

        setWeeklyData(data)
      } catch (err) {
        console.error("Error fetching weekly data", err)
      }
    }

    fetchWeeklyAnalytics()
  }, [])

  // Calculate total revenue for selected date
  const calculateRevenue = () => {
    let total = 0

    bookingList.forEach((booking) => {
      console.log(booking.preferred_date);
      console.log(selectedDate); 
      if (booking.done && booking.preferred_date === selectedDate) {
        const price = SERVICE_PRICES[booking.service] || 0
        console.log("price") ; 
        console.log(price)
        total += price
      }
      else{
      console.log("else chlra mitarrr!!")
    }

    })
    
    console.log("Calculating revenue:", total, "for date:", selectedDate)
    setMoney(total)
  }

  // Fetch all bookings for a specific date
  const all_names = async () => {
    const dates = dateRef.current?.value || selectedDate

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/admin/all`, {
        date: dates,
      })
      
      const bookings = response.data.message.map((b) => ({
        id: b._id,
        name: b.name,
        service: b.service,
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

  const toggleBookingDone = async (id) => {
  try {
    console.log("Toggling booking:", id);
    calculateRevenue()
    
    const bookingToUpdate = bookingList.find(b => b.id === id);
    if (!bookingToUpdate) return;

    const newDoneStatus = !bookingToUpdate.done;
    console.log("new")
    const price = SERVICE_PRICES[bookingToUpdate.service] || 0;

    setBookingList(prevBookings =>
      prevBookings.map(b =>
        b.id === id
          ? { ...b, done: newDoneStatus, status: newDoneStatus ? "done" : "pending" }
          : b
      )
    );

    setMoney(prev => newDoneStatus ? prev + price : prev - price);

    // 🕐 Then update backend (in background)
    await axios.post(`${BACKEND_URL}/api/v1/admin/done`, { userId: id });

    console.log("Backend confirmed done status");
  } catch (error) {
    console.error("Failed to update booking status:", error);
  }
};


  // Camera functions
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject
      stream.getTracks().forEach(track => track.stop())
      setCameraActive(false)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        //@ts-ignore
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Camera access denied:", err)
    }
  }

  const scanQRCode = async () => {
    const context = canvasRef.current?.getContext("2d")
    const video = videoRef.current
    if (!video || !context) return

    context.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height)
    const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)

    const qrCode = jsQR(imageData.data, canvasRef.current.width, canvasRef.current.height)
    if (qrCode) {
      const qrText = qrCode.data
      console.log(qrText)
      try {
        const res = await axios.post(`${BACKEND_URL}/api/v1/admin/check`, {
          qrContent: qrText
        })
        console.log(res)
        setQrResult("QR verified!!")
      } catch (err) {
        console.error("QR verification failed", err)
        setQrResult("QR not verified!!")
      }
      stopCamera()
    }
  }

  useEffect(() => {
    let interval
    if (cameraActive) {
      interval = setInterval(scanQRCode, 1000)
    }
    return () => clearInterval(interval)
  }, [cameraActive])

  const handleScanQR = (booking) => {
    setScannedCustomer(booking)
    setShowScanner(true)
    scannerRef.current?.scrollIntoView({ behavior: "smooth" })
    startCamera()
  }

  const simulateQRScan = async () => {
    if (scannedCustomer) {
      try {
        // Make API call to add points and mark as done
        

        setQrResult(`Scanned: ${scannedCustomer.name}, +150 points added`)

        // Update booking list
        setBookingList(prevBookings =>
          prevBookings.map(booking => {
            if (booking.id === scannedCustomer.id) {
              return {
                ...booking,
                points: booking.points + 150,
                done: true,
                status: "done",
              }
            }
            return booking
          })
        )

      
        if (!scannedCustomer.done) {
          const price = SERVICE_PRICES[scannedCustomer.service] || 0
          setMoney(prevMoney => prevMoney + price)
        }

        await axios.post(`${BACKEND_URL}/api/v1/admin/add-points`, { 
          userId: scannedCustomer.id,
          points: 150 
        })
      } catch (error) {
        console.error("Failed to add points:", error)
      }
    }
  }

  const backToBookings = () => {
    setShowScanner(false)
    setQrResult("")
    setScannedCustomer(null)
    const stream = videoRef.current?.srcObject
    stream?.getTracks().forEach((track) => track.stop())
    bookingsRef.current?.scrollIntoView({ behavior: "smooth" })
  }  
  // Statistics
  const loyalCustomers = bookingList.filter((b) => b.isLoyal).length
  const regularCustomers = bookingList.length - loyalCustomers
  const completedBookings = bookingList.filter((b) => b.done).length
  const totalPointsGiven = bookingList.reduce((sum, b) => sum + (b.done ? 150 : 0), 0)
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navbar */}
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
        {/* Section 1: Today's Bookings */}
        <section ref={bookingsRef} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold text-white">Today's Bookings</h1>
            <div className="flex items-center gap-2">
      
              <Calendar className="h-4 w-4 text-orange-400" />
              <Input
                type="date"
                ref={dateRef}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto bg-gray-900 border-orange-900/20 text-white"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookingList.map((booking) => (
              <Card
                key={booking.id}
                id={`booking-${booking.id}`}
                className={`bg-gray-900 border-orange-900/20 transition-all duration-300 ${
                  booking.done ? "ring-2 ring-green-500 bg-green-900/10" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{booking.name}</CardTitle>
                    <div className="flex gap-2">
                      {booking.isLoyal && (
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Loyal
                        </Badge>
                      )}
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "secondary"}
                        className={booking.status === "confirmed" ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-700"}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-orange-400">
                      <Scissors className="h-4 w-4" />
                      <span className="text-sm">{booking.service}</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{booking.preferred_time}</span>
                    </div>
                    {booking.isLoyal && (
                      <div className="text-xs text-blue-400">Points: {booking.points.toLocaleString()}</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                              id={`done-${booking.id}`}
                              checked={booking.done}
                              onCheckedChange={() => toggleBookingDone(booking.id)}
                              className="border-orange-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
/>
                      <label
                        htmlFor={`done-${booking.id}`}
                        className={`text-sm font-medium ${booking.done ? "text-green-400" : "text-white"}`}
                      >
                        {booking.done ? "Done" : "Pending"}
                      </label>
                    </div>

                    {booking.isLoyal && (
                      <Button
                        size="sm"
                        onClick={() => handleScanQR(booking)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <QrCode className="h-3 w-3 mr-1" />
                        Scan QR
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        {/* Section 2: QR Scanner */}
        <section ref={scannerRef} className="space-y-6">
  <div className="flex items-center justify-between">
    <h2 className="text-3xl font-bold text-white">QR Scanner</h2>
    {cameraActive && (
      <Button onClick={stopCamera} variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-900/20">
        <ArrowUp className="h-4 w-4 mr-2" /> Stop Camera
      </Button>
    )}
  </div>
  <Card className="bg-gray-900 border-orange-900/20">
    <CardHeader>
      <CardTitle className="text-white">Live QR Scanner</CardTitle>
      <CardDescription className="text-gray-400">
        {scannedCustomer ? `Scanning for: ${scannedCustomer.name}` : "Click 'Start Camera' to scan QR"}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="aspect-video bg-black rounded-lg border-2 border-dashed border-orange-600">
        <video ref={videoRef} className="w-full h-full object-cover rounded-lg" />
      </div>
      <canvas ref={canvasRef} width={640} height={480} className="hidden"></canvas>

      <div className="flex gap-4 flex-wrap">
        {!cameraActive && (
          <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Camera className="h-4 w-4 mr-1" /> Start Camera
          </Button>
        )}
      </div>
      {capturedImage && (
        <div className="mt-4">
          <p className="text-sm text-white mb-2">Captured QR Image:</p>
          <img src={capturedImage} alt="Captured Preview" className="rounded border border-orange-600" />
        </div>
      )}
      {qrResult && (
        <Card className="bg-green-900/20 border-green-600/30">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Check className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-green-400 font-medium">{qrResult}</p>
                {scannedCustomer && (
                  <p className="text-sm text-green-300 mt-1">
                    Updated Points: {(scannedCustomer.points + 150).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </CardContent>
  </Card>
</section>
        {/* Section 3: Analytics Overview */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Analytics Overview</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gray-900 border-orange-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Bookings Today</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">{bookingList.length}</div>
                <p className="text-xs text-gray-400">{completedBookings} completed</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-orange-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Loyalty Points Given</CardTitle>
                <Star className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{totalPointsGiven.toLocaleString()}</div>
                <p className="text-xs text-gray-400">Today's total</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-orange-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Loyal Customers</CardTitle>
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{loyalCustomers}</div>
                <p className="text-xs text-gray-400">vs {regularCustomers} regular</p>
              </CardContent>
            </Card>

             <Card className="bg-gray-900 border-orange-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Revenue</CardTitle>
            <span className="text-orange-500 font-bold">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">${money}</div>
            <p className="text-xs text-gray-400">
              {selectedDate === new Date().toISOString().split("T")[0]
                ? "Today's total"
                : `Total on ${selectedDate}`}
            </p>
          </CardContent>
        </Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Weekly Bookings Chart */}
            <Card className="bg-gray-900 border-orange-900/20">
              <CardHeader>
                <CardTitle className="text-white">Bookings - Last 7 Days</CardTitle>
                <CardDescription className="text-gray-400">Daily booking comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyData.map((day) => {
                    const maxBookings = Math.max(...weeklyData.map((d) => d.bookings))
                    return (
                      <div key={day.day} className="flex items-center space-x-4">
                        <div className="w-12 text-sm text-gray-400">{day.day}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div
                              className="bg-gradient-to-r from-orange-600 to-orange-800 h-6 rounded transition-all duration-500"
                              style={{ width: `${(day.bookings / maxBookings) * 100}%` }}
                            />
                            <span className="text-sm text-white">{day.bookings}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Customer Type Pie Chart */}
            <Card className="bg-gray-900 border-orange-900/20">
              <CardHeader>
                <CardTitle className="text-white">Customer Types Today</CardTitle>
                <CardDescription className="text-gray-400">Loyal vs Regular customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#374151"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="3"
                          strokeDasharray={`${(loyalCustomers / bookingList.length) * 100}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {Math.round((loyalCustomers / bookingList.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-white">Loyal Customers</span>
                      </div>
                      <span className="text-sm text-blue-400">{loyalCustomers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <span className="text-sm text-white">Regular Customers</span>
                      </div>
                      <span className="text-sm text-gray-400">{regularCustomers}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
