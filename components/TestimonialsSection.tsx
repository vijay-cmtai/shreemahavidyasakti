"use client"

import { Star, Quote } from "lucide-react"
import { useTranslation } from '@/contexts/TranslationContext'

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Saara",
    role: "Manager",
    zodiac: "Leo",
    rating: 3,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    text: "Helped me make crucial career decisions.",
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

export default function TestimonialsSection() {
  const { t } = useTranslation()

  return (
    <section className="jyoti-cream-bg py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            {t('home.testimonials.title', 'What Our Clients Say')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.testimonials.subtitle', 'Discover how  has helped thousands of people find clarity and transform their lives')}
          </p>
        </div>

        {/* First Marquee - Left to Right */}
        <div className="mb-4">
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-shrink-0 mx-4 my-4 w-96">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 h-48 flex flex-col">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-2 h-8">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <Quote className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center mb-2 h-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <div className="flex-1 flex items-center justify-center mb-3 min-h-0">
                      <p className="text-gray-700 text-center leading-relaxed text-xs line-clamp-2">
                        "{testimonial.text}"
                      </p>
                    </div>

                    {/* Customer Info */}
                    <div className="flex items-center justify-center space-x-2 h-12">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-orange-200"
                      />
                      <div className="text-center">
                        <p className="font-semibold text-gray-800 text-xs">{testimonial.name}</p>
                        <p className="text-xs text-orange-500">{testimonial.role}</p>
                        <p className="text-xs text-gray-500">{testimonial.zodiac}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {testimonials.map((testimonial) => (
                <div key={`duplicate-${testimonial.id}`} className="flex-shrink-0 mx-4 my-4 w-96">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 h-48 flex flex-col">
                    <div className="flex justify-center mb-2 h-8">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <Quote className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex justify-center mb-2 h-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="flex-1 flex items-center justify-center mb-3 min-h-0">
                      <p className="text-gray-700 text-center leading-relaxed text-xs line-clamp-2">
                        "{testimonial.text}"
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-2 h-12">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-orange-200"
                      />
                      <div className="text-center">
                        <p className="font-semibold text-gray-800 text-xs">{testimonial.name}</p>
                        <p className="text-xs text-orange-500">{testimonial.role}</p>
                        <p className="text-xs text-gray-500">{testimonial.zodiac}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Marquee - Right to Left */}
        <div className="mb-4">
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee-reverse">
              {testimonials.slice().reverse().map((testimonial) => (
                <div key={`reverse-${testimonial.id}`} className="flex-shrink-0 mx-4 my-4 w-96">
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-3 shadow-xl border border-orange-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 h-48 flex flex-col">
                    <div className="flex justify-center mb-2 h-8">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Quote className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex justify-center mb-2 h-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="flex-1 flex items-center justify-center mb-3 min-h-0">
                      <p className="text-gray-700 text-center leading-relaxed text-xs line-clamp-2">
                        "{testimonial.text}"
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-2 h-12">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-orange-300"
                      />
                      <div className="text-center">
                        <p className="font-semibold text-gray-800 text-xs">{testimonial.name}</p>
                        <p className="text-xs text-orange-600">{testimonial.role}</p>
                        <p className="text-xs text-gray-500">{testimonial.zodiac}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {testimonials.slice().reverse().map((testimonial) => (
                <div key={`reverse-duplicate-${testimonial.id}`} className="flex-shrink-0 mx-4 my-4 w-96">
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-3 shadow-xl border border-orange-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 h-48 flex flex-col">
                    <div className="flex justify-center mb-2 h-8">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Quote className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex justify-center mb-2 h-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="flex-1 flex items-center justify-center mb-3 min-h-0">
                      <p className="text-gray-700 text-center leading-relaxed text-xs line-clamp-2">
                        "{testimonial.text}"
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-2 h-12">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-orange-300"
                      />
                      <div className="text-center">
                        <p className="font-semibold text-gray-800 text-xs">{testimonial.name}</p>
                        <p className="text-xs text-orange-600">{testimonial.role}</p>
                        <p className="text-xs text-gray-500">{testimonial.zodiac}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 px-4">
          <p className="text-gray-600 mb-6">
            {t('home.testimonials.cta.question', 'Ready to discover what the stars have in store for you?')}
          </p>
          <button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            {t('home.testimonials.cta.button', 'Get Your Free Consultation')}
          </button>
        </div>
      </div>
    </section>
  )
}
