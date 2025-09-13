"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/contexts/TranslationContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isKundliOpen, setIsKundliOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const serviceLinks = [
    { name: "रत्न", href: "/", englishName: "Gemstones" },
    { name: "रुद्राक्ष", href: "/", englishName: "Rudraksha" },
    { name: "यंत्र", href: "/", englishName: "Yantra" },
    { name: "किताबें", href: "/", englishName: "Books" },
    { name: "साधना", href: "/", englishName: "Sadhana" },
    { name: "पूजाएं", href: "/", englishName: "Pujas" },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-gray-50 py-2 px-4 text-xs sm:text-sm text-gray-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <span className="text-center sm:text-left">
            {t("website.talkToAstrologers")} : +91 9700380000
          </span>
          <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-4">
            <span>xyz.com</span>
            <span>|</span>
            <span>{t("website.followUs")}</span>
            <div className="flex gap-2">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-400 transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Youtube size={16} />
              </a>
            </div>
            <span>|</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img
                src="https://www.shreemahavidyashaktipeethwebinar.com/_next/image?url=%2Fassets%2Fshree-maaha.png&w=256&q=75"
                alt="Logo"
                className="w-15 h-16 sm:w-22 sm:h-26 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Home */}
            <button
              onClick={() => handleNavigation("/")}
              className="font-medium transition-colors text-orange-500"
            >
              {t("website.home")}
            </button>

            {/* About Us */}
            <button
              onClick={() => handleNavigation("/")}
              className="font-medium transition-colors text-gray-700 hover:text-orange-500"
            >
              {t("website.about")}
            </button>

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 font-medium text-gray-700 hover:text-orange-500 transition-colors">
                {t("website.services")}
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {serviceLinks.map((service) => (
                  <DropdownMenuItem
                    key={service.href}
                    onClick={() => handleNavigation(service.href)}
                    className="cursor-pointer hover:bg-orange-50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{service.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Kundli Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="font-medium transition-colors text-gray-700 hover:text-orange-500 flex items-center gap-1">
                  {t("website.kundli")}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem
                  onClick={() => handleNavigation("/vip-kundli")}
                >
                  {t("website.vipKundli", "VIP Kundli")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/")}>
                  {t("website.samanyeKundli", "Samanye Kundli")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Blog */}
            <button
              onClick={() => handleNavigation("/")}
              className="font-medium transition-colors text-gray-700 hover:text-orange-500"
            >
              {t("website.blog")}
            </button>

            {/* Gallery */}
            <button
              onClick={() => handleNavigation("/")}
              className="font-medium transition-colors text-gray-700 hover:text-orange-500"
            >
              {t("website.gallery")}
            </button>

            {/* Panshang */}
            <button
              onClick={() => handleNavigation("/")}
              className="font-medium transition-colors text-gray-700 hover:text-orange-500"
            >
              {t("website.panshang")}
            </button>

            {/* Contact */}
            <button
              onClick={() => handleNavigation("/")}
              className="font-medium transition-colors text-gray-700 hover:text-orange-500"
            >
              {t("website.contact")}
            </button>
          </div>

          {/* Chat Now Button */}
          <Button className="hidden md:block jyoti-orange-bg hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base">
            {t("website.chatNow")}
          </Button>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t bg-white">
            <div className="flex flex-col space-y-3 pt-4 px-2">
              {/* Home */}
              <button
                onClick={() => handleNavigation("/")}
                className="text-left font-medium transition-colors text-orange-500"
              >
                {t("website.home")}
              </button>

              {/* About Us */}
              <button
                onClick={() => handleNavigation("/")}
                className="text-left font-medium transition-colors text-gray-700 hover:text-orange-500"
              >
                {t("website.about")}
              </button>

              {/* Blog */}
              <button
                onClick={() => handleNavigation("/")}
                className="text-left font-medium transition-colors text-gray-700 hover:text-orange-500"
              >
                {t("website.blog")}
              </button>

              {/* Gallery */}
              <button
                onClick={() => handleNavigation("/")}
                className="text-left font-medium transition-colors text-gray-700 hover:text-orange-500"
              >
                {t("website.gallery")}
              </button>

              {/* Panshang */}
              <button
                onClick={() => handleNavigation("/")}
                className="text-left font-medium transition-colors text-gray-700 hover:text-orange-500"
              >
                {t("website.panshang")}
              </button>

              {/* Mobile Services Dropdown */}
              <div className="border-t pt-3 mt-3">
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="flex items-center justify-between w-full text-left font-medium transition-colors text-gray-700 hover:text-orange-500"
                >
                  <span>{t("website.services")}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isServicesOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {serviceLinks.map((service) => (
                      <button
                        key={service.href}
                        onClick={() => handleNavigation(service.href)}
                        className="text-left font-medium transition-colors text-gray-600 hover:text-orange-500 block w-full py-1"
                      >
                        <div className="flex flex-col">
                          <span>{service.name}</span>
                          <span className="text-xs text-gray-500">
                            {service.englishName}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Kundli Dropdown */}
              <div className="border-t pt-3 mt-3">
                <button
                  onClick={() => setIsKundliOpen(!isKundliOpen)}
                  className="flex items-center justify-between w-full text-left font-medium transition-colors text-gray-700 hover:text-orange-500"
                >
                  <span>{t("website.kundli")}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isKundliOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isKundliOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    <button
                      onClick={() => handleNavigation("/")}
                      className="text-left font-medium transition-colors text-gray-600 hover:text-orange-500 block w-full py-1"
                    >
                      {t("website.vipKundli", "VIP Kundli")}
                    </button>
                    <button
                      onClick={() => handleNavigation("/")}
                      className="text-left font-medium transition-colors text-gray-600 hover:text-orange-500 block w-full py-1"
                    >
                      {t("website.samanyeKundli", "Samanye Kundli")}
                    </button>
                  </div>
                )}
              </div>

              {/* Contact */}
              <button
                onClick={() => handleNavigation("/")}
                className="text-left font-medium transition-colors text-gray-700 hover:text-orange-500 border-t pt-3 mt-3"
              >
                {t("website.contact")}
              </button>

              <Button className="jyoti-orange-bg hover:bg-orange-600 text-white px-6 py-3 rounded-full w-full sm:w-fit text-base font-semibold">
                {t("website.chatNow")}
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
