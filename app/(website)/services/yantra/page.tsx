"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  ShoppingCart,
  Search,
  Triangle,
  Hexagon,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

// Types
interface Yantra {
  _id: string;
  name: string;
  englishName: string;
  category: string;
  deity: string;
  material: string;
  size: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  imageUrl?: string;
  imagePath?: string;
  mediaUrl?: string;
  thumbnail?: string;
  description: string;
  benefits: string[];
  activation: string;
  isBlessed: boolean;
  isCustom: boolean;
  isEnergized: boolean;
  inStock: boolean;
  isActive: boolean;
  stock: number;
  rating?: number;
  reviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper function to get image URL
const getImageUrl = (yantra: Yantra): string => {
  if (!yantra) return "/placeholder.jpg";

  // Check multiple possible image field names
  const imageField =
    yantra.image ||
    yantra.imageUrl ||
    yantra.imagePath ||
    yantra.mediaUrl ||
    yantra.thumbnail;

  if (!imageField) return "/placeholder.jpg";

  // If it's already a full URL, return as is
  if (imageField.startsWith("http://") || imageField.startsWith("https://")) {
    return imageField;
  }

  // If it's a relative path, construct the full URL
  if (imageField.startsWith("/")) {
    return `${API_BASE_URL}${imageField}`;
  }

  // If it's just a filename or path, prepend the API base URL
  return `${API_BASE_URL}/${imageField}`;
};

export default function Yantra() {
  const { t, isLoading: translationLoading } = useTranslation();

  const [yantras, setYantras] = useState<Yantra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    alternativeMobile: "",
    specialInstructions: "",
  });

  // Fetch yantras from API
  const fetchYantras = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/yantra/public`);
      if (!response.ok) {
        throw new Error("Failed to fetch yantras");
      }

      const data = await response.json();
      setYantras(data.yantra || data || []);
    } catch (error) {
      console.error("Error fetching yantras:", error);
      setError("Failed to load yantras. Please try again later.");
      setYantras([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchYantras();
  }, []);

  // Get dynamic categories from yantras data
  const dynamicCategories = yantras.reduce((acc: string[], yantra) => {
    if (!acc.includes(yantra.category)) {
      acc.push(yantra.category);
    }
    return acc;
  }, []);

  const yantraCategories = [
    { id: "all", name: "All Yantras", english: "All Yantras" },
    ...dynamicCategories.map((category) => ({
      id: category,
      name: category,
      english: category,
    })),
  ];

  // Dummy data removed - now using API data from yantras state

  const priceRanges = [
    { id: "all", name: t("yantra.priceRanges.all", "All Prices") },
    { id: "0-1500", name: t("yantra.priceRanges.under1500", "Under ₹1,500") },
    {
      id: "1500-2500",
      name: t("yantra.priceRanges.1500to2500", "₹1,500 - ₹2,500"),
    },
    {
      id: "2500-3500",
      name: t("yantra.priceRanges.2500to3500", "₹2,500 - ₹3,500"),
    },
    { id: "3500+", name: t("yantra.priceRanges.above3500", "Above ₹3,500") },
  ];

  const filteredYantras = yantras.filter((yantra) => {
    // Only show active yantras
    if (!yantra.isActive) return false;

    const matchesCategory =
      selectedCategory === "all" || yantra.category === selectedCategory;
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "0-1500" && yantra.price <= 1500) ||
      (priceRange === "1500-2500" &&
        yantra.price > 1500 &&
        yantra.price <= 2500) ||
      (priceRange === "2500-3500" &&
        yantra.price > 2500 &&
        yantra.price <= 3500) ||
      (priceRange === "3500+" && yantra.price > 3500);
    const matchesSearch =
      yantra.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      yantra.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      yantra.deity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      yantra.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (yantra.benefits &&
        yantra.benefits.some((benefit) =>
          benefit.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    return matchesCategory && matchesPrice && matchesSearch;
  });

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Checkout Data:", checkoutData);
    console.log("Selected Product:", selectedProduct);

    alert(
      `Thank you ${checkoutData.name}! Your order for ${selectedProduct.name} has been received. You will be redirected to payment gateway.`
    );

    setCheckoutData({
      name: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      alternativeMobile: "",
      specialInstructions: "",
    });
    setShowCheckoutForm(false);
    setSelectedProduct(null);
  };

  // Show loading state while translations are loading
  if (translationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/yantra-hero.jpg')",
            opacity: 0.9,
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-purple-900/80"></div>

        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">🔯</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">🌟</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">
            ⚡
          </div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">
            ✨
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("yantra.hero.title", "Sacred Yantra Collection")}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            {t(
              "yantra.hero.subtitle",
              "Sacred Yantras for Spiritual & Material Benefits"
            )}
          </p>
          <p className="text-lg opacity-80 mb-8 max-w-3xl mx-auto">
            {t(
              "yantra.hero.description",
              "Ancient geometric patterns that bring divine blessings and positive energy"
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔯</span>
              <span>
                {t("yantra.hero.features.energized", "Properly Energized")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🙏</span>
              <span>
                {t("yantra.hero.features.installation", "Expert Installation")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>
                {t("yantra.hero.features.benefits", "Immediate Benefits")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-orange-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {t("yantra.search.title", "🔍 Find Your Perfect Yantra")}
              </h2>
              <p className="text-gray-600">
                {t(
                  "yantra.search.subtitle",
                  "Filter by category, price and deity"
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-orange-600" />
                  {t("yantra.search.labels.search", "Search Yantras")}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder={t(
                      "yantra.search.placeholders.search",
                      "Search yantra, deity, or benefits..."
                    )}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Triangle className="w-4 h-4 mr-2 text-orange-600" />
                  {t("yantra.search.labels.category", "Category")}
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue
                      placeholder={t(
                        "yantra.search.placeholders.category",
                        "Select Category"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {yantraCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  💰 {t("yantra.search.labels.priceRange", "Price Range")}
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue
                      placeholder={t(
                        "yantra.search.placeholders.priceRange",
                        "Select Price"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.id} value={range.id}>
                        {range.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Search className="w-5 h-5 mr-2" />
                  {t("yantra.search.button", "Search Now")}
                </Button>
              </div>
            </div>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="text-sm text-gray-600 mr-4">
                {t("yantra.search.quickFilters", "Quick Filters:")}
              </div>
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors">
                {t("yantra.search.tags.popular", "✨ Most Popular")}
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors">
                {t("yantra.search.tags.energized", "🏆 Energized")}
              </button>
              <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200 transition-colors">
                {t("yantra.search.tags.premium", "💎 Premium")}
              </button>
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors">
                {t("yantra.search.tags.newArrivals", "🔯 New Arrivals")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Yantras Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t("yantra.collection.title", "Available Yantra Collection")}
            </h2>
            <p className="text-gray-600">
              {loading
                ? t("yantra.labels.loading", "Loading...")
                : `${filteredYantras.length} ${t("yantra.collection.count", "yantras found")}`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <span className="ml-2 text-gray-600">
                {t("yantra.collection.loading", "Loading yantras...")}
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
                <p className="font-semibold">
                  {t("yantra.collection.error.title", "Error Loading Yantras")}
                </p>
                <p className="text-sm mt-1">{error}</p>
                <Button
                  onClick={fetchYantras}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  {t("yantra.collection.error.retry", "Try Again")}
                </Button>
              </div>
            </div>
          )}

          {/* Yantras Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredYantras.map((yantra) => (
                <Card
                  key={yantra._id}
                  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50"
                >
                  {yantra.isEnergized && (
                    <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                      ⚡ {t("yantra.hero.features.energized", "Energized")}
                    </Badge>
                  )}

                  <div className="relative">
                    <Image
                      src={getImageUrl(yantra)}
                      alt={yantra.name}
                      width={400}
                      height={300}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-2 p-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                      >
                        <Hexagon className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center shadow-lg">
                        <span className="mr-1">🔯</span>
                        {yantra.deity}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-xl text-gray-800 mb-1">
                        {yantra.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {yantra.englishName}
                      </p>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {yantra.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {yantra.rating || 4.5}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({yantra.reviews || 0})
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-orange-600 border-orange-200 bg-orange-50"
                      >
                        {yantra.category}
                      </Badge>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {yantra.benefits &&
                        yantra.benefits.slice(0, 4).map((benefit, index) => (
                          <div
                            key={index}
                            className="text-xs bg-gradient-to-r from-orange-50 to-red-50 text-orange-800 px-3 py-2 rounded-lg text-center font-medium border border-orange-200"
                          >
                            {benefit}
                          </div>
                        ))}
                    </div>

                    {/* Material and Size */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="bg-gray-50 px-3 py-2 rounded-lg text-center">
                        <div className="text-xs text-gray-600">
                          {t("yantra.labels.material", "Material")}
                        </div>
                        <div className="font-semibold text-sm">
                          {yantra.material}
                        </div>
                      </div>
                      <div className="bg-gray-50 px-3 py-2 rounded-lg text-center">
                        <div className="text-xs text-gray-600">
                          {t("yantra.labels.size", "Size")}
                        </div>
                        <div className="font-semibold text-sm">
                          {yantra.size}
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-orange-600">
                            ₹{yantra.price.toLocaleString()}
                          </span>
                          {yantra.originalPrice &&
                            yantra.originalPrice > yantra.price && (
                              <>
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ₹{yantra.originalPrice.toLocaleString()}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-200 bg-green-50 ml-2"
                                >
                                  {Math.round(
                                    ((yantra.originalPrice - yantra.price) /
                                      yantra.originalPrice) *
                                      100
                                  )}
                                  % OFF
                                </Badge>
                              </>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 shadow-lg"
                        onClick={() => {
                          setSelectedProduct({
                            ...yantra,
                            selectedOption: { price: yantra.price },
                            optionType: "direct",
                          });
                          setShowCheckoutForm(true);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {t("yantra.labels.buyNow", "Buy Now")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results State */}
          {!loading && !error && filteredYantras.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {t("yantra.collection.empty", "No yantras found.")}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange("all");
                  setSearchTerm("");
                }}
              >
                {t("yantra.collection.clearFilters", "Clear Filters")}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t("yantra.features.title", "Why Choose Our Yantras?")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("yantra.features.subtitle", "Authentic and energized yantras")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "✅",
                title: t("yantra.features.items.energized.title", "Energized"),
                desc: t(
                  "yantra.features.items.energized.desc",
                  "All yantras are properly energized"
                ),
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: "🌍",
                title: t("yantra.features.items.authentic.title", "Authentic"),
                desc: t(
                  "yantra.features.items.authentic.desc",
                  "Made according to ancient scriptures"
                ),
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: "📱",
                title: t(
                  "yantra.features.items.guidance.title",
                  "Expert Guidance"
                ),
                desc: t(
                  "yantra.features.items.guidance.desc",
                  "Free consultation on selection"
                ),
                color: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("yantra.cta.title", "Enhance Your Life with Sacred Yantras")}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t(
              "yantra.cta.subtitle",
              "Get authentic and energized yantras for your needs"
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              {t("yantra.cta.explore", "Explore Yantras")}
            </Button>
            <Button
              variant="outline"
              className="border-white text-orange-800 px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600"
            >
              {t("yantra.cta.call", "Call: +91 9700380000")}
            </Button>
          </div>
        </div>
      </section>

      {/* Checkout Form Modal */}
      {showCheckoutForm && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardTitle className="text-2xl flex items-center justify-between">
                {t(
                  "yantra.checkout.title",
                  "🛒 Checkout - {{productName}}"
                ).replace("{{productName}}", selectedProduct.name)}
                ""
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCheckoutForm(false);
                    setSelectedProduct(null);
                  }}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Order Summary */}
              <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-200">
                <h3 className="font-bold text-lg text-orange-800 mb-2">
                  {t("yantra.checkout.orderSummary", "📋 Order Summary")}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t("yantra.checkout.product", "Product:")}</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("yantra.checkout.deity", "Deity:")}</span>
                    <span className="font-medium">{selectedProduct.deity}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t">
                    <span>
                      {t("yantra.checkout.totalAmount", "Total Amount:")}
                    </span>
                    <span>₹{selectedProduct.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t(
                      "yantra.checkout.deliveryInfo",
                      "📝 Delivery Information"
                    )}
                  </h3>
                  <p className="text-gray-600">
                    {t(
                      "yantra.checkout.deliveryDesc",
                      "Please fill in your details for delivery"
                    )}
                  </p>
                </div>

                {/* Fixed Product Name Field */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <label className="block text-sm font-medium text-orange-800 mb-2">
                    {t("yantra.checkout.productName", "🛍️ Product Name")}
                  </label>
                  <Input
                    type="text"
                    value={selectedProduct.name}
                    disabled
                    className="border-2 border-orange-200 bg-orange-100 text-orange-800 font-semibold cursor-not-allowed"
                  />
                  <p className="text-xs text-orange-600 mt-1">
                    This field is fixed and cannot be changed
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("yantra.checkout.fullName", "👤 Full Name *")}
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.name}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter your full name"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("yantra.checkout.mobile", "📱 Mobile Number *")}
                    </label>
                    <Input
                      type="tel"
                      required
                      value={checkoutData.mobile}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          mobile: e.target.value,
                        })
                      }
                      placeholder="Enter mobile number"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(
                        "yantra.checkout.alternativeMobile",
                        "📞 Alternative Mobile"
                      )}
                    </label>
                    <Input
                      type="tel"
                      value={checkoutData.alternativeMobile}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          alternativeMobile: e.target.value,
                        })
                      }
                      placeholder="Alternative number (optional)"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("yantra.checkout.pincode", "📮 PIN Code *")}
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.pincode}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          pincode: e.target.value,
                        })
                      }
                      placeholder="PIN Code"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("yantra.checkout.address", "🏠 Complete Address *")}
                  </label>
                  <Textarea
                    required
                    value={checkoutData.address}
                    onChange={(e: any) =>
                      setCheckoutData({
                        ...checkoutData,
                        address: e.target.value,
                      })
                    }
                    placeholder="Enter your complete delivery address"
                    className="border-2 border-orange-200 focus:border-orange-400"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("yantra.checkout.city", "🏙️ City *")}
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.city}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          city: e.target.value,
                        })
                      }
                      placeholder="City"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("yantra.checkout.state", "🗺️ State *")}
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.state}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          state: e.target.value,
                        })
                      }
                      placeholder="State"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t(
                      "yantra.checkout.specialInstructions",
                      "📝 Special Instructions (Optional)"
                    )}
                  </label>
                  <Textarea
                    value={checkoutData.specialInstructions}
                    onChange={(e: any) =>
                      setCheckoutData({
                        ...checkoutData,
                        specialInstructions: e.target.value,
                      })
                    }
                    placeholder="Any special delivery instructions or installation requests"
                    className="border-2 border-orange-200 focus:border-orange-400"
                    rows={2}
                  />
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">
                    {t(
                      "yantra.checkout.importantInfo",
                      "📌 Important Information"
                    )}
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>
                      •{" "}
                      {t(
                        "yantra.checkout.freeShipping",
                        "Free shipping across India"
                      )}
                    </p>
                    <p>
                      •{" "}
                      {t(
                        "yantra.checkout.deliveryTime",
                        "Delivery within 5-7 working days"
                      )}
                    </p>
                    <p>
                      •{" "}
                      {t(
                        "yantra.checkout.codAvailable",
                        "COD available (Cash on Delivery)"
                      )}
                    </p>
                    <p>
                      •{" "}
                      {t(
                        "yantra.checkout.installationGuidance",
                        "Expert installation guidance included"
                      )}
                    </p>
                    <p>
                      •{" "}
                      {t(
                        "yantra.checkout.allEnergized",
                        "All yantras are properly energized"
                      )}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowCheckoutForm(false);
                      setSelectedProduct(null);
                    }}
                  >
                    {t("yantra.checkout.back", "← Back")}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3"
                  >
                    {t(
                      "yantra.checkout.proceedToPayment",
                      "💳 Proceed to Payment"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
