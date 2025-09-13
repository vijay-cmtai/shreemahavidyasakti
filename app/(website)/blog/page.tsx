"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye, ArrowRight, Search, Filter, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useTranslation } from "@/contexts/TranslationContext"

// Interface for blog post
interface BlogPost {
  _id: string;
  title: string;
  hindiTitle?: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  authorName: string;
  publishDate: string;
  readTime: string;
  views: number | string;
  slug: string;
  featured: boolean;
  trending: boolean;
  status: string;
}

export default function BlogPage() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(["All", "Astrology", "Rudraksha", "Marriage", "Gemstones", "Yantra", "Career"])

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blogs`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Public Blog: Raw API response:', data)
        
        // Handle different API response structures
        let blogsArray = [];
        if (data.blogs && Array.isArray(data.blogs)) {
          // API returns { blogs: [...], pagination: {...} }
          blogsArray = data.blogs;
        } else if (Array.isArray(data)) {
          // API returns direct array
          blogsArray = data;
        }
        
        console.log('Public Blog: Extracted blogs array:', blogsArray)
        
        // Ensure data is an array and filter only published posts
        const publishedPosts = Array.isArray(blogsArray) 
          ? blogsArray.filter((post: BlogPost) => post.status === 'published')
          : []
        
        setBlogPosts(publishedPosts)
        
        // Extract unique categories from posts
        const uniqueCategories = ["All", ...new Set(publishedPosts.map((post: BlogPost) => post.category))]
        setCategories(uniqueCategories)
      } else {
        console.error('Failed to fetch blogs:', response.status, response.statusText)
        setBlogPosts([])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setBlogPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Load blogs on component mount
  useEffect(() => {
    fetchBlogs()
  }, [])

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPosts = blogPosts.filter(post => post.featured)
  const trendingPosts = blogPosts.filter(post => post.trending)



  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  // Format views helper
  const formatViews = (views: number | string) => {
    if (typeof views === 'number') {
      if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'k'
      }
      return views.toString()
    }
    return views
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/85 via-red-900/80 to-purple-900/85"></div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">📚</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">🔮</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">✨</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">🌟</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full mr-6">
              <TrendingUp className="w-16 h-16" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              {t('blog.hero.title', 'Astrology Blog')}
            </h1>
          </div>
          <p className="text-2xl md:text-3xl font-semibold mb-4 text-yellow-100">
            {t('blog.hero.subtitle', '🔮 Latest Insights & Expert Knowledge 🔮')}
          </p>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {t('blog.hero.description', 'Discover ancient wisdom, modern insights, and expert guidance on astrology, rudraksha, gemstones and spiritual practices')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/20 px-4 py-2 rounded-full">{t('blog.hero.features.expertArticles', '📖 Expert Articles')}</div>
            <div className="bg-white/20 px-4 py-2 rounded-full">{t('blog.hero.features.vedicWisdom', '🔮 Vedic Wisdom')}</div>
            <div className="bg-white/20 px-4 py-2 rounded-full">{t('blog.hero.features.gemstoneGuides', '💎 Gemstone Guides')}</div>
            <div className="bg-white/20 px-4 py-2 rounded-full">{t('blog.hero.features.spiritualPractices', '🙏 Spiritual Practices')}</div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-orange-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('blog.search.title', '🔍 Find Your Perfect Article')}</h2>
              <p className="text-gray-600">{t('blog.search.subtitle', 'Search and filter through our extensive collection of astrological knowledge')}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-orange-600" />
                  {t('blog.search.searchArticles', 'Search Articles')}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder={t('blog.search.searchPlaceholder', 'Search by title, content, or keywords...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-3 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-orange-600" />
                  {t('blog.search.category', 'Category')}
                </label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-3 px-4 border-2 border-orange-200 focus:border-orange-400 rounded-xl bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Search className="w-5 h-5 mr-2" />
                  {t('blog.search.searchNow', 'Search Now')}
                </Button>
              </div>
            </div>
            
            {/* Quick Filter Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="text-sm text-gray-600 mr-4">{t('blog.search.quickFilters', 'Quick Filters:')}</div>
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors">
                {t('blog.search.featuredArticles', '✨ Featured Articles')}
              </button>
              <button className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors">
                {t('blog.search.trendingNow', '🔥 Trending Now')}
              </button>
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors">
                {t('blog.search.latestPosts', '📖 Latest Posts')}
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors">
                {t('blog.search.gemstoneGuides', '💎 Gemstone Guides')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('blog.featured.title', '✨ Featured Articles')}</h2>
              <p className="text-gray-600">{t('blog.featured.subtitle', 'Handpicked articles with the most valuable insights')}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post._id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50">
                  {post.trending && (
                    <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                      {t('blog.trending', '🔥 Trending')}
                    </Badge>
                  )}
                  
                  <div className="relative">
                    <img
                      src={post.featuredImage }
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      // onError={(e) => {
                      //   const target = e.target as HTMLImageElement;
                      //   target.src = '/images/placeholder.jpg';
                      // }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Badge className="bg-orange-500 hover:bg-orange-600 mb-3">
                        {post.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-3">
                        {post.title}
                      </h3>
                      {post.hindiTitle && (
                        <h4 className="text-lg font-medium text-gray-700 mb-2">
                          {post.hindiTitle}
                        </h4>
                      )}
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.publishDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatViews(post.views)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0"
                        onClick={() => window.location.href = `/blog/${post.slug}`}
                      >
                        {t('blog.readMore', 'Read More')} <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('blog.allArticles.title', '📚 All Articles')}</h2>
            <p className="text-gray-600">{t('blog.allArticles.articlesFound', { count: filteredPosts.length })}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post._id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white">
                {post.trending && (
                  <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                    {t('blog.trending', '🔥 Trending')}
                  </Badge>
                )}
                
                <div className="relative">
                  <img
                    src={post.featuredImage || '/images/placeholder.jpg'}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    // onError={(e) => {
                    //   const target = e.target as HTMLImageElement;
                    //   target.src = '/images/placeholder.jpg';
                    // }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge className="bg-orange-500 hover:bg-orange-600 mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-3">
                      {post.title}
                    </h3>
                    {post.hindiTitle && (
                      <h4 className="text-base font-medium text-gray-700 mb-2">
                        {post.hindiTitle}
                      </h4>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.publishDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatViews(post.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0"
                      onClick={() => window.location.href = `/blog/${post.slug}`}
                    >
                      {t('blog.readMore', 'Read More')} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-3 w-20"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('blog.noArticlesFound', 'No articles found.')}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("All")
                  setSearchTerm("")
                }}
              >
                {t('blog.clearFilters', 'Clear Filters')}
              </Button>
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
              {t('blog.loadMore', 'Load More Articles')}
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 via-red-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('blog.newsletter.title', '📧 Get Latest Blog Updates')}</h2>
          <p className="text-lg opacity-90 mb-8">
            {t('blog.newsletter.subtitle', 'Subscribe to receive the latest astrology insights and tips directly in your inbox')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('blog.newsletter.emailPlaceholder', 'Your email address...')}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold">
              {t('blog.newsletter.subscribe', 'Subscribe')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
