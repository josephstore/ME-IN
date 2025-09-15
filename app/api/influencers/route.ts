// 인플루언서 API 라우트
// GET: 인플루언서 목록 조회

import { NextRequest, NextResponse } from 'next/server'
import { InfluencerService } from '@/lib/services/databaseService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      expertise_areas: searchParams.get('expertise')?.split(',') || undefined,
      languages: searchParams.get('languages')?.split(',') || undefined,
      min_followers: searchParams.get('min_followers') ? parseInt(searchParams.get('min_followers')!) : undefined,
      platforms: searchParams.get('platforms')?.split(',') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    }

    // 실제 데이터베이스에서 인플루언서 조회 시도
    try {
      const influencers = await InfluencerService.getInfluencers(filters)
      
      return NextResponse.json({
        success: true,
        data: influencers,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: influencers.length
        }
      })
    } catch (dbError) {
      console.warn('데이터베이스 연결 실패, 더미 데이터 반환:', dbError)
      
      // 데이터베이스 연결 실패 시 더미 데이터 반환
      const dummyInfluencers = [
        {
          id: '1',
          name: 'Aisha Al-Rashid',
          bio_ko: '뷰티와 라이프스타일 인플루언서',
          bio_en: 'Beauty and lifestyle influencer',
          bio_ar: 'مؤثرة في الجمال ونمط الحياة',
          nationality: 'Saudi Arabia',
          current_location: 'Riyadh',
          languages: ['ar', 'en'],
          expertise_areas: ['Beauty', 'Lifestyle'],
          content_categories: ['Beauty', 'Fashion', 'Lifestyle'],
          is_verified: true,
          verification_level: 2,
          created_at: new Date().toISOString(),
          users: {
            email: 'aisha@me-in.com',
            is_verified: true
          },
          influencer_social_accounts: [
            {
              platform: 'Instagram',
              username: 'aisha_beauty',
              followers_count: 150000,
              avg_views: 12000,
              engagement_rate: 4.5,
              is_verified: true
            }
          ]
        }
      ]
      
      return NextResponse.json({
        success: true,
        data: dummyInfluencers,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: dummyInfluencers.length
        },
        note: 'Using demo data - database connection not available'
      })
    }
  } catch (error) {
    console.error('Influencers GET error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch influencers',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
