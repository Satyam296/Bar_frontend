"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function useAdminAuth() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.replace("/admin") // redirect if no token
    }
  }, [router])
}
