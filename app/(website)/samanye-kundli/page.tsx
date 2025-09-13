"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Star, 
  User,
  ArrowRight,
  CheckCircle,
  Heart,
  Brain,
  Target,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react"
import { useTranslation } from "@/contexts/TranslationContext"

export default function SamanyeKundliPage() {
  const { t, isLoading, locale } = useTranslation()
  
  // Debug: Log translation status
  console.log('Current locale:', locale)
  console.log('Is loading:', isLoading)
  
  // Test translation
  console.log('Test translation:', t('kundli.houses.house1.name', 'Fallback'))
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
    { name: "Saturn", symbol: "♄", color: "#EA3F37", house: "10th House", influence: "Career & Discipline" }
  ]

  const houses = [
    { number: 1, nameKey: "houses.house1.name", elementKey: "houses.house1.element", rulerKey: "houses.house1.ruler", significanceKey: "houses.house1.significance" },
    { number: 2, nameKey: "houses.house2.name", elementKey: "houses.house2.element", rulerKey: "houses.house2.ruler", significanceKey: "houses.house2.significance" },
    { number: 3, nameKey: "houses.house3.name", elementKey: "houses.house3.element", rulerKey: "houses.house3.ruler", significanceKey: "houses.house3.significance" },
    { number: 4, nameKey: "houses.house4.name", elementKey: "houses.house4.element", rulerKey: "houses.house4.ruler", significanceKey: "houses.house4.significance" },
    { number: 5, nameKey: "houses.house5.name", elementKey: "houses.house5.element", rulerKey: "houses.house5.ruler", significanceKey: "houses.house5.significance" },
    { number: 6, nameKey: "houses.house6.name", elementKey: "houses.house6.element", rulerKey: "houses.house6.ruler", significanceKey: "houses.house6.significance" },
    { number: 7, nameKey: "houses.house7.name", elementKey: "houses.house7.element", rulerKey: "houses.house7.ruler", significanceKey: "houses.house7.significance" },
    { number: 8, nameKey: "houses.house8.name", elementKey: "houses.house8.element", rulerKey: "houses.house8.ruler", significanceKey: "houses.house8.significance" },
    { number: 9, nameKey: "houses.house9.name", elementKey: "houses.house9.element", rulerKey: "houses.house9.ruler", significanceKey: "houses.house9.significance" },
    { number: 10, nameKey: "houses.house10.name", elementKey: "houses.house10.element", rulerKey: "houses.house10.ruler", significanceKey: "houses.house10.significance" },
    { number: 11, nameKey: "houses.house11.name", elementKey: "houses.house11.element", rulerKey: "houses.house11.ruler", significanceKey: "houses.house11.significance" },
    { number: 12, nameKey: "houses.house12.name", elementKey: "houses.house12.element", rulerKey: "houses.house12.ruler", significanceKey: "houses.house12.significance" }
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
          vipKundli: 'Samanye Kundli',
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

  // Show loading state while translations are loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
          <div className="absolute top-10 left-10 text-6xl opacity-20">🔮</div>
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
              <Star className="w-8 h-8 text-yellow-400" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('samanyeKundli.hero.title', 'Samanye Kundli')}
              </h1>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-orange-100">
              {t('samanyeKundli.hero.subtitle', 'सामान्य कुंडली विश्लेषण')}
            </h2>
            
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              {t('samanyeKundli.hero.description', 'Discover your life\'s blueprint with our comprehensive general kundli analysis service.')}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>{t('samanyeKundli.hero.features.planetaryPositions', 'Basic Planetary Positions')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>{t('samanyeKundli.hero.features.houseAnalysis', 'House Analysis')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>{t('samanyeKundli.hero.features.lifePathGuidance', 'Life Path Guidance')}</span>
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
                <h3 className="text-2xl font-bold text-green-800 mb-2">{t('samanyeKundli.thankYou.title', 'Thank You!')}</h3>
                <p className="text-green-700">{t('samanyeKundli.thankYou.message', 'Your Samanye Kundli request has been submitted successfully. We\'ll get back to you soon!')}</p>
              </motion.div>
            )}
            <Card className="p-8 bg-white shadow-xl border-0">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('samanyeKundli.form.title', 'Generate Your Kundli')}</h3>
                <p className="text-gray-600">{t('samanyeKundli.form.subtitle', 'Enter your birth details to get started')}</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('samanyeKundli.form.fields.fullName', 'Full Name')}
                  </label>
                  <Input
                    type="text"
                    placeholder={t('samanyeKundli.form.placeholders.fullName', 'Enter your full name')}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('samanyeKundli.form.fields.dateOfBirth', 'Date of Birth')}
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
                    {t('samanyeKundli.form.fields.timeOfBirth', 'Time of Birth')}
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
                    {t('samanyeKundli.form.fields.placeOfBirth', 'Place of Birth')}
                  </label>
                  <Input
                    type="text"
                    placeholder={t('samanyeKundli.form.placeholders.placeOfBirth', 'City, State, Country')}
                    value={formData.place}
                    onChange={(e) => handleInputChange("place", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('samanyeKundli.form.fields.gender', 'Gender')}
                  </label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('samanyeKundli.form.placeholders.gender', 'Select gender')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('samanyeKundli.form.options.male', 'Male')}</SelectItem>
                      <SelectItem value="female">{t('samanyeKundli.form.options.female', 'Female')}</SelectItem>
                      <SelectItem value="other">{t('samanyeKundli.form.options.other', 'Other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('samanyeKundli.form.fields.mobileNumber', 'Mobile Number')}
                  </label>
                  <Input
                    type="tel"
                    placeholder={t('samanyeKundli.form.placeholders.mobileNumber', 'Enter your mobile number')}
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('samanyeKundli.form.fields.kundli', 'Kundli')}
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-medium">
                    {t('samanyeKundli.hero.title', 'Samanye Kundli')}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 text-lg font-semibold"
                >
                  {t('samanyeKundli.form.submit', 'Submit')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Features Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">{t('samanyeKundli.whatYouGet.title', 'What You\'ll Get')}</h3>
              <p className="text-lg text-gray-600 mb-8">
                {t('samanyeKundli.whatYouGet.description', 'Our comprehensive kundli analysis provides insights into your personality, relationships, career, and life path based on Vedic astrology principles.')}
              </p>
            </div>
            
            <div className="grid gap-6">
              <Card className="p-6 bg-white shadow-lg border-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('samanyeKundli.features.planetaryPositions.title', 'Basic Planetary Positions')}</h4>
                    <p className="text-gray-600">{t('samanyeKundli.features.planetaryPositions.description', 'Understand the positions of planets in your birth chart and their influence on your life.')}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-white shadow-lg border-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('samanyeKundli.features.houseAnalysis.title', 'House Analysis')}</h4>
                    <p className="text-gray-600">{t('samanyeKundli.features.houseAnalysis.description', 'Detailed analysis of all 12 houses and their impact on different aspects of your life.')}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-white shadow-lg border-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('samanyeKundli.features.lifePathGuidance.title', 'Life Path Guidance')}</h4>
                    <p className="text-gray-600">{t('samanyeKundli.features.lifePathGuidance.description', 'Personalized guidance for your career, relationships, and life decisions based on your kundli.')}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-white shadow-lg border-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('samanyeKundli.features.relationshipInsights.title', 'Relationship Insights')}</h4>
                    <p className="text-gray-600">{t('samanyeKundli.features.relationshipInsights.description', 'Discover compatibility insights and relationship guidance based on astrological analysis.')}</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('samanyeKundli.planetaryInfluences.title', 'Planetary Influences')}</h2>
            <p className="text-lg text-gray-600">{t('samanyeKundli.planetaryInfluences.description', 'Understanding how different planets influence various aspects of your life.')}</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('samanyeKundli.houses.title', 'The 12 Houses')}</h2>
            <p className="text-lg text-gray-600">{t('samanyeKundli.houses.description', 'Each house represents different aspects of life and their significance in your kundli.')}</p>
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
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{t(house.nameKey, `भाव ${house.number}`)}</h3>
                    <p className="text-sm text-gray-600 mb-2">{t(house.elementKey, 'तत्व')} • {t(house.rulerKey, 'स्वामी')}</p>
                    <p className="text-gray-700 text-sm">{t(house.significanceKey, 'महत्व')}</p>
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
            <h2 className="text-3xl font-bold mb-4">{t('samanyeKundli.cta.title', 'Ready to Discover Your Destiny?')}</h2>
            <p className="text-lg opacity-90 mb-8">
              {t('samanyeKundli.cta.description', 'Get your personalized kundli analysis and unlock the secrets of your birth chart.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                {t('samanyeKundli.cta.generateNow', 'Generate Now')}
              </Button>
              <Button variant="outline" className="border-white text-orange-700 hover:bg-white hover:text-orange-600 px-8 py-3 text-lg font-semibold">
                {t('samanyeKundli.cta.learnMore', 'Learn More')}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('samanyeKundli.contact.title', 'Get in Touch')}</h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('samanyeKundli.contact.description', 'Have questions about your kundli? Our expert astrologers are here to help.')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t('samanyeKundli.contact.callUs', 'Call Us')}</h3>
                <p className="text-gray-600">+91 9773380099</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t('samanyeKundli.contact.emailUs', 'Email Us')}</h3>
                <p className="text-gray-600">info@jyotidarshan.com</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t('samanyeKundli.contact.chatNow', 'Chat Now')}</h3>
                <p className="text-gray-600">{t('samanyeKundli.contact.liveConsultation', 'Live Consultation')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
