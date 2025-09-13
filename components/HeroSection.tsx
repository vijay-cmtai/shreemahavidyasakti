"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { t } = useTranslation()

  const slides = [
    {
      image: "/images/hero.png",
      title: t("home.hero.slide1.title"),
      subtitle: t("home.hero.slide1.subtitle"),
      titleColor: "text-white",
      subtitleColor: "text-orange-500"
    },
    {
      image: "/images/mata.jpg",
      title: t("home.hero.slide2.title"),
      subtitle: t("home.hero.slide2.subtitle"),
      titleColor: "text-white",
      subtitleColor: "text-orange-500"
    },
    {
      image: "/images/kundli.png",
      title: t("home.hero.slide3.title"),
      subtitle: t("home.hero.slide3.subtitle"),
      titleColor: "text-white",
      subtitleColor: "text-orange-500"
    },
    {
      image: "/images/rashi.png",
      title: t("home.hero.slide4.title"),
      subtitle: t("home.hero.slide4.subtitle"),
      titleColor: "text-white",
      subtitleColor: "text-orange-500"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="min-h-[600px] sm:min-h-[700px] flex items-center justify-center relative overflow-hidden">
      {/* Static Background Image */}
      <div className="absolute inset-0 bg-[url('/images/hero1.jpg')] bg-cover bg-center"></div>
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Ganesha Image with fade effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={slides[currentSlide].image} 
              alt="Lord Ganesha" 
              className="w-60 h-40 sm:w-80 sm:h-52 lg:w-94 lg:h-64 mx-auto object-contain" 
            />
          </motion.div>
        </AnimatePresence>

        {/* Sanskrit Mantras with fade effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="space-y-3 sm:space-y-4 px-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className={`text-lg sm:text-2xl md:text-4xl font-bold devanagari leading-tight ${slides[currentSlide].titleColor}`}>
              {slides[currentSlide].title}
            </h1>
            <h2 className={`text-base sm:text-xl md:text-3xl font-bold devanagari leading-tight ${slides[currentSlide].subtitleColor}`}>
              {slides[currentSlide].subtitle}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scrolling Text */}
      <div className="absolute bottom-0 left-0 right-0 jyoti-orange-new-bg text-white py-2 sm:py-3 overflow-hidden z-10 shadow-[0_-4px_20px_rgba(243,125,0,0.3)]">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-xs sm:text-sm px-4 inline-block">
            {t("home.hero.scrollingText")}
          </span>
          <span className="text-xs sm:text-sm px-4 inline-block">
            {t("home.hero.scrollingText")}
          </span>
          <span className="text-xs sm:text-sm px-4 inline-block">
            {t("home.hero.scrollingText")}
          </span>
          <span className="text-xs sm:text-sm px-4 inline-block">
            {t("home.hero.scrollingText")}
          </span>
        </div>
      </div>
    </section>
  )
}
