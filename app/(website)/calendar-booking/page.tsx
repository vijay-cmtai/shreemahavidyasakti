"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Phone, MapPin, Video, MessageCircle } from "lucide-react"

export default function CalendarBooking() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [consultationType, setConsultationType] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  })

  // Generate next 30 days
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: i === 0,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    return dates
  }

  const timeSlots = [
    { time: "09:00", label: "9:00 AM", available: true },
    { time: "09:30", label: "9:30 AM", available: true },
    { time: "10:00", label: "10:00 AM", available: false },
    { time: "10:30", label: "10:30 AM", available: true },
    { time: "11:00", label: "11:00 AM", available: true },
    { time: "11:30", label: "11:30 AM", available: true },
    { time: "12:00", label: "12:00 PM", available: false },
    { time: "14:00", label: "2:00 PM", available: true },
    { time: "14:30", label: "2:30 PM", available: true },
    { time: "15:00", label: "3:00 PM", available: true },
    { time: "15:30", label: "3:30 PM", available: false },
    { time: "16:00", label: "4:00 PM", available: true },
    { time: "16:30", label: "4:30 PM", available: true },
    { time: "17:00", label: "5:00 PM", available: true },
    { time: "17:30", label: "5:30 PM", available: true },
    { time: "18:00", label: "6:00 PM", available: true },
    { time: "19:00", label: "7:00 PM", available: true },
    { time: "19:30", label: "7:30 PM", available: false },
    { time: "20:00", label: "8:00 PM", available: true }
  ]

  const services = [
    { id: "kundli", name: "Kundli Analysis", duration: "60 mins", price: "₹1,999" },
    { id: "matchmaking", name: "Match Making", duration: "45 mins", price: "₹2,499" },
    { id: "vastu", name: "Vastu Consultation", duration: "90 mins", price: "₹3,999" },
    { id: "numerology", name: "Numerology Reading", duration: "45 mins", price: "₹1,499" },
    { id: "career", name: "Career Guidance", duration: "30 mins", price: "₹999" },
    { id: "general", name: "General Consultation", duration: "30 mins", price: "₹799" }
  ]

  const consultationTypes = [
    { id: "video", name: "Video Call", icon: Video, description: "Face-to-face consultation via video call" },
    { id: "audio", name: "Audio Call", icon: Phone, description: "Voice consultation over phone call" },
    { id: "chat", name: "Text Chat", icon: MessageCircle, description: "Written consultation via chat" },
    { id: "inperson", name: "In Person", icon: MapPin, description: "Physical consultation at our center" }
  ]

  const dates = generateDates()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTimeSlot || !selectedService || !consultationType) {
      alert("Please fill all required fields")
      return
    }
    
    const bookingData = {
      date: selectedDate,
      time: selectedTimeSlot,
      service: selectedService,
      consultationType,
      ...formData
    }
    
    console.log("Booking submitted:", bookingData)
    alert("Booking confirmed! You will receive a confirmation email shortly.")
  }

  const selectedServiceDetails = services.find(s => s.id === selectedService)

  return (
    <main className="min-h-screen bg-gray-50">

      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-400 to-red-500 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Calendar Booking</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Schedule Your Consultation at Your Convenience
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Selection */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Service Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Select Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedService === service.id 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <h3 className="font-semibold">{service.name}</h3>
                        <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                          <span>{service.duration}</span>
                          <span className="font-semibold text-orange-600">{service.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Consultation Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Consultation Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {consultationTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          consultationType === type.id 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => setConsultationType(type.id)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <type.icon className="w-5 h-5 text-orange-500" />
                          <h3 className="font-semibold">{type.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Date Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {dates.map((date) => (
                      <div
                        key={date.date}
                        className={`p-3 text-center rounded-lg cursor-pointer transition-all ${
                          selectedDate === date.date
                            ? 'bg-orange-500 text-white'
                            : date.isToday
                            ? 'bg-orange-100 text-orange-700 border border-orange-300'
                            : date.isWeekend
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-white border border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => !date.isWeekend && setSelectedDate(date.date)}
                      >
                        <div className="text-xs font-medium">{date.dayName}</div>
                        <div className="text-lg font-bold">{date.day}</div>
                        <div className="text-xs">{date.month}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    * Weekend slots are not available. Please select weekdays only.
                  </p>
                </CardContent>
              </Card>

              {/* Time Slot Selection */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Select Time Slot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => slot.available && setSelectedTimeSlot(slot.time)}
                          className={`${
                            selectedTimeSlot === slot.time 
                              ? 'bg-orange-500 hover:bg-orange-600' 
                              : !slot.available 
                              ? 'opacity-50 cursor-not-allowed' 
                              : ''
                          }`}
                        >
                          {slot.label}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span>Booked</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              {selectedDate && selectedTimeSlot && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleBooking} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
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
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          placeholder="Any specific questions or requirements..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg rounded-full"
                      >
                        Confirm Booking
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Side - Booking Summary */}
            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedServiceDetails && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h3 className="font-semibold text-orange-800">{selectedServiceDetails.name}</h3>
                      <div className="flex justify-between text-sm text-orange-600 mt-2">
                        <span>Duration: {selectedServiceDetails.duration}</span>
                        <span className="font-semibold">{selectedServiceDetails.price}</span>
                      </div>
                    </div>
                  )}

                  {consultationType && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {consultationTypes.find(t => t.id === consultationType)?.icon && (
                          <div className="text-blue-600">
                            {React.createElement(consultationTypes.find(t => t.id === consultationType)!.icon, { size: 16 })}
                          </div>
                        )}
                        <span className="text-blue-800 font-medium">
                          {consultationTypes.find(t => t.id === consultationType)?.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedDate && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedTimeSlot && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 text-purple-800">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">
                          {timeSlots.find(t => t.time === selectedTimeSlot)?.label}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold text-orange-600">
                        {selectedServiceDetails?.price || "Select Service"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-500" />
                      <span>+91 9773380099</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-orange-500" />
                      <span>Live Chat Support</span>
                    </div>
                    <p className="text-gray-600">
                      Our support team is available to help you with your booking.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>


    </main>
  )
}
