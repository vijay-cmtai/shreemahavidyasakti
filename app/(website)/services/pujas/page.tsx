"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/contexts/TranslationContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Users, Search, Play, Star, Loader2, Flame } from "lucide-react"
import Image from "next/image"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get image URL
const getImageUrl = (puja: any): string => {
  if (!puja || !puja.image) return '/placeholder.jpg';
  
  // If it's already a full URL, return as is
  if (puja.image.startsWith('http://') || puja.image.startsWith('https://')) {
    return puja.image;
  }
  
  // If it starts with /, it's a relative path
  if (puja.image.startsWith('/')) {
    return `${API_BASE_URL}${puja.image}`;
  }
  
  // Otherwise, assume it's a filename and construct the full path
  return `${API_BASE_URL}/uploads/${puja.image}`;
};

// Interface matching API schema
interface Puja {
  _id: string;
  name: string;
  englishName: string;
  category: string;
  deity: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  requirements: string[];
  benefits: string[];
  process: string[];
  maxParticipants: number;
  isOnline: boolean;
  isHomeVisit: boolean;
  priestName: string;
  priestContact: string;
  location: string;
  isActive: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Pujas() {
  const { t, isLoading: translationLoading } = useTranslation()
  
  // API State
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularity");

  // Fetch pujas from API
  useEffect(() => {
    fetchPujas();
  }, []);

  const fetchPujas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try multiple endpoints
      const endpoints = [
        `${API_BASE_URL}/api/puja/public`,
        `${API_BASE_URL}/api/puja/all`,
        `${API_BASE_URL}/api/puja/admin/all`
      ];
      
      let data: any = null;
      for (const endpoint of endpoints) {
        try {
          console.log('Trying endpoint:', endpoint);
          const response = await fetch(endpoint);
          if (response.ok) {
            data = await response.json();
            console.log('API Response from', endpoint, ':', data);
            break;
          }
        } catch (err) {
          console.warn(`Error with endpoint ${endpoint}:`, err);
          continue;
        }
      }
      
      if (!data) {
        throw new Error('All API endpoints failed');
      }
      
      // Handle different response formats
      let pujasData: Puja[] = [];
      if (data.success && data.data) {
        pujasData = Array.isArray(data.data) ? data.data : [];
      } else if (data.pujas) {
        pujasData = Array.isArray(data.pujas) ? data.pujas : [];
      } else if (data.puja) {
        pujasData = Array.isArray(data.puja) ? data.puja : [];
      } else if (Array.isArray(data)) {
        pujasData = data;
      } else {
        throw new Error('Unexpected response format');
      }
      
      setPujas(pujasData);
    } catch (err: any) {
      console.error('Error fetching pujas:', err);
      setError(`Failed to load pujas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic categories and locations from API data
  const categories = Array.from(new Set(pujas.map(p => p.category)));
  const locations = Array.from(new Set(pujas.map(p => p.location)));

  const filteredPujas = pujas.filter(puja => {
    // Only show active pujas
    if (!puja.isActive) return false;
    
    const matchesCategory = selectedCategory === "all" || puja.category === selectedCategory;
    const matchesLocation = location === "all" || puja.location === location;
    const matchesSearch = puja.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         puja.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         puja.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         puja.deity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         puja.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLocation && matchesSearch;
  });

  const sortedPujas = [...filteredPujas].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return b.reviews - a.reviews; // popularity
    }
  });

  // Show loading state while translations are loading
  if (translationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/puja-hero.jpg')",
            opacity: 0.9
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-purple-900/80"></div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">🕉️</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">🙏</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">✨</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">🌟</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('pujas.hero.title', 'Puja Services')}</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            {t('pujas.hero.subtitle', 'Complete puja service with proper rituals and procedures')}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕉️</span>
              <span>{t('pujas.hero.features.authenticRituals', 'Authentic Rituals')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🙏</span>
              <span>{t('pujas.hero.features.expertPandits', 'Expert Pandits')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span>{t('pujas.hero.features.spiritualBenefits', 'Spiritual Benefits')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Puja Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🔴 Live Puja</h2>
            <p className="text-gray-600">Join live puja from home</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Live Ganesh Puja</h3>
                <p className="text-gray-600 mb-4">Join live Ganesh Puja for new beginnings</p>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Today 6:00 PM</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Join Live
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Live Lakshmi Puja</h3>
                <p className="text-gray-600 mb-4">Join live Lakshmi Puja for wealth</p>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Tomorrow 7:00 PM</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Join Live
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Live Shiva Puja</h3>
                <p className="text-gray-600 mb-4">Join live Shiva Puja for peace</p>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Day after 8:00 PM</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                  Join Live
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Search and Filter Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-orange-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('pujas.search.title', '🔍 Find Your Perfect Puja')}</h2>
              <p className="text-gray-600">{t('pujas.search.subtitle', 'Filter by category, location and search')}</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-orange-600" />
                  {t('pujas.search.labels.search', 'Search Pujas')}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder={t('pujas.search.placeholders.search', 'Search puja, deity, or category...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Flame className="w-4 h-4 mr-2 text-orange-600" />
                  {t('pujas.search.labels.category', 'Category')}
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder={t('pujas.search.placeholders.category', 'Select Category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('pujas.search.options.allCategories', 'All Categories')}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  📍 {t('pujas.search.labels.location', 'Location')}
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder={t('pujas.search.placeholders.location', 'Select Location')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('pujas.search.options.allLocations', 'All Locations')}</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  📊 {t('pujas.search.labels.sortBy', 'Sort By')}
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder={t('pujas.search.placeholders.sortBy', 'Sort By')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">{t('pujas.search.sortOptions.popularity', 'Most Popular')}</SelectItem>
                    <SelectItem value="price-low">{t('pujas.search.sortOptions.priceLow', 'Price: Low to High')}</SelectItem>
                    <SelectItem value="price-high">{t('pujas.search.sortOptions.priceHigh', 'Price: High to Low')}</SelectItem>
                    <SelectItem value="rating">{t('pujas.search.sortOptions.rating', 'Highest Rated')}</SelectItem>
                    <SelectItem value="newest">{t('pujas.search.sortOptions.newest', 'Newest First')}</SelectItem>
                  </SelectContent>
                </Select>
          </div>
        </div>
          </div>
        </div>
      </section>

      {/* Available Pujas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('pujas.collection.title', 'Available Puja Services')}</h2>
            {loading ? (
              <p className="text-gray-600">{t('pujas.collection.loading', 'Loading pujas...')}</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
            <p className="text-gray-600">{t('pujas.collection.count', `${filteredPujas.length} pujas found`)}</p>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">{t('pujas.collection.loading', 'Loading pujas...')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-2 text-red-600">{t('pujas.collection.error.title', 'Failed to Load Pujas')}</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={fetchPujas}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {t('pujas.collection.error.retry', 'Try Again')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sortedPujas.map((puja) => (
                <Card key={puja._id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50">
                  <div className="relative">
                    <Image 
                      src={getImageUrl(puja)} 
                      alt={puja.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-orange-600 text-white shadow-lg">
                      {puja.category}
                    </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{puja.rating || 4.5}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-xl text-gray-800 mb-1">{puja.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{puja.englishName}</p>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{puja.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{puja.rating || 4.5}</span>
                        <span className="text-sm text-gray-500">({puja.reviews || 0}+)</span>
                    </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                        {puja.deity}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="text-gray-700 font-medium">{t('pujas.labels.duration', 'Duration')}: {puja.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="text-gray-700 font-medium">{t('pujas.labels.maxParticipants', 'Max')}: {puja.maxParticipants} people</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="text-gray-700 font-medium">{t('pujas.labels.location', 'Location')}: {puja.location}</span>
                    </div>
                  </div>
                  
                    {/* Benefits */}
                    {puja.benefits && puja.benefits.length > 0 && (
                  <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-green-600 text-sm">🔹 {t('pujas.labels.benefits', 'Benefits:')}</h4>
                        <div className="flex flex-wrap gap-1">
                      {puja.benefits.slice(0, 3).map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                          {puja.benefits.length > 3 && (
                            <Badge variant="outline" className="text-xs text-green-500">
                              +{puja.benefits.length - 3} more
                            </Badge>
                          )}
                    </div>
                  </div>
                    )}
                    
                    {/* Requirements */}
                    {puja.requirements && puja.requirements.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 text-blue-600 text-sm">🔹 {t('pujas.labels.includes', 'Includes:')}</h4>
                        <div className="flex flex-wrap gap-1">
                          {puja.requirements.slice(0, 3).map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                          {puja.requirements.length > 3 && (
                            <Badge variant="outline" className="text-xs text-blue-500">
                              +{puja.requirements.length - 3} more
                            </Badge>
                          )}
                    </div>
                  </div>
                    )}
                  
                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                    <div>
                          <span className="text-2xl font-bold text-orange-600">₹{puja.price.toLocaleString()}</span>
                          {puja.originalPrice > puja.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">₹{puja.originalPrice.toLocaleString()}</span>
                          )}
                    </div>
                        {puja.originalPrice > puja.price && (
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      {Math.round(((puja.originalPrice - puja.price) / puja.originalPrice) * 100)}% OFF
                    </Badge>
                        )}
                      </div>
                  </div>
                  
                    {/* Service Options */}
                    <div className="flex items-center gap-2 mb-4">
                      {puja.isOnline && <Badge variant="outline" className="text-xs">{t('pujas.labels.online', 'Online')}</Badge>}
                      {puja.isHomeVisit && <Badge variant="outline" className="text-xs">{t('pujas.labels.homeVisit', 'Home Visit')}</Badge>}
                      {puja.priestName && <Badge variant="outline" className="text-xs">{t('pujas.labels.priest', 'Priest')}: {puja.priestName}</Badge>}
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      disabled={!puja.inStock}
                    >
                      {puja.inStock ? t('pujas.labels.bookPuja', 'Book Puja') : t('pujas.labels.outOfStock', 'Out of Stock')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          )}

          {!loading && !error && filteredPujas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('pujas.collection.empty', 'No pujas found.')}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("all");
                  setLocation("all");
                  setSearchTerm("");
                }}
              >
                {t('pujas.collection.clearFilters', 'Clear Filters')}
              </Button>
        </div>
          )}
        </div>
      </section>

      {/* Puja Booking Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('pujas.booking.title', '🙏 Book Your Puja Service')}</h2>
            <p className="text-lg text-gray-600 mb-8">{t('pujas.booking.subtitle', 'Complete puja service with proper rituals and procedures')}</p>
            
            {/* Rules and Terms */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-12 text-left max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-center text-orange-600 mb-6">{t('pujas.booking.rulesTitle', '⚠️ Rules & Terms')}</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">1.</span>
                  <p>{t('pujas.booking.rules.gotra', 'Gotra is mandatory for all pujas. If gotra is unknown, "Kashyap Gotra" will be considered valid.')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">2.</span>
                  <p>{t('pujas.booking.rules.family', 'All participants must be from the same family and same gotra.')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">3.</span>
                  <p>{t('pujas.booking.rules.sankalp', 'Brahmin will chant the names and gotra of all participants during the sankalp.')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">4.</span>
                  <p>{t('pujas.booking.rules.video', 'Puja video will be sent on WhatsApp within 72 hours after completion.')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">5.</span>
                  <p>{t('pujas.booking.rules.prasad', '"Prabhu Prasad Ashirwad Box" will be delivered by courier within 10 days. No additional charges.')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Regular Puja Cards */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">{t('pujas.booking.regularTitle', 'Regular Puja Services')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* 1 Person Puja */}
              <Card className="hover:shadow-lg transition-shadow border-orange-200">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{t('pujas.booking.forPerson', { count: 1 })}</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">₹1,600</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>{t('pujas.booking.features.sankalp', 'Sankalp by Brahmin')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>{t('pujas.booking.features.video', 'Puja video in 72 hours')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>{t('pujas.booking.features.prasad', 'Prabhu Prasad Box')}</span>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-sm mb-2">Prasad Box Contains:</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• Rudraksha Kavach (4,5,6 Mukhi) - 1 Set</li>
                      <li>• Raksha Sutra - 1 pc</li>
                      <li>• Mohini Tilak - 1 pc</li>
                      <li>• Lakshmi Yantra - 1 pc</li>
                      <li>• Sacred Prasad - 1 packet</li>
                    </ul>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    {t('pujas.labels.bookPuja', 'Book Now')}
                  </Button>
                </CardContent>
              </Card>

              {/* 2 Person Puja */}
              <Card className="hover:shadow-lg transition-shadow border-orange-200">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">For 2 Persons</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">₹2,100</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>Sankalp with both names</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>{t('pujas.booking.features.video', 'Puja video in 72 hours')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>Prasad box for 2 persons</span>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-sm mb-2">Prasad Box Contains:</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• Rudraksha Kavach (4,5,6 Mukhi) - 2 Sets</li>
                      <li>• Raksha Sutra - 2 pcs</li>
                      <li>• Mohini Tilak - 2 pcs</li>
                      <li>• Lakshmi Yantra - 2 pcs</li>
                      <li>• Sacred Prasad - 2 packets</li>
                    </ul>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    {t('pujas.labels.bookPuja', 'Book Now')}
                  </Button>
                </CardContent>
              </Card>

              {/* 4 Person Puja */}
              <Card className="hover:shadow-lg transition-shadow border-orange-200">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">For 4 Persons</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">₹3,100</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>Sankalp with all 4 names</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>{t('pujas.booking.features.video', 'Puja video in 72 hours')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>Prasad box for 4 persons</span>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-sm mb-2">Prasad Box Contains:</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• Rudraksha Kavach (4,5,6 Mukhi) - 4 Sets</li>
                      <li>• Raksha Sutra - 4 pcs</li>
                      <li>• Mohini Tilak - 4 pcs</li>
                      <li>• Lakshmi Yantra - 4 pcs</li>
                      <li>• Sacred Prasad - 4 packets</li>
                    </ul>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    {t('pujas.labels.bookPuja', 'Book Now')}
                  </Button>
                </CardContent>
              </Card>

              {/* 6 Person Puja */}
              <Card className="hover:shadow-lg transition-shadow border-orange-200">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">For 6 Persons</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">₹4,100</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>Sankalp with all 6 names</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>{t('pujas.booking.features.video', 'Puja video in 72 hours')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">✅</span>
                      <span>Prasad box for 6 persons</span>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-sm mb-2">Prasad Box Contains:</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• Rudraksha Kavach (4,5,6 Mukhi) - 6 Sets</li>
                      <li>• Raksha Sutra - 6 pcs</li>
                      <li>• Mohini Tilak - 6 pcs</li>
                      <li>• Lakshmi Yantra - 6 pcs</li>
                      <li>• Sacred Prasad - 6 packets</li>
                    </ul>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    {t('pujas.labels.bookPuja', 'Book Now')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* VIP Puja Cards */}
          <div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">{t('pujas.booking.vipTitle', 'VIP Dosha Nivaran Pujas')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                { name: "Kaal Sarp Dosha", price: 11000, icon: "🐍" },
                { name: "Pitru Dosha", price: 15000, icon: "🙏" },
                { name: "Mangal Dosha / Kuj Dosha", price: 11000, icon: "🔴" },
                { name: "Shani Dosha (Sade Sati)", price: 17000, icon: "🪐" },
                { name: "Rahu Grahan Dosha", price: 11000, icon: "🌑" },
                { name: "Chandra Grahan Dosha", price: 11000, icon: "🌙" },
                { name: "Mangal + Ketu Dosha", price: 12000, icon: "🔥" },
                { name: "Guru Chandal Dosha Nivaran", price: 15000, icon: "⭐" },
                { name: "Drishti Yoga", price: 12000, icon: "👁️" },
                { name: "Chandal Dosha Puja", price: 16000, icon: "⚡" },
                { name: "Shapit Yoga", price: 12000, icon: "🌀" },
                { name: "Upasak Yoga Dosha", price: 12000, icon: "🕉️" },
                { name: "Gandmool Dosha", price: 14000, icon: "🌿" },
                { name: "Kemdrum Yoga Dosha", price: 16000, icon: "🌊" },
                { name: "Vriddh Yoga (Chandra-Shani)", price: 17000, icon: "🌛" },
                { name: "Shadgraha Yoga", price: 12000, icon: "🌟" },
                { name: "Vansh Yoga Puja", price: 11000, icon: "👨‍👩‍👧‍👦" },
                { name: "Kemdrum Yoga", price: 11000, icon: "💫" },
                { name: "Namkaran Yoga", price: 12500, icon: "📝" },
                { name: "Navansh Dosha", price: 14000, icon: "🎯" },
                { name: "Dagdh Rashi Dosha", price: 14000, icon: "🔥" },
                { name: "Shatabhisha Dosha", price: 19000, icon: "💎" },
                { name: "Maun Jap / Nazar Dosha", price: 11000, icon: "👁️‍🗨️" },
                { name: "Papkartari Yoga", price: 11000, icon: "⚔️" },
                { name: "Grahankari Yoga Dosha", price: 12000, icon: "🌘" },
                { name: "Kaal Sarp/Sarp Dosha", price: 16000, icon: "🐍" },
                { name: "Vyalmukhi Yagya", price: 15000, icon: "🔱" }
              ].map((puja, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">{puja.icon}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2 leading-tight">{puja.name}</h4>
                      <p className="text-2xl font-bold text-green-600">₹{puja.price.toLocaleString()}</p>
                    </div>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✅</span>
                        <span>{t('pujas.booking.vipFeatures.ritual', '2.5 hours ritual')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✅</span>
                        <span>{t('pujas.booking.vipFeatures.brahmins', 'Expert Brahmins')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✅</span>
                        <span>{t('pujas.booking.vipFeatures.streaming', 'Live YouTube streaming')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✅</span>
                        <span>{t('pujas.booking.vipFeatures.vipPrasad', 'VIP Prasad Box')}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm py-2">
{t('pujas.labels.bookPuja', 'Book VIP Puja')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VIP Puja Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">🕉️</div>
          <div className="absolute top-20 right-20 text-4xl">🌟</div>
          <div className="absolute bottom-20 left-20 text-5xl">👑</div>
          <div className="absolute bottom-10 right-10 text-3xl">✨</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{t('pujas.vipBenefits.title', '🌟 VIP Puja Benefits')}</h2>
            <p className="text-xl opacity-90 mb-8">{t('pujas.vipBenefits.subtitle', 'Special personalized rituals - 2.5 hours of divine blessings')}</p>
          </div>

          {/* VIP Puja Benefits */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-green-400/30">
            <h3 className="text-2xl font-bold text-center mb-8 text-yellow-300">{t('pujas.vipBenefits.completeTitle', '🌟 Complete VIP Puja Benefits')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🎯", title: "Personal Ritual", desc: "2.5 hours special ritual exclusively for your family" },
                { icon: "🙏", title: "Gotra-based Sankalp", desc: "Special sankalp with your name and gotra for divine blessings" },
                { icon: "👥", title: "Two Expert Brahmins", desc: "Two learned Brahmins performing Vedic chanting and havan" },
                { icon: "📿", title: "Mantra-Siddh Rudraksha", desc: "5,6,7 Mukhi Rudraksha and 108 beads mala" },
                { icon: "🌊", title: "Panchamrit Abhishek", desc: "Remove negativity and infuse divine energy" },
                { icon: "🔥", title: "Havan Blessings", desc: "Destroy troubles, diseases, enemies and obstacles" },
                { icon: "💎", title: "Spiritual Growth", desc: "Wealth, prosperity, happiness, peace and security" },
                { icon: "📱", title: "Live Darshan", desc: "Watch live puja from home via YouTube link" },
                { icon: "🎁", title: "Special Prasad Box", desc: "Consecrated Rudraksha, Yantra and divine prasad" }
              ].map((benefit, index) => (
                <div key={index} className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 p-4 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all">
                  <div className="text-2xl mb-2">{benefit.icon}</div>
                  <h4 className="font-bold mb-2 text-green-300">{benefit.title}</h4>
                  <p className="text-sm opacity-90">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* VIP Rules Card */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white border-2 border-green-300 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">{t('pujas.vipBenefits.rulesTitle', '⚠️ VIP Puja Rules')}</h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">1.</span>
                    <p className="text-sm">Sankalp will be taken only for one family and one gotra</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">2.</span>
                    <p className="text-sm">If gotra is unknown, "Kashyap Gotra" will be considered valid</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">3.</span>
                    <p className="text-sm">Brahmin will act as yajman on your behalf and complete the entire puja</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">4.</span>
                    <p className="text-sm">If you can attend the puja, it will be even more auspicious and beneficial</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">5.</span>
                    <p className="text-sm">Complete Vedic procedures, mantra chanting and havan included</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">6.</span>
                    <p className="text-sm">Live darshan facility via YouTube link</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-center text-green-800 font-semibold">
                    {t('pujas.vipBenefits.quote', '"VIP Puja opens the door to happiness, peace and prosperity for your family for generations."')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prasad Box Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('pujas.prasadBox.title', '🎁 Prabhu Prasad Ashirwad Box')}</h2>
            <p className="text-lg text-gray-600">{t('pujas.prasadBox.subtitle', 'All items are provided as blessed prasad and sanctified (consecrated) form')}</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-orange-600 mb-6">{t('pujas.prasadBox.specialFeatures', '✨ Special Features')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500">🌸</span>
                    <p>All items are blessed as prasad, consecrated and chanted with mantras</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500">💧</span>
                    <p>Rudraksha purified with Lord's water abhishek</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500">🏛️</span>
                    <p>All materials collected from sacred places</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500">🚚</span>
                    <p>Free delivery within 10 days</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-orange-600 mb-6">{t('pujas.prasadBox.boxContents', '📦 Box Contents')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "4 Mukhi Rudraksha Kavach",
                    "5 Mukhi Rudraksha Kavach", 
                    "6 Mukhi Rudraksha Kavach",
                    "Raksha Sutra",
                    "Mohini Tilak",
                    "Lakshmi Yantra",
                    "Sacred Prasad",
                    "Sadhana Catalog"
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-500">✨</span>
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('pujas.features.title', 'Why Choose Our Puja Services?')}</h2>
            <p className="text-lg text-gray-600">{t('pujas.features.subtitle', 'Professional and authentic puja services')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "✅", title: t('pujas.features.items.completeRituals.title', 'Complete Rituals'), desc: t('pujas.features.items.completeRituals.desc', 'Puja as per scriptures') },
              { icon: "🏠", title: t('pujas.features.items.homeService.title', 'Home Service'), desc: t('pujas.features.items.homeService.desc', 'Puja service at your home') },
              { icon: "📱", title: t('pujas.features.items.onlinePuja.title', 'Online Puja'), desc: t('pujas.features.items.onlinePuja.desc', 'Join live online puja') }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-400 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('pujas.cta.title', 'Book Your Puja Today')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('pujas.cta.subtitle', 'Get divine blessings and positive energy in your life')}
          </p>
          <Button className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            {t('pujas.cta.bookNow', 'Book Puja Now')}
          </Button>
        </div>
      </section>
    </main>
  )
}
