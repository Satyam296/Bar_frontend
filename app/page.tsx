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
  const [showBookingConfirm, setShowBookingConfirm] = useState(false)
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

const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
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
    setShowBookingConfirm(true);
    
    // Clear form fields
    if (nameRef.current) nameRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (phoneRef.current) phoneRef.current.value = '';
    if (serviceRef.current) serviceRef.current.value = 'Select a service';
    if (preferred_dateRef.current) preferred_dateRef.current.value = '';
    if (preferred_timeRef.current) preferred_timeRef.current.value = 'Select a time';
  } catch (error) {
    console.error("Booking failed:", error);
    alert("Booking failed. Please try again.");
  }
}; 
  return (
    <main className="min-h-screen bg-black text-white">
      
      <section className="relative h-screen flex items-center justify-center">
  <div className="absolute inset-0 z-0">
    <Image
      src="/photos/main_shop_photo.png"
      alt="Barber cutting hair"
      fill
      className="object-cover object-center"
      priority
      style={{ objectPosition: 'center 20%' }}
    />
    <div className="absolute inset-0 bg-black/70"></div>
  </div>
  
  <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
    <h1 className="text-5xl md:text-7xl font-serif mb-6">
      Samir's Salon. <br />
      Style. Rewards. Repeat.
    </h1>
    <p className="text-xl md:text-2xl mb-12 text-gray-300">
      Where Every Visit <span className="text-amber-400 font-semibold">Pays Off</span> — Earn rewards with every service.
    </p>

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
              src="/photos/door_open.png"
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
        <h2 className="text-4xl md:text-5xl font-serif mb-3 text-center">Meet Our Master Stylist</h2>
        <p className="text-center text-gray-400 mb-16 text-lg">Creating beauty, building confidence</p>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 items-center bg-zinc-800 p-8 md:p-10 rounded-lg">
            {/* Stylist Image */}
            <div className="md:col-span-2">
              <div className="w-56 h-56 md:w-64 md:h-64 mx-auto">
                <img
                  src="/photos/samir_sir.png"
                  alt="Samir - Master Stylist"
                  className="w-full h-full object-cover rounded-full border-4 border-amber-600"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>
            </div>
            
            {/* Stylist Info */}
            <div className="md:col-span-3 text-center md:text-left">
              <h3 className="text-4xl md:text-5xl font-serif mb-2">Samir</h3>
              <p className="text-amber-400 text-xl mb-6">Master Hair Stylist & Founder</p>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                With over 15 years of experience, Samir specializes in creating stunning transformations for women. From precision cuts to beautiful color work and special occasion styling, he brings expertise and artistry to every appointment.
              </p>
              
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Specialties</h4>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Hair Coloring & Highlights</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Precision Cuts & Styling</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Bridal & Event Styling</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Keratin & Hair Treatments</span>
                  </div>
                </div>
              </div>
              
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300">
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
      backgroundImage: "url('/photos/styling_haircuts.png')", // <-- Put your image path here
    }}
  >
    <div className="absolute inset-0 bg-black/50 rounded-sm"></div> {/* Optional overlay */}
    
    <div className="relative z-10">
      <h3 className="text-2xl font-serif mb-4">Signature Haircuts & Styling</h3>
      <p className="text-gray-300 mb-4">Traditional haircut with attention to detail and precision.</p>
      <p className="text-amber-400 text-xl font-semibold">$35</p>
    </div>
  </div>

            {/* Service 2 */}
            <div
    className="relative border border-amber-800 rounded-sm bg-cover bg-center text-white p-8"
    style={{
      backgroundImage: "url('/photos/coloring_hair.png')", // <-- Put your image path here
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
      backgroundImage: "url('/photos/hair_treatment.png')", // <-- Put your image path here
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
      backgroundImage: "url('/photos/nails.png')", // <-- Put your image path here
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
      backgroundImage: "url('/photos/manicure.png')", // <-- Put your image path here
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
      backgroundImage: "url('/photos/bridal.png')", // <-- Put your image path here
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
                <span>Leave a Google review and get +200 bonus points</span>
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
          <div ref={bookingFormRef}>
            <h2 className="text-4xl md:text-5xl font-serif mb-8">Book Now</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
              <Button onClick={handleSignup} className="w-full bg-amber-800 hover:bg-amber-700 text-white px-8 py-6 text-lg rounded-sm" type="button">
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
            <p>&copy;{new Date().getFullYear()} Classic Barbershop. All rights reserved.</p>
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