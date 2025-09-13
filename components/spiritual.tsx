"use client";

import { Check } from "lucide-react";
import Image from "next/image";

// Placeholder for your translation context
type TFunction = (key: string, fallback: string) => string;
const useTranslation = (): { t: TFunction } => ({
  t: (key, fallback) => fallback,
});

export default function SpiritualCourseSection() {
  const { t } = useTranslation();

  const courseFeatures = [
    {
      number: "1",
      title: "Vigyan Bhairav Tantra",
      description:
        "Experience 72 potent and ancient meditation techniques revealed in the Vigyan Bhairav Tantra — a timeless scripture that unlocks deep states of consciousness and spiritual awakening.",
    },
    {
      number: "2",
      title: "Kundalini Sadhana",
      description:
        "Learn the art of awakening and balancing your Kundalini energy through guided methods practices designed to activate your true spiritual power safely and effectively.",
    },
    {
      number: "3",
      title: "Spiritual Secrets of Hanuman Chalisa",
      description:
        "Dive deep into the mystical meanings within the Hanuman Chalisa, enhancing your devotion, courage, and inner strength.",
    },
    {
      number: "4",
      title: "Ancient Pranayama Techniques",
      description:
        "Daily workshops designed for higher-level spiritual practices and courses, enabling you to deepen your journey toward financial freedom.",
    },
    {
      number: "5",
      title: "E-books and Study Materials",
      description:
        "Get access to comprehensive study materials to support your spiritual practice and enhance your understanding of sacred wisdom.",
    },
    {
      number: "6",
      title: "Upanishad Gyan",
      description:
        "Dive into the profound teachings of the Upanishads, exploring the philosophy that forms the foundation of spiritual wisdom.",
    },
    {
      number: "7",
      title: "And Much More",
      description:
        "Access weekly live sessions, guided meditations, Q&A, and community support. This course offers a complete transformational experience for your mind, body, and soul.",
    },
  ];

  return (
    <section className="bg-[#F4E6CD] py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Spiritual meditation in cosmic space"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
              {/* CTA Button */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity">
                  Register Now
                </button>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#252847] mb-8">
              What You Will Get in the{" "}
              <span className="text-yellow-600">6-Month Spiritual Course</span>
            </h2>

            <div className="space-y-6">
              {courseFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  {/* Number Circle */}
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white font-bold text-sm rounded-full flex items-center justify-center">
                    {feature.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-[#252847] text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
