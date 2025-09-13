"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/contexts/TranslationContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, Play, BookOpen, Star, Search, Filter, Loader2, Brain } from "lucide-react"
import Image from "next/image"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get image URL
const getImageUrl = (sadhana: any): string => {
  if (!sadhana || !sadhana.image) return '/placeholder.jpg';
  
  // If it's already a full URL, return as is
  if (sadhana.image.startsWith('http://') || sadhana.image.startsWith('https://')) {
    return sadhana.image;
  }
  
  // If it starts with /, it's a relative path
  if (sadhana.image.startsWith('/')) {
    return `${API_BASE_URL}${sadhana.image}`;
  }
  
  // Otherwise, assume it's a filename and construct the full path
  return `${API_BASE_URL}/uploads/${sadhana.image}`;
};

// Interface matching MongoDB schema
interface Sadhana {
  _id: string;
  name: string;
  englishName: string;
  duration: string;
  icon: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  process: string[];
  benefits: string[];
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  deity: string;
  inStock: boolean;
  isActive: boolean;
  discountPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export default function Sadhana() {
  const { t, isLoading: translationLoading } = useTranslation()
  
  // API State
  const [sadhanas, setSadhanas] = useState<Sadhana[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularity");

  // Fetch sadhanas from API
  useEffect(() => {
    fetchSadhanas();
  }, []);

  const fetchSadhanas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try multiple endpoints
      const endpoints = [
        `${API_BASE_URL}/api/sadhana/public`,
        `${API_BASE_URL}/api/sadhana/all`,
        `${API_BASE_URL}/api/sadhana/admin/all`
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
      let sadhanasData: Sadhana[] = [];
      if (data.success && data.data) {
        sadhanasData = Array.isArray(data.data) ? data.data : [];
      } else if (data.sadhanas) {
        sadhanasData = Array.isArray(data.sadhanas) ? data.sadhanas : [];
      } else if (data.sadhana) {
        sadhanasData = Array.isArray(data.sadhana) ? data.sadhana : [];
      } else if (Array.isArray(data)) {
        sadhanasData = data;
      } else {
        throw new Error('Unexpected response format');
      }
      
      setSadhanas(sadhanasData);
    } catch (err: any) {
      console.error('Error fetching sadhanas:', err);
      setError(`Failed to load sadhanas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic categories and levels from API data
  const categories = Array.from(new Set(sadhanas.map(s => s.category)));
  const levels = Array.from(new Set(sadhanas.map(s => s.level)));

  const filteredSadhanas = sadhanas.filter(sadhana => {
    // Only show active sadhanas
    if (!sadhana.isActive) return false;
    
    const matchesCategory = selectedCategory === "all" || sadhana.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || sadhana.level === selectedLevel;
    const matchesSearch = sadhana.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sadhana.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sadhana.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sadhana.deity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sadhana.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const sortedSadhanas = [...filteredSadhanas].sort((a, b) => {
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
            backgroundImage: "url('/images/sadhana-hero.jpg')",
            opacity: 0.9
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-purple-900/80"></div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">🧘</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">🙏</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">✨</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">🌟</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('sadhana.hero.title', 'Sadhana Programs')}</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            {t('sadhana.hero.subtitle', 'Spiritual Sadhana Programs')}
          </p>
          <p className="text-lg opacity-80 mb-8">
            {t('sadhana.hero.description', 'Journey of spiritual progress and life transformation')}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧘</span>
              <span>{t('sadhana.hero.features.dailyPractice', 'Daily Practice')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🙏</span>
              <span>{t('sadhana.hero.features.expertGuidance', 'Expert Guidance')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span>{t('sadhana.hero.features.lifeTransformation', 'Life Transformation')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is Sadhana */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('sadhana.whatIsSadhana.title', 'What is Sadhana?')}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              {t('sadhana.whatIsSadhana.description', 'Sadhana means continuous practice. It is a systematic method of spiritual development that leads individuals to higher consciousness through mantra chanting, meditation, and devotion.')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🧘", title: t('sadhana.whatIsSadhana.items.meditation.title', 'Meditation'), desc: t('sadhana.whatIsSadhana.items.meditation.desc', 'Deep meditation for inner peace') },
              { icon: "📿", title: t('sadhana.whatIsSadhana.items.mantraJaap.title', 'Mantra Jaap'), desc: t('sadhana.whatIsSadhana.items.mantraJaap.desc', 'Sacred mantra chanting') },
              { icon: "🕉️", title: t('sadhana.whatIsSadhana.items.devotion.title', 'Devotion'), desc: t('sadhana.whatIsSadhana.items.devotion.desc', 'Pure devotion and surrender') }
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

      {/* Search and Filter Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-orange-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('sadhana.search.title', '🔍 Find Your Perfect Sadhana')}</h2>
              <p className="text-gray-600">{t('sadhana.search.subtitle', 'Filter by category, level and search')}</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-orange-600" />
                  {t('sadhana.search.labels.search', 'Search Sadhanas')}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder={t('sadhana.search.placeholders.search', 'Search sadhana, deity, or category...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-orange-600" />
                  {t('sadhana.search.labels.category', 'Category')}
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder={t('sadhana.search.placeholders.category', 'Select Category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('sadhana.search.options.allCategories', 'All Categories')}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  📊 {t('sadhana.search.labels.level', 'Level')}
                </label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder={t('sadhana.search.placeholders.level', 'Select Level')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('sadhana.search.options.allLevels', 'All Levels')}</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  📊 {t('sadhana.search.labels.sortBy', 'Sort By')}
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                    <SelectValue placeholder={t('sadhana.search.placeholders.sortBy', 'Sort By')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">{t('sadhana.search.sortOptions.popularity', 'Most Popular')}</SelectItem>
                    <SelectItem value="price-low">{t('sadhana.search.sortOptions.priceLow', 'Price: Low to High')}</SelectItem>
                    <SelectItem value="price-high">{t('sadhana.search.sortOptions.priceHigh', 'Price: High to Low')}</SelectItem>
                    <SelectItem value="rating">{t('sadhana.search.sortOptions.rating', 'Highest Rated')}</SelectItem>
                    <SelectItem value="newest">{t('sadhana.search.sortOptions.newest', 'Newest First')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sadhana Programs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('sadhana.collection.title', 'Available Sadhana Programs')}</h2>
            {loading ? (
              <p className="text-gray-600">{t('sadhana.collection.loading', 'Loading sadhanas...')}</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <p className="text-gray-600">{t('sadhana.collection.count', `${filteredSadhanas.length} sadhanas found`)}</p>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">{t('sadhana.collection.loading', 'Loading sadhanas...')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-2 text-red-600">{t('sadhana.collection.error.title', 'Failed to Load Sadhanas')}</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={fetchSadhanas}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {t('sadhana.collection.error.retry', 'Try Again')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sortedSadhanas.map((sadhana) => (
                <Card key={sadhana._id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50">
                  <div className="relative">
                    <Image 
                      src={getImageUrl(sadhana)} 
                      alt={sadhana.name}
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
                        {sadhana.level}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{sadhana.rating || 4.5}</span>
                      </div>
                    </div>
          </div>
          
                <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-xl text-gray-800 mb-1">{sadhana.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{sadhana.englishName}</p>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{sadhana.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{sadhana.rating || 4.5}</span>
                        <span className="text-sm text-gray-500">({sadhana.reviews || 0}+)</span>
                    </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                        {sadhana.category}
                      </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="text-gray-700 font-medium">{t('sadhana.labels.duration', 'Duration')}: {sadhana.duration}</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="text-gray-700 font-medium">{t('sadhana.labels.deity', 'Deity')}: {sadhana.deity}</span>
                    </div>
                  </div>
                  
                    {/* Process */}
                    {sadhana.process && sadhana.process.length > 0 && (
                  <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-orange-600 text-sm">🔹 {t('sadhana.labels.process', 'Process:')}</h4>
                        <ul className="space-y-1 text-xs text-gray-600">
                          {sadhana.process.slice(0, 2).map((item, index) => {
                            // Parse malformed JSON strings and handle \n characters
                            const parseItem = (item: any): string[] => {
                              if (typeof item === 'string') {
                                // Remove JSON brackets and quotes
                                let cleanItem = item.replace(/^\["|"\]$/g, '').replace(/^"|"$/g, '');
                                
                                if (item.startsWith('[')) {
                                  try {
                                    const parsed = JSON.parse(item);
                                    if (Array.isArray(parsed)) {
                                      return parsed.flatMap(p => {
                                        if (typeof p === 'string') {
                                          return p.split('\\n').map(line => 
                                            line.replace(/^"|"$/g, '').trim()
                                          ).filter(line => line);
                                        }
                                        return [p];
                                      });
                                    }
                                  } catch {
                                    // If JSON parsing fails, clean the string manually
                                    cleanItem = item.replace(/^\["|"\]$/g, '').replace(/^"|"$/g, '');
                                  }
                                }
                                
                                // Split by \n and clean each line
                                return cleanItem.split('\\n').map(line => 
                                  line.replace(/^"|"$/g, '').trim()
                                ).filter(line => line);
                              }
                              return [item];
                            };
                            
                            const parsedItems = parseItem(item);
                            return parsedItems.slice(0, 2).map((parsedItem, subIndex) => (
                              <li key={`${index}-${subIndex}`} className="flex items-start space-x-2">
                          <span className="text-orange-500 mt-1">•</span>
                                <span className="line-clamp-2">{parsedItem}</span>
                        </li>
                            ));
                          })}
                          {sadhana.process.length > 2 && (
                            <li className="text-orange-500 text-xs">+{sadhana.process.length - 2} more steps</li>
                          )}
                    </ul>
                  </div>
                    )}
                  
                    {/* Benefits */}
                    {sadhana.benefits && sadhana.benefits.length > 0 && (
                  <div className="mb-6">
                        <h4 className="font-semibold mb-2 text-green-600 text-sm">🔹 {t('sadhana.labels.benefits', 'Benefits:')}</h4>
                        <ul className="space-y-1 text-xs text-gray-600">
                          {sadhana.benefits.slice(0, 2).map((benefit, index) => {
                            // Parse malformed JSON strings and handle \n characters
                            const parseItem = (item: any): string[] => {
                              if (typeof item === 'string') {
                                // Remove JSON brackets and quotes
                                let cleanItem = item.replace(/^\["|"\]$/g, '').replace(/^"|"$/g, '');
                                
                                if (item.startsWith('[')) {
                                  try {
                                    const parsed = JSON.parse(item);
                                    if (Array.isArray(parsed)) {
                                      return parsed.flatMap(p => {
                                        if (typeof p === 'string') {
                                          return p.split('\\n').map(line => 
                                            line.replace(/^"|"$/g, '').trim()
                                          ).filter(line => line);
                                        }
                                        return [p];
                                      });
                                    }
                                  } catch {
                                    // If JSON parsing fails, clean the string manually
                                    cleanItem = item.replace(/^\["|"\]$/g, '').replace(/^"|"$/g, '');
                                  }
                                }
                                
                                // Split by \n and clean each line
                                return cleanItem.split('\\n').map(line => 
                                  line.replace(/^"|"$/g, '').trim()
                                ).filter(line => line);
                              }
                              return [item];
                            };
                            
                            const parsedItems = parseItem(benefit);
                            return parsedItems.slice(0, 2).map((parsedItem, subIndex) => (
                              <li key={`${index}-${subIndex}`} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                                <span className="line-clamp-2">{parsedItem}</span>
                        </li>
                            ));
                          })}
                          {sadhana.benefits.length > 2 && (
                            <li className="text-green-500 text-xs">+{sadhana.benefits.length - 2} more benefits</li>
                          )}
                    </ul>
                      </div>
                    )}
                    
                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-orange-600">₹{sadhana.price.toLocaleString()}</span>
                          {sadhana.originalPrice > sadhana.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">₹{sadhana.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        {sadhana.originalPrice > sadhana.price && (
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            {sadhana.discountPercentage || Math.round(((sadhana.originalPrice - sadhana.price) / sadhana.originalPrice) * 100)}% OFF
                          </Badge>
                        )}
                      </div>
                  </div>
                  
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      disabled={!sadhana.inStock}
                    >
                      {sadhana.inStock ? t('sadhana.labels.joinProgram', 'Join Sadhana Program') : t('sadhana.labels.outOfStock', 'Out of Stock')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          )}

          {!loading && !error && filteredSadhanas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('sadhana.collection.empty', 'No sadhanas found.')}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                  setSearchTerm("");
                }}
              >
                {t('sadhana.collection.clearFilters', 'Clear Filters')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600">Special sadhana events and celebrations</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('sadhana.features.title', 'Why Choose Our Sadhana Programs?')}</h2>
            <p className="text-lg text-gray-600">{t('sadhana.features.subtitle', 'Authentic spiritual guidance and support')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "👨‍🏫", title: t('sadhana.features.items.expertGuidance.title', 'Expert Guidance'), desc: t('sadhana.features.items.expertGuidance.desc', 'Experienced spiritual teachers') },
              { icon: "📱", title: t('sadhana.features.items.onlineSupport.title', 'Online Support'), desc: t('sadhana.features.items.onlineSupport.desc', '24/7 guidance and support') },
              { icon: "🏠", title: t('sadhana.features.items.homePractice.title', 'Home Practice'), desc: t('sadhana.features.items.homePractice.desc', 'Practice from your home') }
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
      {/* <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Spiritual Journey Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Transform your life through authentic spiritual practices
          </p>
          <Button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Join Sadhana Program
          </Button>
        </div>
      </section> */}
    </main>
  )
}
