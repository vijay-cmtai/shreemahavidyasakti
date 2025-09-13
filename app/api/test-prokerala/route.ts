import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test the ProKerala API integration
    const baseUrl = request.url.replace('/api/test-prokerala', '');
    const testUrl = `${baseUrl}/api/panchang?latitude=28.6139&longitude=77.2090`;
    
    console.log('Testing ProKerala API integration:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    return NextResponse.json({
      status: response.ok ? 'success' : 'error',
      statusCode: response.status,
      message: response.ok ? 'ProKerala API integration working correctly' : 'ProKerala API integration failed',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test ProKerala API integration',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
