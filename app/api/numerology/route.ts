import { NextRequest, NextResponse } from 'next/server';
import { PROKERALA_CONFIG, makeProKeralaRequest, createErrorResponse, formatDate } from '@/lib/prokerala-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const dateParam = searchParams.get('date');
    const system = searchParams.get('system') || 'pythagorean'; // pythagorean or chaldean

    if (!name || !dateParam) {
      return NextResponse.json(
        { success: false, error: 'Name and birth date are required for numerology analysis' },
        { status: 400 }
      );
    }

    const endpoint = system === 'chaldean' 
      ? PROKERALA_CONFIG.ENDPOINTS.CHALDEAN_NUMEROLOGY 
      : PROKERALA_CONFIG.ENDPOINTS.NUMEROLOGY;

    const params = {
      'name': name,
      'date': dateParam,
      'system': system
    };

    const apiData = await makeProKeralaRequest(endpoint, params);

    if (!apiData || !apiData.data) {
      throw new Error('Invalid API response: missing data structure');
    }

    const data = apiData.data;

    // Transform Numerology API data
    const transformedData = {
      personalInfo: {
        name: name,
        birthDate: formatDate(new Date(dateParam)),
        system: system
      },

      // Core numbers
      coreNumbers: {
        lifePathNumber: {
          number: data.life_path_number?.number || 0,
          meaning: data.life_path_number?.meaning || 'N/A',
          description: data.life_path_number?.description || 'Life path number represents your life journey and purpose'
        },
        destinyNumber: {
          number: data.destiny_number?.number || 0,
          meaning: data.destiny_number?.meaning || 'N/A',
          description: data.destiny_number?.description || 'Destiny number shows what you are meant to accomplish'
        },
        soulUrgeNumber: {
          number: data.soul_urge_number?.number || 0,
          meaning: data.soul_urge_number?.meaning || 'N/A',
          description: data.soul_urge_number?.description || 'Soul urge number reveals your inner desires'
        },
        personalityNumber: {
          number: data.personality_number?.number || 0,
          meaning: data.personality_number?.meaning || 'N/A',
          description: data.personality_number?.description || 'Personality number shows how others see you'
        },
        birthDayNumber: {
          number: data.birth_day_number?.number || 0,
          meaning: data.birth_day_number?.meaning || 'N/A',
          description: data.birth_day_number?.description || 'Birth day number indicates your natural talents'
        }
      },

      // Additional numbers
      additionalNumbers: {
        maturityNumber: {
          number: data.maturity_number?.number || 0,
          meaning: data.maturity_number?.meaning || 'N/A',
          description: data.maturity_number?.description || 'Maturity number represents your later life goals'
        },
        karmaNumber: {
          number: data.karma_number?.number || 0,
          meaning: data.karma_number?.meaning || 'N/A',
          description: data.karma_number?.description || 'Karma number shows lessons from past lives'
        },
        hiddenPassionNumber: {
          number: data.hidden_passion_number?.number || 0,
          meaning: data.hidden_passion_number?.meaning || 'N/A',
          description: data.hidden_passion_number?.description || 'Hidden passion number reveals your secret desires'
        }
      },

      // Name analysis
      nameAnalysis: {
        vowelSum: data.vowel_sum || 0,
        consonantSum: data.consonant_sum || 0,
        totalSum: data.total_sum || 0,
        reducedValue: data.reduced_value || 0,
        nameRuling: data.name_ruling_number || 0
      },

      // Personality traits
      personalityTraits: {
        strengths: data.strengths || ['Sample strength'],
        weaknesses: data.weaknesses || ['Sample weakness'],
        luckyNumbers: data.lucky_numbers || [1, 3, 5],
        luckyColors: data.lucky_colors || ['Red', 'Yellow'],
        luckyDays: data.lucky_days || ['Monday', 'Wednesday'],
        compatibleNumbers: data.compatible_numbers || [2, 4, 6]
      },

      // Career and relationships
      predictions: {
        career: data.career_prediction || 'Career guidance based on numerology',
        relationship: data.relationship_prediction || 'Relationship insights from numbers',
        health: data.health_prediction || 'Health guidance based on numerological analysis',
        finance: data.finance_prediction || 'Financial insights from your numbers'
      },

      // Year analysis
      currentYear: {
        personalYear: data.personal_year?.number || 0,
        meaning: data.personal_year?.meaning || 'N/A',
        description: data.personal_year?.description || 'Your personal year number for current year'
      },

      // Recommendations
      recommendations: data.recommendations || [
        'This is a sample numerology analysis for demonstration purposes.'
      ],

      // Lucky information
      luckyInfo: {
        gemstone: data.lucky_gemstone || 'Ruby',
        metal: data.lucky_metal || 'Gold',
        direction: data.lucky_direction || 'East',
        time: data.lucky_time || 'Morning'
      }
    };

    console.log('Numerology data transformed:', transformedData);
    return NextResponse.json({ success: true, data: transformedData });

  } catch (error) {
    console.error('Numerology API route error:', error);
    
    // Fallback numerology data
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'Sample Name';
    const dateParam = searchParams.get('date');
    const system = searchParams.get('system') || 'pythagorean';
    
    const fallbackData = {
      personalInfo: {
        name: name,
        birthDate: dateParam ? formatDate(new Date(dateParam)) : 'Sample Date',
        system: system
      },

      coreNumbers: {
        lifePathNumber: {
          number: 7,
          meaning: 'The Seeker',
          description: 'You are naturally inclined towards spirituality and deep thinking.'
        },
        destinyNumber: {
          number: 3,
          meaning: 'The Creative',
          description: 'You are meant to express creativity and bring joy to others.'
        },
        soulUrgeNumber: {
          number: 5,
          meaning: 'The Adventurer',
          description: 'Your inner desire is for freedom and adventure.'
        },
        personalityNumber: {
          number: 8,
          meaning: 'The Achiever',
          description: 'Others see you as ambitious and goal-oriented.'
        },
        birthDayNumber: {
          number: 1,
          meaning: 'The Leader',
          description: 'You have natural leadership abilities.'
        }
      },

      additionalNumbers: {
        maturityNumber: {
          number: 1,
          meaning: 'The Pioneer',
          description: 'In later life, you will focus on independence and leadership.'
        },
        karmaNumber: {
          number: 4,
          meaning: 'The Builder',
          description: 'Past life lessons involve learning discipline and hard work.'
        },
        hiddenPassionNumber: {
          number: 6,
          meaning: 'The Nurturer',
          description: 'Your secret passion is caring for others and creating harmony.'
        }
      },

      nameAnalysis: {
        vowelSum: 15,
        consonantSum: 22,
        totalSum: 37,
        reducedValue: 1,
        nameRuling: 1
      },

      personalityTraits: {
        strengths: ['Leadership', 'Creativity', 'Intuition', 'Independence'],
        weaknesses: ['Impatience', 'Overthinking', 'Stubbornness'],
        luckyNumbers: [1, 3, 5, 7, 9],
        luckyColors: ['Red', 'Orange', 'Yellow'],
        luckyDays: ['Sunday', 'Tuesday', 'Thursday'],
        compatibleNumbers: [2, 4, 6, 8]
      },

      predictions: {
        career: 'Your numbers suggest success in creative or leadership roles. Consider careers in arts, management, or spirituality.',
        relationship: 'You are compatible with people who can match your intellectual depth and respect your independence.',
        health: 'Pay attention to stress management and maintain a balanced lifestyle for optimal health.',
        finance: 'Your financial success will come through creative ventures and wise investments.'
      },

      currentYear: {
        personalYear: 5,
        meaning: 'Year of Change',
        description: 'This year brings opportunities for travel, change, and new experiences.'
      },

      recommendations: [
        'Focus on developing your creative talents',
        'Trust your intuition in decision-making',
        'Maintain balance between independence and cooperation',
        'This year is favorable for making significant life changes'
      ],

      luckyInfo: {
        gemstone: 'Ruby',
        metal: 'Gold',
        direction: 'East',
        time: 'Morning (6-9 AM)'
      }
    };

    return createErrorResponse(error, fallbackData);
  }
}
