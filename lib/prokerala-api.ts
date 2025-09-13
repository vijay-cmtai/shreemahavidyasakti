import { NextResponse } from 'next/server';

// ProKerala API Configuration - Complete API endpoints
export const PROKERALA_CONFIG = {
  CLIENT_ID: 'e50d8a5a-6290-433f-86c2-41247b1bac4a',
  CLIENT_SECRET: 'Dg6hxY8vnyrqhG5z1zqQrwn3F10I1K10dVAMWWP',
  API_BASE_URL: 'https://api.prokerala.com',
  TOKEN_ENDPOINT: '/token',
  
  // All available API endpoints
  ENDPOINTS: {
    PANCHANG: '/v2/astrology/panchang',
    CALENDAR: '/v2/astrology/calendar',
    HOROSCOPE: '/v2/astrology/kundli',
    DAILY_HOROSCOPE: '/v2/horoscope/daily',
    MARRIAGE_MATCHING: '/v2/astrology/marriage-compatibility',
    NUMEROLOGY: '/v2/numerology/birth-number',
    CHALDEAN_NUMEROLOGY: '/v2/numerology/chaldean',
    WESTERN_BIRTH_CHART: '/v2/western-astrology/birth-chart',
    WESTERN_ASPECTS: '/v2/western-astrology/aspects',
  },
  
  DEFAULT_AYANAMSA: 1, // Lahiri Ayanamsa
  TOKEN_EXPIRY_BUFFER: 300 // 5 minutes buffer
};

export interface ProKeralaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Token cache
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('Using cached access token');
    return cachedToken;
  }

  try {
    const tokenUrl = `${PROKERALA_CONFIG.API_BASE_URL}${PROKERALA_CONFIG.TOKEN_ENDPOINT}`;
    console.log('Requesting new access token from:', tokenUrl);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': PROKERALA_CONFIG.CLIENT_ID,
        'client_secret': PROKERALA_CONFIG.CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token request failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      
      if (response.status === 401) {
        throw new Error('Invalid client credentials. Please check your Client ID and Client Secret.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. Your API account may not be activated.');
      } else if (response.status >= 500) {
        throw new Error('ProKerala API server error. Please try again later.');
      }
      
      throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
    }

    const tokenData: ProKeralaTokenResponse = await response.json();
    
    if (!tokenData.access_token) {
      throw new Error('Invalid token response: missing access_token');
    }
    
    // Cache the token with buffer before expiry
    cachedToken = tokenData.access_token;
    tokenExpiry = Date.now() + (tokenData.expires_in - PROKERALA_CONFIG.TOKEN_EXPIRY_BUFFER) * 1000;
    
    console.log('Successfully obtained access token, expires in:', tokenData.expires_in, 'seconds');
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    cachedToken = null;
    tokenExpiry = null;
    throw error instanceof Error ? error : new Error('Failed to authenticate with ProKerala API');
  }
}

export async function makeProKeralaRequest(
  endpoint: string,
  params: Record<string, string>
): Promise<any> {
  try {
    const accessToken = await getAccessToken();
    
    const url = new URL(`${PROKERALA_CONFIG.API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    console.log('Making ProKerala API request:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'User-Agent': 'Jyotish-Darshan/1.0'
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ProKerala API request failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: url.toString()
      });
      
      if (response.status === 401) {
        // Token might be expired, clear cache
        cachedToken = null;
        tokenExpiry = null;
        throw new Error('Authentication token expired or invalid. Please try again.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. Your API subscription may have expired.');
      } else if (response.status === 400) {
        throw new Error('Invalid request parameters.');
      } else if (response.status === 404) {
        throw new Error('API endpoint not found.');
      } else if (response.status >= 500) {
        throw new Error('ProKerala API server error. Please try again later.');
      }
      
      throw new Error(`ProKerala API error: ${response.status} ${response.statusText}`);
    }

    const apiData = await response.json();
    console.log('ProKerala API response received');
    return apiData;
  } catch (error) {
    console.error('ProKerala API request error:', error);
    throw error;
  }
}

export function createErrorResponse(error: unknown, fallbackData?: any) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  
  if (fallbackData) {
    return NextResponse.json({
      success: true,
      data: fallbackData,
      warning: `Using fallback data. ${errorMessage}`
    });
  }
  
  return NextResponse.json(
    { 
      success: false, 
      error: errorMessage 
    },
    { status: 500 }
  );
}

// Utility functions
export function formatTime(timeString: string): string {
  try {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  } catch {
    return timeString || 'N/A';
  }
}

export function formatDate(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return 'Invalid Date';
  }
}
