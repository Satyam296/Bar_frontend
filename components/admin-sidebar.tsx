"use client"

import { Calendar, Home, Users, QrCode, Settings, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
    isActive: true,
  },
  {
    title: "Bookings",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Loyal Customers",
    url: "#",
    icon: Users,
  },
  {
    title: "QR Scan",
    url: "#",
    icon: QrCode,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AdminSidebar() {
  return (
    <Sidebar className="border-r border-orange-500/20 bg-black">
      <SidebarHeader className="border-b border-orange-500/20 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">💈</span>
          </div>
          <span className="text-white font-bold text-lg">Elite Barber</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-500 font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="text-gray-300 hover:text-white hover:bg-orange-500/10 data-[active=true]:bg-orange-500/20 data-[active=true]:text-orange-500 data-[active=true]:border-r-2 data-[active=true]:border-orange-500"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-orange-500/20 p-4 bg-black">
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-orange-500/10">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
