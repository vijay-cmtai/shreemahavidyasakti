"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Image, Video, Clock, Play, X, ZoomIn } from "lucide-react"
import { useTranslation } from "@/contexts/TranslationContext"

// Media interface based on your API
interface MediaItem {
  _id: string
  title: string
  description?: string
  type: "video" | "image"
  thumbnail: string
  mediaUrl?: string
  url?: string // For backward compatibility
  duration?: string
  views: number
  likes: number
  shares: number
  createdAt: string
  updatedAt: string
  tags: string[]
}

export default function Gallery() {
  const { t } = useTranslation()
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // API state
  const [galleryMedia, setGalleryMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API functions
  const fetchAllMedia = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/gallery`)
      if (!response.ok) throw new Error('Failed to fetch media')
      const data = await response.json()
      
      // Handle different response formats like dashboard
      let items: MediaItem[] = []
      if (data.media && Array.isArray(data.media)) {
        items = data.media.map((item: any) => ({
          ...item,
          url: item.mediaUrl || item.url, // Map mediaUrl to url for display
          tags: Array.isArray(item.tags) ? item.tags.map((tag: any) => 
            typeof tag === 'string' && tag.startsWith('[') ? 
              JSON.parse(tag).join(', ') : tag
          ).flat() : item.tags || []
        }))
      } else if (Array.isArray(data)) {
        items = data
      }
      
      setGalleryMedia(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media')
      setGalleryMedia([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchAllMedia()
  }, [])

  const openModal = (media: MediaItem) => {
    setSelectedMedia(media)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMedia(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Hero Section - Static */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/gallery-hero.jpg')",
            opacity: 0.9
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/85 via-red-900/80 to-purple-900/85"></div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">🎥</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">��️</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">✨</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">🌟</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('gallery.heroTitle')}</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">{t('gallery.heroSubtitle')}</h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            {t('gallery.heroDescription')}
          </p>
        </div>
      </section>

      {/* Media Gallery - No Filters */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{t('gallery.loading.title')}</h3>
              <p className="text-gray-600">{t('gallery.loading.description')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-2 text-red-800">{t('gallery.error.title')}</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => {
                  setError(null)
                  fetchAllMedia()
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {t('gallery.error.tryAgain')}
              </Button>
            </div>
          ) : galleryMedia.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎥</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{t('gallery.empty.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('gallery.empty.description')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryMedia.map((media) => (
                <Card key={media._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <div className="relative" onClick={() => openModal(media)}>
                    {/* Thumbnail - Only Image/Video, No Text Below */}
                    <div className="relative h-80 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
                      <img
                        src={media.thumbnail || media.url}
                        alt={media.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                      
                      {/* Fallback Icon */}
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center hidden">
                        {media.type === 'video' ? (
                          <Video className="w-16 h-16 text-orange-500" />
                        ) : (
                          <Image className="w-16 h-16 text-orange-500" />
                        )}
                      </div>
                      
                      {/* Zoom Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-80 rounded-full p-3">
                          <ZoomIn className="w-8 h-8 text-orange-600" />
                        </div>
                      </div>
                      
                      {/* Media Type Indicator */}
                      <div className="absolute top-3 left-3">
                        <Badge className={`${
                          media.type === 'video' 
                            ? 'bg-blue-500 hover:bg-blue-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        } text-white`}>
                          {media.type === 'video' ? <Video className="w-3 h-3 mr-1" /> : <Image className="w-3 h-3 mr-1" />}
                          {media.type === 'video' ? t('gallery.mediaType.video') : t('gallery.mediaType.image')}
                        </Badge>
                      </div>
                      
                      {/* Play Button Overlay for Videos */}
                      {media.type === 'video' && (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                              <Play className="w-8 h-8 text-orange-600 ml-1" />
                            </div>
                          </div>
                          
                          {/* Duration Badge */}
                          {media.duration && (
                            <div className="absolute bottom-3 right-3">
                              <Badge className="bg-black bg-opacity-75 text-white border-0">
                                <Clock className="w-3 h-3 mr-1" />
                                {media.duration}
                              </Badge>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {/* No content section below image - completely removed */}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Full Screen Modal */}
      {isModalOpen && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <Button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white text-black hover:bg-gray-100 rounded-full w-12 h-12 p-0"
            >
              <X className="w-6 h-6" />
            </Button>
            
            {/* Media Content - Only Media, No Text Info */}
            <div className="relative">
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.mediaUrl || selectedMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[90vh] object-contain"
                >
                  {t('gallery.videoNotSupported', 'Your browser does not support the video tag.')}
                </video>
              ) : (
                <img
                  src={selectedMedia.thumbnail || selectedMedia.url}
                  alt={selectedMedia.title}
                  className="max-w-full max-h-[90vh] object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}