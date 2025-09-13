"use client"

import { Card } from "@/components/ui/card"

const newsArticles = [
  {
    title: "What's the news?",
    image: "/placeholder.svg?height=150&width=200",
    description: "2024: Coconut Vat Purnima & Day Marriage Auspicious...",
  },
  {
    title: "What's the news?",
    image: "/placeholder.svg?height=150&width=200",
    description: "2024: Coconut Vat Purnima & Day Marriage Auspicious...",
  },
]

export default function NewsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">News & Articles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsArticles.map((article, index) => (
            <Card key={index} className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
              <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-3">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{article.description}</p>
                <a href="#" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                  View All News and Events
                </a>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold">
            View All
          </button>
        </div>
      </div>
    </section>
  )
}
