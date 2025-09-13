"use client"

import React, { useState } from 'react';
import { Calendar, Clock, Star, Sunrise, Sunset, Moon, Sun, Crown, Sparkles, Download, Share2, RefreshCw, MapPin, ChevronRight, TrendingUp, Eye, Zap, AlertCircle, Users, User, Calculator } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePanchangData } from "@/hooks/usePanchangData";
import { 
  useCalendarData, 
  useMarriageMatching, 
  useHoroscopeData, 
  useNumerologyData 
} from "@/hooks/useProKeralaAPIs";
import { useTranslation } from "@/contexts/TranslationContext";

export default function PanshangPage() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [coordinates, setCoordinates] = useState({ 
    latitude: 28.6139, 
    longitude: 77.2090 
  });
  const [locationName, setLocationName] = useState("New Delhi, India");
  
  // Personal details for horoscope and numerology
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    numerologySystem: 'pythagorean'
  });

  // Marriage matching details
  const [marriageDetails, setMarriageDetails] = useState({
    brideName: '',
    brideBirthDate: '',
    brideBirthTime: '',
    groomName: '',
    groomBirthDate: '',
    groomBirthTime: '',
    matchingSystem: 'ashta_kuta'
  });

  // Fetch all data
  const { data: panchangData, loading, error, refetch } = usePanchangData(selectedDate, coordinates.latitude, coordinates.longitude);
  const { data: calendarData, loading: calendarLoading, error: calendarError, refetch: refetchCalendar } = useCalendarData(selectedDate, coordinates.latitude, coordinates.longitude);
  const { data: horoscopeData, loading: horoscopeLoading, error: horoscopeError, refetch: refetchHoroscope } = useHoroscopeData(
    personalDetails.birthDate, 
    personalDetails.birthTime, 
    coordinates.latitude, 
    coordinates.longitude
  );
  const { data: numerologyData, loading: numerologyLoading, error: numerologyError, refetch: refetchNumerology } = useNumerologyData(
    personalDetails.name, 
    personalDetails.birthDate, 
    personalDetails.numerologySystem
  );
  const { data: marriageData, loading: marriageLoading, error: marriageError, performMatching } = useMarriageMatching(null);

  const handleMarriageMatching = () => {
    if (marriageDetails.brideBirthDate && marriageDetails.groomBirthDate) {
      performMatching();
    }
  };

  const refreshAllData = () => {
    refetch();
    refetchCalendar();
    if (personalDetails.birthDate && personalDetails.birthTime) {
      refetchHoroscope();
    }
    if (personalDetails.name && personalDetails.birthDate) {
      refetchNumerology();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/contact-hero.jpg')",
            opacity: 0.9
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-purple-900/80"></div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-6xl opacity-20">📅</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20">🌟</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-20">✨</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20">🔮</div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24 text-center">
          {/* Hero Title */}
          <div className="mb-12">
            <Badge className="mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-6 py-2 text-sm font-semibold">
              <Crown className="w-4 h-4 mr-2" />
              {t('panshang.premiumBadge')}
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              {t('panshang.heroTitle')}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              {t('panshang.heroDescription')}
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">100K+</div>
              <div className="text-gray-400 text-sm">{t('panshang.stats.dailyUsers')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">99.9%</div>
              <div className="text-gray-400 text-sm">{t('panshang.stats.accuracy')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-400 text-sm">{t('panshang.stats.available')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">5★</div>
              <div className="text-gray-400 text-sm">{t('panshang.stats.rating')}</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
            >
              <Eye className="mr-2 w-5 h-5" />
              {t('panshang.viewTodayPanchang')}
            </Button>
            {/* <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-lg backdrop-blur-sm"
            >
              <Download className="mr-2 w-5 h-5" />
              Download Report
            </Button> */}
          </div>
        </div>


      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Quick Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 justify-between items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {t('panshang.completeAstrologyServices')}
              </h2>
              <p className="text-gray-600 text-lg">
                {t('panshang.servicesDescription')}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshAllData}
                disabled={loading}
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {t('panshang.refreshAll')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t('panshang.share')}
              </Button>
            </div>
          </div>

          {/* Date Display */}
          <Card className="mb-8 bg-gradient-to-r from-orange-500 to-red-600 border-0 text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 text-yellow-300" />
                    <Badge className="bg-white/20 text-white border-0">{t('panshang.live')}</Badge>
                  </div>
                  {loading ? (
                    <Skeleton className="h-8 w-64 bg-white/20" />
                  ) : (
                    <h3 className="text-2xl md:text-3xl font-bold">{panchangData?.date}</h3>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-orange-200 mb-1">{t('panshang.currentLocation')}</div>
                  <div className="flex items-center text-white">
                    <MapPin className="w-4 h-4 mr-1" />
                    {locationName}
                  </div>
                  <div className="text-xs text-orange-300 mt-1">
                    {t('panshang.poweredBy')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Tabs */}
          <Tabs defaultValue="panchang" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="panchang" className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                {t('panshang.tabs.panchang')}
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('panshang.tabs.calendar')}
              </TabsTrigger>
              <TabsTrigger value="horoscope" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                {t('panshang.tabs.horoscope')}
              </TabsTrigger>
              <TabsTrigger value="marriage" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('panshang.tabs.marriage')}
              </TabsTrigger>
              <TabsTrigger value="numerology" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                {t('panshang.tabs.numerology')}
              </TabsTrigger>
            </TabsList>

            {/* Panchang Tab */}
            <TabsContent value="panchang">
              {/* Date & Location Selection */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-indigo-500" />
                    Select Date & Location
                  </CardTitle>
                  <CardDescription>Choose date and location for accurate Panchang data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="panchangDate">Date</Label>
                      <Input
                        id="panchangDate"
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.0001"
                        value={coordinates.latitude}
                        onChange={(e) => setCoordinates(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.0001"
                        value={coordinates.longitude}
                        onChange={(e) => setCoordinates(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={refetch}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                      >
                        {loading ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sun className="w-4 h-4 mr-2" />
                        )}
                        Get Panchang
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Input
                      placeholder="Location name (optional)"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Error Display */}
              {error && (
                <Alert className="mb-8 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}. Please try refreshing the page.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Primary Data */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Sun & Moon Timings */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-yellow-50">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg">
                          <Sun className="w-5 h-5 text-white" />
                        </div>
                        Sun & Moon Timings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                              <Sunrise className="w-5 h-5 text-orange-500" />
                              <span className="font-medium">Sunrise</span>
                            </div>
                            {loading ? (
                              <Skeleton className="h-5 w-20" />
                            ) : (
                              <span className="font-bold text-orange-600">{panchangData?.sunrise}</span>
                            )}
                          </div>
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                              <Sunset className="w-5 h-5 text-red-500" />
                              <span className="font-medium">Sunset</span>
                            </div>
                            {loading ? (
                              <Skeleton className="h-5 w-20" />
                            ) : (
                              <span className="font-bold text-red-600">{panchangData?.sunset}</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                              <Moon className="w-5 h-5 text-blue-500" />
                              <span className="font-medium">Moonrise</span>
                            </div>
                            {loading ? (
                              <Skeleton className="h-5 w-20" />
                            ) : (
                              <span className="font-bold text-blue-600">{panchangData?.moonrise}</span>
                            )}
                          </div>
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                              <Moon className="w-5 h-5 text-indigo-500" />
                              <span className="font-medium">Moonset</span>
                            </div>
                            {loading ? (
                              <Skeleton className="h-5 w-20" />
                            ) : (
                              <span className="font-bold text-indigo-600">{panchangData?.moonset}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Panchang Elements */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        Panchang Elements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tithi:</span>
                            {loading ? <Skeleton className="h-5 w-24" /> : <span className="font-semibold">{panchangData?.tithi}</span>}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nakshatra:</span>
                            {loading ? <Skeleton className="h-5 w-24" /> : <span className="font-semibold">{panchangData?.nakshatra}</span>}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Yoga:</span>
                            {loading ? <Skeleton className="h-5 w-24" /> : <span className="font-semibold">{panchangData?.yoga}</span>}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Karana:</span>
                            {loading ? <Skeleton className="h-5 w-24" /> : <span className="font-semibold">{panchangData?.karana}</span>}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Paksha:</span>
                            {loading ? <Skeleton className="h-5 w-24" /> : <span className="font-semibold">{panchangData?.paksha}</span>}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Season:</span>
                            {loading ? <Skeleton className="h-5 w-24" /> : <span className="font-semibold">{panchangData?.ritu}</span>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Auspicious Times */}
                <div className="space-y-6">
                  {/* Auspicious Times */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        Auspicious Times
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {loading ? (
                          Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-12 w-full" />
                          ))
                        ) : panchangData?.auspiciousTimes.length ? (
                          panchangData.auspiciousTimes.map((timeObj, index) => (
                            <div key={index} className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-green-800">{timeObj.period}</span>
                                <Badge className="bg-green-100 text-green-800 border-0">Good</Badge>
                              </div>
                              {timeObj.description && (
                                <div className="text-xs text-gray-600">{timeObj.description}</div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                            <Clock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            No specific auspicious times available for today
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Inauspicious Times */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-pink-50">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        Avoid These Times
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {loading ? (
                          Array.from({ length: 2 }).map((_, index) => (
                            <Skeleton key={index} className="h-12 w-full" />
                          ))
                        ) : panchangData?.inauspiciousTimes.length ? (
                          panchangData.inauspiciousTimes.map((timeObj, index) => (
                            <div key={index} className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-red-800">{timeObj.period}</span>
                                <Badge className="bg-red-100 text-red-800 border-0">Avoid</Badge>
                              </div>
                              {timeObj.description && (
                                <div className="text-xs text-gray-600">{timeObj.description}</div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                            <Clock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            No specific inauspicious times to avoid today
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Special Events */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                        Special Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {loading ? (
                          Array.from({ length: 2 }).map((_, index) => (
                            <Skeleton key={index} className="h-10 w-full" />
                          ))
                        ) : (
                          panchangData?.specialEvents.map((event, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-800">{event}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    Calendar Settings
                  </CardTitle>
                  <CardDescription>Select date and location for calendar information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="calendarDate">Date</Label>
                      <Input
                        id="calendarDate"
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="calLat">Latitude</Label>
                      <Input
                        id="calLat"
                        type="number"
                        step="0.0001"
                        value={coordinates.latitude}
                        onChange={(e) => setCoordinates(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="calLng">Longitude</Label>
                      <Input
                        id="calLng"
                        type="number"
                        step="0.0001"
                        value={coordinates.longitude}
                        onChange={(e) => setCoordinates(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={refetchCalendar}
                        disabled={calendarLoading}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                      >
                        {calendarLoading ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Calendar className="w-4 h-4 mr-2" />
                        )}
                        Get Calendar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    Hindu Calendar & Traditional Dates
                  </CardTitle>
                  <CardDescription>Complete traditional calendar information</CardDescription>
                </CardHeader>
                <CardContent>
                  {calendarLoading ? (
                    <div className="grid md:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))}
                    </div>
                  ) : calendarError ? (
                    <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                      Error: {calendarError}
                    </div>
                  ) : calendarData ? (
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h3 className="font-semibold text-orange-800 mb-3">Hindu Date</h3>
                        <div className="space-y-2 text-sm">
                          <div>Year: {calendarData.hinduDate.year}</div>
                          <div>Month: {calendarData.hinduDate.month}</div>
                          <div>Day: {calendarData.hinduDate.day}</div>
                          <div>Paksha: {calendarData.hinduDate.paksha}</div>
                          <div>Season: {calendarData.hinduDate.season}</div>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h3 className="font-semibold text-purple-800 mb-3">Vikram Samvat</h3>
                        <div className="space-y-2 text-sm">
                          <div>Year: {calendarData.vikramSamvat.year}</div>
                          <div>Month: {calendarData.vikramSamvat.month}</div>
                          <div>Day: {calendarData.vikramSamvat.day}</div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-3">Special Days</h3>
                        <div className="space-y-1">
                          {calendarData.specialDays.slice(0, 3).map((event, index) => (
                            <Badge key={index} variant="secondary" className="text-xs block mb-1">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Horoscope Tab */}
            <TabsContent value="horoscope">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-purple-500" />
                      Personal Details for Horoscope
                    </CardTitle>
                    <CardDescription>Enter your birth details for complete horoscope analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="birthDate">Birth Date</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={personalDetails.birthDate}
                          onChange={(e) => setPersonalDetails(prev => ({ ...prev, birthDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthTime">Birth Time</Label>
                        <Input
                          id="birthTime"
                          type="time"
                          value={personalDetails.birthTime}
                          onChange={(e) => setPersonalDetails(prev => ({ ...prev, birthTime: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          onClick={refetchHoroscope}
                          disabled={!personalDetails.birthDate || !personalDetails.birthTime || horoscopeLoading}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                        >
                          {horoscopeLoading ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Star className="w-4 h-4 mr-2" />
                          )}
                          Generate Horoscope
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {horoscopeError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {horoscopeError}
                    </AlertDescription>
                  </Alert>
                )}

                {horoscopeData && (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <User className="w-5 h-5 text-purple-600" />
                          Personal Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rashi:</span>
                            <span className="font-semibold">{horoscopeData.personalDetails.rashi}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nakshatra:</span>
                            <span className="font-semibold">{horoscopeData.personalDetails.nakshatra}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Gana:</span>
                            <span className="font-semibold">{horoscopeData.personalDetails.gana}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nadi:</span>
                            <span className="font-semibold">{horoscopeData.personalDetails.nadi}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Yoni:</span>
                            <span className="font-semibold">{horoscopeData.personalDetails.yoni}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Varna:</span>
                            <span className="font-semibold">{horoscopeData.personalDetails.varna}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-purple-600" />
                          Current Dasha
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Planet:</span>
                            <span className="font-semibold">{horoscopeData.dasha.current.planet}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Remaining:</span>
                            <span className="font-semibold">{horoscopeData.dasha.current.remainingPeriod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">End Date:</span>
                            <span className="font-semibold">{horoscopeData.dasha.current.endDate}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Sun className="w-5 h-5 text-yellow-600" />
                          Key Planets
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sun:</span>
                            <span className="font-semibold">{horoscopeData.planets.sun?.sign} ({horoscopeData.planets.sun?.house} house)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Moon:</span>
                            <span className="font-semibold">{horoscopeData.planets.moon?.sign} ({horoscopeData.planets.moon?.house} house)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mars:</span>
                            <span className="font-semibold">{horoscopeData.planets.mars?.sign} ({horoscopeData.planets.mars?.house} house)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-orange-600" />
                          Yogas & Doshas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-600 text-sm">Yogas:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {horoscopeData.yogas.slice(0, 3).map((yoga, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {yoga}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">Doshas:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Badge variant={horoscopeData.doshas.mangal ? "destructive" : "outline"} className="text-xs">
                                Mangal: {horoscopeData.doshas.mangal ? "Yes" : "No"}
                              </Badge>
                              <Badge variant={horoscopeData.doshas.kaal_sarpa ? "destructive" : "outline"} className="text-xs">
                                Kaal Sarpa: {horoscopeData.doshas.kaal_sarpa ? "Yes" : "No"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="marriage">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-pink-500" />
                      Marriage Compatibility Analysis
                    </CardTitle>
                    <CardDescription>Enter birth details for both partners to analyze compatibility</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3 text-pink-600">Bride Details</h3>
                        <div className="space-y-3">
                          <Input
                            placeholder="Bride's Name"
                            value={marriageDetails.brideName}
                            onChange={(e) => setMarriageDetails(prev => ({ ...prev, brideName: e.target.value }))}
                          />
                          <Input
                            type="date"
                            placeholder="Birth Date"
                            value={marriageDetails.brideBirthDate}
                            onChange={(e) => setMarriageDetails(prev => ({ ...prev, brideBirthDate: e.target.value }))}
                          />
                          <Input
                            type="time"
                            placeholder="Birth Time"
                            value={marriageDetails.brideBirthTime}
                            onChange={(e) => setMarriageDetails(prev => ({ ...prev, brideBirthTime: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3 text-blue-600">Groom Details</h3>
                        <div className="space-y-3">
                          <Input
                            placeholder="Groom's Name"
                            value={marriageDetails.groomName}
                            onChange={(e) => setMarriageDetails(prev => ({ ...prev, groomName: e.target.value }))}
                          />
                          <Input
                            type="date"
                            placeholder="Birth Date"
                            value={marriageDetails.groomBirthDate}
                            onChange={(e) => setMarriageDetails(prev => ({ ...prev, groomBirthDate: e.target.value }))}
                          />
                          <Input
                            type="time"
                            placeholder="Birth Time"
                            value={marriageDetails.groomBirthTime}
                            onChange={(e) => setMarriageDetails(prev => ({ ...prev, groomBirthTime: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <Button 
                        onClick={handleMarriageMatching}
                        disabled={!marriageDetails.brideBirthDate || !marriageDetails.groomBirthDate || marriageLoading}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        {marriageLoading ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Users className="w-4 h-4 mr-2" />
                        )}
                        Analyze Compatibility
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {marriageError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {marriageError}
                    </AlertDescription>
                  </Alert>
                )}

                {marriageData && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-center">Compatibility Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center mb-6">
                          <div className="text-5xl font-bold text-green-600 mb-2">
                            {marriageData.overallScore}/{marriageData.maxScore}
                          </div>
                          <div className="text-lg text-gray-600 mb-2">{marriageData.compatibility}</div>
                          <div className="text-sm text-gray-500 max-w-2xl mx-auto">{marriageData.recommendation}</div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4">
                          {Object.entries(marriageData.kutas).slice(0, 8).map(([name, kuta]) => (
                            <div key={name} className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border">
                              <div className="font-semibold text-sm capitalize text-purple-800 mb-1">
                                {name.replace('_', ' ')}
                              </div>
                              <div className="text-2xl font-bold text-purple-600 mb-1">
                                {kuta.score}/{kuta.maxScore}
                              </div>
                              <div className="text-xs text-gray-600">
                                {kuta.score === kuta.maxScore ? 'Perfect' : kuta.score > kuta.maxScore/2 ? 'Good' : 'Fair'}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                          <div className="p-4 bg-pink-50 rounded-lg">
                            <h4 className="font-semibold text-pink-800 mb-3">{marriageData.bride.name || 'Bride'}</h4>
                            <div className="space-y-2 text-sm">
                              <div>Nakshatra: {marriageData.bride.nakshatra}</div>
                              <div>Rashi: {marriageData.bride.rashi}</div>
                              <div>Gana: {marriageData.bride.gana}</div>
                              <div>Nadi: {marriageData.bride.nadi}</div>
                            </div>
                          </div>

                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-3">{marriageData.groom.name || 'Groom'}</h4>
                            <div className="space-y-2 text-sm">
                              <div>Nakshatra: {marriageData.groom.nakshatra}</div>
                              <div>Rashi: {marriageData.groom.rashi}</div>
                              <div>Gana: {marriageData.groom.gana}</div>
                              <div>Nadi: {marriageData.groom.nadi}</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                          <h4 className="font-semibold text-yellow-800 mb-2">Mangal Dosha Analysis</h4>
                          <div className="text-sm space-y-1">
                            <div>Bride: <Badge variant={marriageData.mangalDosha.bride ? "destructive" : "secondary"}>
                              {marriageData.mangalDosha.bride ? "Yes" : "No"}
                            </Badge></div>
                            <div>Groom: <Badge variant={marriageData.mangalDosha.groom ? "destructive" : "secondary"}>
                              {marriageData.mangalDosha.groom ? "Yes" : "No"}
                            </Badge></div>
                            <div>Matching: <span className="font-semibold">{marriageData.mangalDosha.matching}</span></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="numerology">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Calculator className="w-6 h-6 text-blue-500" />
                      Numerology Analysis
                    </CardTitle>
                    <CardDescription>Enter your name and birth date for comprehensive numerological insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={personalDetails.name}
                          onChange={(e) => setPersonalDetails(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="numBirthDate">Birth Date</Label>
                        <Input
                          id="numBirthDate"
                          type="date"
                          value={personalDetails.birthDate}
                          onChange={(e) => setPersonalDetails(prev => ({ ...prev, birthDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="system">System</Label>
                        <select
                          id="system"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={personalDetails.numerologySystem}
                          onChange={(e) => setPersonalDetails(prev => ({ ...prev, numerologySystem: e.target.value }))}
                        >
                          <option value="pythagorean">Pythagorean</option>
                          <option value="chaldean">Chaldean</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          onClick={refetchNumerology}
                          disabled={!personalDetails.name || !personalDetails.birthDate || numerologyLoading}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                        >
                          {numerologyLoading ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Calculator className="w-4 h-4 mr-2" />
                          )}
                          Analyze Numbers
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {numerologyError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {numerologyError}
                    </AlertDescription>
                  </Alert>
                )}

                {numerologyData && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Core Numbers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {Object.entries(numerologyData.coreNumbers).map(([key, number]) => (
                            <div key={key} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                              <div>
                                <div className="font-semibold capitalize text-blue-800">
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </div>
                                <div className="text-sm text-gray-600">{number.meaning}</div>
                              </div>
                              <div className="text-3xl font-bold text-purple-600">{number.number}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Lucky Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm font-semibold text-gray-700 mb-2">Lucky Numbers</div>
                              <div className="flex flex-wrap gap-2">
                                {numerologyData.personalityTraits.luckyNumbers.map((num, index) => (
                                  <Badge key={index} className="bg-blue-100 text-blue-800 border-0">{num}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-700 mb-2">Lucky Colors</div>
                              <div className="flex flex-wrap gap-2">
                                {numerologyData.personalityTraits.luckyColors.map((color, index) => (
                                  <Badge key={index} variant="outline" className="border-purple-200">{color}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-700 mb-2">Lucky Days</div>
                              <div className="flex flex-wrap gap-2">
                                {numerologyData.personalityTraits.luckyDays.map((day, index) => (
                                  <Badge key={index} className="bg-green-100 text-green-800 border-0">{day}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Gemstone & Metal</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-4 bg-yellow-50 rounded-lg">
                              <div className="text-sm font-semibold text-yellow-800 mb-1">Lucky Gemstone</div>
                              <div className="text-lg font-bold text-yellow-700">{numerologyData.luckyInfo.gemstone}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <div className="text-sm font-semibold text-gray-800 mb-1">Lucky Metal</div>
                              <div className="text-lg font-bold text-gray-700">{numerologyData.luckyInfo.metal}</div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="text-sm font-semibold text-blue-800 mb-1">Lucky Direction</div>
                              <div className="text-lg font-bold text-blue-700">{numerologyData.luckyInfo.direction}</div>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                              <div className="text-sm font-semibold text-orange-800 mb-1">Lucky Time</div>
                              <div className="text-lg font-bold text-orange-700">{numerologyData.luckyInfo.time}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Personality Traits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm font-semibold text-green-700 mb-2">Strengths</div>
                              <div className="flex flex-wrap gap-1">
                                {numerologyData.personalityTraits.strengths.map((strength, index) => (
                                  <Badge key={index} className="bg-green-100 text-green-800 border-0 text-xs">
                                    {strength}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-red-700 mb-2">Areas to Improve</div>
                              <div className="flex flex-wrap gap-1">
                                {numerologyData.personalityTraits.weaknesses.map((weakness, index) => (
                                  <Badge key={index} className="bg-red-100 text-red-800 border-0 text-xs">
                                    {weakness}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Current Year Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                            <div className="text-4xl font-bold text-purple-600 mb-2">
                              {numerologyData.currentYear.personalYear}
                            </div>
                            <div className="text-lg font-semibold text-purple-800 mb-2">
                              {numerologyData.currentYear.meaning}
                            </div>
                            <div className="text-sm text-gray-600">
                              {numerologyData.currentYear.description}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Life Predictions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Career</h4>
                            <p className="text-sm text-gray-700">{numerologyData.predictions.career}</p>
                          </div>
                          <div className="p-4 bg-pink-50 rounded-lg">
                            <h4 className="font-semibold text-pink-800 mb-2">Relationships</h4>
                            <p className="text-sm text-gray-700">{numerologyData.predictions.relationship}</p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">Health</h4>
                            <p className="text-sm text-gray-700">{numerologyData.predictions.health}</p>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <h4 className="font-semibold text-yellow-800 mb-2">Finance</h4>
                            <p className="text-sm text-gray-700">{numerologyData.predictions.finance}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
