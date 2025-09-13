"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Calendar, Clock, Users, Star, Eye } from "lucide-react"

export default function PujaShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const livePujas = [
    {
      id: 1,
      title: "Ganga Aarti - Live from Haridwar",
      description: "Join the divine evening Ganga Aarti ceremony live from Har Ki Pauri, Haridwar",
      time: "Today 7:00 PM",
      duration: "45 mins",
      viewers: "2.5K watching",
      isLive: true,
      image: "/placeholder.jpg",
      videoId: "dQw4w9WgXcQ"
    },
    {
      id: 2,
      title: "Mahamrityunjaya Jaap",
      description: "108 times Mahamrityunjaya mantra chanting for health and longevity",
      time: "Tomorrow 6:00 AM",
      duration: "60 mins",
      viewers: "1.8K registered",
      isLive: false,
      image: "/placeholder.jpg",
      videoId: "dQw4w9WgXcQ"
    }
  ]

  const recordedPujas = [
    {
      id: 1,
      title: "Satyanarayan Puja - Complete Ceremony",
      description: "Full Satyanarayan Puja with proper Vedic rituals and mantras",
      duration: "2 hours 15 mins",
      views: "45.2K views",
      rating: 4.9,
      category: "festivals",
      image: "/placeholder.jpg",
      videoId: "dQw4w9WgXcQ"
    },
    {
      id: 2,
      title: "Lakshmi Puja for Prosperity",
      description: "Invoke Goddess Lakshmi's blessings for wealth and prosperity",
      duration: "1 hour 30 mins", 
      views: "32.8K views",
      rating: 4.8,
      category: "prosperity",
      image: "/placeholder.jpg",
      videoId: "dQw4w9WgXcQ"
    },
    {
      id: 3,
      title: "Ganesh Chaturthi Special Puja",
      description: "Special Ganesh Puja ceremony for removing obstacles",
      duration: "1 hour 45 mins",
      views: "67.5K views", 
      rating: 4.9,
      category: "festivals",
      image: "/placeholder.jpg",
      videoId: "dQw4w9WgXcQ"
    },
    {
      id: 4,
      title: "Hanuman Chalisa - 108 Times",
      description: "Powerful Hanuman Chalisa recitation for strength and protection",
      duration: "3 hours",
      views: "89.1K views",
      rating: 4.7,
      category: "devotional",
      image: "/placeholder.jpg",
      videoId: "dQw4w9WgXcQ"
    },
    {
      id: 5,
      title: "Rudra Abhishek - Shiva Puja",
      description: "Sacred Shiva Abhishek ceremony for spiritual growth",
      duration: "2 hours",
      views: "41.6K views",
      rating: 4.8,
      category: "spiritual",
      image: "/placeholder.jpg",
      videoId: "dQw4w9WgXcQ"
    },
    {
      id: 6,
      title: "Navagraha Shanti Puja",
      description: "Nine planet peace ceremony for astrological remedies", 
      duration: "2 hours 30 mins",
      views: "28.4K views",
      rating: 4.6,
      category: "remedial",
      image: "/placeholder.jpg",
      videoId: "dQw4w9WgXcQ"
    }
  ]

  const categories = [
    { id: "all", name: "All Pujas" },
    { id: "festivals", name: "Festival Pujas" },
    { id: "prosperity", name: "Prosperity" },
    { id: "devotional", name: "Devotional" },
    { id: "spiritual", name: "Spiritual" },
    { id: "remedial", name: "Remedial" }
  ]

  const filteredPujas = selectedCategory === "all" 
    ? recordedPujas 
    : recordedPujas.filter(puja => puja.category === selectedCategory)

  const handleWatchVideo = (videoId: string) => {
    // In a real app, this would open a video player or redirect to YouTube
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }

  return (
    <main className="min-h-screen bg-gray-50">

      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-400 to-red-500 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Puja Showcase</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Watch Live & Recorded Sacred Ceremonies
          </p>
        </div>
      </section>

      {/* Live Pujas Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Live Pujas
            </h2>
            <p className="text-lg text-gray-600">
              Join live sacred ceremonies and connect with divine energy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {livePujas.map((puja) => (
              <Card key={puja.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={puja.image} 
                    alt={puja.title}
                    className="w-full h-48 object-cover"
                  />
                  {puja.isLive && (
                    <Badge className="absolute top-4 left-4 bg-red-500 animate-pulse">
                      🔴 LIVE
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <Button 
                      onClick={() => handleWatchVideo(puja.videoId)}
                      className="bg-white bg-opacity-90 text-gray-800 hover:bg-white p-4 rounded-full"
                    >
                      <Play className="w-8 h-8" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{puja.title}</h3>
                  <p className="text-gray-600 mb-4">{puja.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {puja.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {puja.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-orange-600">
                      <Users className="w-4 h-4" />
                      {puja.viewers}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recorded Pujas Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Recorded Pujas
            </h2>
            <p className="text-lg text-gray-600">
              Access our library of sacred ceremonies anytime
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Puja Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPujas.map((puja) => (
              <Card key={puja.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={puja.image} 
                    alt={puja.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button 
                      onClick={() => handleWatchVideo(puja.videoId)}
                      className="bg-white bg-opacity-90 text-gray-800 hover:bg-white p-4 rounded-full"
                    >
                      <Play className="w-8 h-8" />
                    </Button>
                  </div>
                  <Badge className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white">
                    {puja.duration}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">{puja.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{puja.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      {puja.views}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      {puja.rating}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Puja Request Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Request a Special Puja
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Can't find what you're looking for? Request a personalized puja ceremony
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full">
              Request Custom Puja
            </Button>
            <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 rounded-full">
              Schedule Live Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">HD Quality Videos</h3>
              <p className="text-gray-600">Crystal clear video quality for the best viewing experience</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Live Interaction</h3>
              <p className="text-gray-600">Participate in live pujas and send your prayers</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Access</h3>
              <p className="text-gray-600">Watch recorded pujas anytime, anywhere</p>
            </div>
          </div>
        </div>
      </section>


    </main>
  )
}
