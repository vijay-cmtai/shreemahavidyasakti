"use client"

// Header and Footer are included in the layout
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Award, Users, Clock } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/contexts/TranslationContext"

export default function About() {
  const { t } = useTranslation()
  
  const achievements = [
    { icon: Users, number: "50,000+", text: t('about.happyClients') },
    { icon: Clock, number: "25+", text: t('about.yearsExperience') },
    { icon: Award, number: "500+", text: t('about.awardsWon') },
    { icon: Star, number: "4.9/5", text: t('about.clientRating') },
  ]

  const specializations = [
    t('about.specializations.vedicAstrology'),
    t('about.specializations.kundliAnalysis'), 
    t('about.specializations.matchMaking'),
    t('about.specializations.vastuShastra'),
    t('about.specializations.numerology'),
    t('about.specializations.palmistry'),
    t('about.specializations.faceReading'),
    t('about.specializations.careerGuidance')
  ]

  const testimonials = [
    {
      id: 1,
      name: "Saara",
      role: "Manager",
      zodiac: "Leo",
      rating: 3,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      text: "Jyotish Lok helped me make crucial career decisions.",
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Software Engineer",
      zodiac: "Aries",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      text: "Completely transformed my life! Accurate predictions and exceptional service.",
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      role: "Business Owner",
      zodiac: "Taurus",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: "Detailed kundli analysis revealed spot-on insights.",
    },
    {
      id: 4,
      name: "Anjali Patel",
      role: "Teacher",
      zodiac: "Cancer",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      text: "Found my perfect life partner through match-making service.",
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Doctor",
      zodiac: "Virgo",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      text: "Invaluable career guidance. Perfect understanding.",
    },
    {
      id: 6,
      name: "Meera Reddy",
      role: "Artist",
      zodiac: "Libra",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      text: "Name correction brought positive changes.",
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/about-hero.jpg')",
            opacity: 0.9
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-purple-900/80"></div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">🌟</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">🔮</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">✨</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">💫</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('about.heroTitle')}</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            {t('about.heroSubtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔮</span>
              <span>{t('about.experience')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <span>{t('about.expertAstrologers')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span>{t('about.authenticGuidance')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main About Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
              {t('about.welcomeTitle')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🌟</span>
                  {t('about.ourBelief')}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {t('about.ourBeliefText')}
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">👥</span>
                  {t('about.ourExpertTeam')}
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  {t('about.ourExpertTeamText')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    t('about.expertTypes.vedicAstrologySpecialists'),
                    t('about.expertTypes.palmistrySpecialists'), 
                    t('about.expertTypes.numerologyExperts'),
                    t('about.expertTypes.lalKitabSpecialists'),
                    t('about.expertTypes.prashnaKundliAcharyas'),
                    t('about.expertTypes.vastuShastraConsultants')
                  ].map((expert, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">{expert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl transform rotate-3"></div> */}
              {/* <div className="absolute inset-0 bg-gradient-to-r  to-red-800 rounded-3xl transform rotate-3"></div> */}

              <img 
                src="/images/logo1.png" 
                alt="Jyotish Lok Team" 
                className="relative rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">10+</div>
                    <div className="text-sm text-gray-600">{t('about.expertAcharyas')}</div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Analysis */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('about.deepAnalysisTitle')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">✨</span>
                  {t('about.weTellYou')}:
                </h3>
                <div className="space-y-4">
                  {[
                    t('about.weTellYouItems.mahadashaAntardasha'),
                    t('about.weTellYouItems.rajyogaActive'), 
                    t('about.weTellYouItems.troublesomeYogas'),
                    t('about.weTellYouItems.rightDirectionGuidance')
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-orange-500 text-lg mt-1">✨</span>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🔮</span>
                  {t('about.remediesAndGuidance')}:
                </h3>
                <div className="space-y-4">
                  {[
                    t('about.remediesAndGuidanceItems.gemstoneRecommendation'),
                    t('about.remediesAndGuidanceItems.rudrakshaSelection'),
                    t('about.remediesAndGuidanceItems.pujaRitual')
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-purple-500 text-lg mt-1">🔮</span>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Services */}
      <section className="py-16 bg-gradient-to-r from-orange-100 to-red-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('about.specialServices')}
            </h2>
            <p className="text-lg text-gray-600">{t('about.specialServicesSubtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('about.samanyaKundliTitle')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('about.samanyaKundliText')}
                </p>
                <div className="space-y-3 mb-6 text-sm text-gray-700">
                  <div className="flex items-center justify-center">
                    <span className="text-orange-500 mr-2">✓</span>
                    {t('about.samanyaKundliFeatures.basicPlanetaryAnalysis')}
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-orange-500 mr-2">✓</span>
                    {t('about.samanyaKundliFeatures.dashaAntardashaPeriods')}
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-orange-500 mr-2">✓</span>
                    {t('about.samanyaKundliFeatures.generalLifePredictions')}
                  </div>
                </div>
                <Link href="/samanye-kundli">
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full"
                  >
                    {t('about.bookSamanyaKundli')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl">👑</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('about.vipKundliTitle')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('about.vipKundliText')}
                </p>
                <div className="space-y-3 mb-6 text-sm text-gray-700">
                  <div className="flex items-center justify-center">
                    <span className="text-purple-500 mr-2">✓</span>
                    {t('about.vipKundliFeatures.deepPlanetaryAnalysis')}
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-purple-500 mr-2">✓</span>
                    {t('about.vipKundliFeatures.personalizedRemedies')}
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-purple-500 mr-2">✓</span>
                    {t('about.vipKundliFeatures.priorityConsultation')}
                  </div>
                </div>
                <Link href="/vip-kundli">
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full"
                  >
                    {t('about.bookVipService')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Service Info */}
          <div className="mt-12 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t('about.whyChooseOurKundliServices')}</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">🔮</span>
                  <span>{t('about.whyChooseOurKundliServicesItems.yearsExperience')}</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">📱</span>
                  <span>{t('about.supportAvailable')}</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">💎</span>
                  <span>{t('about.authenticAnalysis')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Panel Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              {t('about.ourExpertPanel')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {t('about.ourExpertPanelText')}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="bg-white hover:shadow-lg transition-shadow border-t-4 border-blue-500">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('about.expertPanel')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('about.expertPanelText')}
                </p>
                <div className="space-y-2 text-sm">
                  {[
                    t('about.expertTypes.vedicAstrologySpecialists'),
                    t('about.expertTypes.palmistrySpecialists'), 
                    t('about.expertTypes.numerologyExperts'),
                    t('about.expertTypes.lalKitabSpecialists'),
                    t('about.expertTypes.prashnaKundliAcharyas'),
                    t('about.expertTypes.vastuShastraConsultants')
                  ].map((expert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{expert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-lg transition-shadow border-t-4 border-green-500">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-green-600 text-xl">✨</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('about.kundliAnalysis')}</h3>
                <p className="text-gray-600 mb-4">{t('about.kundliAnalysisText')}</p>
                <div className="space-y-2 text-sm">
                  {[
                    t('about.kundliAnalysisItems.mahaDashaAntarDasha'),
                    t('about.kundliAnalysisItems.rajyogaManifest'),
                    t('about.kundliAnalysisItems.maleficYogas'), 
                    t('about.kundliAnalysisItems.yearRoundGuidance')
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 text-sm mt-0.5">✨</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-lg transition-shadow border-t-4 border-purple-500">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-purple-600 text-xl">🔮</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('about.guidanceAndRemedies')}</h3>
                <p className="text-gray-600 mb-4">{t('about.guidanceAndRemediesText')}</p>
                <div className="space-y-2 text-sm">
                  {[
                    t('about.guidanceAndRemediesItems.perfectGemstoneRecommendations'),
                    t('about.guidanceAndRemediesItems.beneficialRudrakshaSelection'),
                    t('about.guidanceAndRemediesItems.effectivePujasRituals')
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-purple-500 text-sm mt-0.5">🔮</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardContent className="p-6">
                  <achievement.icon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-800 mb-2">{achievement.number}</div>
                  <div className="text-sm text-gray-600">{achievement.text}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Specializations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('about.areasOfExpertise')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('about.areasOfExpertiseText')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {specializations.map((specialization, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="p-3 text-center justify-center border-orange-200 text-orange-700 hover:bg-orange-50 text-base"
              >
                {specialization}
              </Badge>
            ))}
          </div>

          <div className="mt-16">
            <Card className="p-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('about.educationAndCredentials')}</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  {t('about.educationCredentials.mastersAstrology')}
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  {t('about.educationCredentials.certifiedVastuConsultant')}
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  {t('about.educationCredentials.authorBooks')}
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  {t('about.educationCredentials.memberFederation')}
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  {t('about.educationCredentials.magazineContributor')}
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('about.whatOurClientsSay')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('about.whatOurClientsSaySubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-400 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('about.readyToTransformYourLife')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('about.readyToTransformSubtitle')}
          </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/contact">
               <button className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                 {t('about.bookConsultation')}
               </button>
             </Link>
             <a href="tel:+919773380099">
               <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-500 transition-colors">
                 {t('about.callNow')}
               </button>
             </a>
           </div>
        </div>
      </section>
    </main>
  )
}
