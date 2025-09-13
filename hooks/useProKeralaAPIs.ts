import { useState, useEffect } from 'react';

// Base API response interface
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  warning?: string;
}

// Calendar data interface
export interface CalendarData {
  date: string;
  calendarType: string;
  hinduDate: {
    year: string;
    month: string;
    day: string;
    paksha: string;
    season: string;
  };
  vikramSamvat: {
    year: string;
    month: string;
    day: string;
  };
  shalivahana: {
    year: string;
    month: string;
    day: string;
  };
  kaliYear: string;
  islamicDate: {
    year: string;
    month: string;
    day: string;
  };
  events: string[];
  festivals: string[];
  fasting: string[];
  specialDays: string[];
}

// Marriage matching data interface
export interface MarriageMatchingData {
  overallScore: number;
  maxScore: number;
  compatibility: string;
  recommendation: string;
  kutas: {
    [key: string]: {
      score: number;
      maxScore: number;
      description: string;
    };
  };
  bride: {
    name: string;
    nakshatra: string;
    rashi: string;
    gana: string;
    nadi: string;
    yoni: string;
  };
  groom: {
    name: string;
    nakshatra: string;
    rashi: string;
    gana: string;
    nadi: string;
    yoni: string;
  };
  mangalDosha: {
    bride: boolean;
    groom: boolean;
    matching: string;
  };
  rajjuMatching: string;
  vedhaMatching: string;
  summary: string;
}

// Horoscope data interface
export interface HoroscopeData {
  birthDetails: {
    date: string;
    time: string;
    location: string;
    chartType: string;
  };
  planets: {
    [key: string]: {
      sign: string;
      degree: string;
      house: string;
      nakshatra: string;
    };
  };
  personalDetails: {
    rashi: string;
    nakshatra: string;
    nakshatraLord: string;
    gana: string;
    nadi: string;
    yoni: string;
    varna: string;
  };
  dasha: {
    current: {
      planet: string;
      startDate: string;
      endDate: string;
      remainingPeriod: string;
    };
    next: {
      planet: string;
      startDate: string;
      endDate: string;
    };
  };
  yogas: string[];
  doshas: {
    mangal: boolean;
    kaal_sarpa: boolean;
    saade_sati: boolean;
    other: string[];
  };
  houses: Array<{
    number: number;
    sign: string;
    lord: string;
    planets: string[];
  }>;
  ascendant: {
    sign: string;
    degree: string;
    nakshatra: string;
  };
  chartData: any;
  recommendations: string[];
}

// Numerology data interface
export interface NumerologyData {
  personalInfo: {
    name: string;
    birthDate: string;
    system: string;
  };
  coreNumbers: {
    [key: string]: {
      number: number;
      meaning: string;
      description: string;
    };
  };
  additionalNumbers: {
    [key: string]: {
      number: number;
      meaning: string;
      description: string;
    };
  };
  nameAnalysis: {
    vowelSum: number;
    consonantSum: number;
    totalSum: number;
    reducedValue: number;
    nameRuling: number;
  };
  personalityTraits: {
    strengths: string[];
    weaknesses: string[];
    luckyNumbers: number[];
    luckyColors: string[];
    luckyDays: string[];
    compatibleNumbers: number[];
  };
  predictions: {
    career: string;
    relationship: string;
    health: string;
    finance: string;
  };
  currentYear: {
    personalYear: number;
    meaning: string;
    description: string;
  };
  recommendations: string[];
  luckyInfo: {
    gemstone: string;
    metal: string;
    direction: string;
    time: string;
  };
}

// Generic hook for API calls
function useAPICall<T>(
  url: string,
  dependencies: any[] = [],
  options: RequestInit = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      const result: APIResponse<T> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'API request was not successful');
      }

      if (result.warning) {
        console.warn('API Warning:', result.warning);
      }

      setData(result.data || null);
    } catch (err) {
      console.error('API call error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Calendar API hook
export const useCalendarData = (
  date?: Date,
  latitude?: number,
  longitude?: number,
  calendarType: string = 'amanta'
) => {
  const url = `/api/calendar?${new URLSearchParams({
    date: date?.toISOString() || new Date().toISOString(),
    latitude: latitude?.toString() || '28.6139',
    longitude: longitude?.toString() || '77.2090',
    type: calendarType
  }).toString()}`;

  return useAPICall<CalendarData>(url, [date, latitude, longitude, calendarType]);
};

// Marriage matching API hook
export const useMarriageMatching = (
  matchingData: {
    brideName?: string;
    brideBirthDate?: string;
    brideBirthTime?: string;
    brideCoordinates?: string;
    groomName?: string;
    groomBirthDate?: string;
    groomBirthTime?: string;
    groomCoordinates?: string;
    matchingSystem?: string;
  } | null
) => {
  const [data, setData] = useState<MarriageMatchingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performMatching = async () => {
    if (!matchingData || !matchingData.brideBirthDate || !matchingData.groomBirthDate) {
      setError('Complete birth details are required for both bride and groom');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/marriage-matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchingData),
      });

      const result: APIResponse<MarriageMatchingData> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Marriage matching request was not successful');
      }

      if (result.warning) {
        console.warn('API Warning:', result.warning);
      }

      setData(result.data || null);
    } catch (err) {
      console.error('Marriage matching error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    performMatching
  };
};

// Horoscope API hook
export const useHoroscopeData = (
  birthDate?: string,
  birthTime?: string,
  latitude?: number,
  longitude?: number,
  chartType: string = 'rasi'
) => {
  const url = birthDate && birthTime ? `/api/horoscope?${new URLSearchParams({
    date: birthDate,
    time: birthTime,
    latitude: latitude?.toString() || '28.6139',
    longitude: longitude?.toString() || '77.2090',
    chart_type: chartType
  }).toString()}` : '';

  return useAPICall<HoroscopeData>(url, [birthDate, birthTime, latitude, longitude, chartType]);
};

// Numerology API hook
export const useNumerologyData = (
  name?: string,
  birthDate?: string,
  system: string = 'pythagorean'
) => {
  const url = name && birthDate ? `/api/numerology?${new URLSearchParams({
    name,
    date: birthDate,
    system
  }).toString()}` : '';

  return useAPICall<NumerologyData>(url, [name, birthDate, system]);
};

// Combined hook for all services
export const useAllAstrologyData = (
  commonParams: {
    date?: Date;
    latitude?: number;
    longitude?: number;
  }
) => {
  const panchang = useAPICall(`/api/panchang?${new URLSearchParams({
    date: commonParams.date?.toISOString() || new Date().toISOString(),
    latitude: commonParams.latitude?.toString() || '28.6139',
    longitude: commonParams.longitude?.toString() || '77.2090'
  }).toString()}`, [commonParams.date, commonParams.latitude, commonParams.longitude]);

  const calendar = useCalendarData(
    commonParams.date, 
    commonParams.latitude, 
    commonParams.longitude
  );

  return {
    panchang,
    calendar,
    isLoading: panchang.loading || calendar.loading,
    hasError: panchang.error || calendar.error,
    refetchAll: () => {
      panchang.refetch();
      calendar.refetch();
    }
  };
};
