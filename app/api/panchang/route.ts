import { NextRequest, NextResponse } from 'next/server';

// ProKerala API Configuration - Based on official documentation
const PROKERALA_CONFIG = {
  CLIENT_ID: 'e50d8a5a-6290-433f-86c2-41247b1bac4a',
  CLIENT_SECRET: 'Dg6hxY8vnyrqhG5z1zqQrwn3F10I1K10dVAMWWP',
  API_BASE_URL: 'https://api.prokerala.com',
  TOKEN_ENDPOINT: '/token',
  PANCHANG_ENDPOINT: '/v2/astrology/panchang',
  DEFAULT_AYANAMSA: 1, // Lahiri Ayanamsa
  TOKEN_EXPIRY_BUFFER: 300 // 5 minutes buffer before token expiry
};

interface ProKeralaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Token cache
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string> {
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

    console.log('Token request response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token request failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Check for specific error cases
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
    console.log('Successfully obtained access token, expires in:', tokenData.expires_in, 'seconds');
    
    // Validate token response
    if (!tokenData.access_token) {
      throw new Error('Invalid token response: missing access_token');
    }
    
    // Cache the token with buffer before expiry
    cachedToken = tokenData.access_token;
    tokenExpiry = Date.now() + (tokenData.expires_in - PROKERALA_CONFIG.TOKEN_EXPIRY_BUFFER) * 1000;
    
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    cachedToken = null;
    tokenExpiry = null;
    throw error instanceof Error ? error : new Error('Failed to authenticate with ProKerala API');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const latitude = searchParams.get('latitude') || '28.6139';
    const longitude = searchParams.get('longitude') || '77.2090';

    // Use provided date or current date
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    const datetime = targetDate.toISOString();

    // Get access token
    const accessToken = await getAccessToken();

    // Build API URL according to ProKerala documentation
    const panchangUrl = `${PROKERALA_CONFIG.API_BASE_URL}${PROKERALA_CONFIG.PANCHANG_ENDPOINT}`;
    const url = new URL(panchangUrl);
    url.searchParams.append('ayanamsa', PROKERALA_CONFIG.DEFAULT_AYANAMSA.toString());
    url.searchParams.append('coordinates', `${latitude},${longitude}`);
    url.searchParams.append('datetime', datetime);

    console.log('Fetching Panchang data from ProKerala:', url.toString());
    console.log('Request parameters:', {
      ayanamsa: PROKERALA_CONFIG.DEFAULT_AYANAMSA,
      coordinates: `${latitude},${longitude}`,
      datetime: datetime
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'User-Agent': 'Jyotish-Darshan/1.0'
      },
    });

    console.log('Panchang API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ProKerala Panchang API request failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: url.toString(),
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Handle specific API error cases
      if (response.status === 401) {
        // Token might be expired or invalid, clear cache
        cachedToken = null;
        tokenExpiry = null;
        throw new Error('Authentication token expired or invalid. Please try again.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. Your API subscription may have expired or you may have exceeded rate limits.');
      } else if (response.status === 400) {
        throw new Error('Invalid request parameters. Please check the date, coordinates, and ayanamsa values.');
      } else if (response.status === 404) {
        throw new Error('Panchang API endpoint not found. The API may have been updated.');
      } else if (response.status >= 500) {
        throw new Error('ProKerala API server error. Please try again later.');
      }
      
      throw new Error(`ProKerala API error: ${response.status} ${response.statusText}`);
    }

    const apiData = await response.json();
    console.log('Received Panchang API response:', JSON.stringify(apiData, null, 2));
    
    // Validate API response structure
    if (!apiData || !apiData.data) {
      throw new Error('Invalid API response: missing data structure');
    }

    const data = apiData.data;
    
    // Format time helper
    const formatTime = (timeString: string): string => {
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
    };

    // Transform API data to our format with safe property access
    const transformedData = {
      date: targetDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      sunrise: formatTime(data.sun_rise),
      sunset: formatTime(data.sun_set),
      moonrise: formatTime(data.moon_rise),
      moonset: formatTime(data.moon_set),
      tithi: data.tithi?.name || 'N/A',
      tithiDetails: data.tithi?.details || data.tithi?.summary || 'No details available',
      nakshatra: data.nakshatra?.name || 'N/A',
      nakshatraLord: data.nakshatra?.lord || 'N/A',
      yoga: data.yoga?.name || 'N/A',
      yogaMeaning: data.yoga?.meaning || data.yoga?.details || 'No meaning available',
      karana: data.karana?.name || 'N/A',
      paksha: data.paksha?.name || 'N/A',
      ritu: data.ritu?.name || 'N/A',
      hinduWeekday: data.hindu_weekday?.name || 'N/A',
      auspiciousTimes: Array.isArray(data.auspicious_period) ? data.auspicious_period : [],
      inauspiciousTimes: Array.isArray(data.inauspicious_period) ? data.inauspicious_period : [],
      specialEvents: [
        ...(data.tithi?.special ? [data.tithi.special] : []),
        ...(data.ritu?.name ? [`${data.ritu.name} Season`] : []),
        ...(data.hindu_weekday?.name ? [`${data.hindu_weekday.name} (Hindu Weekday)`] : [])
      ].filter(Boolean)
    };

    console.log('Transformed data:', transformedData);
    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('API route error:', error);
    
    // Provide fallback mock data if ProKerala API is unavailable
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    
    const mockData = {
      date: targetDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      sunrise: "06:12 AM",
      sunset: "05:48 PM",
      moonrise: "08:30 PM",
      moonset: "07:15 AM",
      tithi: "Shukla Paksha Tritiya",
      tithiDetails: "This is the third day of the bright fortnight",
      nakshatra: "Rohini",
      nakshatraLord: "Moon",
      yoga: "Shobhana",
      yogaMeaning: "Auspicious and beneficial",
      karana: "Bava",
      paksha: "Shukla Paksha",
      ritu: "Winter",
      hinduWeekday: "Somwar",
      auspiciousTimes: [
        { period: "06:12 AM - 07:30 AM", description: "Morning auspicious time" },
        { period: "11:45 AM - 01:15 PM", description: "Midday favorable period" },
        { period: "04:30 PM - 05:48 PM", description: "Evening beneficial time" }
      ],
      inauspiciousTimes: [
        { period: "12:30 PM - 01:15 PM", description: "Avoid important activities" },
        { period: "04:00 PM - 04:45 PM", description: "Inauspicious period" }
      ],
      specialEvents: [
        "Sample Astrological Event",
        "Winter Season",
        "Somwar (Hindu Weekday)"
      ]
    };

    // Return mock data with a warning
    return NextResponse.json({
      success: true,
      data: mockData,
      warning: "Using sample data. ProKerala API may be temporarily unavailable."
    });
  }
}
