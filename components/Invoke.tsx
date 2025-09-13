"use client";

import { BookText, CalendarClock, PlaySquare } from "lucide-react";

// Placeholder for your translation context, assuming it's available
type TFunction = (key: string, fallback: string) => string;
const useTranslation = (): { t: TFunction } => ({
  t: (key, fallback) => fallback,
});

export default function InvokeGraceSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <BookText className="w-5 h-5 text-red-600" />,
      title: t(
        "invoke.feature1.title",
        "Guided Mantra Chanting with Proper Vidhi"
      ),
      description: t(
        "invoke.feature1.desc",
        "Receive detailed guidance to chant the divine verses with correct pronunciation, rhythm, and intonation – ensuring you unlock its powerful benefits."
      ),
    },
    {
      icon: <CalendarClock className="w-5 h-5 text-yellow-600" />,
      title: t(
        "invoke.feature2.title",
        "Live Meditations Every Sunday at 10:00 AM"
      ),
      description: t(
        "invoke.feature2.desc",
        "Join weekly themed sadhanas and teachings with spiritual mentors to deepen your understanding, and to connect with divine energy and blessings."
      ),
    },
    {
      icon: <PlaySquare className="w-5 h-5 text-red-600" />,
      title: t(
        "invoke.feature3.title",
        "Daily Practice Videos for Consistency"
      ),
      description: t(
        "invoke.feature3.desc",
        "Access our video content including mantra recitations, sadhana techniques, and spiritual insights — helping you maintain your spiritual practice throughout the week."
      ),
    },
  ];

  return (
    // ✅ Changed background color to light cream
    <section className="bg-[#F4E6CD] py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#252847]">
            {t("invoke.title.part1", "Invoke the Grace of Maa Mahalakshmi in")}{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-600 text-transparent bg-clip-text">
              {t("invoke.title.highlight", "6 Months")}
            </span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              // ✅ Changed card background to a slightly darker cream/white for contrast
              className="bg-white/50 p-8 rounded-xl border border-orange-200 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center border border-orange-200">
                  {feature.icon}
                </div>
                {/* ✅ Changed text colors for light background */}
                <h3 className="ml-4 font-semibold text-gray-800 text-base">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
