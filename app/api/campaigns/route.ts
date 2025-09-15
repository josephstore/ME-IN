// 캠페인 API 라우트
// GET: 캠페인 목록 조회
// POST: 새 캠페인 생성

import { NextRequest, NextResponse } from 'next/server'
import { CampaignService } from '@/lib/services/databaseService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      status: searchParams.get('status') || 'active',
      category: searchParams.get('category') || undefined,
      target_regions: searchParams.get('target_regions')?.split(',') || undefined,
      min_budget: searchParams.get('min_budget') ? parseInt(searchParams.get('min_budget')!) : undefined,
      max_budget: searchParams.get('max_budget') ? parseInt(searchParams.get('max_budget')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    }

    // 실제 데이터베이스에서 캠페인 조회 시도
    try {
      const campaigns = await CampaignService.getCampaigns(filters)
      
      return NextResponse.json({
        success: true,
        data: campaigns,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: campaigns.length
        }
      })
    } catch (dbError) {
      console.warn('데이터베이스 연결 실패, 더미 데이터 반환:', dbError)
      
      // 데이터베이스 연결 실패 시 더미 데이터 반환
      const dummyCampaigns = [
        {
          id: '1',
          title_ko: '캐어리 쿨링 토너 캠페인',
          title_en: 'Carery Cooling Toner Campaign',
          title_ar: 'حملة تونر كاري المبرد',
          description_ko: '시원하고 촉촉한 토너를 소개하는 캠페인',
          category: 'Beauty',
          budget_total: 5000,
          budget_per_influencer: 500,
          status: 'active',
          target_regions: ['UAE', 'Saudi Arabia', 'Qatar'],
          target_languages: ['ar', 'en'],
          min_followers: 10000,
          required_platforms: ['Instagram', 'TikTok'],
          created_at: new Date().toISOString(),
          brands: {
            company_name_ko: 'K-뷰티 코리아',
            company_name_en: 'K-Beauty Korea',
            logo_url: '/images/logo-arabic.png'
          }
        }
      ]
      
      return NextResponse.json({
        success: true,
        data: dummyCampaigns,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: dummyCampaigns.length
        },
        note: 'Using demo data - database connection not available'
      })
    }
  } catch (error) {
    console.error('Campaigns GET error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch campaigns',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { brand_id, ...campaignData } = body

    if (!brand_id) {
      return NextResponse.json(
        { success: false, error: 'Brand ID is required' },
        { status: 400 }
      )
    }

    // 임시로 더미 응답 반환
    const dummyCampaign = {
      id: Date.now().toString(),
      brand_id,
      ...campaignData,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: dummyCampaign
    }, { status: 201 })
  } catch (error) {
    console.error('Campaigns POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create campaign',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
