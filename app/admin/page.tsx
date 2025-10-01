"use client"

import type React from "react"

import { useState, useRef } from "react" ;
import { useRouter } from "next/navigation";
import axios from "axios" ;
import {BACKEND_URL} from "@/components/config" ; 
import {
  Scissors,
  Calendar,
  MapPin,
  Camera,
  MessageSquare,
  BarChart3,
  Shield,
  Mail,
  Phone,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminSignup() {
    const shopNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const adminPasswordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
  const [formData, setFormData] = useState({
    shopName: "",
    email: "",
    phone: "",
    adminPassword: "",
  })
  const [showError, setShowError] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (showError) setShowError(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.adminPassword !== "correct-password") {
      setShowError(true)
      return
    }
    console.log("Form submitted:", formData)
  }

  const benefits = [
    {
      icon: Calendar,
      title: "View all today's bookings at a glance",
    },
    {
      icon: MapPin,
      title: "See which customers are loyal and ready for rewards",
    },
    {
      icon: Camera,
      title: "Scan QR codes to auto-increase loyalty points",
    },
    {
      icon: MessageSquare,
      title: "Track customer reviews and engagement",
    },
    {
      icon: BarChart3,
      title: "Weekly earnings and activity analytics",
    },
  ]

  const admin = async () =>{
    const name = shopNameRef.current?.value;
    const email = emailRef.current?.value;
    const phone = phoneRef.current?.value;
    const password = adminPasswordRef.current?.value;
    console.log(name) ; 
    console.log(password);

    try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/admin/signin`, {
      name,
      password,
      phone,
      email
    });

    console.log("Booking Response:", response.data);
    const token2 = response.data.imp;
    localStorage.setItem("token", token2)
    router.push("/admin_dashboard");
  } catch (error) {
    console.error("Booking failed:", error);
  }

  }

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <Card className="bg-black border-gray-800 shadow-2xl">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scissors className="h-10 w-10 text-orange-500" />
              <h1 className="text-4xl font-bold text-white">Barbershop Admin</h1>
            </div>
            <CardTitle className="text-2xl text-white font-light">
              ✂️ Barbershop Owner? Sign Up to Access Your Admin Dashboard
            </CardTitle>
            <CardDescription className="text-lg text-gray-300 max-w-2xl mx-auto">
              Welcome to your shop's exclusive Loyalty and Booking Management Panel.
            </CardDescription>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Shield className="h-5 w-5 text-orange-500" />
              <Badge variant="outline" className="text-orange-400 border-orange-500 bg-orange-500/10">
                🔐 This dashboard is for shop owners only
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              To sign up, you'll need your private shop password given during onboarding.
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Error Alert */}
            {showError && (
              <Alert className="bg-red-900/20 border-red-500 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>❗Incorrect Shop Password</strong>
                  <br />
                  Please double-check the password provided to you.
                  <br />
                  If the issue continues, contact our team at:{" "}
                  <a href="mailto:support@yourdomain.com" className="text-orange-400 hover:text-orange-300">
                    support@yourdomain.com
                  </a>
                </AlertDescription>
              </Alert>
            )}

            {/* Benefits Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-green-400">✅</span>
                Benefits You Get:
              </h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/50 border border-gray-800"
                  >
                    <benefit.icon className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">• 📅 {benefit.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-800" />

            {/* Form Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-orange-500">📥</span>
                Create Your Admin Account:
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shopName" className="text-gray-300 font-medium">
                      Shop Name
                    </Label>
                    <Input
                      id="shopName"
                      name="shopName"
                      type="text"
                      ref= {shopNameRef}
                      placeholder="Enter your barbershop name"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      required
                      className="h-12 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                      <Input
                        id="email"
                        ref = {emailRef}
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300 font-medium">
                      Phone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                      <Input
                        id="phone"
                        ref={phoneRef}
                        name="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPassword" className="text-gray-300 font-medium">
                      Admin Password
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                      <Input
                        id="adminPassword"
                        ref={adminPasswordRef}
                        name="adminPassword"
                        type="password"
                        placeholder="Enter private password from onboarding"
                        value={formData.adminPassword}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500 pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Enter the private password shared during onboarding</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  onClick={admin}
                  className="w-full h-12 text-lg font-semibold bg-orange-600 hover:bg-orange-700 text-white border-0"
                >
                  Create Admin Account
                </Button>
              </form>
            </div>

            <Separator className="bg-gray-800" />

            {/* Support Section */}
            <div className="text-center space-y-2">
              <p className="text-gray-400">Need help?</p>
              <p className="text-sm text-gray-400">
                Contact us at{" "}
                <a href="mailto:support@yourdomain.com" className="text-orange-400 hover:text-orange-300 font-medium">
                  support@yourdomain.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
