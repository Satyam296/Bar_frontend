"use client"
import { useState, useEffect } from "react"
import { X, Crown, Scissors, Gift, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LoyaltyModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Show modal after a short delay when page loads
    const timer = setTimeout(() => {
      setShowModal(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleJoinLoyalty = () => {
   
    console.log("User joined loyalty program!")
    setShowModal(false)
  
  }

  const handleDismiss = () => {
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Sample Background Content */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Classic Barbershop</h1>
        <p className="text-gray-400 text-lg">Premium grooming services for the modern gentleman</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Classic Cut", price: "$35" },
            { name: "Fade & Taper", price: "$40" },
            { name: "Beard Trim", price: "$25" },
          ].map((service, index) => (
            <div key={index} className="bg-gray-900 border border-orange-600/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
              <p className="text-2xl font-bold text-orange-500">{service.price}</p>
            </div>
          ))}
        </div>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={handleDismiss} />

         
          <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-orange-600/40 rounded-2xl shadow-2xl max-w-lg w-full animate-modal-in overflow-hidden">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600"></div>

        
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-1 rounded-full hover:bg-gray-800/50"
            >
              <X className="h-6 w-6" />
            </button>

            
            <div className="p-8 text-center">
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-full p-4 shadow-lg">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>

             
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                🎉 Become Our Loyal Customer – Absolutely FREE!
              </h2>

              
              <p className="text-orange-400 font-semibold text-lg mb-6">
                Unlock rewards like free haircuts, grooming kits & exclusive discounts.
              </p>

             
              <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                Get your loyalty card at no cost and start collecting points on every visit. Enjoy exclusive perks just
                for being a regular!
              </p>

            
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="bg-orange-600/20 rounded-full p-3 mb-2 mx-auto w-fit border border-orange-600/30">
                    <Scissors className="h-6 w-6 text-orange-400" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Free Cuts</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-600/20 rounded-full p-3 mb-2 mx-auto w-fit border border-orange-600/30">
                    <Gift className="h-6 w-6 text-orange-400" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Grooming Kits</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-600/20 rounded-full p-3 mb-2 mx-auto w-fit border border-orange-600/30">
                    <Star className="h-6 w-6 text-orange-400" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">VIP Perks</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleJoinLoyalty}
                  className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-400 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 animate-glow text-lg"
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
            
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
          </div>
        </div>
      )}
    </div>
  )
}
