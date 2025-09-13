"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, MessageCircle, Video, Calendar } from "lucide-react"
import { useTranslation } from "@/contexts/TranslationContext"

export default function Contact() {
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiryType: "",
    message: "",
    preferredContact: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })
  
  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: string;
  }>({})

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return t('contact.required')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return t('contact.validEmail')
    }
    return ""
  }

  const validatePhone = (phone: string): string => {
    if (!phone) return "" // Phone is optional
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return t('contact.validPhone')
    }
    return ""
  }

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {}
    
    // Email validation
    const emailError = validateEmail(formData.email)
    if (emailError) errors.email = emailError
    
    // Phone validation
    const phoneError = validatePhone(formData.phone)
    if (phoneError) errors.phone = phoneError
    
    // Message length validation
    if (formData.message.length < 10) {
      errors.message = t('contact.messageMinLength', 'Message must be at least 10 characters long')
    }
    
    // Required fields validation
    if (!formData.name.trim()) errors.name = t('contact.nameRequired', 'Name is required')
    if (!formData.subject.trim()) errors.subject = t('contact.subjectRequired', 'Subject is required')
    if (!formData.inquiryType) errors.inquiryType = t('contact.inquiryTypeRequired', 'Please select an inquiry type')
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Real-time validation for email and phone
    if (field === 'email') {
      const emailError = validateEmail(value)
      if (emailError) {
        setFieldErrors(prev => ({ ...prev, email: emailError }))
      } else if (fieldErrors.email) {
        setFieldErrors(prev => ({ ...prev, email: '' }))
      }
    }
    
    if (field === 'phone') {
      const phoneError = validatePhone(value)
      if (phoneError) {
        setFieldErrors(prev => ({ ...prev, phone: phoneError }))
      } else if (fieldErrors.phone) {
        setFieldErrors(prev => ({ ...prev, phone: '' }))
      }
    }
    
    // Clear other field errors when user starts typing
    if (fieldErrors[field] && field !== 'email' && field !== 'phone') {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: t('contact.errorMessage')
      })
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })
    setFieldErrors({})

    try {
      // Debug: Log what we're sending
      console.log('Sending form data:', formData)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: result.message || t('contact.successMessage')
        })
        
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          inquiryType: "",
          message: "",
          preferredContact: ""
        })
      } else {
        // Handle validation errors
        if (result.details && Array.isArray(result.details)) {
          const errors: { [key: string]: string } = {}
          result.details.forEach((detail: any) => {
            errors[detail.field] = detail.message
          })
          setFieldErrors(errors)
          setSubmitStatus({
            type: 'error',
            message: result.error || t('contact.errorMessage')
          })
        } else {
          setSubmitStatus({
            type: 'error',
            message: result.error || result.message || t('contact.errorMessage')
          })
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus({
        type: 'error',
        message: t('contact.errorMessage')
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: Phone,
      title: t('contact.phoneConsultation'),
      description: t('contact.phoneDescription'),
      value: t('contact.phoneValue'),
      action: t('contact.phoneAction'),
      available: t('contact.phoneAvailable')
    },
    {
      icon: MessageCircle,
      title: t('contact.whatsappSupport'),
      description: t('contact.whatsappDescription'),
      value: t('contact.whatsappValue'),
      action: t('contact.whatsappAction'),
      available: t('contact.whatsappAvailable')
    },
    {
      icon: Video,
      title: t('contact.videoConsultation'),
      description: t('contact.videoDescription'),
      value: t('contact.videoValue'),
      action: t('contact.videoAction'),
      available: t('contact.videoAvailable')
    },
    {
      icon: Mail,
      title: t('contact.emailSupport'),
      description: t('contact.emailDescription'),
      value: t('contact.emailValue'),
      action: t('contact.emailAction'),
      available: t('contact.emailAvailable')
    }
  ]

  const officeHours = [
    { day: t('contact.mondayFriday'), hours: t('contact.hours1') },
    { day: t('contact.saturday'), hours: t('contact.hours2') },
    { day: t('contact.sunday'), hours: t('contact.hours3') }
  ]

  const inquiryTypes = [
    "general",
    "service", 
    "product",
    "support",
    "feedback",
    "partnership",
    "media"
  ]

  const inquiryTypeLabels = {
    "general": t('contact.generalInquiry'),
    "service": t('contact.kundliConsultation'),
    "product": t('contact.gemstoneGuidance'), 
    "support": t('contact.pujaBooking'),
    "feedback": t('contact.vastuConsultation'),
    "partnership": t('contact.other'),
    "media": t('contact.other')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      
             {/* Hero Section */}
       <section className="relative py-20 text-white overflow-hidden">
         {/* Background Image */}
         <div 
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{
             backgroundImage: "url('/images/contact-hero.jpg')",
             opacity: 0.9
           }}
         ></div>
         
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-purple-900/80"></div>
         
         {/* Shadow Overlay */}
         <div className="absolute inset-0 bg-black/40"></div>
         
         {/* Decorative Elements */}
         <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute top-10 left-10 text-6xl opacity-20">📞</div>
           <div className="absolute top-20 right-20 text-4xl opacity-20">💬</div>
           <div className="absolute bottom-10 left-20 text-5xl opacity-20">✨</div>
           <div className="absolute bottom-20 right-10 text-3xl opacity-20">🌟</div>
         </div>

         <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
           <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('contact.title')}</h1>
           <p className="text-xl md:text-2xl opacity-90 mb-8">
             {t('contact.subtitle')}
           </p>
           <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
             <div className="flex items-center gap-2">
               <span className="text-2xl">📱</span>
               <span>{t('contact.phoneAvailable')}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="text-2xl">🔮</span>
               <span>{t('about.expertAstrologers')}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="text-2xl">💫</span>
               <span>{t('about.authenticGuidance')}</span>
             </div>
           </div>
         </div>
       </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('contact.howCanWeHelpYou')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('contact.choosePreferredWay')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  <p className="font-semibold text-gray-800 mb-2">{method.value}</p>
                  <p className="text-xs text-gray-500 mb-4">{method.available}</p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('contact.sendUsMessage')}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Status Messages */}
                {submitStatus.type === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">{submitStatus.message}</p>
                  </div>
                )}
                {submitStatus.type === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{submitStatus.message}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t('contact.name')} *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className={`mt-1 ${fieldErrors["name"] ? "border-red-500" : ""}`}
                      />
                      {fieldErrors["name"] && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors["name"]}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">{t('contact.email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className={`mt-1 ${fieldErrors["email"] ? "border-red-500" : ""}`}
                        placeholder="example@email.com"
                      />
                      {fieldErrors["email"] && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors["email"]}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{t('contact.emailHelp', 'Enter a valid email address')}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">{t('contact.phone')}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`mt-1 ${fieldErrors["phone"] ? "border-red-500" : ""}`}
                        placeholder="+91 98765 43210"
                      />
                      {fieldErrors["phone"] && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors["phone"]}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{t('contact.phoneHelp', 'Optional - Enter with or without country code')}</p>
                    </div>
                    <div>
                      <Label htmlFor="inquiryType">{t('contact.inquiryType')} *</Label>
                      <Select 
                        value={formData.inquiryType} 
                        onValueChange={(value) => handleInputChange("inquiryType", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder={t('contact.selectInquiryType', 'Select inquiry type')} />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {inquiryTypeLabels[type as keyof typeof inquiryTypeLabels]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldErrors["inquiryType"] && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors["inquiryType"]}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">{t('contact.subject')} *</Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                      className={`mt-1 ${fieldErrors["subject"] ? "border-red-500" : ""}`}
                      placeholder={t('contact.subjectPlaceholder', 'Brief description of your inquiry')}
                    />
                    {fieldErrors["subject"] && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors["subject"]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="preferredContact">{t('contact.preferredContact')}</Label>
                    <Select 
                      value={formData.preferredContact} 
                      onValueChange={(value) => handleInputChange("preferredContact", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={t('contact.preferredContactPlaceholder', 'How would you like us to respond?')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">{t('contact.emailContact')}</SelectItem>
                        <SelectItem value="phone">{t('contact.phoneCall')}</SelectItem>
                        <SelectItem value="whatsapp">{t('contact.whatsapp')}</SelectItem>
                        <SelectItem value="sms">{t('contact.sms', 'SMS')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">{t('contact.message')} *</Label>
                    <p className="text-xs text-gray-500 mb-1">{t('contact.messageLength', 'Message must be between 10 and 2000 characters')}</p>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                      className={`mt-1 ${fieldErrors["message"] ? "border-red-500" : ""}`}
                      rows={6}
                      placeholder={t('contact.messagePlaceholder', 'Please provide details about your inquiry...')}
                      maxLength={2000}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {fieldErrors["message"] && (
                        <p className="text-red-500 text-xs">{fieldErrors["message"]}</p>
                      )}
                      <p className={`text-xs ml-auto ${formData.message.length < 10 ? 'text-red-500' : formData.message.length > 1800 ? 'text-orange-500' : 'text-gray-500'}`}>
                        {formData.message.length}/2000 {t('contact.characters', 'characters')}
                      </p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg rounded-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('contact.submitting') : t('contact.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              
              {/* Office Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {t('contact.officeAddress')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">Jyotish Lok Astrology Center</h3>
                      <p className="text-gray-600 mt-1">
                        {t('contact.officeLocation')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>+91 9773380099</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>info@jyotidarshan.com</span>
                    </div>

                    <Button variant="outline" className="w-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      {t('contact.getDirections', 'Get Directions')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {t('contact.workingHours')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{schedule.day}</span>
                        <span className="font-semibold">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>{t('contact.emergencyConsultations', 'Emergency Consultations:')}</strong> {t('contact.emergencyConsultationsText', 'Available 24/7 for urgent matters. Additional charges may apply for after-hours consultations.')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('contact.quickContact')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('contact.scheduleConsultation', 'Schedule Consultation')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('contact.liveChatSupport', 'Live Chat Support')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    {t('contact.requestCallback', 'Request Callback')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('contact.contactInformation')}</h2>
            <p className="text-gray-600">{t('contact.officeAddress')}</p>
          </div>
          
          <Card className="overflow-hidden">
            <div className="w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d224169.44784355108!2d77.08719532763139!3d28.610346233965313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sJyotish%20Darshan%20Astrology%20Center%20New%20Delhi%2C%20India!5e0!3m2!1sen!2sin!4v1756101369669!5m2!1sen!2sin" 
                width="100%" 
                height="450" 
                style={{border:0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Jyotish Lok Astrology Center Location"
                className="w-full"
              ></iframe>
            </div>
          </Card>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <strong>Jyotish Lok Astrology Center</strong><br />
              New Delhi, India
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('contact.frequentlyAskedQuestions')}</h2>
            <p className="text-gray-600">{t('contact.quickAnswers')}</p>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{t('contact.responseTime')}</h3>
                <p className="text-gray-600">
                  {t('contact.responseTimeAnswer')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{t('contact.urgentConsultations')}</h3>
                <p className="text-gray-600">
                  {t('contact.urgentConsultationsAnswer')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{t('contact.multipleLanguages')}</h3>
                <p className="text-gray-600">
                  {t('contact.multipleLanguagesAnswer')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
