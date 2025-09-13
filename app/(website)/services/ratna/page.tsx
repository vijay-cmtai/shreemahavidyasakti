"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ShoppingCart, Filter, Search, Heart, Eye, Gem } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/contexts/TranslationContext"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get full image URL
const getImageUrl = (gemstone: any): string => {
  // Check multiple possible image field names
  const imagePath = gemstone.image || gemstone.imageUrl || gemstone.imagePath || gemstone.mediaUrl || gemstone.thumbnail;
  
  if (!imagePath) return '/images/placeholder.jpg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /, it's a relative path
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Otherwise, assume it's a filename and construct the full path
  return `${API_BASE_URL}/uploads/${imagePath}`;
};

// Interface matching MongoDB schema
interface Gemstone {
  _id: string;
  name: string;
  englishName: string;
  hindiName: string;
  category: "precious" | "semi-precious" | "organic" | "other";
  planet: string;
  planetEmoji: string;
  planetHindi: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  benefits: string[];
  jaap: string;
  brahmins: string;
  weight: string;
  origin: string;
  certified: boolean;
  inStock: boolean;
  premium: boolean;
  luxury: boolean;
  isActive: boolean;
  discountPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export default function Ratna() {
  const { t, isLoading: translationLoading } = useTranslation()
  
  // API State
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter State
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  
  // Modal State
  const [showWorshipModal, setShowWorshipModal] = useState<string | null>(null)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Gemstone | null>(null)
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    alternativeMobile: '',
    specialInstructions: ''
  })

  // Fetch gemstones from API
  useEffect(() => {
    fetchGemstones();
  }, []);

  const fetchGemstones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/gemstones/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Debug: Log first gemstone to see image field
      if (data.gemstones && data.gemstones.length > 0) {
        const firstGemstone = data.gemstones[0];
        console.log('First gemstone image field:', firstGemstone.image);
        console.log('All image-related fields:', {
          image: firstGemstone.image,
          imageUrl: (firstGemstone as any).imageUrl,
          imagePath: (firstGemstone as any).imagePath,
          mediaUrl: (firstGemstone as any).mediaUrl,
          thumbnail: (firstGemstone as any).thumbnail
        });
        console.log('First gemstone full data:', firstGemstone);
      }
      
      // Handle different response formats
      if (data.success) {
        setGemstones(data.gemstones || data.data || []);
      } else if (data.gemstones) {
        setGemstones(data.gemstones);
      } else if (data.data) {
        setGemstones(data.data);
      } else if (Array.isArray(data)) {
        setGemstones(data);
      } else {
        setError(data.message || 'Failed to fetch gemstones');
      }
    } catch (err: any) {
      console.error('Error fetching gemstones:', err);
      setError(`Failed to load gemstones: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const gemstoneCategories = [
    { id: "all", name: "All Gemstones", english: "All Gemstones" },
    { id: "precious", name: "Precious Gems", english: "Precious Gems" },
    { id: "semi-precious", name: "Semi-Precious", english: "Semi-Precious" },
    { id: "organic", name: "Organic Gems", english: "Organic Gems" },
    { id: "other", name: "Other Gems", english: "Other Gems" }
  ]

  // Dynamic categories from API data
  const dynamicCategories = Array.from(new Set(gemstones.map(g => g.category))).map(cat => ({
    id: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' '),
    english: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')
  }));

  const priceRanges = [
    { id: "all", name: t('ratna.priceRanges.all', 'All Prices') },
    { id: "0-5000", name: t('ratna.priceRanges.under5000', 'Under ₹5,000') },
    { id: "5000-10000", name: t('ratna.priceRanges.5000to10000', '₹5,000 - ₹10,000') },
    { id: "10000-20000", name: t('ratna.priceRanges.10000to20000', '₹10,000 - ₹20,000') },
    { id: "20000+", name: t('ratna.priceRanges.above20000', 'Above ₹20,000') }
  ]

  const sortOptions = [
    { id: "popularity", name: t('ratna.sortOptions.popularity', 'Most Popular') },
    { id: "price-low", name: t('ratna.sortOptions.priceLow', 'Price: Low to High') },
    { id: "price-high", name: t('ratna.sortOptions.priceHigh', 'Price: High to Low') },
    { id: "rating", name: t('ratna.sortOptions.rating', 'Highest Rated') },
    { id: "newest", name: t('ratna.sortOptions.newest', 'Newest First') }
  ]

  const filteredGemstones = gemstones.filter(gemstone => {
    // Only show active gemstones
    if (!gemstone.isActive) return false;
    
    const matchesCategory = selectedCategory === "all" || gemstone.category === selectedCategory
    const matchesPrice = priceRange === "all" || 
      (priceRange === "0-5000" && gemstone.price <= 5000) ||
      (priceRange === "5000-10000" && gemstone.price > 5000 && gemstone.price <= 10000) ||
      (priceRange === "10000-20000" && gemstone.price > 10000 && gemstone.price <= 20000) ||
      (priceRange === "20000+" && gemstone.price > 20000)
    const matchesSearch = gemstone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gemstone.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gemstone.hindiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gemstone.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gemstone.planet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gemstone.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesPrice && matchesSearch
  })

  const sortedGemstones = [...filteredGemstones].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return b.reviews - a.reviews // popularity
    }
  })

  const handleSelectOption = (gemstone: Gemstone, option: any, optionType: 'worship' | 'size') => {
    setSelectedProduct(gemstone)
    setShowWorshipModal(null)
    setShowCheckoutForm(true)
  }

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically integrate with payment gateway
    console.log('Checkout Data:', checkoutData)
    console.log('Selected Product:', selectedProduct)
    
    // For now, just show an alert
    alert(`Thank you ${checkoutData.name}! Your order for ${selectedProduct?.name} has been received. You will be redirected to payment gateway.`)
    
    // Reset form
    setCheckoutData({
      name: '',
      mobile: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      alternativeMobile: '',
      specialInstructions: ''
    })
    setShowCheckoutForm(false)
    setSelectedProduct(null)
  }

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
            backgroundImage: "url('/images/ratna-hero.jpg')",
            opacity: 0.9
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-purple-900/80"></div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">💎</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">🌟</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">💍</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">✨</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('ratna.hero.title', 'Gemstone Collection')}</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            {t('ratna.hero.subtitle', 'Natural & Certified Gemstones')}
          </p>
          <p className="text-lg opacity-80 mb-8 max-w-3xl mx-auto">
            {t('ratna.hero.description', 'Pure natural gemstones for planetary benefits and spiritual development')}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span>{t('ratna.hero.features.certified', 'Certified Quality')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🙏</span>
              <span>{t('ratna.hero.features.blessed', 'Blessed by Brahmins')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span>{t('ratna.hero.features.benefits', 'Planetary Benefits')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-orange-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('ratna.search.title', '🔍 Find Your Perfect Gemstone')}</h2>
              <p className="text-gray-600">{t('ratna.search.subtitle', 'Filter by planet, price and category')}</p>
            </div>
            
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-orange-600" />
                  {t('ratna.search.labels.search', 'Search Gemstones')}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder={t('ratna.search.placeholders.search', 'Search gemstone, planet, or benefits...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Gem className="w-4 h-4 mr-2 text-orange-600" />
                  {t('ratna.search.labels.category', 'Category')}
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder={t('ratna.search.placeholders.category', 'Select Category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('ratna.search.options.allCategories', 'All Categories')}</SelectItem>
                    {dynamicCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  💰 {t('ratna.search.labels.priceRange', 'Price Range')}
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder={t('ratna.search.placeholders.priceRange', 'Select Price')} />
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
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  📊 {t('ratna.search.labels.sortBy', 'Sort By')}
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder={t('ratna.search.placeholders.sortBy', 'Sort By')} />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Search className="w-5 h-5 mr-2" />
                  {t('ratna.search.button', 'Search Now')}
                </Button>
              </div>
            </div>
            
            {/* Quick Filter Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="text-sm text-gray-600 mr-4">{t('ratna.search.quickFilters', 'Quick Filters:')}</div>
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors">
                ✨ {t('ratna.search.tags.popular', 'Most Popular')}
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors">
                🏆 {t('ratna.search.tags.premium', 'Premium Gems')}
              </button>
              <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200 transition-colors">
                👑 {t('ratna.search.tags.luxury', 'Luxury Gems')}
              </button>
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors">
                💎 {t('ratna.search.tags.navratna', 'Navratna')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gemstones Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('ratna.collection.title', 'Available Gemstone Collection')}</h2>
            {loading ? (
              <p className="text-gray-600">{t('ratna.collection.loading', 'Loading gemstones...')}</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
            <p className="text-gray-600">{`${filteredGemstones.length} ${t('ratna.collection.count', 'gemstones found')}`}</p>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">{t('ratna.collection.loading', 'Loading gemstones...')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-2 text-red-600">{t('ratna.collection.error.title', 'Failed to Load Gemstones')}</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={fetchGemstones}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {t('ratna.collection.error.retry', 'Try Again')}
              </Button>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedGemstones.map((gemstone) => (
              <Card key={gemstone._id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50">
                {gemstone.premium && (
                  <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                    ✨ {t('ratna.labels.premium', 'Premium')}
                  </Badge>
                )}
                {gemstone.luxury && (
                  <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                    👑 {t('ratna.labels.luxury', 'Luxury')}
                  </Badge>
                )}
                {gemstone.certified && (
                  <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                    ✓ {t('ratna.labels.certified', 'Certified')}
                  </Badge>
                )}
                
                <div className="relative">
                  <img 
                    src={getImageUrl(gemstone)} 
                    alt={gemstone.name}
                    className="w-full h-78 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Hide image and show fallback icon
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback icon when image fails to load */}
                  <div className="w-full h-56 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center hidden">
                    <Gem className="w-16 h-16 text-orange-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-2 p-4">
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center shadow-lg">
                      <span className="mr-1">{gemstone.planetEmoji}</span>
                      {gemstone.planetHindi}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">{gemstone.hindiName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{gemstone.englishName}</p>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{gemstone.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{gemstone.rating}</span>
                      <span className="text-sm text-gray-500">({gemstone.reviews}+)</span>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                      {gemstone.planet}
                    </Badge>
                  </div>

                  {/* Jaap Information */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 px-3 py-2 rounded-lg mb-4 border border-orange-200">
                    <div className="text-xs text-orange-800 font-medium">{t('ratna.labels.worshipFeatures', 'Worship Features:')}</div>
                    <div className="text-sm text-orange-700">
                      📿 {gemstone.jaap} • 🙏 {gemstone.brahmins}
                    </div>
                  </div>
                  
                  {/* Benefits Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {gemstone.benefits.slice(0, 4).map((benefit, index) => (
                      <div key={index} className="text-xs bg-gradient-to-r from-orange-50 to-red-50 text-orange-800 px-3 py-2 rounded-lg text-center font-medium border border-orange-200">
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* Weight and Origin */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="bg-gray-50 px-3 py-2 rounded-lg text-center">
                      <div className="text-xs text-gray-600">{t('ratna.labels.weight', 'Weight')}</div>
                      <div className="font-semibold text-sm">{gemstone.weight}</div>
                    </div>
                    <div className="bg-gray-50 px-3 py-2 rounded-lg text-center">
                      <div className="text-xs text-gray-600">{t('ratna.labels.origin', 'Origin')}</div>
                      <div className="font-semibold text-sm">{gemstone.origin}</div>
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-orange-600">₹{gemstone.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">₹{gemstone.originalPrice.toLocaleString()}</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        {gemstone.discountPercentage || Math.round(((gemstone.originalPrice - gemstone.price) / gemstone.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                  </div>

                  {/* Certification */}
                  {gemstone.certified && (
                    <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded text-center font-medium mb-4">
                      ✓ {t('ratna.labels.certifiedQuality', 'Certified Quality')}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 shadow-lg"
                      disabled={!gemstone.inStock}
                      onClick={() => {
                        if (gemstone.inStock) {
                          setSelectedProduct(gemstone)
                          setShowCheckoutForm(true)
                        }
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {gemstone.inStock ? t('ratna.labels.buyNow', 'Buy Now') : t('ratna.labels.outOfStock', 'Out of Stock')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}

          {!loading && !error && filteredGemstones.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('ratna.collection.empty', 'No gemstones found.')}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("all")
                  setPriceRange("all")
                  setSearchTerm("")
                }}
              >
                {t('ratna.collection.clearFilters', 'Clear Filters')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('ratna.features.title', 'Why Choose Our Gemstones?')}</h2>
            <p className="text-lg text-gray-600">{t('ratna.features.subtitle', 'Authentic and certified gemstone collection')}</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: "✅", title: t('ratna.features.items.certified.title', 'Certified Quality'), desc: t('ratna.features.items.certified.desc', 'All gemstones are certified'), color: "from-green-500 to-emerald-500" },
              { icon: "🌍", title: t('ratna.features.items.natural.title', 'Natural Origin'), desc: t('ratna.features.items.natural.desc', '100% pure natural gemstones'), color: "from-blue-500 to-cyan-500" },
              { icon: "🙏", title: t('ratna.features.items.worship.title', 'Expert Worship'), desc: t('ratna.features.items.worship.desc', 'Mantra chanting by Brahmins'), color: "from-orange-500 to-red-500" },
              { icon: "📱", title: t('ratna.features.items.consultation.title', 'Expert Consultation'), desc: t('ratna.features.items.consultation.desc', 'Free astrological consultation'), color: "from-purple-500 to-pink-500" }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits of Gemstones */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('ratna.benefits.title', 'Benefits of Gemstones')}</h2>
            <p className="text-gray-600">{t('ratna.benefits.subtitle', 'Natural gemstones bring positive changes to your life')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-orange-500">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧘</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t('ratna.benefits.items.spiritual.title', 'Spiritual Benefits')}</h3>
                <p className="text-gray-600">{t('ratna.benefits.items.spiritual.desc', 'Mental peace, meditation focus and spiritual power')}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-red-500">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t('ratna.benefits.items.wealth.title', 'Wealth & Prosperity')}</h3>
                <p className="text-gray-600">{t('ratna.benefits.items.wealth.desc', 'Business success, wealth growth and financial stability')}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-purple-500">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t('ratna.benefits.items.health.title', 'Health Benefits')}</h3>
                <p className="text-gray-600">{t('ratna.benefits.items.health.desc', 'Physical health, mental balance and protection from negativity')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('ratna.cta.title', 'Enhance Your Life with Gemstones')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('ratna.cta.subtitle', 'Get authentic gemstones for planetary benefits')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              {t('ratna.cta.consult', 'Consult Astrologer')}
            </Button>
            <Button variant="outline" className="border-white text-orange-800 px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600">
              {t('ratna.cta.call', 'Call: +91 9773380099')}
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
                🛒 {t('ratna.checkout.title', 'Checkout')} - {selectedProduct.name}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowCheckoutForm(false)
                    setSelectedProduct(null)
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
                <h3 className="font-bold text-lg text-orange-800 mb-2">📋 {t('ratna.checkout.orderSummary', 'Order Summary')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('ratna.checkout.product', 'Product:')}</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('ratna.checkout.planet', 'Planet:')}</span>
                    <span className="font-medium">{selectedProduct.planet}</span>
                  </div>
                      <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t">
                        <span>{t('ratna.checkout.total', 'Total Amount:')}</span>
                    <span>₹{selectedProduct.price.toLocaleString()}</span>
                      </div>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">📝 {t('ratna.checkout.deliveryInfo', 'Delivery Information')}</h3>
                  <p className="text-gray-600">{t('ratna.checkout.deliveryDesc', 'Please fill in your details for delivery')}</p>
                </div>

                {/* Fixed Product Name Field */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <label className="block text-sm font-medium text-orange-800 mb-2">
                    🛍️ {t('ratna.checkout.productName', 'Product Name')}
                  </label>
                  <Input
                    type="text"
                    value={selectedProduct.name}
                    disabled
                    className="border-2 border-orange-200 bg-orange-100 text-orange-800 font-semibold cursor-not-allowed"
                  />
                  <p className="text-xs text-orange-600 mt-1">This field is fixed and cannot be changed</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 {t('ratna.checkout.fullName', 'Full Name *')}
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.name}
                      onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📱 {t('ratna.checkout.mobile', 'Mobile Number *')}
                    </label>
                    <Input
                      type="tel"
                      required
                      value={checkoutData.mobile}
                      onChange={(e) => setCheckoutData({...checkoutData, mobile: e.target.value})}
                      placeholder="Enter mobile number"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📞 {t('ratna.checkout.alternativeMobile', 'Alternative Mobile')}
                    </label>
                    <Input
                      type="tel"
                      value={checkoutData.alternativeMobile}
                      onChange={(e) => setCheckoutData({...checkoutData, alternativeMobile: e.target.value})}
                      placeholder="Alternative number (optional)"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📮 {t('ratna.checkout.pincode', 'PIN Code *')}
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.pincode}
                      onChange={(e) => setCheckoutData({...checkoutData, pincode: e.target.value})}
                      placeholder="PIN Code"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏠 {t('ratna.checkout.address', 'Complete Address *')}
                  </label>
                  <Textarea
                    required
                    value={checkoutData.address}
                    onChange={(e: any) => setCheckoutData({...checkoutData, address: e.target.value})}
                    placeholder="Enter your complete delivery address"
                    className="border-2 border-orange-200 focus:border-orange-400"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏙️ {t('ratna.checkout.city', 'City *')}
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.city}
                      onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})}
                      placeholder="City"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🗺️ {t('ratna.checkout.state', 'State *')}
                    </label>
                    <Input
                      type="text"
                      required
                      value={checkoutData.state}
                      onChange={(e) => setCheckoutData({...checkoutData, state: e.target.value})}
                      placeholder="State"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 {t('ratna.checkout.specialInstructions', 'Special Instructions (Optional)')}
                  </label>
                  <Textarea
                    value={checkoutData.specialInstructions}
                    onChange={(e: any) => setCheckoutData({...checkoutData, specialInstructions: e.target.value})}
                    placeholder="Any special delivery instructions or requests for the worship ceremony"
                    className="border-2 border-orange-200 focus:border-orange-400"
                    rows={2}
                  />
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">📌 {t('ratna.checkout.importantInfo', 'Important Information')}</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• {t('ratna.checkout.freeShipping', 'Free shipping across India')}</p>
                    <p>• {t('ratna.checkout.deliveryTime', 'Delivery within 5-7 working days')}</p>
                    <p>• {t('ratna.checkout.codAvailable', 'COD available (Cash on Delivery)')}</p>
                    <p>• {t('ratna.checkout.certificate', 'Certificate of authenticity included')}</p>
                    <p>• {t('ratna.checkout.videoWorship', 'Video of worship ceremony will be shared on WhatsApp')}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowCheckoutForm(false)
                      setSelectedProduct(null)
                    }}
                  >
                    {t('ratna.checkout.back', '← Back')}
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3"
                  >
                    {t('ratna.checkout.proceedToPayment', '💳 Proceed to Payment')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
