"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotificationsBanner() {
  return (
    <Alert className="bg-orange-500/10 border-orange-500/30 text-orange-100 mb-6">
      <Bell className="h-4 w-4 text-orange-500" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          <strong>New Booking Alert!</strong> You have 2 new bookings for today. Check the bookings table below.
        </span>
        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10">
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
