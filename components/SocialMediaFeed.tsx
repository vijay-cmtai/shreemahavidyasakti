"use client"

import { Card } from "@/components/ui/card"

const posts = [
  {
    title: "Ganesh Chaturthi Maha is Ashtami",
    image: "/placeholder.svg?height=200&width=300",
    likes: "❤️ 45",
  },
  {
    title: "Ganesh Chaturthi Maha is Ashtami",
    image: "/placeholder.svg?height=200&width=300",
    likes: "❤️ 32",
  },
  {
    title: "Ganesh Chaturthi Maha is Ashtami",
    image: "/placeholder.svg?height=200&width=300",
    likes: "❤️ 28",
  },
  {
    title: "Ganesh Chaturthi Maha is Ashtami",
    image: "/placeholder.svg?height=200&width=300",
    likes: "❤️ 51",
  },
]

export default function SocialMediaFeed() {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Social Media Feed</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <Card key={index} className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.likes}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
