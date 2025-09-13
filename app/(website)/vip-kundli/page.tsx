"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useTranslation } from "@/contexts/TranslationContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Star, 
  Sparkles, 
  Crown,
  Zap,
  Heart,
  Shield,
  Clock,
  MapPin,
  Calendar,
  User,
  Moon,
  Sun,
  ArrowRight,
  CheckCircle,
  Award,
  Gem,
  Eye,
  Brain,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react"

export default function VIPKundliPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    place: "",
    gender: "",
    mobile: "",
    vipKundli: ""
  })
  const [showThankYou, setShowThankYou] = useState(false)

  const planets = [
    { name: "Sun", symbol: "☉", color: "#F37D00", house: "1st House", influence: "Core Personality" },
    { name: "Moon", symbol: "☽", color: "#0EB5A2", house: "4th House", influence: "Emotions & Mind" },
    { name: "Mercury", symbol: "☿", color: "#EA3F37", house: "3rd House", influence: "Communication" },
    { name: "Venus", symbol: "♀", color: "#EFFD07", house: "7th House", influence: "Love & Beauty" },
    { name: "Mars", symbol: "♂", color: "#F37D00", house: "1st House", influence: "Energy & Action" },
    { name: "Jupiter", symbol: "♃", color: "#0EB5A2", house: "9th House", influence: "Wisdom & Growth" },
    { name: "Saturn", symbol: "♄", color: "#EA3F37", house: "10th House", influence: "Career & Discipline" },
    { name: "Uranus", symbol: "♅", color: "#EFFD07", house: "11th House", influence: "Innovation" },
    { name: "Neptune", symbol: "♆", color: "#0EB5A2", house: "12th House", influence: "Spirituality" },
    { name: "Pluto", symbol: "♇", color: "#F37D00", house: "8th House", influence: "Transformation" }
  ]

  const houses = [
    { number: 1, name: "Ascendant", element: "Fire", ruler: "Mars", significance: "Personality & Appearance" },
    { number: 2, name: "Wealth", element: "Earth", ruler: "Venus", significance: "Finances & Values" },
    { number: 3, name: "Communication", element: "Air", ruler: "Mercury", significance: "Siblings & Communication" },
    { number: 4, name: "Home", element: "Water", ruler: "Moon", significance: "Mother & Property" },
    { number: 5, name: "Creativity", element: "Fire", ruler: "Sun", significance: "Children & Intelligence" },
    { number: 6, name: "Health", element: "Earth", ruler: "Mercury", significance: "Work & Health" },
    { number: 7, name: "Partnership", element: "Air", ruler: "Venus", significance: "Marriage & Business" },
    { number: 8, name: "Transformation", element: "Water", ruler: "Mars", significance: "Longevity & Mysteries" },
    { number: 9, name: "Dharma", element: "Fire", ruler: "Jupiter", significance: "Religion & Higher Learning" },
    { number: 10, name: "Career", element: "Earth", ruler: "Saturn", significance: "Profession & Status" },
    { number: 11, name: "Gains", element: "Air", ruler: "Jupiter", significance: "Income & Friends" },
    { number: 12, name: "Moksha", element: "Water", ruler: "Saturn", significance: "Spirituality & Losses" }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/kundli-lead/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          vipKundli: 'VIP Kundli',
          status: 'pending',
          priority: 'medium',
          isProcessed: false,
          notes: []
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      const result = await response.json()
      console.log("Form submitted successfully:", result)
      
             // Reset form after successful submission
       setFormData({
         name: "",
         date: "",
         time: "",
         place: "",
         gender: "",
         mobile: "",
         vipKundli: ""
       })
      
             // Show thank you message for 3 seconds
       setShowThankYou(true)
       setTimeout(() => {
         setShowThankYou(false)
       }, 3000)
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit form. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero.jpg')",
            opacity: 0.8
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/85 via-red-900/80 to-purple-900/85"></div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">👑</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">⭐</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">✨</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">🌟</div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('vipKundli.hero.title', 'VIP Kundli Analysis')}
              </h1>
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-orange-100">
              {t('vipKundli.hero.subtitle', 'प्रीमियम कुंडली विश्लेषण')}
            </h2>
            
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              {t('vipKundli.hero.description', 'Experience the most comprehensive and accurate astrological analysis with our premium VIP Kundli service.')}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>{t('vipKundli.hero.features.premiumAnalysis', 'Premium Analysis')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>{t('vipKundli.hero.features.aiPoweredInsights', 'AI-Powered Insights')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>{t('vipKundli.hero.features.expertConsultation', 'Expert Consultation')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12"
        >
          {/* Form Section */}
          <motion.div variants={itemVariants}>
            {showThankYou && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg text-center"
              >
                <div className="text-6xl mb-4">🙏</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">{t('vipKundli.thankYou.title', 'Thank You!')}</h3>
                <p className="text-green-700">{t('vipKundli.thankYou.message', 'Your VIP Kundli request has been submitted successfully. We\'ll get back to you soon!')}</p>
              </motion.div>
            )}
            <Card className="p-8 bg-white shadow-xl border-0">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('vipKundli.form.title', 'Generate Your VIP Kundli')}</h3>
                <p className="text-gray-600">{t('vipKundli.form.subtitle', 'Enter your birth details for premium analysis')}</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vipKundli.form.fields.fullName', 'Full Name')}
                  </label>
                  <Input
                    type="text"
                    placeholder={t('vipKundli.form.placeholders.fullName', 'Enter your full name')}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vipKundli.form.fields.dateOfBirth', 'Date of Birth')}
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vipKundli.form.fields.timeOfBirth', 'Time of Birth')}
                  </label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vipKundli.form.fields.placeOfBirth', 'Place of Birth')}
                  </label>
                  <Input
                    type="text"
                    placeholder={t('vipKundli.form.placeholders.placeOfBirth', 'City, State, Country')}
                    value={formData.place}
                    onChange={(e) => handleInputChange("place", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vipKundli.form.fields.gender', 'Gender')}
                  </label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('vipKundli.form.placeholders.gender', 'Select gender')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('vipKundli.form.options.male', 'Male')}</SelectItem>
                      <SelectItem value="female">{t('vipKundli.form.options.female', 'Female')}</SelectItem>
                      <SelectItem value="other">{t('vipKundli.form.options.other', 'Other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vipKundli.form.fields.mobileNumber', 'Mobile Number')}
                  </label>
                  <Input
                    type="tel"
                    placeholder={t('vipKundli.form.placeholders.mobileNumber', 'Enter your mobile number')}
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vipKundli.form.fields.kundli', 'Kundli')}
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-medium">
                    {t('vipKundli.form.fields.kundli', 'VIP Kundli')}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 text-lg font-semibold"
                >
                 {t('vipKundli.form.submit', 'Submit')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* VIP Features Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">{t('vipKundli.features.title', 'VIP Exclusive Features')}</h3>
              <p className="text-lg text-gray-600 mb-8">
                {t('vipKundli.features.description', 'Get access to the most advanced astrological insights and personalized guidance with our premium service.')}
              </p>
            </div>
            
            <div className="grid gap-6">
              <Card className="p-6 bg-white shadow-lg border-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('vipKundli.features.items.deepAnalysis.title', 'Deep Analysis')}</h4>
                    <p className="text-gray-600">{t('vipKundli.features.items.deepAnalysis.description', 'Comprehensive study of all planetary positions and their influences on your life.')}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-white shadow-lg border-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('vipKundli.features.items.aiPoweredInsights.title', 'AI-Powered Insights')}</h4>
                    <p className="text-gray-600">{t('vipKundli.features.items.aiPoweredInsights.description', 'Advanced algorithms provide accurate predictions and personalized recommendations.')}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-white shadow-lg border-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('vipKundli.features.items.lifePathGuidance.title', 'Life Path Guidance')}</h4>
                    <p className="text-gray-600">{t('vipKundli.features.items.lifePathGuidance.description', 'Clear direction for career, relationships, health, and spiritual growth.')}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-white shadow-lg border-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('vipKundli.features.items.expertConsultation.title', 'Expert Consultation')}</h4>
                    <p className="text-gray-600">{t('vipKundli.features.items.expertConsultation.description', 'One-on-one sessions with certified astrologers for personalized guidance.')}</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Planetary Information */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('vipKundli.planetaryInfluences.title', 'Planetary Influences')}</h2>
            <p className="text-lg text-gray-600">{t('vipKundli.planetaryInfluences.description', 'Understanding the key planets and their significance in your kundli')}</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planets.map((planet, index) => (
              <motion.div
                key={planet.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
                      style={{ backgroundColor: planet.color + '20' }}
                    >
                      {planet.symbol}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{planet.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{planet.house}</p>
                    <p className="text-gray-700">{planet.influence}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* House Information */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('vipKundli.houses.title', 'The 12 Houses')}</h2>
            <p className="text-lg text-gray-600">{t('vipKundli.houses.description', 'Each house represents different aspects of your life journey')}</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses.map((house, index) => (
              <motion.div
                key={house.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-orange-600">{house.number}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{house.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{house.element} • {house.ruler}</p>
                    <p className="text-gray-700 text-sm">{house.significance}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 via-red-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">{t('vipKundli.cta.title', 'Ready for VIP Analysis?')}</h2>
            <p className="text-lg opacity-90 mb-8">
              {t('vipKundli.cta.description', 'Get your premium kundli analysis and unlock the deepest secrets of your birth chart')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                {t('vipKundli.cta.generateNow', 'Generate VIP Kundli Now')}
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg font-semibold">
                {t('vipKundli.cta.bookConsultation', 'Book Expert Consultation')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('vipKundli.contact.title', 'Need Expert Guidance?')}</h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('vipKundli.contact.description', 'Our experienced astrologers are here to help you understand your kundli better')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t('vipKundli.contact.callUs', 'Call Us')}</h3>
                <p className="text-gray-600">+91 9773380000</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t('vipKundli.contact.emailUs', 'Email Us')}</h3>
                <p className="text-gray-600">info@xyz.com</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t('vipKundli.contact.chatNow', 'Chat Now')}</h3>
                <p className="text-gray-600">{t('vipKundli.contact.liveConsultation', 'Live consultation')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
