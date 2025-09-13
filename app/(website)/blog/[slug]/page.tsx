"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, ArrowLeft, Share2, Heart, MessageCircle, Clock, TrendingUp, BookOpen, Tag } from "lucide-react"
import { useEffect, useState } from "react"
import { notFound } from 'next/navigation'

// Interface for blog post
interface BlogPost {
  _id: string;
  title: string;
  hindiTitle?: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  images?: { url: string; alt?: string; caption?: string }[];
  category: string;
  authorName: string;
  publishDate: string;
  readTime: string;
  views: number;
  likes: number;
  commentCount?: number;
  tags: string[] | string;
  slug: string;
  featured: boolean;
  trending: boolean;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface RelatedPost {
  _id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  publishDate: string;
  readTime: string;
  slug: string;
}

interface BlogDetailPageProps {
  params: {
    slug: string
  }
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)
  
  // Fetch blog by slug
  const fetchBlogBySlug = async (slug: string) => {
    try {
      setLoading(true)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blogs/slug/${slug}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Blog Detail: Raw API response:', data)
        
        // Handle different API response structures
        let blogData = null;
        if (data.blog) {
          // API returns { blog: {...} }
          blogData = data.blog;
        } else if (data._id) {
          // API returns direct blog object
          blogData = data;
        }
        
        if (blogData) {
          setBlog(blogData)
          // Fetch related posts (same category, different post)
          fetchRelatedPosts(blogData.category, blogData._id)
        } else {
          console.error('No blog data found in response')
          notFound()
        }
      } else if (response.status === 404) {
        notFound()
      } else {
        console.error('Failed to fetch blog:', response.statusText)
        setBlog(null)
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
      setBlog(null)
    } finally {
      setLoading(false)
    }
  }

  // Fetch related posts
  const fetchRelatedPosts = async (category: string, currentPostId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blogs?category=${category}&limit=3`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Related Posts: Raw API response:', data)
        
        // Handle different API response structures
        let postsArray = [];
        if (data.blogs && Array.isArray(data.blogs)) {
          // API returns { blogs: [...], pagination: {...} }
          postsArray = data.blogs;
        } else if (Array.isArray(data)) {
          // API returns direct array
          postsArray = data;
        }
        
        // Filter out current post and take only 3
        const filtered = Array.isArray(postsArray) 
          ? postsArray.filter((post: RelatedPost) => post._id !== currentPostId).slice(0, 3)
          : []
        setRelatedPosts(filtered)
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

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
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'k'
    }
    return views.toString()
  }

  // Format tags helper
  const formatTags = (tags: string[] | string) => {
    if (Array.isArray(tags)) {
      return tags
    }
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim())
    }
    return []
  }

  useEffect(() => {
    if (params.slug) {
      fetchBlogBySlug(params.slug)
    }
  }, [params.slug])

  // Consistent hero background image for all blog posts
  const heroBackgroundImage = "/images/hero.jpg"
  
  // Fallback image for blog featured images
  const fallbackImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4 w-1/4"></div>
            <div className="h-12 bg-gray-300 rounded mb-6"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{
            backgroundImage: `url('${heroBackgroundImage}')`,
            opacity: 1
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/85 via-red-900/80 to-purple-900/85"></div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">📚</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">🔮</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">✨</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">🌟</div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 mb-6"
              onClick={() => window.location.href = '/blog'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
            
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-orange-500 hover:bg-orange-600">
                {blog.category}
              </Badge>
              {blog.featured && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                  ✨ Featured
                </Badge>
              )}
              {blog.trending && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500">
                  🔥 Trending
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>
            
            {blog.hindiTitle && (
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 leading-tight text-yellow-100">
                {blog.hindiTitle}
              </h2>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blog.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.publishDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{formatViews(blog.views)} views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Featured Image Section */}
      {blog.featuredImage && (
        <section className="py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackImage;
                }}
              />
              {blog.images && blog.images.length > 0 && (
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-black/70 text-white">
                    {blog.images.length + 1} Images
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none text-gray-800">
                <p className="text-xl leading-relaxed text-gray-700 mb-8">
                  {blog.excerpt}
                </p>
                
                {/* Main Blog Content */}
                <div 
                  className="space-y-6 text-gray-700 blog-content prose prose-lg prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <style jsx>{`
                  .blog-content h1 { font-size: 2rem; font-weight: bold; margin: 2rem 0 1rem 0; color: #1f2937; }
                  .blog-content h2 { font-size: 1.5rem; font-weight: bold; margin: 1.5rem 0 0.75rem 0; color: #374151; }
                  .blog-content h3 { font-size: 1.25rem; font-weight: bold; margin: 1.25rem 0 0.5rem 0; color: #4b5563; }
                  .blog-content p { margin: 1rem 0; line-height: 1.7; }
                  .blog-content ul, .blog-content ol { margin: 1rem 0; padding-left: 2rem; }
                  .blog-content li { margin: 0.5rem 0; }
                  .blog-content blockquote { 
                    border-left: 4px solid #f97316; 
                    padding-left: 1rem; 
                    margin: 1.5rem 0; 
                    font-style: italic; 
                    background-color: #fff7ed; 
                    padding: 1rem; 
                    border-radius: 0.5rem;
                  }
                  .blog-content a { color: #f97316; text-decoration: underline; }
                  .blog-content strong { font-weight: 600; }
                  .blog-content em { font-style: italic; }
                `}</style>
              </div>
              
              {/* Tags */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formatTags(blog.tags).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Social Actions */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      {blog.likes}
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {blog.commentCount || 0}
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Author Info */}
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{blog.authorName}</h3>
                      <p className="text-sm text-gray-600">Expert Astrologer & Spiritual Guide</p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Reading Stats */}
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Reading Stats
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reading Time:</span>
                        <span className="font-medium">{blog.readTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Views:</span>
                        <span className="font-medium">{formatViews(blog.views)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Likes:</span>
                        <span className="font-medium">{blog.likes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Comments:</span>
                        <span className="font-medium">{blog.commentCount || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">📚 Related Articles</h2>
            <p className="text-gray-600">Continue your spiritual journey with these related insights</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
                              <Card key={post._id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white cursor-pointer"
                    onClick={() => window.location.href = `/blog/${post.slug}`}>
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
                  <Badge className="bg-orange-500 hover:bg-orange-600 mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(post.publishDate)}</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 via-red-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">📧 Stay Updated with Latest Insights</h2>
          <p className="text-lg opacity-90 mb-8">
            Subscribe to receive the latest astrology insights and spiritual guidance directly in your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
