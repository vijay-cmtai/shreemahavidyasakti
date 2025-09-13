"use client"

import { Button } from "@/components/ui/button"

export default function ServicesSection() {
  return (
    <section className="jyoti-cream-bg py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Panchang & Social Media */}
          <div className="space-y-6 lg:space-y-8">
            {/* Panchang Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Panchang</h3>
                  <p className="text-sm font-medium text-gray-700">Aaj Ka Panchang</p>
                  <p className="text-sm text-gray-600">New Delhi, India</p>
                  <p className="text-xs text-gray-500 mt-1">Wednesday, 9 October 2024</p>
                </div>
                <Button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium w-fit">
                  Detailed Panchang
                </Button>
              </div>

              {/* 2x2 Grid for Panchang Times */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
                <div className="bg-blue-600 text-white p-3 rounded-lg text-center shadow-sm">
                  <div className="text-lg mb-1">↑</div>
                  <div className="text-xs font-medium">SUNRISE</div>
                  <div className="text-sm font-bold">6:18:31</div>
                </div>
                <div className="bg-blue-600 text-white p-3 rounded-lg text-center shadow-sm">
                  <div className="text-lg mb-1">↓</div>
                  <div className="text-xs font-medium">SUNSET</div>
                  <div className="text-sm font-bold">17:57:43</div>
                </div>
                <div className="bg-blue-600 text-white p-3 rounded-lg text-center shadow-sm">
                  <div className="text-lg mb-1">🌙</div>
                  <div className="text-xs font-medium">MOONRISE</div>
                  <div className="text-sm font-bold">12:10:28</div>
                </div>
                <div className="bg-blue-600 text-white p-3 rounded-lg text-center shadow-sm">
                  <div className="text-lg mb-1">🌙</div>
                  <div className="text-xs font-medium">MOONSET</div>
                  <div className="text-sm font-bold">22:13:7</div>
                </div>
              </div>

              {/* Detailed Panchang Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-medium text-gray-700">Month</p>
                  <p className="text-gray-600">Amanta: Ashwin</p>
                  <p className="text-gray-600">Purnimanta: Ashwin</p>
                  <p className="font-medium text-gray-700 mt-2">Tithi: Shukla Shashthi</p>
                  <p className="text-gray-600">Till: 2024-10-09 12:15:55</p>
                  <p className="font-medium text-gray-700 mt-2">Yog: Shobhan</p>
                  <p className="text-gray-600">Till: 2024-10-10 05:53:23</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Samvat</p>
                  <p className="text-gray-600">Vikram: 2081 Peengal</p>
                  <p className="text-gray-600">Shaka: 1946 Krodhi</p>
                  <p className="font-medium text-gray-700 mt-2">Nakshatra: Mool</p>
                  <p className="text-gray-600">Till: 2024-10-10 05:15:08</p>
                  <p className="font-medium text-gray-700 mt-2">Karan: Taitil</p>
                  <p className="text-gray-600">Purnimanta: 2024-10-09 12:12:55</p>
                </div>
              </div>
            </div>

            {/* Social Media Feed */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Social Media Feed</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "📷", platform: "Instagram" },
                  { icon: "🐦", platform: "Twitter" },
                  { icon: "📘", platform: "Facebook" },
                  { icon: "📺", platform: "YouTube" }
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="bg-gradient-to-br from-purple-900 to-orange-600 rounded-lg h-32 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white text-xl">🏺</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ▶
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700">Every Problem Have A Solution</p>
                      <p className="text-xs text-gray-500">Ganesh Chaturthi Maha is Ashtami...</p>
                    </div>
                    <div className="absolute bottom-2 left-2 text-white text-xs">
                      {item.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* News & Articles */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">News & Articles</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-800 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <span className="text-amber-600 text-2xl">⭐</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-800">What's the news?</h4>
                    <p className="text-xs text-gray-600 mt-1">2024: Coconut Vat Purnima & Day Marriage Auspicious...</p>
                    <p className="text-xs text-blue-500 mt-1 cursor-pointer hover:underline">
                      View All News and Events
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-800 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <span className="text-amber-600 text-2xl">⭐</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-800">What's the news?</h4>
                    <p className="text-xs text-gray-600 mt-1">500 Coconut Vat Purnima & Day Marriage Auspicious...</p>
                    <p className="text-xs text-blue-500 mt-1 cursor-pointer hover:underline">
                      View All News and Events
                    </p>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4 jyoti-orange-bg hover:bg-orange-600 text-white rounded-lg">View All</Button>
            </div>
          </div>

          {/* Right Column - Our Services */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-center text-gray-800">Our Services</h3>
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <span className="text-2xl">🙏</span>
              <p className="text-center text-base sm:text-lg devanagari font-medium text-gray-700">
                लोकाः समस्ताः सुखिनो भवन्तु
              </p>
            </div>

            {/* Featured Service Card */}
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">📜</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-800">Order Hard Copy of Kundali (Birth Chart) for</h4>
                  <p className="text-xs text-gray-600">convenient reference, personal keepsake,</p>
                  <p className="text-xs text-gray-600">detailed layout and easy annotations ₹1100</p>
                </div>
                <div className="text-orange-500 text-xl">→</div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
              {/* Row 1 */}
              <div className="text-center p-3 hover:shadow-md transition-shadow rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">Kundali Analysis</h4>
                <p className="text-xs text-gray-600 mb-2">Overall with 3 areas of concern</p>
                <p className="text-sm font-bold text-gray-800">₹11000</p>
                <p className="text-xs text-orange-500 line-through">₹15000</p>
              </div>

              <div className="text-center p-3 hover:shadow-md transition-shadow rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">💕</span>
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">Match - Matching</h4>
                <p className="text-xs text-gray-600 mb-2">Find compatibility</p>
                <p className="text-sm font-bold text-gray-800">₹25000</p>
                <p className="text-xs text-orange-500 line-through">₹6000</p>
              </div>

              <div className="text-center p-3 hover:shadow-md transition-shadow rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 bg-pink-100 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">💑</span>
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">Marriage Consultation</h4>
                <p className="text-xs text-gray-600 mb-2">Get guidance</p>
                <p className="text-sm font-bold text-gray-800">₹25000</p>
                <p className="text-xs text-orange-500 line-through">₹6000</p>
              </div>

              {/* Row 2 */}
              <div className="text-center p-3 hover:shadow-md transition-shadow rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">👶</span>
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">Progeny/ Children</h4>
                <p className="text-xs text-gray-600 mb-2">Child predictions</p>
                <p className="text-sm font-bold text-gray-800">₹25000</p>
                <p className="text-xs text-orange-500 line-through">₹6000</p>
              </div>

              <div className="text-center p-3 hover:shadow-md transition-shadow rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">📚</span>
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">Education</h4>
                <p className="text-xs text-gray-600 mb-2">Academic guidance</p>
                <p className="text-sm font-bold text-gray-800">₹25000</p>
                <p className="text-xs text-orange-500 line-through">₹6000</p>
              </div>

              <div className="text-center p-3 hover:shadow-md transition-shadow rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">💼</span>
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">Career/ Profession</h4>
                <p className="text-xs text-gray-600 mb-2">Professional guidance</p>
                <p className="text-sm font-bold text-gray-800">₹25000</p>
                <p className="text-xs text-orange-500 line-through">₹6000</p>
              </div>

              {/* Row 3 */}
              <div className="text-center p-3 hover:shadow-md transition-shadow rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✏️</span>
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">Name Correction</h4>
                <p className="text-xs text-gray-600 mb-2">Numerology names</p>
                <p className="text-sm font-bold text-gray-800">₹25000</p>
                <p className="text-xs text-orange-500 line-through">₹6000</p>
              </div>

              <div className="text-center p-3 hover:shadow-md transition-shadow rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🕐</span>
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">Muhurta</h4>
                <p className="text-xs text-gray-600 mb-2">Auspicious timing</p>
                <p className="text-sm font-bold text-gray-800">₹25000</p>
                <p className="text-xs text-orange-500 line-through">₹6000</p>
              </div>

              <div className="text-center p-3 hover:shadow-md transition-shadow rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 bg-teal-100 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">⏰</span>
                </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">Good / Bad Times</h4>
                <p className="text-xs text-gray-600 mb-2">Favorable periods</p>
                <p className="text-sm font-bold text-gray-800">₹25000</p>
                <p className="text-xs text-orange-500 line-through">₹6000</p>
              </div>
            </div>

            <div className="text-center">
              <Button className="jyoti-orange-bg hover:bg-orange-600 text-white px-8 py-2 rounded-lg shadow-sm">
                View All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
