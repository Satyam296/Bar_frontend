"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Crown, Scissors, Gift, Star } from "lucide-react"
import { BACKEND_URL } from "../components/config"
import axios from "axios"
import Loyal_Form from "@/components/loyal_form"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const nameRef = useRef<HTMLInputElement>(null)
  const bookingFormRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const serviceRef = useRef<HTMLSelectElement>(null)
  const preferred_dateRef = useRef<HTMLInputElement>(null)
  const preferred_timeRef = useRef<HTMLSelectElement>(null)

  const [showModal, setShowModal] = useState(false)
  const [loyal_form, setloyalform] = useState(false)
  const [showBookingConfirm, setShowBookingConfirm] = useState(false)
  const aboutRef = useRef<HTMLDivElement>(null)
  const [showStickyButton, setShowStickyButton] = useState(false)
  const loyalFormRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Prevent horizontal scroll
    document.body.style.overflowX = 'hidden'
    document.documentElement.style.overflowX = 'hidden'
    
    return () => {
      document.body.style.overflowX = ''
      document.documentElement.style.overflowX = ''
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!aboutRef.current) return

      const aboutTop = aboutRef.current.offsetTop
      const aboutBottom = aboutTop + aboutRef.current.offsetHeight
      const scrollY = window.scrollY + window.innerHeight / 2

      if (scrollY >= aboutTop && scrollY <= document.body.scrollHeight) {
        setShowStickyButton(true)
      } else {
        setShowStickyButton(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Handle click outside loyalty form
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loyalFormRef.current && !loyalFormRef.current.contains(event.target as Node)) {
        setloyalform(false)
      }
    }

    if (loyal_form) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [loyal_form])

  const handleJoinLoyalty = () => {
    setShowModal(false)
    setloyalform(true)
  }

  const handleDismiss = () => {
    setShowModal(false)
  }

  const handleScrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const name = nameRef.current?.value
    const email = emailRef.current?.value
    const phone = phoneRef.current?.value
    const service = serviceRef.current?.value
    const preferred_date = preferred_dateRef.current?.value
    const preferred_time = preferred_timeRef.current?.value

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/book`, {
        name,
        email,
        phone,
        service,
        preferred_date,
        preferred_time,
      })

      console.log("Booking Response:", response.data)
      setShowBookingConfirm(true)

      // Clear form fields
      if (nameRef.current) nameRef.current.value = ""
      if (emailRef.current) emailRef.current.value = ""
      if (phoneRef.current) phoneRef.current.value = ""
      if (serviceRef.current) serviceRef.current.value = "Select a service"
      if (preferred_dateRef.current) preferred_dateRef.current.value = ""
      if (preferred_timeRef.current) preferred_timeRef.current.value = "Select a time"
    } catch (error) {
      console.error("Booking failed:", error)
      alert("Booking failed. Please try again.")
    }
  }

  const handleAdminDashboard = () => {
    router.push("/admin_dashboard")
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Admin Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleAdminDashboard}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 text-sm rounded-sm"
        >
          Admin
        </Button>
      </div>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/photos/main_shop_photo.png"
            alt="Barber cutting hair"
            fill
            className="object-cover object-center"
            priority
            style={{ objectPosition: "center 20%" }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            Samir's Salon. <br />
            Style. Rewards. Repeat.
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300">
            Where Every Visit <span className="text-amber-400 font-semibold">Pays Off</span> — Earn rewards with every service.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-amber-800 hover:bg-amber-700 text-white px-8 py-6 text-lg rounded-sm"
              onClick={() => {
                window.location.href = "https://dingg.app/booking/samirs-salon-hiranandani-mehdows"
              }}
            >
              Book an Appointment
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-sm"
              onClick={() => setShowModal(true)}
            >
              Get Loyalty Card
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section ref={aboutRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-8">About Us</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Welcome to <span className="text-amber-500 font-semibold">Samir's Salon</span> — where artistry meets precision. 
              For over three decades, we've been redefining beauty and grooming experiences with a perfect blend 
              of modern trends and timeless techniques.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mt-4">
              Along with expert salon services, we also provide professional training in hair styling, 
              makeup, and nail art. Our team ensures every client and trainee leaves confident, skilled, 
              and refreshed — committed to excellence with every experience.
            </p>
          </div>

          <div className="relative h-80 md:h-96">
            <Image
              src="/photos/door_open.png"
              alt="Samir's Salon Front"
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      {showStickyButton && (
        <div className="fixed right-6 bottom-6 flex flex-col items-center gap-4 z-50">
          {/* Book Now Button */}
          <Button
            className="bg-amber-800 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-amber-400/50 transition-all duration-300"
            onClick={() =>
              (window.location.href =
                "https://dingg.app/booking/samirs-salon-hiranandani-mehdows")
            }
          >
            Book Now
          </Button>

          {/* WhatsApp */}
          <a
            href="https://wa.me/917738466566"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-lg hover:shadow-green-400/50 transition-all duration-300"
            title="Chat on WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 48 48"
              fill="currentColor"
            >
              <path
                fill="#fff"
                d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5
                c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24
                c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"
              ></path>
              <path
                fill="#40c351"
                d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6
                C15.3,8.2,8.2,15.3,8.2,24
                c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8l6-1.6l0.6,0.3
                c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8
                C39.8,19.8,38.2,15.8,35.2,12.8z"
              ></path>
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8
                c-0.3,0-0.6,0-0.9,0
                s-0.8,0.1-1.3,0.6
                c-0.4,0.5-1.7,1.6-1.7,4
                s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2
                c4,1.6,4.8,1.3,5.7,1.2
                c0.9-0.1,2.8-1.1,3.2-2.3
                c0.4-1.1,0.4-2.1,0.3-2.3
                c-0.1-0.2-0.4-0.3-0.9-0.6
                s-2.8-1.4-3.2-1.5
                c-0.4-0.2-0.8-0.2-1.1,0.2
                c-0.3,0.5-1.2,1.5-1.5,1.9
                c-0.3,0.3-0.6,0.4-1,0.1
                c-0.5-0.2-2-0.7-3.8-2.4
                c-1.4-1.3-2.4-2.8-2.6-3.3
                c-0.3-0.5,0-0.7,0.2-1
                c0.2-0.2,0.5-0.6,0.7-0.8
                c0.2-0.3,0.3-0.5,0.5-0.8
                c0.2-0.3,0.1-0.6,0-0.8
                C20.6,19.3,19.7,17,19.3,16z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/samirs_salon/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 p-[2px] rounded-full shadow-lg hover:shadow-pink-400/50 transition-all duration-300"
            title="Visit Instagram"
          >
            <div className="bg-white rounded-full p-2 flex items-center justify-center">
              <img
                src="photos/instagram.png"
                alt="Instagram"
                width={26}
                height={26}
              />
            </div>
          </a>
        </div>
      )}

      {/* Our Founder Section */}
      <section className="py-20 px-4 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-3 text-center text-white">
            Meet Our Founder
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">
            A legacy of style and care
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8 items-center bg-zinc-800 p-8 md:p-10 rounded-xl shadow-lg">
              {/* Stylist Image */}
              <div className="md:col-span-2 flex justify-center">
                <div className="w-56 h-56 md:w-64 md:h-64">
                  <img
                    src="/photos/samir_sir.png"
                    alt="Mustaqeem Y. Sahani (Samir) - Founder"
                    className="w-full h-full object-cover rounded-full border-4 border-amber-600"
                    style={{ objectPosition: 'center 20%' }}
                  />
                </div>
              </div>

              {/* Stylist Info */}
              <div className="md:col-span-3 text-center md:text-left">
                <h3 className="text-4xl md:text-5xl font-serif mb-2 text-white">
                  Mustaqeem Y. Sahani (Samir)
                </h3>
                <p className="text-amber-400 text-xl mb-6">Founder & Master Hair Stylist</p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  With over 30 years of experience in the salon and haircare industry, Mustaqeem Y. Sahani 
                  (widely known as Samir) was a former Director and Head of Operations at the renowned 
                  <span className="text-amber-400 font-medium"> JUICE SALON</span>. He has worked with numerous 
                  celebrities and now brings his passion, artistry, and dedication to 
                  <span className="text-amber-400 font-medium"> Samir's Salon</span>, offering clients a warm, 
                  personalized, and professional experience.
                </p>

                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Specialties</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-2">•</span>Advanced Haircuts & Styling
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-2">•</span>Hair Coloring & Highlights
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-2">•</span>Keratin & Hair Botox Treatments
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-2">•</span>Bridal & Event Grooming
                    </li>
                  </ul>
                </div>

                <button
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
                  onClick={() =>
                    (window.location.href =
                      'https://dingg.app/booking/samirs-salon-hiranandani-mehdows')
                  }
                >
                  Book with Samir
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-16 text-center">Our Services</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div
              className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
              style={{
                backgroundImage: "url('/photos/styling_haircuts.png')",
              }}
            >
              <div className="absolute inset-0 bg-black/50 rounded-sm"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-serif mb-4">Haircuts & Styling</h3>
                <p className="text-gray-300 mb-4">Traditional haircut with attention to detail and precision.</p>
              </div>
            </div>

            {/* Service 2 */}
            <div
              className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
              style={{
                backgroundImage: "url('/photos/coloring_hair.png')",
              }}
            >
              <div className="absolute inset-0 bg-black/50 rounded-sm"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-serif mb-4">Hair Coloring</h3>
                <p className="text-gray-300 mb-4">Add depth and dimension with custom shades for a fresh, vibrant style.</p>
              </div>
            </div>

            {/* Service 3 */}
            <div
              className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
              style={{
                backgroundImage: "url('/photos/hair_treatment.png')",
              }}
            >
              <div className="absolute inset-0 bg-black/50 rounded-sm"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-serif mb-4">Hair Straightening</h3>
                <p className="text-gray-300 mb-4">Smooth or curl your hair for a sleek, polished and lasting finish.</p>
              </div>
            </div>
            {/* Service 4 */}
            <div
              className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
              style={{
                backgroundImage: "url('/photos/nails.png')",
              }}
            >
              <div className="absolute inset-0 bg-black/50 rounded-sm"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-serif mb-4">Nail Art</h3>
                <p className="text-gray-300 mb-4">Beautifully designed nails with detailed artistic patterns.</p>
              </div>
            </div>

            {/* Service 5 */}
            <div
              className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
              style={{
                backgroundImage: "url('/photos/manicure.png')",
              }}
            >
              <div className="absolute inset-0 bg-black/50 rounded-sm"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-serif mb-4">Skin Care Combo</h3>
                <p className="text-gray-300 mb-4">Complete treatment package for healthy and glowing skin.</p>
              </div>
            </div>

            {/* Service 6 */}
            <div
              className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
              style={{
                backgroundImage: "url('/photos/bridal.png')",
              }}
            >
              <div className="absolute inset-0 bg-black/50 rounded-sm"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-serif mb-4">Bridal Makeup</h3>
                <p className="text-gray-300 mb-4">Elegant makeup for the bride on her special day.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty Program Section */}
      <section className="py-20 px-4 bg-amber-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-8">Loyalty Program</h2>
          <p className="text-xl mb-12">
            Join our loyalty program and earn points with every visit. Redeem your points for free services or products.
          </p>
          <div className="bg-black/20 p-8 rounded-sm mb-12">
            <h3 className="text-2xl font-serif mb-4">How It Works</h3>
            <ul className="text-left max-w-md mx-auto space-y-4">
              <li className="flex items-start gap-3">
                <span className="bg-white text-amber-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                  1
                </span>
                <span>Scan QR code at checkout and get +150 bonus points</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-white text-amber-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </span>
                <span>Earn 10 points for every ₹100 you spend</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-white text-amber-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                  3
                </span>
                <span>Leave a Google review and get +50 bonus points</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-white text-amber-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                  4
                </span>
                <span>Redeem points for discounts and exclusive rewards</span>
              </li>
            </ul>
          </div>
          <Button
            className="bg-black hover:bg-zinc-800 text-white px-8 py-6 text-lg rounded-sm"
            onClick={() => setShowModal(true)}
          >
            Get Your Loyalty Card
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-8">Visit Us</h2>
            <div className="space-y-6 text-lg">
              <p className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  HIRANANDANI MEADOWS, Emerald Plaza, Shop No. 21, Block No. 2, Pokharan Rd No. 2, Thane West, Thane, Maharashtra 400601
                </span>
              </p>
              <p className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Monday - Friday: 9am - 8pm
                  <br />
                  Saturday: 8am - 6pm
                  <br />
                  Sunday: 10am - 4pm
                </span>
              </p>
              <p className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+91 7738466566</span>
              </p>
            </div>
          </div>
          <div id="instagram-profile" className="text-center py-12">
            <h2 className="text-3xl font-serif mb-4 text-white">Follow us on Instagram</h2>
            <a
              href="https://www.instagram.com/samirs_salon/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "#fff",
                backgroundColor: "#E1306C",
                padding: "10px 20px",
                borderRadius: "5px",
                display: "inline-block",
              }}
            >
              Visit @samirs_salon
            </a>
          </div>
        </div>
      </section> 

      <footer className="py-12 px-4 bg-zinc-900 text-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-serif mb-4 text-white">Samir's Salon</h3>
              <p className="mb-4">Where rewards come with every cut</p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/samirs_salon/" className="text-gray-300 hover:text-amber-600">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-serif mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-amber-600">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-600">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-600">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-600">
                    Founder
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-600">
                    Loyalty Program
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-serif mb-4 text-white">Newsletter</h3>
              <p className="mb-4">Subscribe to our newsletter for special offers and updates.</p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-zinc-800 border-zinc-700 rounded-l-sm px-4 py-2 w-full focus:ring-amber-600 focus:border-amber-600"
                />
                <Button className="bg-amber-800 hover:bg-amber-700 text-white rounded-l-none rounded-r-sm">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 text-center">
            <p>&copy;{new Date().getFullYear()} Samir's Salon. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with enhanced blur */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in"
            onClick={handleDismiss}
          />
          
          {/* Main Modal Container */}
          <div className="relative bg-gradient-to-br from-zinc-900 via-black to-amber-900/20 border border-amber-700/30 rounded-xl shadow-2xl max-w-md w-full animate-modal-in overflow-hidden">
            {/* Elegant Top Border */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-amber-200/80 hover:text-white transition-all duration-200 z-10 p-2 rounded-lg hover:bg-amber-800/30 backdrop-blur-sm"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              {/* Icon Section */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/10 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-5 shadow-2xl border border-amber-500/30">
                    <Crown className="h-8 w-8 text-amber-100" />
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-white mb-3 leading-tight">
                  Join Our Loyalty Family
                </h2>
                <div className="w-16 h-0.5 bg-amber-500 mx-auto mb-4"></div>
                <p className="text-amber-300 font-medium text-base mb-2">
                  Earn Rewards. Get Exclusive Perks.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center group">
                  <div className="bg-amber-900/30 rounded-xl p-3 mb-2 mx-auto border border-amber-700/30 group-hover:border-amber-500/50 transition-all duration-300">
                    <Scissors className="h-5 w-5 text-amber-400 mx-auto" />
                  </div>
                  <p className="text-xs text-amber-200/90 font-medium">Free Services</p>
                </div>
                <div className="text-center group">
                  <div className="bg-amber-900/30 rounded-xl p-3 mb-2 mx-auto border border-amber-700/30 group-hover:border-amber-500/50 transition-all duration-300">
                    <Gift className="h-5 w-5 text-amber-400 mx-auto" />
                  </div>
                  <p className="text-xs text-amber-200/90 font-medium">Premium Gifts</p>
                </div>
                <div className="text-center group">
                  <div className="bg-amber-900/30 rounded-xl p-3 mb-2 mx-auto border border-amber-700/30 group-hover:border-amber-500/50 transition-all duration-300">
                    <Star className="h-5 w-5 text-amber-400 mx-auto" />
                  </div>
                  <p className="text-xs text-amber-200/90 font-medium">VIP Treatment</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-amber-950/20 rounded-lg p-4 mb-6 border border-amber-800/20">
                <p className="text-amber-100/90 text-sm leading-relaxed text-center">
                  Get your digital loyalty card and start earning points with every visit. 
                  <span className="text-amber-300 font-semibold"> Completely free</span> to join!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleJoinLoyalty}
                  className="w-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-white font-semibold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] border border-amber-500/30 text-base"
                >  
                  Get My Loyalty Card
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  className="w-full text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/20 py-2.5 px-6 rounded-lg transition-all duration-200 text-sm border border-transparent hover:border-amber-800/30"
                >
                  Maybe Later
                </Button>
              </div>

              {/* Trust Badge */}
              <div className="mt-6 pt-4 border-t border-amber-800/30">
                <div className="flex items-center justify-center gap-3 text-xs text-amber-200/60">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span>500+ Members</span>
                  </div>
                  <div className="w-0.5 h-0.5 bg-amber-600 rounded-full"></div>
                  <span>No Commitment</span>
                </div>
              </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"></div>
          </div>
        </div>
      )}

      {loyal_form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div ref={loyalFormRef}>
            <Loyal_Form />
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showBookingConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowBookingConfirm(false)} />
          
          <div className="relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-2 border-green-600/40 rounded-2xl shadow-2xl max-w-md w-full animate-modal-in overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-green-500 to-green-600"></div>
            
            <button
              onClick={() => setShowBookingConfirm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-1 rounded-full hover:bg-gray-800/50"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-4 shadow-lg">
                    <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                Booking Confirmed!
              </h2>

              <p className="text-green-400 font-semibold text-lg mb-4">
                Your appointment has been successfully booked.
              </p>

              <p className="text-gray-300 text-sm leading-relaxed mb-8">
                We'll send you a confirmation message shortly. Looking forward to seeing you!
              </p>

              <Button
                onClick={() => setShowBookingConfirm(false)}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Great, Thanks!
              </Button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
          </div>
        </div>
      )}
    </main>
  )
}