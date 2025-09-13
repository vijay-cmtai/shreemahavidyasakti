import { NextRequest, NextResponse } from 'next/server';
import { PROKERALA_CONFIG, makeProKeralaRequest, createErrorResponse, formatDate } from '@/lib/prokerala-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const latitude = searchParams.get('latitude') || '28.6139';
    const longitude = searchParams.get('longitude') || '77.2090';
    const calendarType = searchParams.get('type') || 'amanta'; // amanta, purnimanta, etc.

    const targetDate = dateParam ? new Date(dateParam) : new Date();
    const datetime = targetDate.toISOString();

    const params = {
      'ayanamsa': PROKERALA_CONFIG.DEFAULT_AYANAMSA.toString(),
      'coordinates': `${latitude},${longitude}`,
      'datetime': datetime,
      'calendar_type': calendarType
    };

    const apiData = await makeProKeralaRequest(PROKERALA_CONFIG.ENDPOINTS.CALENDAR, params);

    if (!apiData || !apiData.data) {
      throw new Error('Invalid API response: missing data structure');
    }

    const data = apiData.data;

    // Transform Calendar API data
    const transformedData = {
      date: formatDate(targetDate),
      calendarType: calendarType,
      hinduDate: {
        year: data.hindu_year || 'N/A',
        month: data.hindu_month?.name || 'N/A',
        day: data.hindu_day || 'N/A',
        paksha: data.paksha?.name || 'N/A',
        season: data.ritu?.name || 'N/A'
      },
      vikramSamvat: {
        year: data.vikram_samvat?.year || 'N/A',
        month: data.vikram_samvat?.month || 'N/A',
        day: data.vikram_samvat?.day || 'N/A'
      },
      shalivahana: {
        year: data.shalivahana?.year || 'N/A',
        month: data.shalivahana?.month || 'N/A',
        day: data.shalivahana?.day || 'N/A'
      },
      kaliYear: data.kali_year || 'N/A',
      islamicDate: {
        year: data.islamic_year || 'N/A',
        month: data.islamic_month || 'N/A',
        day: data.islamic_day || 'N/A'
      },
      events: data.events || [],
      festivals: data.festivals || [],
      fasting: data.fasting || [],
      specialDays: [
        ...(data.events || []),
        ...(data.festivals || []),
        ...(data.fasting || [])
      ]
    };

    console.log('Calendar data transformed:', transformedData);
    return NextResponse.json({ success: true, data: transformedData });

  } catch (error) {
    console.error('Calendar API route error:', error);
    
    // Fallback calendar data
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    
    const fallbackData = {
      date: formatDate(targetDate),
      calendarType: 'amanta',
      hinduDate: {
        year: '2081',
        month: 'Magha',
        day: '15',
        paksha: 'Shukla Paksha',
        season: 'Winter'
      },
      vikramSamvat: {
        year: '2081',
        month: 'Magha',
        day: '15'
      },
      shalivahana: {
        year: '1947',
        month: 'Magha',
        day: '15'
      },
      kaliYear: '5126',
      islamicDate: {
        year: '1446',
        month: 'Rajab',
        day: '12'
      },
      events: ['Sample Religious Event'],
      festivals: ['Sample Festival'],
      fasting: ['Sample Fasting Day'],
      specialDays: ['Sample Religious Event', 'Sample Festival', 'Sample Fasting Day']
    };

    return createErrorResponse(error, fallbackData);
  }
}
