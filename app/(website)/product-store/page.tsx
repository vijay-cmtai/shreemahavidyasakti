"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ShoppingCart, Filter, Search, Heart, Eye } from "lucide-react"

export default function ProductStore() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [cart, setCart] = useState<number[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])

  const categories = [
    { id: "all", name: "All Products" },
    { id: "rudraksha", name: "Rudraksha" },
    { id: "yantra", name: "Yantra" },
    { id: "gemstones", name: "Gemstones" },
    { id: "crystals", name: "Crystals" },
    { id: "idols", name: "Idols" },
    { id: "books", name: "Books" }
  ]

  const products = [
    {
      id: 1,
      name: "5 Mukhi Rudraksha",
      category: "rudraksha",
      price: 1299,
      originalPrice: 1599,
      rating: 4.8,
      reviews: 245,
      image: "/placeholder.jpg",
      description: "Authentic 5 face Rudraksha for peace and spiritual growth",
      inStock: true,
      discount: 19,
      bestseller: true,
      features: ["Certified Genuine", "Lab Tested", "Free Energization"]
    },
    {
      id: 2,
      name: "Shree Yantra - Brass",
      category: "yantra",
      price: 2499,
      originalPrice: 3299,
      rating: 4.9,
      reviews: 189,
      image: "/placeholder.jpg",
      description: "Sacred geometry for prosperity and abundance",
      inStock: true,
      discount: 24,
      bestseller: false,
      features: ["Pure Brass", "Hand Carved", "Blessed by Priest"]
    },
    {
      id: 3,
      name: "Natural Ruby (Manik)",
      category: "gemstones",
      price: 12999,
      originalPrice: 15999,
      rating: 4.7,
      reviews: 67,
      image: "/placeholder.jpg",
      description: "Certified natural ruby for Sun planet strength",
      inStock: true,
      discount: 19,
      bestseller: true,
      features: ["Certificate Included", "Astrological Grade", "Eye Clean"]
    },
    {
      id: 4,
      name: "Rose Quartz Crystal",
      category: "crystals",
      price: 899,
      originalPrice: 1199,
      rating: 4.6,
      reviews: 123,
      image: "/placeholder.jpg",
      description: "Love and healing crystal for emotional balance",
      inStock: true,
      discount: 25,
      bestseller: false,
      features: ["Natural Stone", "Cleansed & Charged", "Gift Wrapped"]
    },
    {
      id: 5,
      name: "Ganesha Idol - Marble",
      category: "idols",
      price: 3499,
      originalPrice: 4299,
      rating: 4.9,
      reviews: 98,
      image: "/placeholder.jpg",
      description: "Handcrafted marble Ganesha for removing obstacles",
      inStock: true,
      discount: 19,
      bestseller: false,
      features: ["Pure Marble", "Hand Carved", "Antique Finish"]
    },
    {
      id: 6,
      name: "Lal Kitab - Hindi",
      category: "books",
      price: 699,
      originalPrice: 999,
      rating: 4.5,
      reviews: 456,
      image: "/placeholder.jpg",
      description: "Complete Lal Kitab with remedies and predictions",
      inStock: true,
      discount: 30,
      bestseller: true,
      features: ["Latest Edition", "Easy Language", "500+ Pages"]
    },
    {
      id: 7,
      name: "Blue Sapphire (Neelam)",
      category: "gemstones",
      price: 8999,
      originalPrice: 11999,
      rating: 4.8,
      reviews: 34,
      image: "/placeholder.jpg",
      description: "Premium blue sapphire for Saturn planet",
      inStock: false,
      discount: 25,
      bestseller: false,
      features: ["Ceylon Origin", "Heat Treated", "Certificate"]
    },
    {
      id: 8,
      name: "Mahamrityunjaya Yantra",
      category: "yantra",
      price: 1799,
      originalPrice: 2299,
      rating: 4.7,
      reviews: 156,
      image: "/placeholder.jpg",
      description: "Powerful yantra for health and longevity",
      inStock: true,
      discount: 22,
      bestseller: false,
      features: ["Copper Made", "Energized", "With Mantra"]
    }
  ]

  const filteredProducts = products
    .filter(product => {
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number)
        if (max && (product.price < min || product.price > max)) return false
        if (!max && product.price < min) return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.id - a.id
        default:
          return b.bestseller ? 1 : -1
      }
    })

  const addToCart = (productId: number) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId])
    }
  }

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId))
    } else {
      setWishlist([...wishlist, productId])
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">

      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-400 to-red-500 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Product Store</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Authentic Spiritual Products for Your Journey
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-1000">₹0 - ₹1,000</SelectItem>
                <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                <SelectItem value="5000-15000">₹5,000 - ₹15,000</SelectItem>
                <SelectItem value="15000">₹15,000+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              Showing {filteredProducts.length} products
            </p>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <span className="text-sm text-gray-500">
                Cart ({cart.length}) | Wishlist ({wishlist.length})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group relative overflow-hidden hover:shadow-lg transition-shadow">
                {product.bestseller && (
                  <Badge className="absolute top-2 left-2 z-10 bg-orange-500">
                    Bestseller
                  </Badge>
                )}
                {product.discount > 0 && (
                  <Badge className="absolute top-2 right-2 z-10 bg-red-500">
                    {product.discount}% OFF
                  </Badge>
                )}
                
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => toggleWishlist(product.id)}
                      className={wishlist.includes(product.id) ? "bg-red-100 text-red-600" : ""}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-orange-600">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-600">
                        <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={!product.inStock}
                    onClick={() => addToCart(product.id)}
                  >
                    {!product.inStock ? (
                      "Out of Stock"
                    ) : cart.includes(product.id) ? (
                      "Added to Cart"
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("all")
                  setPriceRange("all")
                  setSearchTerm("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h3 className="font-semibold mb-2">Authentic Products</h3>
              <p className="text-gray-600 text-sm">100% genuine and certified</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">On orders above ₹999</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-orange-600 text-2xl">🔄</span>
              </div>
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">7-day return policy</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-600 text-2xl">🙏</span>
              </div>
              <h3 className="font-semibold mb-2">Blessed Items</h3>
              <p className="text-gray-600 text-sm">Energized by our priests</p>
            </div>
          </div>
        </div>
      </section>


    </main>
  )
}
