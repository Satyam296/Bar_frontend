"use client"
import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Crown, Star, Gift, Scissors, X } from "lucide-react"
import {BACKEND_URL} from "@/components/config" ; 
import axios from "axios" ;

export default function Loyal_Form() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  };

  const loyalty = async () => {
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const phone = phoneRef.current?.value;

    if (!name || !email || !phone) {
      alert("Please fill in all the fields.");
      return;
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/loyal`, {
        name,
        email,
        phone
      });

      console.log("Booking Response:", response.data);
      const token = response.data.imp;
      localStorage.setItem("token", token)
      router.push("/dashboard");
    } catch (error) {
      console.error("Booking failed:", error);
    }
  }

  return (
    <div className="min-h-screen bg-black/95 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
      
      {/* Main Card */}
      <Card className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-br from-zinc-900 via-black to-amber-900/10 border border-amber-700/30 shadow-2xl rounded-xl overflow-hidden">
        {/* Top Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        
        <CardHeader className="text-center space-y-3 sm:space-y-4 pb-4 sm:pb-6 pt-6 sm:pt-8">
          {/* Icon */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/10 rounded-full blur-lg animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-3 sm:p-4 shadow-2xl border border-amber-500/30">
                <Crown className="h-6 w-6 sm:h-7 sm:w-7 text-amber-100" />
              </div>
            </div>
          </div>

          <CardTitle className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
            Join Our Loyalty Family
          </CardTitle>
          
          <CardDescription className="text-amber-300/90 text-sm sm:text-base leading-relaxed px-2">
            Get 150 bonus points instantly + exclusive rewards
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
          {/* Benefits Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2">
            <div className="text-center group">
              <div className="bg-amber-900/30 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-1 mx-auto border border-amber-700/30 group-hover:border-amber-500/50 transition-all duration-300">
                <Scissors className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mx-auto" />
              </div>
              <p className="text-xs text-amber-200/90 font-medium leading-tight">Free Services</p>
            </div>
            <div className="text-center group">
              <div className="bg-amber-900/30 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-1 mx-auto border border-amber-700/30 group-hover:border-amber-500/50 transition-all duration-300">
                <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mx-auto" />
              </div>
              <p className="text-xs text-amber-200/90 font-medium leading-tight">Premium Gifts</p>
            </div>
            <div className="text-center group">
              <div className="bg-amber-900/30 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-1 mx-auto border border-amber-700/30 group-hover:border-amber-500/50 transition-all duration-300">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mx-auto" />
              </div>
              <p className="text-xs text-amber-200/90 font-medium leading-tight">VIP Treatment</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-amber-100/90 font-medium text-sm sm:text-base">
                Full Name
              </Label>
              <Input
                ref={nameRef}
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="bg-amber-950/20 border-amber-700/40 text-white placeholder:text-amber-200/50 focus:border-amber-500 focus:ring-amber-500/20 h-11 sm:h-12 rounded-lg transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-amber-100/90 font-medium text-sm sm:text-base">
                Phone Number
              </Label>
              <Input
                ref={phoneRef}
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="bg-amber-950/20 border-amber-700/40 text-white placeholder:text-amber-200/50 focus:border-amber-500 focus:ring-amber-500/20 h-11 sm:h-12 rounded-lg transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-100/90 font-medium text-sm sm:text-base">
                Email Address
              </Label>
              <Input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-amber-950/20 border-amber-700/40 text-white placeholder:text-amber-200/50 focus:border-amber-500 focus:ring-amber-500/20 h-11 sm:h-12 rounded-lg transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={loyalty}
              type="submit"
              className="w-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-white font-semibold py-3 sm:py-3.5 h-12 sm:h-14 rounded-lg shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] border border-amber-500/30 text-sm sm:text-base"
            >
              <Crown className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Become a Loyal Customer
            </Button>
          </form>

          {/* Trust Message */}
          <div className="text-center pt-3 sm:pt-4 border-t border-amber-800/30">
            <div className="flex items-center justify-center gap-2 text-amber-200/70 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Instant QR Code</span>
              </div>
              <div className="w-0.5 h-0.5 bg-amber-600 rounded-full"></div>
              <span className="text-xs">No Spam</span>
            </div>
            <p className="text-amber-200/80 text-xs sm:text-sm leading-relaxed">
              ⭐ Get your digital loyalty card instantly and start earning rewards today!
            </p>
          </div>
        </CardContent>

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"></div>
      </Card>
    </div>
  )
}