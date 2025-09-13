"use client"

import { useTranslation } from "@/contexts/TranslationContext"

export default function WhyChooseUs() {
  const { t } = useTranslation()
  
  return (
    <section className="py-16 md:py-24 bg-[#F4E6CD]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-red-500 text-sm font-semibold uppercase mb-2">{t("home.whyChooseUs.subtitle")}</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#252847] mb-4">
            {t("home.whyChooseUs.title")}
          </h2>
          <div className="w-24 h-1 bg-red-500 mx-auto"></div>
        </div>

        {/* Three Feature Columns */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Great Experience */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#252847] mb-4 uppercase">
              {t("home.whyChooseUs.greatExperience.title")}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {t("home.whyChooseUs.greatExperience.description")}
            </p>
          </div>

          {/* Column 2: Data Privacy */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#252847] mb-4 uppercase">
              {t("home.whyChooseUs.dataPrivacy.title")}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {t("home.whyChooseUs.dataPrivacy.description")}
            </p>
          </div>

          {/* Column 3: Best Customer Support */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#252847] mb-4 uppercase">
              {t("home.whyChooseUs.customerSupport.title")}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {t("home.whyChooseUs.customerSupport.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}