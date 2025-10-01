"use client"
import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

  const loyalty = async () =>{
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <CardTitle className="text-2xl font-bold text-white">
            🎉 Join Our Loyalty Program – It's Absolutely FREE!
          </CardTitle>
          <CardDescription className="text-gray-300 text-base leading-relaxed">
            Earn 150 points instantly and unlock exciting rewards like free haircuts, haircare kits, and priority
            bookings.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white font-medium">
                Full Name
              </Label>
              <Input
                ref = {nameRef}
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white font-medium">
                Phone Number
              </Label>
              <Input
                ref = {phoneRef}
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email
              </Label>
              <Input
                ref = {emailRef}
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 h-12"
              />
            </div>

            <Button
              onClick={loyalty}
              type="submit"
              className="w-full bg-gradient-to-r bg-amber-800 hover:bg-amber-700 text-white font-bold py-3 h-12 text-base shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Become a Loyal Customer
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-gray-800">
            <p className="text-gray-300 text-sm leading-relaxed">
              ⭐ You'll receive a QR code instantly to start collecting points after every visit.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
