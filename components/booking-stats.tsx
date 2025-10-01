"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Total Bookings Today",
    value: "12",
    icon: Calendar,
    change: "+2 from yesterday",
  },
  {
    title: "Completed",
    value: "8",
    icon: CheckCircle,
    change: "67% completion rate",
  },
  {
    title: "Pending",
    value: "4",
    icon: Clock,
    change: "33% pending",
  },
  {
    title: "Today's Revenue",
    value: "$480",
    icon: DollarSign,
    change: "+15% from yesterday",
  },
]

export function BookingStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-black border-orange-500/30 shadow-lg shadow-orange-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
