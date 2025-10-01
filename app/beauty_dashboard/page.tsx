"use client"

import type React from "react"

import { useState, useEffect , useRef } from "react"
import Image from "next/image"
import axios from "axios" 
import { BACKEND_URL } from "@/components/config";
import {
  Scissors,
  Sparkles,
  Heart,
  Hand,
  Zap,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  ChevronDown,
  Gift,
  QrCode,
  Clock,
  X,
  Camera,
  Award,
  ArrowRight,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export default function BeautySalonLanding() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [showLoyaltyPopup, setShowLoyaltyPopup] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null);
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const preferred_dateRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);  
  const serviceRef = useRef<HTMLSelectElement>(null); 
  const preferred_timeRef = useRef<HTMLSelectElement>(null); 
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    notes: "",
  })

  // Show popup after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoyaltyPopup(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])
  const handleSignup = async () => {
  const name = nameRef.current?.value;
  const email = emailRef.current?.value;
  const phone = phoneRef.current?.value;
  const service = serviceRef.current?.value;
  const preferred_date = preferred_dateRef.current?.value;
  const preferred_time = preferred_timeRef.current?.value;
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/book`, {
      name,
      email,
      phone,
      service,
      preferred_date,
      preferred_time
    });
    console.log("Booking Response:", response.data);
    alert("Booking successful!");
  } catch (error) {
    console.error("Booking failed:", error);
    alert("Booking failed.");
  }
};

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const services = [
    {
      icon: <Scissors className="w-8 h-8" />,
      title: "Hair Styling & Cuts",
      description: "Professional cuts, styling, and hair treatments for every occasion",
      image: "https://imgs.search.brave.com/sUIHlkPI7vfqZRu7HZ8wzq_6O9ATW1B3wj3IpJAEZIM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE4/NjM0NTEwNS9waG90/by9mZW1hbGUtaGFp/cmRyZXNzZXItaXMt/Y3V0dGluZy13b21h/bi1oYWlyLWNsb3Nl/LXVwLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1Rbk1rTGNu/dUxYdDMxa0d0azlv/RVZ4b0twM0dBNlZN/em10bUZPbzB3YzVN/PQ",
      price: "₹1,500 - ₹3,500",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Bridal & Party Makeup",
      description: "Stunning makeup for your most special moments",
      image: "https://imgs.search.brave.com/CMHz33vZahf6rBEJbNcbAhpGjrmSlf5DYq7yHSJXnOA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzkwL2U2/LzA0LzkwZTYwNDkx/ZmQ4Y2VmMjJlNjY1/NTMxYTVjNzU0NDk4/LmpwZw",
      price: "₹5,000 - ₹15,000",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Facial & Skin Treatments",
      description: "Rejuvenating facials and advanced skin care treatments",
      image: "https://imgs.search.brave.com/tgblbM0QN6Tk9nw44TdIHG_Hbls4o0x9Q0qpeRUZ8X0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlc2hhLmNv/bS9sZWFkLWltYWdl/cy9wbGFjZWhvbGRl/cnMvYmVhdXR5LXNh/bG9uLTQ3LmpwZz9j/bGFzcz13aWR0aC1z/bWFsbA",
      price: "₹2,000 - ₹5,000",
    },
    {
      icon: <Hand className="w-8 h-8" />,
      title: "Manicure & Pedicure",
      description: "Complete nail care with beautiful designs and treatments",
      image: "https://imgs.search.brave.com/fNIg31SeLKtvRtRpWt8cRU0faL5MKzh4qB95NevUgKE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzcv/MTUxLzEwMS9zbWFs/bC90aGUtbWFuaWN1/cmlzdC1ob2xkcy1o/YW5kcy1vZi10aGUt/Y2xpZW50LWluLWJl/YXV0eS1zYWxvbi1v/bi1kZXNrdG9wLWZv/ci1tYW5pY3VyZS13/aXRoLW5haWwtcG9s/aXNoZXMtbmFwa2lu/cy1jcmVhbXMtYW5k/LWxpZ2h0aW5nLWlu/c3RydW1lbnRzLXBo/b3RvLmpwZw",
      price: "₹800 - ₹2,500",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Waxing & Threading",
      description: "Gentle hair removal with professional techniques",
      image: "https://imgs.search.brave.com/0QFC8QWG4iRNLUHqVuU65d6kojMyY-HlXxHuexh-MSM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlc2hhLmNv/bS9sZWFkLWltYWdl/cy9wbGFjZWhvbGRl/cnMvYmVhdXR5LXNh/bG9uLTE5LmpwZz9j/bGFzcz13aWR0aC1z/bWFsbA",
      price: "₹500 - ₹2,000",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Absolutely love this place! The staff is so professional and my hair always looks amazing. The ambiance is so relaxing and luxurious.",
      image: "https://imgs.search.brave.com/qKm4rgyxUiES85pAzQbzloBlyOxApFVoPfCJAReT94w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQy/MjY4NDY0NS9waG90/by9oYXBweS1mdW5r/eS1hbmQtcmV0cm8t/cG9ydHJhaXQtb2Yt/Z2VuLXotd29tYW4t/b3Itc3R1ZGVudC1v/bi1hLXB1cnBsZS1i/YWNrZ3JvdW5kLXdh/bGwtbW9ja3VwLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz05/dHFUYW82TUtIOWtF/RTktUXdVOFlkWnpi/S3ExaGxLeE9xNkVs/UkstV3I4PQ",
      service: "Hair Styling",
    },
    {
      name: "Emily Chen",
      rating: 5,
      text: "Best facial I've ever had! My skin is glowing and I feel so refreshed. The loyalty program is such a nice bonus too!",
      image: "https://imgs.search.brave.com/SbS0Jjr6ZFVLeM7Po9KHILkW9uQffvOK_tHb1kTCzD4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTMy/Nzc2NTYxNy9waG90/by9wb3J0cmFpdC1v/Zi1oYXBweS1jb25m/aWRlbnQteW91bmct/d29tYW4tZGFuY2lu/Zy5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9UnlvTy1VdDl6/YUI1S2ducWhfMjM0/R3Jhay15TVM3ZEFM/bG9scXpPazk4RT0",
      service: "Facial Treatment",
    },
    {
      name: "Maria Rodriguez",
      rating: 5,
      text: "The bridal makeup was perfect! I felt like a princess on my wedding day. Thank you for making my special day even more beautiful.",
      image: "https://imgs.search.brave.com/NzoRuBpPuiM8k9P-SPE0Yh1lPZ66xtb3Xzb_UDGlzfk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQ1/MjY4NDY5Ny9waG90/by9wb3J0cmFpdC1v/Zi15b3VuZy1iZWF1/dGlmdWwtY2FzdWFs/bHktY2xvdGhlZC13/b21hbi1pbi10aGUt/bW9kZXJuLW9mZmlj/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9X0xYcHFKc19N/NFA1NG0tTXdyaTZ6/RFBNVmluWHFhcHo2/Mm9WWFlvYmhHaz0",
      service: "Bridal Makeup",
    },
    {
      name: "Priya Sharma",
      rating: 5,
      text: "Such a classy and elegant salon! The loyalty rewards program is amazing - I've already earned so many points. Highly recommend!",
      image: "https://imgs.search.brave.com/CAEzn0vTXjYSV9BbU0MGZptsGNLkNLSzvkcNdO25_gg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/Nzg3MDA5Ni9waG90/by9oYXBweS13b21h/bi1sb29raW5nLWF0/LWNhbWVyYS1yZWQt/d2FsbC5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9Y1Qza3Y2/VmlTZE84WGZLMDlo/dmxoVEVESWVxcEZK/MVNTeUZrVjBya0l5/RT0",
      service: "Full Service",
    },
  ]

  const galleryImages = [
    {
      src: "https://imgs.search.brave.com/y6UYzoy7LCbxfoAa9HtAYoSsXhdNAbO6dn5mAuvvHDA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aGVi/ZWF1dGlmdWxoYWly/Ym91dGlxdWUuY29t/L2Nkbi9zaG9wL3By/b2R1Y3RzLzhjYWYy/Yl9iNDFjYTAyMjcy/ZGQ0ODUxOTkxYWMz/NDY3MzcwNjM1M19t/djJfMTYwMHguanBn/P3Y9MTY1NjU0NzM0/MQ",
      alt: "Hair transformation",
      category: "Hair",
    },
    {
      src: "https://imgs.search.brave.com/MkDa4h_PUwSMVpkK6c6Waa928qiorn_1YLK2JEG21os/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9iZWF1dHktY29z/bWV0aWNzLWZhY2Ut/d29tYW4td2l0aC1t/YWtldXAtYnJ1c2gt/cGluay1iYWNrZ3Jv/dW5kLXNhbG9uLXdl/bGxuZXNzLWx1eHVy/eS1jb3NtZXRvbG9n/eS1hZXN0aGV0aWMt/ZmVtYWxlLXBlcnNv/bi13aXRoLXRvb2xz/LW5vc2UtZm91bmRh/dGlvbi1wb3dkZXIt/Z2xhbW91cl81OTA0/NjQtMjExODQzLmpw/Zz9zZW10PWFpc19o/eWJyaWQmdz03NDA",
      alt: "Bridal makeup",
      category: "Makeup",
    },
    {
      src: "https://imgs.search.brave.com/L2RBc2BPpwMdZRdjQpGvlDjaVlMRuUi-mGTt3Lw3fxQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9zYWxv/bi1oYWlyY3V0LWdy/b29taW5nLWdpcmwt/Y3VzdG9tZXItd2V0/LWhhaXItdHJpbS13/ZWxsbmVzcy1iZWF1/dHktY2xpZW50LXNj/aXNzb3JzLWNyZWF0/aXZlLXN0eWxlLTMy/NjA4Nzc1Ny5qcGc",
      alt: "Salon interior",
      category: "Ambiance",
    },
    {
      src: "https://imgs.search.brave.com/aD5vHYhMnmr7ibtYgzp0a018uc-gYqDlQeotCZatFo4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI1/NzQ5MDYyMC9waG90/by9mYWxsLWxlYXZl/cy1uYWlsLWFydC1k/ZXNpZ24uanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPTJ3OVVf/OTcwZGFOOUlxaTlw/VnZqRWtrMy0yOWZG/bDBmR2dZTjZvWXJN/dW89",
      alt: "Nail art",
      category: "Nails",
    },
    {
      src: "https://imgs.search.brave.com/gSi74oWj7OXlQXuS6EF3DNQFCAtbctfamYCtkTJYQ-k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zYWxv/bmQuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDI0LzAxL3Jl/ZWd6X2Nsb3NlX3Vw/X3ZpZXdfb2ZfYV9i/ZWF1dGlmdWxfd29t/YW5zX2ZhY2VfZ2V0/dGluZ19hX2ZhY2lh/X2U4YTliNDA1LTNh/Y2MtNDdhNS1iZjM4/LTcwZDRmOGE1MDM4/NS53ZWJw",
      alt: "Facial treatment",
      category: "Skincare",
    },
    {
      src: "https://imgs.search.brave.com/XNV3-aTJgaYFpq7aRv0CcCG8HoeMZNLnaubJPqLf3a4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RhL2Q0/LzU2L2RhZDQ1Njdh/YzI1OGJiMTI5ZTNm/MDllYWQ1Mjc3MmQ0/LmpwZw",
      alt: "Happy client",
      category: "Results",
    },
    {
      src: "https://imgs.search.brave.com/fd32yajg5VdndK3BpVponNbCHbjLKiBr5hQWYwmYFaw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM0/MDUyMTQyL3Bob3Rv/L2hhaXItc2Fsb24t/c2l0dWF0aW9uLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1I/TTRUbDNBVGlqcElT/MVJ2MDk3VUh3bVoz/T2ZtcUdYa25pTkx1/VENxQjBBPQ",
      alt: "Luxury treatment room",
      category: "Ambiance",
    },
    {
      src: "https://imgs.search.brave.com/KCwNsRNwQ1s0tu1PdTIWKNcG-VLKE9a0t930-Ly6tJQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM1/OTQ4NjMzNy9waG90/by9hLXlvdW5nLXdv/bWFuLWJlZm9yZS1h/bmQtYWZ0ZXItcGxh/c3RpYy1zdXJnZXJ5/LWJ1Y2NhbC1mYXQt/cGFkLXJlbW92YWwt/cmVzdWx0LW9mLWNv/c21ldGljLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1WUHRx/UVBudmZyMF9ZU2dq/TzBLM20xSWxHQklZ/aWZaMWpUb2FSQmd4/YzdFPQ",
      alt: "Before and after",
      category: "Transformation",
    },
  ]

  const timeSlots = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "3:30 PM", "5:00 PM"]

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    console.log("Booking submitted:", { ...formData, date: selectedDate, time: selectedTimeSlot })
    //alert("Booking request submitted! We'll confirm within 24 hours.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-peach-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Seasons Beauty
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("gallery")}
                  className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Gallery
                </button>
                <button
                  onClick={() => scrollToSection("booking")}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-pink-600 p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection("hero")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
              >
                Gallery
              </button>
              <button
                onClick={() => scrollToSection("booking")}
                className="block w-full text-left px-3 py-2 text-base font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 transition-all"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Loyalty Program Popup */}
      {showLoyaltyPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setShowLoyaltyPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mb-6">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">💖 Join Our Loyalty Program</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Earn rewards every time you visit us. Scan your QR code at the parlour and get exclusive discounts on
                all services.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>Earn 10 points for every ₹100 spent</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Get 20% off after 100 points</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>Exclusive member-only offers</span>
                </div>
              </div>

              <button
                onClick={() => setShowLoyaltyPopup(false)}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-full py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                🎁 Get Loyalty Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute  z-10"></div>
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <Image
          src="https://imgs.search.brave.com/fVulpx6ryClH3p4KBoKycjVpi_6b_27soHiyY287tSg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzgxLzYxLzI5/LzM2MF9GXzE4MTYx/MjkwOF91aU9IOGE0/cVdpTkd1R1MyUGc1/ZGd3VUlLSlowQzAy/dy5qcGc"
          alt="Happy woman in luxury salon"
          fill
          className="object-cover"
          priority
        />

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-6 drop-shadow-lg">
              Seasons Beauty Parlour
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 font-light tracking-wide drop-shadow-md">
              Where Beauty Meets Elegance
            </p>
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience luxury beauty treatments in our premium salon designed for the modern woman
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => scrollToSection("booking")}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                Book Your Appointment
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => scrollToSection("services")}
                className="border-2 border-white/80 text-white hover:bg-white hover:text-gray-800 px-12 py-6 text-xl rounded-full backdrop-blur-sm bg-white/10 transition-all duration-300"
              >
                See Our Services
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/80" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-gray-800 mb-6">Our Premium Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of luxury beauty treatments, each designed to enhance your natural beauty
              and boost your confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {services.map((service, index) => (
              <div
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden inset-0 bg-black/70">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="text-pink-600">{service.icon}</div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-sm font-semibold text-gray-800">{service.price}</span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                  <button className="w-full rounded-full border-2 border-pink-300 text-pink-600 hover:bg-pink-50 bg-transparent group-hover:bg-pink-600 group-hover:text-white group-hover:border-pink-600 transition-all duration-300 py-3 font-semibold">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Program Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-gray-800 mb-8">Scan. Earn. Glow.</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every visit earns you rewards. Get your digital loyalty card today and unlock exclusive benefits,
              discounts, and special offers.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-3">Scan & Earn</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Simply show your digital loyalty card at checkout and earn points with every service.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-3">Exclusive Rewards</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Redeem points for free services, get birthday specials, and enjoy member-only discounts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-3">VIP Treatment</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Priority booking, special offers, and personalized beauty recommendations just for you.
                  </p>
                </div>
              </div>

              <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                Get Loyalty Card
                <Gift className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-white to-pink-50 rounded-3xl p-12 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl mx-auto mb-8 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-800 mb-4">Digital Loyalty Card</h3>
                  <p className="text-gray-600 mb-6">Your gateway to exclusive rewards and premium beauty experiences</p>
                  <div className="bg-pink-100 rounded-2xl p-4">
                    <p className="text-sm text-pink-700 font-semibold">Member ID: SBP2024</p>
                    <p className="text-xs text-pink-600 mt-1">Points: 250 | Next Reward: 50 points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Reviews Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-gray-800 mb-6">What Our Clients Say</h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-2xl font-bold text-gray-700 ml-4">4.9 on Google Reviews</span>
            </div>
            <p className="text-xl text-gray-600">Over 500+ happy clients trust us with their beauty needs</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white to-pink-50/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <Image
                    src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    width={120}
                    height={120}
                    className="rounded-full shadow-lg"
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>

                  <div>
                    <p className="font-serif text-xl font-semibold text-gray-800">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-pink-600 font-medium">{testimonials[currentTestimonial].service}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-pink-600 hover:bg-white transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-pink-600 hover:bg-white transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="flex justify-center mt-8 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-gradient-to-r from-pink-400 to-purple-400 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="rounded-full border-2 border-pink-300 text-pink-600 hover:bg-pink-50 bg-transparent px-8 py-3 font-semibold transition-all duration-300 flex items-center gap-2 mx-auto">
                Read More Reviews
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-24 px-4 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-gray-800 mb-6">Book Your Appointment</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your preferred date, time, and service. Our team will confirm your booking within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden p-10">
              <h3 className="font-serif text-3xl font-semibold mb-8 text-center text-gray-800">Date & Time</h3>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
               <input
                  ref = {preferred_dateRef}
                  type="date"
                  id="date"
                  className="w-full p-4 text-lg rounded-2xl border border-gray-200 focus:border-pink-300 focus:outline-none font-semibold mb-6 text-gray-800"
                />
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-6 text-gray-800">Available Time Slots</h4>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTimeSlot(time)}
                      //@ts-ignore
                      ref={preferred_timeRef}
                      className={`rounded-full py-3 px-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        selectedTimeSlot === time
                          ? "bg-pink-600 text-white shadow-lg"
                          : "border-2 border-gray-200 text-gray-700 hover:bg-pink-100 hover:border-pink-300"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10">
              <h3 className="font-serif text-3xl font-semibold mb-8 text-center text-gray-800">Your Details</h3>
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    ref={nameRef}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full p-4 text-lg rounded-2xl border border-gray-200 focus:border-pink-300 focus:outline-none font-semibold mb-6 text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    ref={phoneRef}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full p-4 text-lg rounded-2xl border border-gray-200 focus:border-pink-300 focus:outline-none font-semibold mb-6 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select Service</label>
                  <select
                    name="service"
                    ref={serviceRef} 
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full p-4 text-lg rounded-2xl border border-gray-200 focus:border-pink-300 focus:outline-none bg-white font-semibold mb-6 text-gray-800"
                    required
                  >
                    <option value="">Choose your service</option>
                    {services.map((service, index) => (
                      <option key={index} value={service.title}>
                        {service.title} - {service.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special requests or notes for your appointment..."
                    className="w-full p-4 text-lg rounded-2xl border border-gray-200 focus:border-pink-300 focus:outline-none h-32 resize-none font-semibold mb-6 text-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  onClick = {handleSignup}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 rounded-2xl text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Confirm Booking
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-gray-800 mb-6">Our Beautiful Work</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Witness the stunning transformations and luxurious experiences we create for our valued clients
            </p>
            <button className="rounded-full border-2 border-pink-300 text-pink-600 hover:bg-pink-50 bg-transparent px-8 py-4 text-lg font-semibold transition-all duration-300 flex items-center gap-2 mx-auto">
              <Instagram className="w-5 h-5" />
              Follow us on Instagram
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl aspect-square hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {image.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="rounded-full border-2 border-pink-300 text-pink-600 hover:bg-pink-50 bg-transparent px-8 py-4 text-lg font-semibold transition-all duration-300 flex items-center gap-2 mx-auto">
              <Camera className="w-5 h-5" />
              View Full Gallery
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-gray-800 mb-6">Visit Our Salon</h2>
            <p className="text-xl text-gray-600">
              Located in the heart of the city, easily accessible and beautifully designed
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-pink-200 to-purple-200 relative flex items-center justify-center">
                <MapPin className="w-24 h-24 text-pink-600/50" />
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <p className="font-serif font-semibold text-lg text-gray-800">Seasons Beauty Parlour</p>
                  <p className="text-gray-600">Premium Beauty Destination</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10">
                <h3 className="font-serif text-3xl font-semibold mb-8 text-gray-800">Get In Touch</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">Address</h4>
                      <p className="text-gray-600 leading-relaxed">
                        123 Beauty Street, Fashion District
                        <br />
                        Mumbai, Maharashtra 400001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">Phone</h4>
                      <p className="text-gray-600">+91 98765 43210</p>
                      <p className="text-gray-600">+91 98765 43211</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">Hours</h4>
                      <p className="text-gray-600">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                      <p className="text-gray-600">Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-10">
                  <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl py-4 text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                  <button className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50 bg-transparent rounded-2xl py-4 text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h3 className="font-serif text-4xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Seasons Beauty Parlour
              </h3>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed max-w-md">
                Where beauty meets elegance. Experience premium beauty treatments in our luxurious salon designed for
                the modern woman.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, color: "hover:bg-blue-600" },
                  { icon: Instagram, color: "hover:bg-pink-600" },
                  { icon: Twitter, color: "hover:bg-blue-400" },
                ].map(({ icon: Icon, color }, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center ${color} transition-all cursor-pointer transform hover:scale-110 duration-300`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-serif text-2xl font-semibold mb-6 text-white">Quick Booking</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-400 rounded-2xl py-3 px-4 focus:outline-none focus:border-pink-400"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-400 rounded-2xl py-3 px-4 focus:outline-none focus:border-pink-400"
                />
                <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-2xl py-3 font-semibold transition-all duration-300">
                  Quick Book
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-2xl font-semibold mb-6 text-white">Stay Updated</h4>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Get beauty tips, exclusive offers, and appointment reminders.
              </p>
              <div className="space-y-4">
                <input
                  type="email"
                  ref={emailRef} 
                  placeholder="Your Email"
                  className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-400 rounded-2xl py-3 px-4 focus:outline-none focus:border-pink-400"
                />
                <button className="w-full border-2 border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white rounded-2xl py-3 font-semibold bg-transparent transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-left">
                © 2024 Seasons Beauty Parlour. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-pink-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-pink-400 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-pink-400 transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}