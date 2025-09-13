"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star, ShoppingCart, Heart, Eye, Circle } from "lucide-react"
import { useTranslation } from "@/contexts/TranslationContext"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get full image URL
const getImageUrl = (rudraksha: any): string => {
  // Check multiple possible image field names
  const imagePath = rudraksha.image || rudraksha.imageUrl || rudraksha.imagePath || rudraksha.mediaUrl || rudraksha.thumbnail;
  
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

// TypeScript interfaces
interface WorshipOption {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  silverCap: boolean;
  premium?: boolean;
}

interface Rudraksha {
  id: string | number;
  name: string;
  englishName: string;
  category: string;
  deity: string;
  planet: string;
  image: string;
  description: string;
  benefits: string[];
  size: string;
  origin: string;
  certified: boolean;
  rare: boolean;
  inStock: boolean;
  worshipOptions?: WorshipOption[];
  sizeOptions?: Array<{ size: string; price: number }>;
  iglCertified?: boolean;
  worshipIncluded?: { features: string[] };
  specialFeatures?: string[];
  isActive: boolean;
  createdAt?: string;
}

export default function Rudraksha() {
  const { t, isLoading, locale } = useTranslation()
  
  // Translation context check
  useEffect(() => {
    if (!isLoading) {
      console.log('Translation context ready:', { locale })
      console.log('Hero title test:', t('home.rudraksha.hero.title', 'Rudraksha Collection'))
    }
  }, [isLoading, locale, t])
  
  const [selectedMukhi, setSelectedMukhi] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [selectedWorshipOptions, setSelectedWorshipOptions] = useState({})
  const [selectedSizes, setSelectedSizes] = useState({})
  const [showWorshipModal, setShowWorshipModal] = useState<number | null>(null)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [checkoutData, setCheckoutData] = useState({
    name: '',    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    alternativeMobile: '',
    specialInstructions: ''
  })
  // API State
  const [rudrakshas, setRudrakshas] = useState<Rudraksha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic categories from API data
  const dynamicCategories = Array.from(new Set(rudrakshas.map(r => r.category))).map(cat => ({
    id: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' '),
    english: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')
  }));

  // Use dynamic categories for rudraksha types
  const rudrakshaTypes = [
    { id: "all", name: "All Rudraksha", english: "All Rudraksha" },
    ...dynamicCategories
  ];

  const getLowestPrice = (rudraksha: Rudraksha) => {
    if (rudraksha.worshipOptions && rudraksha.worshipOptions.length > 0) {
      return Math.min(...rudraksha.worshipOptions.map((option) => option.price))
    }
    return 0
  }

  const handleSelectOption = (rudraksha: Rudraksha, option: WorshipOption | { size: string; price: number }, optionType: 'worship' | 'size') => {
    setSelectedProduct({
      ...rudraksha,
      selectedOption: option,
      optionType: optionType
    } as any)
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

  const filteredRudraksha = rudrakshas.filter(rudraksha => {
    // Only show active rudrakshas
    if (!rudraksha.isActive) return false;
    
    if (selectedMukhi !== "all" && rudraksha.category !== selectedMukhi) return false
    if (searchTerm && !rudraksha.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !rudraksha.englishName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rudraksha.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rudraksha.deity.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rudraksha.planet.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rudraksha.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm.toLowerCase()))) return false
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      const lowestPrice = getLowestPrice(rudraksha)
      if (max && (lowestPrice < min || lowestPrice > max)) return false
      if (!max && lowestPrice < min) return false
    }
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return getLowestPrice(a) - getLowestPrice(b)
      case "price-high":
        return getLowestPrice(b) - getLowestPrice(a)
      case "rating":
        return ((b as any).rating || 4.5) - ((a as any).rating || 4.5)
      case "newest":
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      default:
        return ((b as any).reviews || 100) - ((a as any).reviews || 100)
    }
  });

  // Fetch rudrakshas from API
  useEffect(() => {
    fetchRudrakshas();
  }, []);

  const fetchRudrakshas = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/rudraksha/public`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()
      console.log('API Response:', data);
      
      // Debug: Log first rudraksha to see image field
      if (data.rudraksha && data.rudraksha.length > 0) {
        const firstRudraksha = data.rudraksha[0];
        console.log('First rudraksha image field:', firstRudraksha.image);
        console.log('All image-related fields:', {
          image: firstRudraksha.image,
          imageUrl: (firstRudraksha as any).imageUrl,
          imagePath: (firstRudraksha as any).imagePath,
          mediaUrl: (firstRudraksha as any).mediaUrl,
          thumbnail: (firstRudraksha as any).thumbnail
        });
        console.log('First rudraksha full data:', firstRudraksha);
      }
      
      // Handle different response formats
      if (data.success) {
        setRudrakshas(data.rudraksha || data.data || []);
      } else if (data.rudraksha) {
        setRudrakshas(data.rudraksha);
      } else if (data.data) {
        setRudrakshas(data.data);
      } else if (Array.isArray(data)) {
        setRudrakshas(data);
      } else {
        setError(data.message || 'Failed to fetch rudrakshas');
      }
    } catch (error: any) {
      console.error('Error fetching rudrakshas:', error);
      setError(`Failed to load rudrakshas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Show loading state while translations are loading
  if (isLoading) {
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
            backgroundImage: "url('/images/rudraksha-hero.jpg')",
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
          <div className="absolute top-20 right-20 text-4xl opacity-20">📿</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">🌺</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">✨</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('home.rudraksha.hero.title', 'Rudraksha Collection')}</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            {t('home.rudraksha.hero.subtitle', 'Sacred Rudraksha Collection')}
          </p>
          <p className="text-lg opacity-80 mb-8 max-w-3xl mx-auto">
            {t('home.rudraksha.hero.description', "Lord Shiva's divine blessing - Authentic, certified and blessed rudraksha beads with multiple worship options")}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>{t('home.rudraksha.hero.features.certified', 'IGL Certified')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🙏</span>
              <span>{t('home.rudraksha.hero.features.blessed', 'Blessed by Brahmins')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📹</span>
              <span>{t('home.rudraksha.hero.features.video', 'Video Worship Available')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Rudraksha */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('home.rudraksha.about.title', 'Glory of Rudraksha')}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t('home.rudraksha.about.description', 'Rudraksha is considered dear to Lord Shiva. It not only provides spiritual power but is also extremely beneficial for physical and mental health.')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-orange-500">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧘</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t('home.rudraksha.about.benefits.spiritual.title', 'Spiritual Benefits')}</h3>
                <p className="text-gray-600">{t('home.rudraksha.about.benefits.spiritual.description', 'Concentration in meditation, spiritual power, and peace of mind')}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-red-500">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t('home.rudraksha.about.benefits.health.title', 'Health Benefits')}</h3>
                <p className="text-gray-600">{t('home.rudraksha.about.benefits.health.description', 'Blood pressure control, heart health, and stress reduction')}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-purple-500">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t('home.rudraksha.about.benefits.protection.title', 'Protection')}</h3>
                <p className="text-gray-600">{t('home.rudraksha.about.benefits.protection.description', 'Protection from negative energy and positive environment')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

       {/* Rudraksha Grid */}
       <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('home.rudraksha.collection.title', 'Available Rudraksha')}</h2>
            {loading ? (
              <p className="text-gray-600">{t('home.rudraksha.collection.loading', 'Loading rudrakshas...')}</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <p className="text-gray-600">{t('home.rudraksha.collection.count', '{{count}} rudraksha found').replace('{{count}}', filteredRudraksha.length.toString())}</p>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">{t('home.rudraksha.collection.loading', 'Loading rudrakshas...')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-2 text-red-600">{t('home.rudraksha.collection.error.title', 'Failed to Load Rudrakshas')}</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={fetchRudrakshas}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {t('home.rudraksha.collection.error.retry', 'Try Again')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
                             {filteredRudraksha.map((rudraksha) => (
                 <Card key={rudraksha.id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50">
                  {rudraksha.rare && (
                    <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                      ✨ Rare
                    </Badge>
                  )}
                  {rudraksha.certified && (
                    <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                      ✓ Certified
                    </Badge>
                  )}
                  
                  <div className="relative">
                    <img 
                      src={getImageUrl(rudraksha)} 
                      alt={rudraksha.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Hide image and show fallback icon
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('opacity-0', 'pointer-events-none');
                        target.nextElementSibling?.classList.add('opacity-100');
                      }}
                    />
                    {/* Fallback icon when image fails to load */}
                    <div className="w-full h-56 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center opacity-0 pointer-events-none">
                      <Circle className="w-16 h-16 text-orange-500" />
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
                      <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {rudraksha.name.split(' ')[0]} {rudraksha.name.split(' ')[1]}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-xl text-gray-800 mb-1">{rudraksha.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{rudraksha.englishName}</p>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{rudraksha.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2 rounded-lg text-center">
                        <div className="text-xs text-gray-600">Deity</div>
                        <div className="font-semibold text-sm">{rudraksha.deity}</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-2 rounded-lg text-center">
                        <div className="text-xs text-gray-600">Planet</div>
                        <div className="font-semibold text-sm">{rudraksha.planet}</div>
                      </div>
                    </div>
                    
                    {((rudraksha as any).rating || (rudraksha as any).reviews) && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor((rudraksha as any).rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({(rudraksha as any).reviews || 100}+)</span>
                      </div>
                    )}

                    {/* Pricing Section */}
                    <div className="mb-4">
                      {rudraksha.worshipOptions ? (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">Worship Options Available:</div>
                          <div className="text-2xl font-bold text-orange-600">
                            Starting from ₹{Math.min(...rudraksha.worshipOptions.map(o => o.price)).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">4 worship options available</div>
                        </div>
                      ) : rudraksha.sizeOptions ? (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">Size Options Available:</div>
                          <div className="text-2xl font-bold text-orange-600">
                            ₹{Math.min(...rudraksha.sizeOptions.map(o => o.price)).toLocaleString()} - ₹{Math.max(...rudraksha.sizeOptions.map(o => o.price)).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">{rudraksha.sizeOptions.length} sizes available</div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-orange-600">₹{((rudraksha as any).price || 0).toLocaleString()}</span>
                          {(rudraksha as any).originalPrice && (rudraksha as any).originalPrice > (rudraksha as any).price && (
                            <span className="text-sm text-gray-500 line-through">₹{((rudraksha as any).originalPrice).toLocaleString()}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Size and Origin Info */}
                    <div className="space-y-2 mb-4 text-sm">
                      {rudraksha.size && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-medium">{rudraksha.size}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Origin:</span>
                        <span className="font-medium">{rudraksha.origin}</span>
                      </div>
                      {rudraksha.iglCertified && (
                        <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded text-center font-medium">
                          IGL Laboratory Certified
                        </div>
                      )}
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {rudraksha.benefits.slice(0, 4).map((benefit, index) => (
                        <div key={index} className="text-xs bg-gradient-to-r from-orange-50 to-red-50 text-orange-800 px-3 py-2 rounded-lg text-center font-medium border border-orange-200">
                          {benefit}
                        </div>
                      ))}
                    </div>

                    {/* Worship Options or Size Options */}
                    {rudraksha.worshipOptions ? (
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{t('home.rudraksha.worshipOptions.title', 'Worship & Blessing Options')}</h3>
                          <p className="text-sm text-gray-600">{t('home.rudraksha.worshipOptions.subtitle', 'Choose the level of spiritual preparation')}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {rudraksha.worshipOptions.map((option, index) => (
                            <Card key={option.id} className={`relative overflow-hidden border-2 transition-all cursor-pointer hover:shadow-lg h-full ${option.premium ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 hover:border-orange-400'}`}>
                              {option.premium && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-bl-lg text-xs font-semibold">
                                  {t('home.rudraksha.worshipOptions.premium', 'Premium')}
                                </div>
                              )}
                              <CardContent className="p-4 h-full flex flex-col">
                                <div className="text-center mb-3">
                                  <div className="text-2xl mb-2">
                                    {index === 0 ? '🙏' : index === 1 ? '📿' : index === 2 ? '🔥' : '👑'}
                                  </div>
                                  <h4 className="font-bold text-md text-gray-800 mb-1">{option.name}</h4>
                                  <p className="text-xs text-gray-600 mb-2">{option.description}</p>
                                  <div className="text-xl font-bold text-orange-600 mb-2">
                                    ₹{option.price.toLocaleString()}
                                  </div>
                                  {option.silverCap && (
                                    <Badge className="bg-gray-100 text-gray-700 text-xs">Silver Cap Included</Badge>
                                  )}
                                </div>
                                <div className="space-y-1 mb-3 flex-grow">
                                  <div className="font-medium text-xs text-gray-700">Includes:</div>
                                  {option.features.slice(0, 2).map((feature, idx) => (
                                    <div key={idx} className="flex items-center text-xs text-gray-600">
                                      <span className="text-green-500 mr-1">✓</span>
                                      {feature}
                                    </div>
                                  ))}
                                  {option.features.length > 2 && (
                                    <div className="text-xs text-gray-500">+ {option.features.length - 2} more features</div>
                                  )}
                                </div>
                                <div className="mt-auto">
                                  <Button 
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm py-2"
                                    onClick={() => handleSelectOption(rudraksha, option, 'worship')}
                                  >
                                    <ShoppingCart className="w-3 h-3 mr-1" />
                                    {t('home.rudraksha.worshipOptions.selectOption', 'Select Option')}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : rudraksha.sizeOptions ? (
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{t('home.rudraksha.sizeOptions.title', 'Size Options Available')}</h3>
                          <p className="text-sm text-gray-600">{t('home.rudraksha.sizeOptions.subtitle', 'All sizes come with complete worship and IGL certification')}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {rudraksha.sizeOptions.map((option, index) => (
                            <Card key={index} className="border-2 border-gray-200 hover:border-orange-400 transition-all cursor-pointer hover:shadow-lg h-full">
                              <CardContent className="p-3 text-center h-full flex flex-col">
                                <div className="text-xl mb-2">📐</div>
                                <div className="font-bold text-sm text-gray-800 mb-1">{option.size}</div>
                                <div className="text-lg font-bold text-orange-600 mb-3 flex-grow">
                                  ₹{option.price.toLocaleString()}
                                </div>
                                <div className="mt-auto">
                                  <Button 
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-xs py-1"
                                    onClick={() => handleSelectOption(rudraksha, option, 'size')}
                                  >
                                    {t('home.rudraksha.sizeOptions.selectSize')}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      ) : (
                        <Button 
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 shadow-lg"
                          disabled={!(rudraksha as any).inStock}
                          onClick={() => {
                            if ((rudraksha as any).inStock) {
                              setSelectedProduct({
                                ...(rudraksha as any),
                                selectedOption: { price: (rudraksha as any).price || 0 },
                                optionType: 'direct'
                              })
                              setShowCheckoutForm(true)
                            }
                          }}
                        >
                          {!(rudraksha as any).inStock ? (
                            t('home.rudraksha.outOfStock')
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              {t('home.rudraksha.buyNow')}
                            </>
                          )}
                        </Button>
                      )}
                    
                    {/* Special Features for Premium Items */}
                    {(rudraksha.worshipIncluded?.features || rudraksha.specialFeatures) && (
                      <div className="mt-4">
                        <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg border border-blue-200">
                          <div className="font-bold text-sm mb-2">✨ Premium Features Included:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(rudraksha.worshipIncluded?.features || rudraksha.specialFeatures)?.map((feature: string, index: number) => (
                              <div key={index} className="flex items-center text-xs">
                                <span className="text-blue-500 mr-1">•</span>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredRudraksha.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('home.rudraksha.collection.empty')}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedMukhi("all")
                  setPriceRange("all")
                  setSearchTerm("")
                }}
              >
                {t('home.rudraksha.collection.clearFilters')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Individual Rudraksha Boxes */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('home.rudraksha.completeCollection.title', 'Complete Rudraksha Collection')}
            </h2>
            <p className="text-lg text-gray-600">{t('home.rudraksha.completeCollection.subtitle', '1 Mukhi to 14 Mukhi - Detailed Information')}</p>
          </div>

          {/* 1 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-orange-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🕉️</span>
                  {t('home.rudraksha.completeCollection.mukhi1.title', '1 Mukhi Rudraksha - Complete Information')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-3">{t('home.rudraksha.completeCollection.mukhi1.primaryDetails.title', 'Primary Details')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.primaryDetails.deity', 'Deity: Lord Shiva - Supreme Brahman')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.primaryDetails.mukhi', 'Mukhi: Only one natural face')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.primaryDetails.rarity', 'Most rare and sacred')}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">{t('home.rudraksha.completeCollection.mukhi1.spiritualBenefits.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.spiritualBenefits.selfKnowledge')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.spiritualBenefits.egoRemoval')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.spiritualBenefits.mentalBalance')}</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">{t('home.rudraksha.completeCollection.mukhi1.healthBenefits.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.healthBenefits.stressRelief')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.healthBenefits.heartHealth')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.healthBenefits.wellness')}</p>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">{t('home.rudraksha.completeCollection.mukhi1.businessLeadership.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.businessLeadership.obstacleRemoval')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.businessLeadership.decisionMaking')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.businessLeadership.leadership')}</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">{t('home.rudraksha.completeCollection.mukhi1.planetaryEffects.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.planetaryEffects.sunConnection')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.planetaryEffects.chakraActivation')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi1.planetaryEffects.awareness')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-pink-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">💑</span>
                  {t('home.rudraksha.completeCollection.mukhi2.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-pink-50 p-6 rounded-lg">
                    <h4 className="font-bold text-pink-800 mb-3">{t('home.rudraksha.completeCollection.mukhi2.formSymbol.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi2.formSymbol.shivaParvati')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi2.formSymbol.unity')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi2.formSymbol.ardhanarishwar')}</p>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">{t('home.rudraksha.completeCollection.mukhi2.religiousImportance.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi2.religiousImportance.marriageHarmony')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi2.religiousImportance.blessing')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi2.religiousImportance.disputeRemoval')}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">{t('home.rudraksha.completeCollection.mukhi2.planetaryEffects.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi2.planetaryEffects.moonControl')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi2.planetaryEffects.chandraDosha')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi2.planetaryEffects.mentalStability')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-red-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-red-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🔥</span>
                  {t('home.rudraksha.completeCollection.mukhi3.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">{t('home.rudraksha.completeCollection.mukhi3.formSymbol.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi3.formSymbol.agniDev')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi3.formSymbol.sinDestroyer')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi3.formSymbol.newBeginnings')}</p>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-3">{t('home.rudraksha.completeCollection.mukhi3.planetaryEffects.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi3.planetaryEffects.marsControl')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi3.planetaryEffects.mangalDosha')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi3.planetaryEffects.diseaseRelief')}</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">{t('home.rudraksha.completeCollection.mukhi3.businessBenefits.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi3.businessBenefits.newBusiness')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi3.businessBenefits.successConversion')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi3.businessBenefits.promotion')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 4 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-yellow-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-yellow-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">📚</span>
                  {t('home.rudraksha.completeCollection.mukhi4.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">{t('home.rudraksha.completeCollection.mukhi4.knowledgeWisdom.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi4.knowledgeWisdom.brahmaSymbol')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi4.knowledgeWisdom.knowledgeGiver')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi4.knowledgeWisdom.sweetSpeech')}</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">{t('home.rudraksha.completeCollection.mukhi4.mercuryEffects.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi4.mercuryEffects.mercuryFactor')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi4.mercuryEffects.speechDefects')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi4.mercuryEffects.educationObstacles')}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">{t('home.rudraksha.completeCollection.mukhi4.suitableFor.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi4.suitableFor.students')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi4.suitableFor.professionals')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi4.suitableFor.memoryPower')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 5 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-orange-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🕉️</span>
                  {t('home.rudraksha.completeCollection.mukhi5.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-3">{t('home.rudraksha.completeCollection.mukhi5.siddhiProvider.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi5.siddhiProvider.mostCommon')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi5.siddhiProvider.sinDestroyer')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi5.siddhiProvider.peaceBalance')}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">{t('home.rudraksha.completeCollection.mukhi5.jupiterEffects.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi5.jupiterEffects.jupiterFactor')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi5.jupiterEffects.knowledgeIncrease')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi5.jupiterEffects.spiritualClarity')}</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">{t('home.rudraksha.completeCollection.mukhi5.healthBenefits.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi5.healthBenefits.bloodPressure')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi5.healthBenefits.diabetes')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi5.healthBenefits.meditation')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 6 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-pink-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">⚔️</span>
                  {t('home.rudraksha.completeCollection.mukhi6.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-pink-50 p-6 rounded-lg">
                    <h4 className="font-bold text-pink-800 mb-3">{t('home.rudraksha.completeCollection.mukhi6.courageAttraction.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi6.courageAttraction.kartikeyaSymbol')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi6.courageAttraction.courageStrength')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi6.courageAttraction.sweetSpeech')}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">{t('home.rudraksha.completeCollection.mukhi6.venusEffects.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi6.venusEffects.venusRelated')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi6.venusEffects.marriageDelay')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi6.venusEffects.loveIncrease')}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">{t('home.rudraksha.completeCollection.mukhi6.forArtists.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi6.forArtists.professionals')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi6.forArtists.businessAttraction')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi6.forArtists.popularity')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 7 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-green-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">💰</span>
                  {t('home.rudraksha.completeCollection.mukhi7.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">{t('home.rudraksha.completeCollection.mukhi7.wealthProsperity.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi7.wealthProsperity.mahalakshmiSymbol')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi7.wealthProsperity.povertyRemoval')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi7.wealthProsperity.saptarishiBlessing')}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">{t('home.rudraksha.completeCollection.mukhi7.saturnPeace.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi7.saturnPeace.saturnRelated')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi7.saturnPeace.debtRemoval')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi7.saturnPeace.sadeSatiRelief')}</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">{t('home.rudraksha.completeCollection.mukhi7.businessSuccess.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi7.businessSuccess.businessStability')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi7.businessSuccess.continuousProfit')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi7.businessSuccess.financialFreedom')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 8 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-red-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-red-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🐘</span>
                  {t('home.rudraksha.completeCollection.mukhi8.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">{t('home.rudraksha.completeCollection.mukhi8.obstacleRemoval.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi8.obstacleRemoval.ganeshSymbol')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi8.obstacleRemoval.allObstacles')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi8.obstacleRemoval.newBeginnings')}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">{t('home.rudraksha.completeCollection.mukhi8.rahuDoshaRemoval.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi8.rahuDoshaRemoval.rahuMaster')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi8.rahuDoshaRemoval.kalsarpDosha')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi8.rahuDoshaRemoval.mentalStress')}</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">{t('home.rudraksha.completeCollection.mukhi8.forStartups.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi8.forStartups.newPlans')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi8.forStartups.failureRelief')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi8.forStartups.leadership')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 9 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-pink-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">⚔️</span>
                  {t('home.rudraksha.completeCollection.mukhi9.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-pink-50 p-6 rounded-lg">
                    <h4 className="font-bold text-pink-800 mb-3">{t('home.rudraksha.completeCollection.mukhi9.strengthCourage.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi9.strengthCourage.navdurgaSymbol')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi9.strengthCourage.immenseStrength')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi9.strengthCourage.negativeProtection')}</p>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">{t('home.rudraksha.completeCollection.mukhi9.diseaseRelief.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi9.diseaseRelief.marsControl')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi9.diseaseRelief.chronicDiseases')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi9.diseaseRelief.mentalInstability')}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">{t('home.rudraksha.completeCollection.mukhi9.protectionVictory.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi9.protectionVictory.enemyVictory')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi9.protectionVictory.dangerProtection')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi9.protectionVictory.fearlessness')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 10 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-blue-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🌟</span>
                  {t('home.rudraksha.completeCollection.mukhi10.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">{t('home.rudraksha.completeCollection.mukhi10.divineProtection.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi10.divineProtection.vishnuForm')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi10.divineProtection.tenDirections')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi10.divineProtection.negativeShield')}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">{t('home.rudraksha.completeCollection.mukhi10.blackMagicRelief.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi10.blackMagicRelief.blackMagicRemoval')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi10.blackMagicRelief.evilEyeProtection')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi10.blackMagicRelief.fearElimination')}</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">{t('home.rudraksha.completeCollection.mukhi10.courageFearlessness.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi10.courageFearlessness.immenseCourage')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi10.courageFearlessness.allFearsRemoval')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi10.courageFearlessness.mentalStability')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 11 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-orange-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">🔱</span>
                  {t('home.rudraksha.completeCollection.mukhi11.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-3">{t('home.rudraksha.completeCollection.mukhi11.leadershipVictory.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi11.leadershipVictory.elevenRudra')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi11.leadershipVictory.leadershipQualities')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi11.leadershipVictory.allEndeavors')}</p>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">{t('home.rudraksha.completeCollection.mukhi11.hanumanBlessing.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi11.hanumanBlessing.hanumanSpecial')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi11.hanumanBlessing.courageFear')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi11.hanumanBlessing.politicsSuccess')}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">{t('home.rudraksha.completeCollection.mukhi11.spiritualProgress.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi11.spiritualProgress.spiritualGrowth')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi11.spiritualProgress.longevityHealth')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi11.spiritualProgress.legalMatters')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 12 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-yellow-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-yellow-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">☀️</span>
                  {t('home.rudraksha.completeCollection.mukhi12.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">{t('home.rudraksha.completeCollection.mukhi12.energyBrilliance.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi12.energyBrilliance.sunEnergy')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi12.energyBrilliance.personalRadiance')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi12.energyBrilliance.vitalityStrength')}</p>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-3">{t('home.rudraksha.completeCollection.mukhi12.administrativeSuccess.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi12.administrativeSuccess.governmentJobs')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi12.administrativeSuccess.administrationLeadership')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi12.administrativeSuccess.authorityRespect')}</p>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3">{t('home.rudraksha.completeCollection.mukhi12.victoryOverEnemies.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi12.victoryOverEnemies.enemyDefeat')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi12.victoryOverEnemies.conspiracyProtection')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi12.victoryOverEnemies.confidenceCourage')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 13 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-purple-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">💘</span>
                  {t('home.rudraksha.completeCollection.mukhi13.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">{t('home.rudraksha.completeCollection.mukhi13.attractionPower.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi13.attractionPower.kamdevShiva')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi13.attractionPower.personalMagnetism')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi13.attractionPower.successProsperity')}</p>
                  </div>
                  
                  <div className="bg-pink-50 p-6 rounded-lg">
                    <h4 className="font-bold text-pink-800 mb-3">{t('home.rudraksha.completeCollection.mukhi13.beautyProsperity.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi13.beautyProsperity.physicalBeauty')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi13.beautyProsperity.materialProsperity')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi13.beautyProsperity.artsSuccess')}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">{t('home.rudraksha.completeCollection.mukhi13.materialSuccess.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi13.materialSuccess.businessPolitics')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi13.materialSuccess.mediaFilm')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi13.materialSuccess.publicRelations')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 14 Mukhi Rudraksha */}
          <div className="mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-indigo-700 mb-8 flex items-center justify-center">
                  <span className="text-4xl mr-4">👁️</span>
                  {t('home.rudraksha.completeCollection.mukhi14.title')}
                </h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h4 className="font-bold text-indigo-800 mb-3">{t('home.rudraksha.completeCollection.mukhi14.divineVision.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi14.divineVision.thirdEyePower')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi14.divineVision.intuitionForesight')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi14.divineVision.divineKnowledge')}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-3">{t('home.rudraksha.completeCollection.mukhi14.royalYogaLeadership.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi14.royalYogaLeadership.rajaYoga')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi14.royalYogaLeadership.exceptionalLeadership')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi14.royalYogaLeadership.highPositions')}</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">{t('home.rudraksha.completeCollection.mukhi14.devmaniStatus.title')}</h4>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi14.devmaniStatus.devmaniScriptures')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi14.devmaniStatus.extremelyRare')}</p>
                    <p className="text-gray-700 text-sm">• {t('home.rudraksha.completeCollection.mukhi14.devmaniStatus.spiritualMaterial')}</p>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-l-4 border-indigo-400">
                  <h4 className="font-bold text-indigo-800 mb-3">{t('home.rudraksha.completeCollection.mukhi14.specialFeatures.title')}</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-indigo-700">
                    <div>• {t('home.rudraksha.completeCollection.mukhi14.specialFeatures.sevenBrahmins')}</div>
                    <div>• {t('home.rudraksha.completeCollection.mukhi14.specialFeatures.mahamrityunjaya')}</div>
                    <div>• {t('home.rudraksha.completeCollection.mukhi14.specialFeatures.rudrashtadhyayi')}</div>
                    <div>• {t('home.rudraksha.completeCollection.mukhi14.specialFeatures.highestSignificance')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      {/* <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-orange-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">🔍 Find Your Perfect Rudraksha</h2>
              <p className="text-gray-600">Filter by Mukhi type, price range, and more</p>
            </div>
            
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-orange-600" />
                  Search Rudraksha
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by name, deity, planet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Circle className="w-4 h-4 mr-2 text-orange-600" />
                  Mukhi Type
                </label>
                <Select value={selectedMukhi} onValueChange={setSelectedMukhi}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder="Select Mukhi" />
                  </SelectTrigger>
                  <SelectContent>
                    {rudrakshaTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  💰 Price Range
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder="Select Price" />
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
                  📊 Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder="Sort By" />
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
                  Search Now
                </Button>
              </div>
            </div>
            
            {/* Quick Filter Tags 
            <div className="flex flex-wrap justify-center gap-3">
              <div className="text-sm text-gray-600 mr-4">Quick Filters:</div>
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors">
                ✨ Most Popular
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors">
                🏆 IGL Certified
              </button>
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors">
                👑 Premium Collection
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors">
                💎 Rare Finds
              </button>
          </div>
        </div>
          </div>
      </section> */}

     

      {/* Consultation CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('home.rudraksha.consultation.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('home.rudraksha.consultation.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100">
              {t('home.rudraksha.consultation.consultAstrologer')}
                    </Button>
            <Button variant="outline" className="border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600">
              {t('home.rudraksha.consultation.call')}
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
                {t('home.rudraksha.checkout.title').replace('{{productName}}', selectedProduct.name)}
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
                <h3 className="font-bold text-lg text-orange-800 mb-2">{t('home.rudraksha.checkout.orderSummary')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('home.rudraksha.checkout.product')}</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('home.rudraksha.checkout.deity')}</span>
                    <span className="font-medium">{selectedProduct.deity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('home.rudraksha.checkout.planet')}</span>
                    <span className="font-medium">{selectedProduct.planet}</span>
                  </div>
                  {selectedProduct.selectedOption && (
                    <>
                      {selectedProduct.optionType !== 'direct' && (
                        <div className="flex justify-between">
                          <span>{selectedProduct.optionType === 'worship' ? t('home.rudraksha.checkout.worshipOption') : t('home.rudraksha.checkout.size')}</span>
                          <span className="font-medium">
                            {selectedProduct.optionType === 'worship' 
                              ? selectedProduct.selectedOption.name 
                              : selectedProduct.selectedOption.size}
                          </span>
            </div>
          )}
                      <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t">
                        <span>{t('home.rudraksha.checkout.totalAmount')}</span>
                        <span>₹{selectedProduct.selectedOption.price.toLocaleString()}</span>
        </div>
                    </>
                  )}
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{t('home.rudraksha.checkout.deliveryInfo')}</h3>
                  <p className="text-gray-600">{t('home.rudraksha.checkout.deliveryDesc')}</p>
                </div>

                {/* Fixed Product Name Field */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <label className="block text-sm font-medium text-orange-800 mb-2">
                    {t('home.rudraksha.checkout.productName')}
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
                      {t('home.rudraksha.checkout.fullName')}
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
                  
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      value={checkoutData.email}
                      onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div> */}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('home.rudraksha.checkout.mobile')}
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('home.rudraksha.checkout.alternativeMobile')}
                    </label>
                    <Input
                      type="tel"
                      value={checkoutData.alternativeMobile}
                      onChange={(e) => setCheckoutData({...checkoutData, alternativeMobile: e.target.value})}
                      placeholder="Alternative number (optional)"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('home.rudraksha.checkout.address')}
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

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('home.rudraksha.checkout.city')}
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
                      {t('home.rudraksha.checkout.state')}
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('home.rudraksha.checkout.pincode')}
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
                    {t('home.rudraksha.checkout.specialInstructions')}
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
                  <h4 className="font-bold text-blue-800 mb-2">{t('home.rudraksha.checkout.importantInfo')}</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• {t('home.rudraksha.checkout.freeShipping')}</p>
                    <p>• {t('home.rudraksha.checkout.deliveryTime')}</p>
                    <p>• {t('home.rudraksha.checkout.codAvailable')}</p>
                    <p>• {t('home.rudraksha.checkout.certificate')}</p>
                    <p>• {t('home.rudraksha.checkout.videoWorship')}</p>
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
                    {t('home.rudraksha.checkout.back')}
            </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3"
                  >
                    {t('home.rudraksha.checkout.proceedToPayment')}
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
