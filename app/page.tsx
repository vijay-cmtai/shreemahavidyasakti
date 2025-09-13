import HeroSection from "@/components/HeroSection";
import KundliSection from "@/components/KundliSection";
import AppDownloadSection from "@/components/AppDownloadSection";
import AboutUs from "@/components/AboutUs";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Invoke from "@/components/Invoke";
import Spiritual from "@/components/spiritual";
import AllTypeBusiness from "@/components/AlltypeBusiness";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div id="hero">
        <HeroSection />
      </div>
      <div id="about">
        <AboutUs />
      </div>
      <div id="kundli">
        <KundliSection />
      </div>
      <div id="invoke">
        <Invoke />
      </div>
      <div id="download-app">
        <AppDownloadSection />
      </div>
      <div id="spiritual">
        <Spiritual />
      </div>
      <div id="AlltypeBusiness">
        <AllTypeBusiness />
      </div>
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <Footer />
    </main>
  );
}
