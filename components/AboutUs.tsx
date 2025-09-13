"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  // ✅ FIX: TypeScript ke liye function ko type kiya gaya hai.
  // Humne bataya ki 'key' ek string hai aur function ek string return karega.
  const t = (key: string): string => {
    const translations: { [key: string]: string } = {
      "home.about.journeyButton": "Start Your Journey →",
    };
    return translations[key] || key;
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#F4E6CD] to-[#E8D5B7]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Main Heading from the new image */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#252847] mb-6 leading-tight">
              Transform Your Spiritual Journey With 6 Months of Shree Suktam
              Sadhana
            </h2>

            {/* Content Paragraph from the new image */}
            <div className="space-y-6">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                In just 6 months, Shree Suktam Sadhana brings a deep spiritual
                transformation—cleansing the mind, awakening inner Shakti, and
                attracting divine abundance. As you chant the sacred verses of
                Maa Mahalakshmi, negativity dissolves, energy aligns, and peace
                blossoms within. Prosperity flows naturally, relationships heal,
                and your life begins to reflect the grace and blessings of the
                Devi. This sadhana doesn’t just change your outer world—it
                elevates your soul, making abundance your natural state and
                devotion your way of life.
              </p>
            </div>

            {/* Button from the new image, with your original styling */}
            <div className="pt-4">
              <Link href="/your-sadhana-link">
                <button className="bg-gradient-to-r from-[#F37D00] to-[#EA3F37] hover:from-[#F37D00]/90 hover:to-[#EA3F37]/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {t("home.about.journeyButton")}
                </button>
              </Link>
            </div>
          </div>

          {/* Image section with the new image, keeping your original component's structure */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative">
              <div className="cursor-pointer group">
                <Image
                  src="/images/about.png" // Replace with the actual path to your new image
                  alt="A person in deep meditation surrounded by sacred symbols for Shree Suktam Sadhana"
                  width={500}
                  height={500}
                  className="w-full max-w-md md:max-w-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
