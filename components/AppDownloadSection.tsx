"use-client";

import { Check, BookOpenCheck, CalendarDays, Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Placeholder for your translation context
type TFunction = (key: string, fallback: string) => string;
const useTranslation = (): { t: TFunction } => ({
  t: (key, fallback) => fallback,
});

// New sub-component for the light-themed top section
const InvokeGraceSection = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: <BookOpenCheck className="w-5 h-5 text-red-600" />,
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
      icon: <CalendarDays className="w-5 h-5 text-yellow-600" />,
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
      icon: <Film className="w-5 h-5 text-red-600" />,
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
    <div className="bg-[#F4E6CD] py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#252847]">
            {t("invoke.title.part1", "Invoke the Grace of Maa Mahalakshmi in")}{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-600 text-transparent bg-clip-text">
              {t("invoke.title.highlight", "6 Months")}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/50 p-8 rounded-xl border border-orange-200 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center border border-orange-200">
                  {feature.icon}
                </div>
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
    </div>
  );
};

export default function SadhanaDetailsPage() {
  const { t } = useTranslation();

  const accessPlanFeatures = [
    t("pricing.3day.feature1", "Day-1 Learn Shree Suktam chanting"),
    t("pricing.3day.feature2", "Day-2 Learn Shree Yantra (Maha Meru) pooja"),
    t(
      "pricing.3day.feature3",
      "Day-3 Learn guided meditation of Shree Suktam with jagrit mantra"
    ),
  ];

  const premiumPlanFeatures = [
    t("pricing.6month.feature1", "Live session Every Sunday at 10 AM"),
    t(
      "pricing.6month.feature2",
      "Learn Shree Suktam in detail and unlock the secrets"
    ),
    t(
      "pricing.6month.feature3",
      "Swar Vigyan - Ancient and Powerful breath techniques to control the Destiny"
    ),
    t(
      "pricing.6month.feature4",
      "Vigyan Bhairav Tantra - 70+ Ancient and powerful meditation techniques"
    ),
    t("pricing.6month.feature5", "Hanuman Chalisa with Spiritual meaning"),
    t("pricing.6month.feature6", "Upanishad Gyan"),
    t("pricing.6month.feature7", "Kundalini Sadhana"),
    t("pricing.6month.feature8", "E-books and Many more..."),
  ];

  const whyJoinReasons = [
    t("whyJoin.reason1", "Unable to maintain focus, peace, or consistency"),
    t("whyJoin.reason2", "Looking for divine support in difficult times"),
    t(
      "whyJoin.reason3",
      "Want to invite abundance, peace, and grace into life"
    ),
  ];

  const whyJoinDetails = [
    {
      icon: <BookOpenCheck className="w-6 h-6 text-orange-600" />,
      title: t(
        "whyJoin.detail1.title",
        "1. Guided Mantra Chanting with Proper Vidhi"
      ),
      description: t(
        "whyJoin.detail1.desc",
        "Receive authentic guidance on how to chant the Shree Suktam with correct pronunciation, rhythm, and spiritual method — ensuring your sadhana is powerful and fruitful."
      ),
    },
    {
      icon: <CalendarDays className="w-6 h-6 text-orange-600" />,
      title: t(
        "whyJoin.detail2.title",
        "2. Live Webinars Every Sunday at 10:00 AM"
      ),
      description: t(
        "whyJoin.detail2.desc",
        "Join weekly interactive satsangs and teachings with spiritual mentors to clarify doubts, deepen your understanding, and stay connected with divine energy and sangha."
      ),
    },
    {
      icon: <Film className="w-6 h-6 text-orange-600" />,
      title: t(
        "whyJoin.detail3.title",
        "3. Daily Practice Videos for Consistency"
      ),
      description: t(
        "whyJoin.detail3.desc",
        "Access daily video content including mantra recitations, sadhana instructions, and spiritual insights — helping you maintain regularity and devotion throughout the 6 months."
      ),
    },
  ];

  return (
    // The main wrapper uses a fragment <> to avoid adding an extra div
    <>
      <InvokeGraceSection />

      <section className="bg-[#F4E6CD] text-gray-800 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* --- Top Section: Pricing Plans --- */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#252847]">
              {t("pricing.title", "Choose Your Meditation Plan")}
            </h2>
            <p className="mt-4 text-gray-600">
              {t(
                "pricing.subtitle",
                "Start your mindfulness journey with flexible subscription options"
              )}
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {/* 3-Day Access Plan */}
            <div className="bg-white border border-orange-200 rounded-xl p-8 flex flex-col shadow-lg">
              <h3 className="text-xl font-bold text-[#252847]">
                {t("pricing.3day.title", "3-Day Access Plan")}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t(
                  "pricing.3day.subtitle",
                  "Learn Shree Suktam Sadhana in 3 days"
                )}
              </p>
              <div className="my-6">
                <span className="text-5xl font-extrabold text-[#252847]">
                  ₹199
                </span>
                <span className="text-gray-600 ml-2">/3 days</span>
              </div>
              <ul className="space-y-4 text-sm flex-1">
                {accessPlanFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-4 h-4 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register/3-day" className="mt-8 block">
                <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                  {t("pricing.button", "Register to subscribe")}
                </button>
              </Link>
            </div>

            {/* 6-Months Premium Subscription */}
            <div className="bg-white border-2 border-red-500 rounded-xl p-8 flex flex-col relative shadow-lg">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                {t("pricing.popular", "Popular")}
              </div>
              <h3 className="text-xl font-bold text-[#252847]">
                {t("pricing.6month.title", "6-Months Premium Subscription")}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t("pricing.6month.subtitle", "Benifits Include:")}
              </p>
              <div className="my-6">
                <span className="text-5xl font-extrabold text-[#252847]">
                  ₹699
                </span>
                <span className="text-gray-600 ml-2">/6 months</span>
              </div>
              <ul className="space-y-4 text-sm flex-1">
                {premiumPlanFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-4 h-4 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register/6-month" className="mt-8 block">
                <button className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                  {t("pricing.button", "Register to subscribe")}
                </button>
              </Link>
            </div>
          </div>

          {/* --- Bottom Section: Why Join --- */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Image */}
            <div className="flex justify-center items-center h-full">
              <div className="bg-white/50 p-8 rounded-xl border border-orange-200 shadow-lg">
                <p className="text-gray-600 italic text-center">
                  Shree Suktam Sadhana promotional image
                </p>
              </div>
            </div>

            {/* Right Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#252847] mb-6">
                {t("whyJoin.title1", "Why Join Our")}{" "}
                <span className="text-red-600">
                  {t("whyJoin.title2", "Shree Suktam Sadhana")}
                </span>{" "}
                <span className="text-orange-600">
                  {t("whyJoin.title3", "Webinar?")}
                </span>
              </h2>
              <ul className="space-y-3 mb-10">
                {whyJoinReasons.map((reason, i) => (
                  <li key={i} className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center mr-3">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{reason}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-8 border-l-2 border-orange-300 pl-8">
                {whyJoinDetails.map((detail, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-8 top-0 -translate-x-1/2 bg-[#F4E6CD] p-1 rounded-full">
                      {detail.icon}
                    </div>
                    <h4 className="font-bold text-[#252847]">{detail.title}</h4>
                    <p className="text-gray-600 text-sm mt-2">
                      {detail.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
