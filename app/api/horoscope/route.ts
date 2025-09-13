import { NextRequest, NextResponse } from 'next/server';
import { PROKERALA_CONFIG, makeProKeralaRequest, createErrorResponse, formatDate } from '@/lib/prokerala-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');
    const latitude = searchParams.get('latitude') || '28.6139';
    const longitude = searchParams.get('longitude') || '77.2090';
    const chartType = searchParams.get('chart_type') || 'rasi'; // rasi, navamsa, etc.

    if (!dateParam || !timeParam) {
      return NextResponse.json(
        { success: false, error: 'Date and time are required for horoscope generation' },
        { status: 400 }
      );
    }

    const datetime = `${dateParam}T${timeParam}:00`;

    const params = {
      'ayanamsa': PROKERALA_CONFIG.DEFAULT_AYANAMSA.toString(),
      'coordinates': `${latitude},${longitude}`,
      'datetime': datetime,
      'chart_type': chartType
    };

    const apiData = await makeProKeralaRequest(PROKERALA_CONFIG.ENDPOINTS.HOROSCOPE, params);

    if (!apiData || !apiData.data) {
      throw new Error('Invalid API response: missing data structure');
    }

    const data = apiData.data;

    // Transform Horoscope API data
    const transformedData = {
      birthDetails: {
        date: formatDate(new Date(datetime)),
        time: timeParam,
        location: `${latitude}, ${longitude}`,
        chartType: chartType
      },
      
      // Basic planetary positions
      planets: {
        sun: {
          sign: data.planets?.sun?.sign?.name || 'N/A',
          degree: data.planets?.sun?.degree || 'N/A',
          house: data.planets?.sun?.house || 'N/A',
          nakshatra: data.planets?.sun?.nakshatra?.name || 'N/A'
        },
        moon: {
          sign: data.planets?.moon?.sign?.name || 'N/A',
          degree: data.planets?.moon?.degree || 'N/A',
          house: data.planets?.moon?.house || 'N/A',
          nakshatra: data.planets?.moon?.nakshatra?.name || 'N/A'
        },
        mars: {
          sign: data.planets?.mars?.sign?.name || 'N/A',
          degree: data.planets?.mars?.degree || 'N/A',
          house: data.planets?.mars?.house || 'N/A',
          nakshatra: data.planets?.mars?.nakshatra?.name || 'N/A'
        },
        mercury: {
          sign: data.planets?.mercury?.sign?.name || 'N/A',
          degree: data.planets?.mercury?.degree || 'N/A',
          house: data.planets?.mercury?.house || 'N/A',
          nakshatra: data.planets?.mercury?.nakshatra?.name || 'N/A'
        },
        jupiter: {
          sign: data.planets?.jupiter?.sign?.name || 'N/A',
          degree: data.planets?.jupiter?.degree || 'N/A',
          house: data.planets?.jupiter?.house || 'N/A',
          nakshatra: data.planets?.jupiter?.nakshatra?.name || 'N/A'
        },
        venus: {
          sign: data.planets?.venus?.sign?.name || 'N/A',
          degree: data.planets?.venus?.degree || 'N/A',
          house: data.planets?.venus?.house || 'N/A',
          nakshatra: data.planets?.venus?.nakshatra?.name || 'N/A'
        },
        saturn: {
          sign: data.planets?.saturn?.sign?.name || 'N/A',
          degree: data.planets?.saturn?.degree || 'N/A',
          house: data.planets?.saturn?.house || 'N/A',
          nakshatra: data.planets?.saturn?.nakshatra?.name || 'N/A'
        }
      },

      // Personal details from birth chart
      personalDetails: {
        rashi: data.rashi?.name || 'N/A',
        nakshatra: data.nakshatra?.name || 'N/A',
        nakshatraLord: data.nakshatra?.lord || 'N/A',
        gana: data.gana || 'N/A',
        nadi: data.nadi || 'N/A',
        yoni: data.yoni || 'N/A',
        varna: data.varna || 'N/A'
      },

      // Dasha periods
      dasha: {
        current: {
          planet: data.current_dasha?.planet || 'N/A',
          startDate: data.current_dasha?.start_date || 'N/A',
          endDate: data.current_dasha?.end_date || 'N/A',
          remainingPeriod: data.current_dasha?.remaining || 'N/A'
        },
        next: {
          planet: data.next_dasha?.planet || 'N/A',
          startDate: data.next_dasha?.start_date || 'N/A',
          endDate: data.next_dasha?.end_date || 'N/A'
        }
      },

      // Yogas and doshas
      yogas: data.yogas || [],
      doshas: {
        mangal: data.mangal_dosha || false,
        kaal_sarpa: data.kaal_sarpa_dosha || false,
        saade_sati: data.saade_sati || false,
        other: data.other_doshas || []
      },

      // House analysis
      houses: Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        sign: data.houses?.[i + 1]?.sign?.name || 'N/A',
        lord: data.houses?.[i + 1]?.lord || 'N/A',
        planets: data.houses?.[i + 1]?.planets || []
      })),

      // Additional information
      ascendant: {
        sign: data.ascendant?.sign?.name || 'N/A',
        degree: data.ascendant?.degree || 'N/A',
        nakshatra: data.ascendant?.nakshatra?.name || 'N/A'
      },

      chartData: data.chart_positions || {},
      recommendations: data.recommendations || []
    };

    console.log('Horoscope data transformed:', transformedData);
    return NextResponse.json({ success: true, data: transformedData });

  } catch (error) {
    console.error('Horoscope API route error:', error);
    
    // Fallback horoscope data
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');
    
    const fallbackData = {
      birthDetails: {
        date: dateParam ? formatDate(new Date(dateParam)) : 'Sample Date',
        time: timeParam || '12:00',
        location: '28.6139, 77.2090',
        chartType: 'rasi'
      },
      
      planets: {
        sun: { sign: 'Leo', degree: '15°30\'', house: '1st', nakshatra: 'Magha' },
        moon: { sign: 'Taurus', degree: '8°45\'', house: '10th', nakshatra: 'Rohini' },
        mars: { sign: 'Aries', degree: '22°15\'', house: '9th', nakshatra: 'Bharani' },
        mercury: { sign: 'Virgo', degree: '12°30\'', house: '2nd', nakshatra: 'Hasta' },
        jupiter: { sign: 'Sagittarius', degree: '5°20\'', house: '5th', nakshatra: 'Moola' },
        venus: { sign: 'Libra', degree: '18°45\'', house: '3rd', nakshatra: 'Swati' },
        saturn: { sign: 'Capricorn', degree: '28°10\'', house: '6th', nakshatra: 'Dhanishta' }
      },

      personalDetails: {
        rashi: 'Taurus',
        nakshatra: 'Rohini',
        nakshatraLord: 'Moon',
        gana: 'Manushya',
        nadi: 'Adi',
        yoni: 'Cow',
        varna: 'Vaishya'
      },

      dasha: {
        current: {
          planet: 'Jupiter',
          startDate: '2023-01-01',
          endDate: '2039-01-01',
          remainingPeriod: '14 years'
        },
        next: {
          planet: 'Saturn',
          startDate: '2039-01-01',
          endDate: '2058-01-01'
        }
      },

      yogas: ['Gaja Kesari Yoga', 'Dhana Yoga'],
      doshas: {
        mangal: false,
        kaal_sarpa: false,
        saade_sati: false,
        other: []
      },

      houses: Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        sign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][i],
        lord: 'Sample Lord',
        planets: []
      })),

      ascendant: {
        sign: 'Leo',
        degree: '15°30\'',
        nakshatra: 'Magha'
      },

      chartData: {},
      recommendations: ['This is a sample horoscope analysis for demonstration purposes.']
    };

    return createErrorResponse(error, fallbackData);
  }
}
