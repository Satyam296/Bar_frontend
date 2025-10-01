"use client" 
import { useState, useEffect , useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Crown, Scissors, Gift, Star } from "lucide-react"
import {BACKEND_URL} from "../components/config" ; 
import axios from "axios" ;
import Loyal_Form from "@/components/loyal_form" ; 

export default function Home() {
  const nameRef = useRef<HTMLInputElement>(null);
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);  
  const serviceRef = useRef<HTMLSelectElement>(null);
  const preferred_dateRef = useRef<HTMLInputElement>(null);
  const preferred_timeRef = useRef<HTMLSelectElement>(null); 

  const [showModal, setShowModal] = useState(false)
  const [loyal_form , setloyalform] = useState(false) 

  useEffect(() => {
     
    const timer = setTimeout(() => {
      setShowModal(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleJoinLoyalty = () => {
    
    
    setShowModal(false)
    setloyalform(true) 
  }

  const handleDismiss = () => {
    setShowModal(false)
  }

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
      preferred_time,
    });

    console.log("Booking Response:", response.data);
    alert("Booking successful!");
  } catch (error) {
    console.error("Booking failed:", error);
    alert("Booking failed.");
  }
}; 


  return (
    <main className="min-h-screen bg-black text-white">
      
      <section className="relative h-screen flex items-center justify-center">
       
        <div className="absolute inset-0 z-0">
          <Image
            src="https://imgs.search.brave.com/XzFx4rFSM4f6c47WjLS-UVb-zblSZrM4TXDi8ia8xfQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9leHRl/cmlvci1jbGFzc2lj/by1iYXJiZXItc2hv/cC1tJUMzJUI2bG5k/YWwtc3dlZGVuLW1h/cmNoLTI3OTM2NDg4/NC5qcGc"
            alt="Barber cutting hair"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            Classic Cuts.
            <br />
            Modern Loyalty.
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300">Earn rewards every time with our Loyalty Card.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button  className="bg-amber-800 hover:bg-amber-700 text-white px-8 py-6 text-lg rounded-sm"
            onClick={() => {
              bookingFormRef.current?.scrollIntoView({ behavior: "smooth" });
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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-8">About Us</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Welcome to our barbershop, where tradition meets trend. Serving the community for over 10 years, we pride
              ourselves on exceptional service and timeless style.
            </p>
          </div>
          <div className="relative h-80 md:h-96">
            <Image
              src="https://imgs.search.brave.com/2WbCx9yjMC-bmEKs_JBmsexBPPTZoimnijhnvdPFP5M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdj/ZG4uc3RhYmxlZGlm/ZnVzaW9ud2ViLmNv/bS8yMDI0LzkvMTUv/ZTE1NmMyOTYtYTYw/Ni00ZmExLThhNGQt/MWYxYTlhNzAxYzNi/LmpwZw"
              alt="Barbershop interior"
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>
      </section>

      {/* Our Barbers Section */}
      <section className="py-20 px-4 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-16 text-center">Our Barbers</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Barber 1 */}
            <div className="text-center bg-zinc-800 p-8 rounded-sm">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Image
                  src="https://imgs.search.brave.com/D9RCIxk4jrdSRGjENOIx3pOccDuX3EuOi34nZK-Goxg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcx/NzQ2ODMyMy9waG90/by9wb3J0cmFpdC1v/Zi1wcm91ZC1iYXJi/ZXJzaG9wLW93bmVy/LWluLWhpcy1zaG9w/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1nWklvQUphR2J6/b2NUSE1SN0dVdUdO/ZjltWnB3OE1VVFdy/cUJBa0wwZ0FNPQ"
                  alt="James - Barber"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-3xl font-serif mb-2">James</h3>
              <p className="text-gray-300">Classic Haircuts</p>
            </div>

            {/* Barber 2 */}
            <div className="text-center bg-zinc-800 p-8 rounded-sm">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Image
                  src="https://imgs.search.brave.com/SiPvtlbyjz-RYgZ2SF6KJSGVDcNtdUFK8aityQyqHqI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9waG90by1jYXVj/YXNpYW4tYmFyYmVy/aW5nLW1hbi1iYWNr/Z3JvdW5kLWJhcmJl/cmluZy1tYW4taXNv/bGF0ZWQtYmxhY2tf/NDc0NzE3LTEzMDMz/OS5qcGc_c2VtdD1h/aXNfaXRlbXNfYm9v/c3RlZCZ3PTc0MA"
                  alt="Michael - Barber"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-3xl font-serif mb-2">Michael</h3>
              <p className="text-gray-300">Fades & Tapers</p>
            </div>

            {/* Barber 3 */}
            <div className="text-center bg-zinc-800 p-8 rounded-sm">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Image
                  src="https://imgs.search.brave.com/ouvAALCoM0cr6Q4ANCYBiiATTe1hAaRIVDsejn89DdI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDQ1MjE1My9waG90/by9wb3J0cmFpdC1v/Zi1hLWJhcmJlci5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/SDU2OVhGOG8tV252/T2dnYXhCRnhrYUh2/Vko4SnBSX3V6eGsx/cjRFd21GMD0"
                  alt="Ethan - Barber"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-3xl font-serif mb-2">Ethan</h3>
              <p className="text-gray-300">Beard Sculpting</p>
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
      backgroundImage: "url('https://imgs.search.brave.com/bTOBzGgL_M1coXsTMRMcNMJGiQfF1EdDqmSSOsc0aEQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzAy/NTUvMjQxNy80OTIy/L2ZpbGVzL1F1aWZm/X0hhaXJzdHlsZV8t/X0NsYXNzaWNfSGFp/cnN0eWxlc19Gb3Jf/TWVuXzFfNDgweDQ4/MC5qcGc_dj0xNzI0/NzY3Mzk3')", // <-- Put your image path here
    }}
  >
    <div className="absolute inset-0 bg-black/50 rounded-sm"></div> {/* Optional overlay */}
    
    <div className="relative z-10">
      <h3 className="text-2xl font-serif mb-4">Classic Cut</h3>
      <p className="text-gray-300 mb-4">Traditional haircut with attention to detail and precision.</p>
      <p className="text-amber-400 text-xl font-semibold">$35</p>
    </div>
  </div>

            {/* Service 2 */}
            <div
    className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
    style={{
      backgroundImage: "url('https://imgs.search.brave.com/tJHWINUj-QgOfzHoyMoECS1SJvnbo_SpLlSrCWRx5S8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2NmLzY5/LzZkL2NmNjk2ZDVm/MzBiZDllYTk4NjEz/NTRjMzJmNDAyMDE3/LmpwZw')", // <-- Put your image path here
    }}
  >
    <div className="absolute inset-0 bg-black/50 rounded-sm"></div> {/* Optional overlay */}
    
    <div className="relative z-10">
      <h3 className="text-2xl font-serif mb-4">Fade & Taper</h3>
      <p className="text-gray-300 mb-4">Shape and style your beard for a clean, refined look.</p>
      <p className="text-amber-400 text-xl font-semibold">$40</p>
    </div>
  </div>

            {/* Service 3 */}
            <div
    className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
    style={{
      backgroundImage: "url('https://imgs.search.brave.com/upkehBClYFqea-g7J6oLuuXlIw6gd3oakQDwFgQK4X4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9iZWFy/ZC10cmltLWJhcmJl/cnNob3AtaW5kb29y/LXBvcnRyYWl0LWVs/ZWdhbnQtYWR1bHQt/bWFuLWJhcmJlci1o/YWlyLWdldHRpbmct/dHJpbS1oaXMtZmFj/aWFsLWhhaXItYmVh/cmQtdHJpbS0yNjQx/MTQ4ODUuanBn')", // <-- Put your image path here
    }}
  >
    <div className="absolute inset-0 bg-black/50 rounded-sm"></div> {/* Optional overlay */}
    
    <div className="relative z-10">
      <h3 className="text-2xl font-serif mb-4">Beard Trim</h3>
      <p className="text-gray-300 mb-4">Modern and style your beard for a clean, refined look.</p>
      <p className="text-amber-400 text-xl font-semibold">$25</p>
    </div>
  </div>
            {/* Service 4 */}
             <div
    className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
    style={{
      backgroundImage: "url('https://imgs.search.brave.com/GcaKgGMfjJzp6nmEo1CTAVH0TWdeqPb62yyw1og1Zz8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c3R5bGVzZWF0LmNv/bS9ibG9nL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzExL3Bl/cnNvbi1nZXR0aW5n/LWhvdC10b3dlbC1z/aGF2ZS5qcGc')", // <-- Put your image path here
    }}
  >
    <div className="absolute inset-0 bg-black/50 rounded-sm"></div> {/* Optional overlay */}
    
    <div className="relative z-10">
      <h3 className="text-2xl font-serif mb-4">Hot Towel Shave</h3>
      <p className="text-gray-300 mb-4">Luxirious straight razor shave with hot towel treatment.</p>
      <p className="text-amber-400 text-xl font-semibold">$40</p>
    </div>
  </div>

            {/* Service 5 */}
             <div
    className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
    style={{
      backgroundImage: "url('https://imgs.search.brave.com/C2R2x9JdwM8ioPD6hZLliNmN_WGcRTWzOQ6I6ZLDDsY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDQv/Nzc0Lzg4OS9zbWFs/bC9tYWxlLWJhcmJl/ci1tYWtlcy1hLWhh/aXJjdXQtYmVhcmQt/Y2xpZW50LXdpdGgt/dmludGFnZS1zdHJh/aWdodC1yYXpvci1w/aG90by5qcGc')", // <-- Put your image path here
    }}
  >
    <div className="absolute inset-0 bg-black/50 rounded-sm"></div> {/* Optional overlay */}
    
    <div className="relative z-10">
      <h3 className="text-2xl font-serif mb-4">Hair & Beard Combo</h3>
      <p className="text-gray-300 mb-4">Complete grooming package for hair and facial hair.</p>
      <p className="text-amber-400 text-xl font-semibold">$60</p>
    </div>
  </div>

            {/* Service 6 */}
             <div
    className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
    style={{
      backgroundImage: "url('https://imgs.search.brave.com/SvT-LyESKhsZxN55wsLVXySJiMe1iX9vVAIMaFVJBBY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTUy/MTExOTgzL3Bob3Rv/L2hhaXItY3V0Lmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1w/M0NNMUlCR1E5Y0dU/TjVuVzdscTRqMXNF/ZXF3Tk4zdGtXeUIx/NTlqMVVRPQ')", // <-- Put your image path here
    }}
  >
    <div className="absolute inset-0 bg-black/50 rounded-sm"></div> {/* Optional overlay */}
    
    <div className="relative z-10">
      <h3 className="text-2xl font-serif mb-4">Kid's Cut</h3>
      <p className="text-gray-300 mb-4">Haircuts for he little gentlemen (under12).</p>
      <p className="text-amber-400 text-xl font-semibold">$25</p>
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
                <span>Sign up for our loyalty card in-store or online</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-white text-amber-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </span>
                <span>Earn 10 points for every dollar spent</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-white text-amber-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                  3
                </span>
                <span>Redeem 500 points for $5 off your service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-white text-amber-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                  4
                </span>
                <span>Enjoy exclusive member-only promotions</span>
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
                  123 Main Street, Downtown
                  <br />
                  New York, NY 10001
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
                <span>(555) 123-4567</span>
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>info@classicbarbershop.com</span>
              </p>
            </div>
          </div>
          <div ref={bookingFormRef}>
            <h2 className="text-4xl md:text-5xl font-serif mb-8">Book Now</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  ref = {nameRef}
                  type="text"
                  id="name"
                  className="w-full bg-zinc-800 border-zinc-700 rounded-sm px-4 py-3 text-white focus:ring-amber-600 focus:border-amber-600"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  ref = {emailRef}
                  type="email"
                  id="email"
                  className="w-full bg-zinc-800 border-zinc-700 rounded-sm px-4 py-3 text-white focus:ring-amber-600 focus:border-amber-600"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  ref = {phoneRef}
                  type="tel"
                  id="phone"
                  className="w-full bg-zinc-800 border-zinc-700 rounded-sm px-4 py-3 text-white focus:ring-amber-600 focus:border-amber-600"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-1">
                  Service
                </label>
                <select
                  ref = {serviceRef}
                  id="service"
                  className="w-full bg-zinc-800 border-zinc-700 rounded-sm px-4 py-3 text-white focus:ring-amber-600 focus:border-amber-600"
                >
                  <option>Select a service</option>
                  <option>Classic Cut</option>
                  <option>Fade & Taper</option>
                  <option>Beard Trim</option>
                  <option>Hot Towel Shave</option>
                  <option>Hair & Beard Combo</option>
                  <option>Kid's Cut</option>
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                  Preferred Date
                </label>
                <input
                  ref = {preferred_dateRef}
                  type="date"
                  id="date"
                  className="w-full bg-zinc-800 border-zinc-700 rounded-sm px-4 py-3 text-white focus:ring-amber-600 focus:border-amber-600"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
                  Preferred Time
                </label>
                <select
                  ref = {preferred_timeRef}
                  id="time"
                  className="w-full bg-zinc-800 border-zinc-700 rounded-sm px-4 py-3 text-white focus:ring-amber-600 focus:border-amber-600"
                >
                  <option>Select a time</option>
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>12:00 PM</option>
                  <option>1:00 PM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                  <option>5:00 PM</option>
                  <option>6:00 PM</option>
                  <option>7:00 PM</option>
                </select>
              </div>
              <Button onClick = {handleSignup} className="w-full bg-amber-800 hover:bg-amber-700 text-white px-8 py-6 text-lg rounded-sm">
                Book Appointment
              </Button>
            </form>
          </div>
        </div>
      </section>

     
      <footer className="py-12 px-4 bg-zinc-900 text-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-serif mb-4 text-white">Classic Barbershop</h3>
              <p className="mb-4">Where tradition meets modern style.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-amber-600">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-amber-600">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-amber-600">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
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
                    Our Barbers
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
            <p>&copy; {new Date().getFullYear()} Classic Barbershop. All rights reserved.</p>
          </div>
        </div>
      </footer>


      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={handleDismiss} />

       
          <div className="relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-2 border-amber-600/40 rounded-2xl shadow-2xl max-w-lg w-full animate-modal-in overflow-hidden">
          
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"></div>

          
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-1 rounded-full hover:bg-gray-800/50"
            >
              <X className="h-6 w-6" />
            </button>

         
            <div className="p-8 text-center">
         
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-amber-500 to-amber-600 rounded-full p-4 shadow-lg">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>

        
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 leading-tight">
                🎉 Become Our Loyal Customer – Absolutely FREE!
              </h2>

            
              <p className="text-amber-400 font-semibold text-lg mb-6">
                Unlock rewards like free haircuts, grooming kits & exclusive discounts.
              </p>

             
              <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                Get your loyalty card at no cost and start collecting points on every visit. Enjoy exclusive perks just
                for being a regular!
              </p>

            
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="bg-amber-600/20 rounded-full p-3 mb-2 mx-auto w-fit border border-amber-600/30">
                    <Scissors className="h-6 w-6 text-amber-400" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Free Cuts</p>
                </div>
                <div className="text-center">
                  <div className="bg-amber-600/20 rounded-full p-3 mb-2 mx-auto w-fit border border-amber-600/30">
                    <Gift className="h-6 w-6 text-amber-400" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Grooming Kits</p>
                </div>
                <div className="text-center">
                  <div className="bg-amber-600/20 rounded-full p-3 mb-2 mx-auto w-fit border border-amber-600/30">
                    <Star className="h-6 w-6 text-amber-400" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">VIP Perks</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleJoinLoyalty}
                  className="w-full bg-gradient-to-r from-amber-800 via-amber-500 to-amber-600 hover:from-amber-800 hover:via-amber-800 hover:to-amber-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105 animate-glow text-lg"
                >  
                  Join Loyalty Program (Free)
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-800/50 py-3 px-6 rounded-lg transition-colors text-sm"
                >
                  No Thanks
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>500+ Members</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                  <span>No Spam Policy</span>
                  <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>

            {/* Decorative Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          </div>
        </div>
        
      )}
      {loyal_form && (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <Loyal_Form />
     </div>
    )}

    </main>
  )
}
