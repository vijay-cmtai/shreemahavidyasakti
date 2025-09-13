"use client";

import { useTranslation } from "@/contexts/TranslationContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const { t } = useTranslation();

  const serviceLinks = [
    { name: "पूजाएं", href: "/", englishName: "Puja Services" },
    { name: "किताबें", href: "/", englishName: "Sacred Books" },
    { name: "रत्न", href: "/", englishName: "Gemstones" },
    { name: "रुद्राक्ष", href: "/", englishName: "Rudraksha" },
    { name: "साधना", href: "/", englishName: "Sadhana Programs" },
    { name: "यंत्र", href: "/", englishName: "Yantras" },
  ];

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-8">
              <div className="relative">
                <img
                  src="/images/logo.png"
                  alt="Jyotish Lok"
                  className="w-16 h-16 mr-4 drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#EFFD07] to-[#F37D00] rounded-full opacity-10 blur-xl"></div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-orange-500">
                  Jyotish Lok
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {t(
                    "footer.divineAstrologicalGuidance",
                    "Divine Astrological Guidance"
                  )}
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
              {t(
                "footer.companyDescription",
                "Your trusted partner in spiritual growth and astrological guidance. Experience the ancient wisdom of Vedic astrology and sacred practices."
              )}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="group w-12 h-12 bg-gray-800 hover:bg-[#F37D00] rounded-full flex items-center justify-center transition-all duration-300 border border-gray-700 hover:border-[#F37D00]"
              >
                <span className="text-gray-300 group-hover:text-white font-bold text-lg">
                  f
                </span>
              </a>
              <a
                href="#"
                className="group w-12 h-12 bg-gray-800 hover:bg-[#0EB5A2] rounded-full flex items-center justify-center transition-all duration-300 border border-gray-700 hover:border-[#0EB5A2]"
              >
                <span className="text-gray-300 group-hover:text-white font-bold text-sm">
                  in
                </span>
              </a>
              <a
                href="#"
                className="group w-12 h-12 bg-gray-800 hover:bg-[#EA3F37] rounded-full flex items-center justify-center transition-all duration-300 border border-gray-700 hover:border-[#EA3F37]"
              >
                <span className="text-gray-300 group-hover:text-white font-bold text-lg">
                  t
                </span>
              </a>
              <a
                href="#"
                className="group w-12 h-12 bg-gray-800 hover:bg-[#EFFD07] rounded-full flex items-center justify-center transition-all duration-300 border border-gray-700 hover:border-[#EFFD07]"
              >
                <span className="text-gray-300 group-hover:text-white font-bold text-sm">
                  yt
                </span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-orange-500">
              {t("footer.quickLinks", "Quick Links")}
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-orange-500 transition-all duration-300 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t("footer.home", "Home")}
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-orange-500 transition-all duration-300 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t("footer.about", "About Us")}
                </a>
              </li>
              <li>
                <a
                  href="/daily-horoscope"
                  className="text-gray-300 hover:text-orange-500 transition-all duration-300 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t("footer.dailyHoroscope", "Daily Horoscope")}
                </a>
              </li>
              <li>
                <a
                  href="/vip-kundli"
                  className="text-gray-300 hover:text-orange-500 transition-all duration-300 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t("footer.vipKundli", "VIP Kundli")}
                </a>
              </li>
              <li>
                <a
                  href="/samanye-kundli"
                  className="text-gray-300 hover:text-orange-500 transition-all duration-300 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t("footer.samanyeKundli", "Samanye Kundli")}
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-orange-500 transition-all duration-300 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t("footer.contact", "Contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-orange-500">
              {t("footer.services", "Services")}
            </h4>
            <ul className="space-y-4">
              {serviceLinks.map((service) => (
                <li key={service.href}>
                  <a
                    href={service.href}
                    className="text-gray-300 hover:text-orange-500 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    <div className="flex flex-col">
                      <span className="font-medium">{service.name}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - New Section */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-orange-500">
              {t("footer.contactInfo", "Contact Info")}
            </h4>
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3 border border-gray-700 group-hover:border-orange-500 transition-colors">
                  <span className="text-orange-500 text-lg">📞</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    {t("footer.phone", "Phone")}
                  </p>
                  <p className="text-orange-500 font-semibold">
                    +91 9773380099
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3 border border-gray-700 group-hover:border-orange-500 transition-colors">
                  <span className="text-orange-500 text-lg">📧</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    {t("footer.email", "Email")}
                  </p>
                  <p className="text-orange-500 font-semibold">
                    info@jyotidarshan.in
                  </p>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3 border border-gray-700 group-hover:border-orange-500 transition-colors">
                  <span className="text-orange-500 text-lg">🌐</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    {t("footer.website", "Website")}
                  </p>
                  <p className="text-orange-500 font-semibold">
                    jyotidarshan.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Jyotish Lok. {t("footer.allRightsReserved")} |
              <a
                href="/terms-of-use"
                className="text-orange-500 hover:text-white transition-colors ml-2"
              >
                {t("footer.terms")}
              </a>{" "}
              |
              <a
                href="/privacy-policy"
                className="text-orange-500 hover:text-white transition-colors ml-2"
              >
                {t("footer.privacy")}
              </a>
            </p>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
