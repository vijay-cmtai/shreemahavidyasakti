import { useState, useEffect } from 'react';
import { PROKERALA_CONFIG } from '@/lib/prokerala-config';

export interface PanchangData {
  date: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  tithi: string;
  tithiDetails: string;
  nakshatra: string;
  nakshatraLord: string;
  yoga: string;
  yogaMeaning: string;
  karana: string;
  paksha: string;
  ritu: string;
  hinduWeekday: string;
  auspiciousTimes: Array<{period: string; description: string}>;
  inauspiciousTimes: Array<{period: string; description: string}>;
  specialEvents: string[];
}

export interface PanchangApiResponse {
  success: boolean;
  data?: PanchangData;
  error?: string;
}

// Updated function to use internal API route
const fetchPanchangData = async (
  date?: Date, 
  latitude?: number, 
  longitude?: number
): Promise<PanchangApiResponse> => {
  try {
    // Use provided coordinates or default to Delhi
    const lat = latitude || PROKERALA_CONFIG.DEFAULT_COORDINATES.latitude;
    const lng = longitude || PROKERALA_CONFIG.DEFAULT_COORDINATES.longitude;
    
    // Build internal API URL
    const url = new URL('/api/panchang', window.location.origin);
    
    if (date) {
      url.searchParams.append('date', date.toISOString());
    }
    url.searchParams.append('latitude', lat.toString());
    url.searchParams.append('longitude', lng.toString());
    
    console.log('Fetching Panchang data from internal API:', url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'API request was not successful');
    }

    // If there's a warning, log it but still return the data
    if (result.warning) {
      console.warn('API Warning:', result.warning);
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error fetching Panchang data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch Panchang data' 
    };
  }
};

export const usePanchangData = (
  selectedDate?: Date, 
  latitude?: number, 
  longitude?: number
) => {
  const [data, setData] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    const response = await fetchPanchangData(selectedDate, latitude, longitude);
    
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.error || 'Unknown error occurred');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedDate, latitude, longitude]);

  return {
    data,
    loading,
    error,
    refetch: loadData
  };
};

// Real API integration example:
/*
const fetchPanchangData = async (date?: Date): Promise<PanchangApiResponse> => {
  try {
    const apiDate = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    const response = await fetch(`/api/panchang?date=${apiDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch Panchang data' 
    };
  }
};
*/
