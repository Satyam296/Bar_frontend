"use client"
import { Download, Calendar, MapPin, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReviewProofUpload } from "../../components/image-upload"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { BACKEND_URL } from "@/components/config"

export default function Component() {
  const router = useRouter()
  const [details, setDetails] = useState<any>(null)
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false)


  useEffect(() => {
    if (typeof window === "undefined") return;
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/")
        return
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/loyal_name`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setDetails(response.data)
        setReviewSubmitted(response.data.name.reviewSubmitted || false)
      } catch (err) {
        console.error("Fetch failed", err)
        router.push("/")
      }
    }

    fetchData()
  }, [router])

  if (!details || !details.name) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  console.log(details.name) ;
  const currentPoints = details.name.point || 0 ; 
  const loyaltyProgress = Math.min((currentPoints / 1000) * 100, 100) ;


  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="mx-auto max-w-md space-y-6">

        {/* Welcome Header */}
        <div className="text-center pt-6 pb-2">
          <h1 className="text-3xl font-bold text-white mb-2">
            Hello {details.name.name.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-400">Welcome back to your dashboard</p>
        </div>

        {/* Customer Info Card */}
        <Card className="bg-black border-2 border-orange-500/30 shadow-lg shadow-orange-500/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5 text-orange-500" />
              Customer Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="font-medium text-white">{details.name.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-orange-500" />
              <span className="text-gray-300">{details.name.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="text-gray-300">Downtown LA Barber</span>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card className="bg-black border-2 border-orange-500/30 shadow-lg shadow-orange-500/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Your QR Code</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-full aspect-square bg-white rounded-xl border border-orange-500/20 overflow-hidden">
              <img
                src={details.name.qrImage}
                alt="QR Code"
                className="w-full h-full object-contain p-4"
              />
            </div>
            
          </CardContent>
        </Card>

        {/* Loyalty Progress Card */}
        <Card className="bg-gradient-to-r from-orange-900/20 to-orange-800/20 border-2 border-orange-500/40 shadow-lg shadow-orange-500/10">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Loyalty Progress: {details.name.point} / 1000 Points
                </h3>
                <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                  <div
                    className="h-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${loyaltyProgress}%` }}
                  />
                </div>
              </div>

              <div className="text-center p-4 bg-black/40 rounded-xl border border-orange-500/20">
                <p className="text-white font-medium">
                  🎁 You'll receive a free haircut or hair product after 1000 points.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Review Proof Upload */}
        <ReviewProofUpload
          reviewSubmitted={reviewSubmitted}
          onProofSubmitted={() => setReviewSubmitted(true)}
/>


        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">Thank you for being a loyal customer! 💈</p>
        </div>
      </div>
    </div>
  )
}
