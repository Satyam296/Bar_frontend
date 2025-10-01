"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, X } from "lucide-react"

const bookings = [
  {
    id: 1,
    customerName: "John Doe",
    service: "Classic Cut",
    dateTime: "Today, 10:00 AM",
    status: "pending",
  },
  {
    id: 2,
    customerName: "Mike Johnson",
    service: "Fade & Taper",
    dateTime: "Today, 11:30 AM",
    status: "done",
  },
  {
    id: 3,
    customerName: "David Smith",
    service: "Beard Trim",
    dateTime: "Today, 2:00 PM",
    status: "pending",
  },
  {
    id: 4,
    customerName: "Alex Brown",
    service: "Hot Towel Shave",
    dateTime: "Today, 3:30 PM",
    status: "pending",
  },
  {
    id: 5,
    customerName: "Chris Wilson",
    service: "Hair & Beard Combo",
    dateTime: "Today, 4:00 PM",
    status: "done",
  },
]

export function BookingsTable() {
  return (
    <Card className="bg-black border-orange-500/30 shadow-lg shadow-orange-500/10">
      <CardHeader>
        <CardTitle className="text-white">Today's Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-orange-500/20 hover:bg-orange-500/5">
                <TableHead className="text-orange-500 font-semibold">Customer Name</TableHead>
                <TableHead className="text-orange-500 font-semibold">Service</TableHead>
                <TableHead className="text-orange-500 font-semibold">Date & Time</TableHead>
                <TableHead className="text-orange-500 font-semibold">Status</TableHead>
                <TableHead className="text-orange-500 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="border-orange-500/10 hover:bg-orange-500/5">
                  <TableCell className="font-medium text-white">{booking.customerName}</TableCell>
                  <TableCell className="text-gray-300">{booking.service}</TableCell>
                  <TableCell className="text-gray-300">{booking.dateTime}</TableCell>
                  <TableCell>
                    <Badge
                      variant={booking.status === "done" ? "default" : "secondary"}
                      className={
                        booking.status === "done"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      }
                    >
                      {booking.status === "done" ? "Done" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {booking.status === "pending" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Done
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
