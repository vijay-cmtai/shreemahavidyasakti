"use client";

import {
  GraduationCap,
  Briefcase,
  Gem,
  FlaskConical,
  Leaf,
  BrainCircuit,
  Wind,
  HelpCircle,
} from "lucide-react";

// Placeholder for your translation context
type TFunction = (key: string, fallback: string) => string;
const useTranslation = (): { t: TFunction } => ({
  t: (key, fallback) => fallback,
});

export default function WebinarAudienceSection() {
  const { t } = useTranslation();

  const audienceCategories = [
    {
      icon: <GraduationCap className="w-8 h-8 text-emerald-600" />,
      title: t("webinar.audience.students", "Students"),
      tag: t("webinar.audience.tag.students", "Aspirants"),
    },
    {
      icon: <Briefcase className="w-8 h-8 text-emerald-600" />,
      title: t("webinar.audience.professionals", "Professionals"),
      tag: t("webinar.audience.tag.professionals", "Employees"),
    },
    {
      icon: <Gem className="w-8 h-8 text-emerald-600" />,
      title: t("webinar.audience.spiritualSeekers", "Spiritual Seekers"),
      tag: t("webinar.audience.tag.spiritualSeekers", "Seekers"),
    },
    {
      icon: <FlaskConical className="w-8 h-8 text-emerald-600" />,
      title: t(
        "webinar.audience.occultPractitioners",
        "Occult Science Practitioners"
      ),
      tag: t("webinar.audience.tag.occultPractitioners", "Mystics"),
    },
    {
      icon: <Leaf className="w-8 h-8 text-emerald-600" />,
      title: t("webinar.audience.yogaEnthusiasts", "Yoga Enthusiasts"),
      tag: t("webinar.audience.tag.yogaEnthusiasts", "Yogis"),
    },
    {
      icon: <BrainCircuit className="w-8 h-8 text-emerald-600" />,
      title: t("webinar.audience.meditationLearners", "Meditation Learners"),
      tag: t("webinar.audience.tag.meditationLearners", "Meditators"),
    },
    {
      icon: <Wind className="w-8 h-8 text-emerald-600" />,
      title: t("webinar.audience.growthSeekers", "Personal Growth Seekers"),
      tag: t("webinar.audience.tag.growthSeekers", "Self-Improvers"),
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-emerald-600" />,
      title: t(
        "webinar.audience.anyoneCurious",
        "Anyone Curious About Spirituality"
      ),
      tag: t("webinar.audience.tag.anyoneCurious", "Curious Minds"),
    },
  ];

  return (
    <section
      className="text-gray-800 py-16 md:py-24"
      style={{ backgroundColor: "#F4E6CD" }}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Main Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {t("webinar.audience.tagline", "ENDLESS USE CASES")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
            {t(
              "webinar.audience.title.part1",
              "All types of businesses can massively benefit from"
            )}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
              {t("webinar.audience.title.highlight", "Webinars")}
            </span>
          </h2>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            {t(
              "webinar.audience.subtitle",
              "Automating your business has never been this easy. Connect with your audience, showcase your expertise, and grow your business with powerful webinars."
            )}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {audienceCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 text-center flex flex-col items-center justify-start aspect-square hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
            >
              <div className="mb-4">{category.icon}</div>
              <h3 className="font-semibold text-gray-800 flex-grow">
                {category.title}
              </h3>
              <span className="mt-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded border border-orange-300">
                {category.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Call to Action Box */}
        <div className="mt-24 max-w-3xl mx-auto bg-gradient-to-r from-orange-500 to-red-500 p-1 rounded-2xl shadow-2xl">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-10 rounded-xl text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t(
                "webinar.cta.title",
                "Ready to transform your life with spirituality?"
              )}
            </h3>
            <p className="mt-4 text-gray-700 max-w-xl mx-auto">
              {t(
                "webinar.cta.subtitle",
                "Join seekers from all walks of life and experience deep transformation with our 6-Month Spiritual Course."
              )}
            </p>
            <div className="mt-8">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-8 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg transform hover:scale-105">
                {t("webinar.cta.button", "Get Started Today")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
