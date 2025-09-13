"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, CheckCircle } from "lucide-react"

export default function ServiceBooking() {
  const [selectedService, setSelectedService] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    question: "",
    preferredTime: "",
    consultationType: ""
  })

  const services = [
    {
      id: "kundli",
      name: "Kundli Analysis",
      price: "₹1,999",
      duration: "60 mins",
      description: "Complete birth chart analysis with planetary positions, doshas, and life predictions",
      features: ["Birth Chart Analysis", "Dasha Predictions", "Dosha Detection", "Remedies Included"],
      image: "/images/kundali-analysis.png"
    },
    {
      id: "matchmaking",
      name: "Match Making",
      price: "₹2,499",
      duration: "45 mins", 
      description: "Comprehensive compatibility analysis for marriage based on Vedic astrology",
      features: ["Gun Milan", "Manglik Analysis", "Compatibility Score", "Marriage Timing"],
      image: "/images/match-making.png"
    },
    {
      id: "vastu",
      name: "Vastu Consultation",
      price: "₹3,999",
      duration: "90 mins",
      description: "Complete Vastu analysis for home/office with practical remedies",
      features: ["Vastu Chart", "Direction Analysis", "Room Layout Review", "Remedy Solutions"],
      image: "/images/astrology-services.png"
    },
    {
      id: "numerology",
      name: "Numerology Reading",
      price: "₹1,499",
      duration: "45 mins",
      description: "Name and number analysis for life path guidance and lucky numbers",
      features: ["Name Analysis", "Lucky Numbers", "Life Path Reading", "Career Guidance"],
      image: "/images/name-correction.png"
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Booking submitted:", { selectedService, formData })
    alert("Booking request submitted! We will contact you shortly.")
  }

  return (
    <main className="min-h-screen bg-gray-50">

      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-400 to-red-500 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Book Your Service</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Choose from our premium astrology and spiritual services
          </p>
        </div>
      </section>

      {/* Services Selection */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Select Your Service
            </h2>
            <p className="text-lg text-gray-600">
              Choose the service that best fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {services.map((service) => (
              <Card 
                key={service.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedService === service.id ? 'ring-2 ring-orange-500 shadow-lg' : ''
                }`}
                onClick={() => handleServiceSelect(service.id)}
              >
                <CardHeader className="text-center">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-20 h-20 mx-auto mb-4 rounded-full"
                  />
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </span>
                    <span className="text-2xl font-bold text-orange-500">{service.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  {selectedService === service.id && (
                    <Badge className="mt-4 w-full justify-center bg-orange-500">
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Booking Form */}
          {selectedService && (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Book {services.find(s => s.id === selectedService)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="consultationType">Consultation Type *</Label>
                      <Select 
                        value={formData.consultationType} 
                        onValueChange={(value) => handleInputChange("consultationType", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select consultation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video Call</SelectItem>
                          <SelectItem value="audio">Audio Call</SelectItem>
                          <SelectItem value="chat">Text Chat</SelectItem>
                          <SelectItem value="inperson">In Person</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(selectedService === 'kundli' || selectedService === 'matchmaking') && (
                    <>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <Label htmlFor="birthDate">Birth Date *</Label>
                          <Input
                            id="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => handleInputChange("birthDate", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="birthTime">Birth Time *</Label>
                          <Input
                            id="birthTime"
                            type="time"
                            value={formData.birthTime}
                            onChange={(e) => handleInputChange("birthTime", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="birthPlace">Birth Place *</Label>
                          <Input
                            id="birthPlace"
                            type="text"
                            value={formData.birthPlace}
                            onChange={(e) => handleInputChange("birthPlace", e.target.value)}
                            placeholder="City, State, Country"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="preferredTime">Preferred Consultation Time</Label>
                    <Select 
                      value={formData.preferredTime} 
                      onValueChange={(value) => handleInputChange("preferredTime", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                        <SelectItem value="evening">Evening (4 PM - 8 PM)</SelectItem>
                        <SelectItem value="night">Night (8 PM - 10 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="question">Your Question/Concern (Optional)</Label>
                    <Textarea
                      id="question"
                      value={formData.question}
                      onChange={(e) => handleInputChange("question", e.target.value)}
                      placeholder="Please describe what you would like to discuss..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg rounded-full"
                    >
                      Book Now - {services.find(s => s.id === selectedService)?.price}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">50,000+</h3>
              <p className="text-gray-600">Happy Clients Served</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">4.9/5</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">25+</h3>
              <p className="text-gray-600">Years of Experience</p>
            </div>
          </div>
        </div>
      </section>


    </main>
  )
}
