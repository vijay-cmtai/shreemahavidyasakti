"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/TranslationContext";
import Image from "next/image";
import { Lock, CheckCircle, Zap } from "lucide-react";

export default function SadhanaOffersSection() {
  const { t } = useTranslation();

  return (
    <section className="jyoti-cream-bg py-8 sm:py-12 lg:py-16 px-4">
      {/* ✅ FIX: Changed max-w-4xl to max-w-6xl to make the cards wider */}
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Card 1: Free Sacred Ebook */}
        <div className="bg-white rounded-2xl shadow-2xl border border-orange-100 p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side: Content */}
            <div className="flex flex-col space-y-6">
              <div>
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {t("sadhana.ebook.offerTag", "Exclusive Offer")}
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#252847]">
                  {t("sadhana.ebook.title1", "Get Your")}{" "}
                  <span className="bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text">
                    {t("sadhana.ebook.title2", "Free Sacred Ebook")}
                  </span>
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {t(
                  "sadhana.ebook.description",
                  'Discover the profound wisdom and transformative power of Shree Suktam Sadhana. Download your free copy of "श्री सूक्तम साधना की महिमा" today!'
                )}
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>
                    {t("sadhana.ebook.feature1", "Detailed Sadhana guidelines")}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>
                    {t(
                      "sadhana.ebook.feature2",
                      "Sacred mantras with meanings"
                    )}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>
                    {t(
                      "sadhana.ebook.feature3",
                      "Step-by-step practice instructions"
                    )}
                  </span>
                </li>
              </ul>
              <div className="pt-2">
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                  <Lock className="w-4 h-4 mr-2" />
                  {t("sadhana.ebook.button", "Login to Access")}
                </Button>
              </div>
            </div>
            {/* Right Side: Image */}
            <div className="flex items-center justify-center">
              <Image
                src="https://www.shreemahavidyashaktipeethwebinar.com/_next/image?url=%2Fassets%2F%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80%20%E0%A4%B8%E0%A5%82%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%AE%E0%A5%8D%20%E0%A4%B8%E0%A4%BE%E0%A4%A7%E0%A4%A8%E0%A4%BE%20%E0%A4%95%E0%A5%80%20%E0%A4%AE%E0%A4%B9%E0%A4%BF%E0%A4%AE%E0%A4%BE.png&w=1920&q=75" // Replace with your image path
                alt="The Power of Shree Suktam Sadhana Ebook Cover"
                width={400}
                height={250}
                className="rounded-lg shadow-xl w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Card 2: 6-Month Sadhana Journey */}
        <div className="bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-gray-800 via-purple-900 to-gray-800 p-3 md:p-4 flex flex-col sm:flex-row justify-between items-center text-white text-center sm:text-left">
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <Image
                src="https://www.shreemahavidyashaktipeethwebinar.com/_next/image?url=%2Fassets%2F599.jpg&w=1920&q=75"
                alt="Shree Mahavidya"
                width={40}
                height={40}
              />
              <span className="font-bold text-sm uppercase tracking-wider">
                {t(
                  "sadhana.journey.shaktipeeth",
                  "Shree Mahavidya - Shaktpeeth"
                )}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-semibold">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span>
                  {t(
                    "sadhana.journey.liveTime",
                    "Connect Live Every Sunday at 10:00 AM"
                  )}
                </span>
              </div>
              <div className="bg-orange-500 text-white font-bold text-xs px-2 py-1 rounded-md">
                <s className="opacity-70 mr-1">₹699</s>
                <span>{t("sadhana.journey.bestValue", "Best Value")}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Side: Title */}
              <div className="text-center md:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#252847] leading-tight">
                  {t(
                    "sadhana.journey.title",
                    "Join the 6-Month Shree Suktam Sadhana Journey –"
                  )}{" "}
                  <span className="block text-yellow-600 mt-2">
                    {t("sadhana.journey.price", "Just ₹599/-")}
                  </span>
                </h2>
              </div>
              {/* Right Side: Image */}
              <div className="flex items-center justify-center">
                <Image
                  src="https://www.shreemahavidyashaktipeethwebinar.com/_next/image?url=%2Fassets%2F599.jpg&w=1920&q=75" // Replace with your image path
                  alt="Sadhana journey with chakra alignment visualization"
                  width={350}
                  height={300}
                  className="rounded-lg w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="text-center mt-8">
              <Button className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-black text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
                {t("sadhana.journey.button", "Login to Access")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
