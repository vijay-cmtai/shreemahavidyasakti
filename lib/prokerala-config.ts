// ProKerala API Configuration
export const PROKERALA_CONFIG = {
  CLIENT_ID: 'e50d8a5a-6290-433f-86c2-41247b1bac4a',
  CLIENT_SECRET: 'Dg6hxY8vnyrqhG5z1zqQrwn3F10I1K10dVAMWWP',
  API_BASE_URL: 'https://api.prokerala.com',
  TOKEN_URL: 'https://api.prokerala.com/token',
  PANCHANG_URL: 'https://api.prokerala.com/v2/astrology/panchang',
  
  // Default coordinates for Delhi, India
  DEFAULT_COORDINATES: {
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'Asia/Kolkata'
  },
  
  // Ayanamsa: 1 = Lahiri (most commonly used in Indian astrology)
  DEFAULT_AYANAMSA: 1
};

export interface ProKeralaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ProKeralaPanchangResponse {
  data: {
    tithi: {
      id: number;
      name: string;
      special: string | null;
      summary: string;
      deity: string;
      details: string;
    };
    nakshatra: {
      id: number;
      name: string;
      lord: string;
      deity: string;
      summary: string;
      details: string;
    };
    yoga: {
      id: number;
      name: string;
      meaning: string;
      details: string;
    };
    karana: {
      id: number;
      name: string;
      deity: string;
      details: string;
    };
    hindu_weekday: {
      id: number;
      name: string;
    };
    paksha: {
      id: number;
      name: string;
      type: string;
    };
    ritu: {
      id: number;
      name: string;
      description: string;
    };
    sun_rise: string;
    sun_set: string;
    moon_rise: string;
    moon_set: string;
    auspicious_period: Array<{
      period: string;
      description: string;
    }>;
    inauspicious_period: Array<{
      period: string;
      description: string;
    }>;
  };
}

// Token management
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await fetch(PROKERALA_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': PROKERALA_CONFIG.CLIENT_ID,
        'client_secret': PROKERALA_CONFIG.CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
    }

    const tokenData: ProKeralaTokenResponse = await response.json();
    
    // Cache the token with 5 minutes buffer before expiry
    cachedToken = tokenData.access_token;
    tokenExpiry = Date.now() + (tokenData.expires_in - 300) * 1000;
    
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to authenticate with ProKerala API');
  }
}
