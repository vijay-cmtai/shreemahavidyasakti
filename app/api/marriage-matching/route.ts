import { NextRequest, NextResponse } from 'next/server';
import { PROKERALA_CONFIG, makeProKeralaRequest, createErrorResponse } from '@/lib/prokerala-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract bride and groom details
    const {
      brideName,
      brideBirthDate,
      brideBirthTime,
      brideCoordinates,
      groomName,
      groomBirthDate,
      groomBirthTime,
      groomCoordinates,
      matchingSystem = 'ashta_kuta' // ashta_kuta or dasha_kuta
    } = body;

    // Validate required fields
    if (!brideBirthDate || !brideBirthTime || !groomBirthDate || !groomBirthTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required birth details' },
        { status: 400 }
      );
    }

    const params = {
      'ayanamsa': PROKERALA_CONFIG.DEFAULT_AYANAMSA.toString(),
      'girl_dob': brideBirthDate,
      'girl_birth_time': brideBirthTime,
      'girl_coordinates': brideCoordinates || '28.6139,77.2090',
      'boy_dob': groomBirthDate,
      'boy_birth_time': groomBirthTime,
      'boy_coordinates': groomCoordinates || '28.6139,77.2090',
      'matching_system': matchingSystem
    };

    const apiData = await makeProKeralaRequest(PROKERALA_CONFIG.ENDPOINTS.MARRIAGE_MATCHING, params);

    if (!apiData || !apiData.data) {
      throw new Error('Invalid API response: missing data structure');
    }

    const data = apiData.data;

    // Transform Marriage Matching API data
    const transformedData = {
      overallScore: data.total_points || 0,
      maxScore: data.max_points || 36,
      compatibility: data.compatibility || 'Unknown',
      recommendation: data.result?.recommendation || 'Please consult an astrologer',
      
      // Individual Kuta scores
      kutas: {
        varna: {
          score: data.varna?.points || 0,
          maxScore: data.varna?.max_points || 1,
          description: data.varna?.description || 'Varna matching'
        },
        vasya: {
          score: data.vasya?.points || 0,
          maxScore: data.vasya?.max_points || 2,
          description: data.vasya?.description || 'Vasya matching'
        },
        tara: {
          score: data.tara?.points || 0,
          maxScore: data.tara?.max_points || 3,
          description: data.tara?.description || 'Tara matching'
        },
        yoni: {
          score: data.yoni?.points || 0,
          maxScore: data.yoni?.max_points || 4,
          description: data.yoni?.description || 'Yoni matching'
        },
        graha_maitri: {
          score: data.graha_maitri?.points || 0,
          maxScore: data.graha_maitri?.max_points || 5,
          description: data.graha_maitri?.description || 'Planetary friendship'
        },
        gana: {
          score: data.gana?.points || 0,
          maxScore: data.gana?.max_points || 6,
          description: data.gana?.description || 'Gana matching'
        },
        bhakoot: {
          score: data.bhakoot?.points || 0,
          maxScore: data.bhakoot?.max_points || 7,
          description: data.bhakoot?.description || 'Bhakoot matching'
        },
        nadi: {
          score: data.nadi?.points || 0,
          maxScore: data.nadi?.max_points || 8,
          description: data.nadi?.description || 'Nadi matching'
        }
      },
      
      // Bride and Groom details
      bride: {
        name: brideName || 'Bride',
        nakshatra: data.girl?.nakshatra?.name || 'N/A',
        rashi: data.girl?.rashi?.name || 'N/A',
        gana: data.girl?.gana || 'N/A',
        nadi: data.girl?.nadi || 'N/A',
        yoni: data.girl?.yoni || 'N/A'
      },
      groom: {
        name: groomName || 'Groom',
        nakshatra: data.boy?.nakshatra?.name || 'N/A',
        rashi: data.boy?.rashi?.name || 'N/A',
        gana: data.boy?.gana || 'N/A',
        nadi: data.boy?.nadi || 'N/A',
        yoni: data.boy?.yoni || 'N/A'
      },

      // Additional analysis
      mangalDosha: {
        bride: data.girl?.mangal_dosha || false,
        groom: data.boy?.mangal_dosha || false,
        matching: data.mangal_dosha_matching || 'Unknown'
      },
      
      rajjuMatching: data.rajju_matching || 'Unknown',
      vedhaMatching: data.vedha_matching || 'Unknown',
      
      summary: data.summary || 'Marriage compatibility analysis completed'
    };

    console.log('Marriage matching data transformed:', transformedData);
    return NextResponse.json({ success: true, data: transformedData });

  } catch (error) {
    console.error('Marriage matching API route error:', error);
    
    // Fallback marriage matching data
    const fallbackData = {
      overallScore: 24,
      maxScore: 36,
      compatibility: 'Good',
      recommendation: 'This is a good match with strong compatibility.',
      
      kutas: {
        varna: { score: 1, maxScore: 1, description: 'Excellent caste compatibility' },
        vasya: { score: 2, maxScore: 2, description: 'Perfect mutual attraction' },
        tara: { score: 3, maxScore: 3, description: 'Favorable birth star compatibility' },
        yoni: { score: 2, maxScore: 4, description: 'Good physical compatibility' },
        graha_maitri: { score: 4, maxScore: 5, description: 'Strong planetary friendship' },
        gana: { score: 6, maxScore: 6, description: 'Perfect temperament match' },
        bhakoot: { score: 3, maxScore: 7, description: 'Good love and affection' },
        nadi: { score: 3, maxScore: 8, description: 'Favorable health compatibility' }
      },
      
      bride: {
        name: 'Bride',
        nakshatra: 'Rohini',
        rashi: 'Taurus',
        gana: 'Manushya',
        nadi: 'Adi',
        yoni: 'Cow'
      },
      groom: {
        name: 'Groom',
        nakshatra: 'Mrigashira',
        rashi: 'Gemini',
        gana: 'Deva',
        nadi: 'Madhya',
        yoni: 'Snake'
      },

      mangalDosha: {
        bride: false,
        groom: false,
        matching: 'Compatible'
      },
      
      rajjuMatching: 'Compatible',
      vedhaMatching: 'No Vedha',
      summary: 'This is a sample marriage compatibility analysis showing good overall compatibility.'
    };

    return createErrorResponse(error, fallbackData);
  }
}
