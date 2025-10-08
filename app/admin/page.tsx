"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { BACKEND_URL } from "@/components/config"
import { Scissors, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminSignup() {
  const nameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [showError, setShowError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const password = passwordRef.current?.value

  if (!password) {
    setShowError(true)
    return
  }

  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/admin/signin`, { password })
    const token = response.data.token
    localStorage.setItem("adminToken", token)  // save token
    router.push("/admin_dashboard")
  } catch (err) {
    console.error("Signin failed:", err)
    setShowError(true)
  }
}


  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Scissors className="h-10 w-10 text-orange-500" />
              <CardTitle className="text-3xl text-white font-bold">Samir's Salon Admin</CardTitle>
            </div>
            <CardDescription className="text-gray-300">
              Sign in with your Name and password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {showError && (
              <Alert className="bg-red-900/20 border-red-500 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  ❌ Incorrect name or password.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input id="name" ref={nameRef} placeholder="Enter your name" required className="bg-gray-800 text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input id="password" ref={passwordRef} type="password" placeholder="Enter shop password" required className="bg-gray-800 text-white" />
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
