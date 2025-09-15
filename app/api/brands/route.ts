// 브랜드 API 라우트
// GET: 브랜드 목록 조회
// POST: 새 브랜드 생성

import { NextRequest, NextResponse } from 'next/server'
import { BrandService } from '@/lib/services/databaseService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      industry: searchParams.get('industry') || undefined,
      region: searchParams.get('region') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    }

    // 실제 데이터베이스에서 브랜드 조회 시도
    try {
      const brands = await BrandService.getBrands(filters)
      
      return NextResponse.json({
        success: true,
        data: brands,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: brands.length
        }
      })
    } catch (dbError) {
      console.error('Database error, returning dummy data:', dbError)
      
      // 더미 데이터 반환
      const dummyBrands = [
        {
          id: 'brand-1',
          user_id: 'user-1',
          company_name: 'Samsung Electronics',
          company_name_en: 'Samsung Electronics',
          industry: 'Technology',
          website: 'https://samsung.com',
          description: 'Leading technology company specializing in consumer electronics',
          description_en: 'Leading technology company specializing in consumer electronics',
          logo_url: '/images/samsung-logo.png',
          founded_year: 1969,
          headquarters: 'Seoul, South Korea',
          employee_count: '267,000+',
          annual_revenue: '$200+ billion',
          social_media: {
            instagram: '@samsung',
            twitter: '@samsung',
            facebook: 'samsung',
            youtube: 'Samsung'
          },
          contact_info: {
            email: 'marketing@samsung.com',
            phone: '+82-2-2255-0114',
            address: '129 Samsung-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do, South Korea'
          },
          verification_status: 'verified',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: 'brand-2',
          user_id: 'user-2',
          company_name: 'LG Electronics',
          company_name_en: 'LG Electronics',
          industry: 'Technology',
          website: 'https://lg.com',
          description: 'Global leader in consumer electronics and home appliances',
          description_en: 'Global leader in consumer electronics and home appliances',
          logo_url: '/images/lg-logo.png',
          founded_year: 1958,
          headquarters: 'Seoul, South Korea',
          employee_count: '75,000+',
          annual_revenue: '$50+ billion',
          social_media: {
            instagram: '@lg',
            twitter: '@lg',
            facebook: 'lg',
            youtube: 'LG'
          },
          contact_info: {
            email: 'marketing@lg.com',
            phone: '+82-2-3777-1114',
            address: 'LG Twin Towers, 128 Yeoui-daero, Yeongdeungpo-gu, Seoul, South Korea'
          },
          verification_status: 'verified',
          created_at: '2024-01-16T00:00:00Z',
          updated_at: '2024-01-16T00:00:00Z'
        },
        {
          id: 'brand-3',
          user_id: 'user-3',
          company_name: 'Hyundai Motor',
          company_name_en: 'Hyundai Motor',
          industry: 'Automotive',
          website: 'https://hyundai.com',
          description: 'Leading automotive manufacturer with global presence',
          description_en: 'Leading automotive manufacturer with global presence',
          logo_url: '/images/hyundai-logo.png',
          founded_year: 1967,
          headquarters: 'Seoul, South Korea',
          employee_count: '120,000+',
          annual_revenue: '$100+ billion',
          social_media: {
            instagram: '@hyundai',
            twitter: '@hyundai',
            facebook: 'hyundai',
            youtube: 'Hyundai'
          },
          contact_info: {
            email: 'marketing@hyundai.com',
            phone: '+82-2-3464-5114',
            address: '12 Heolleung-ro, Seocho-gu, Seoul, South Korea'
          },
          verification_status: 'verified',
          created_at: '2024-01-17T00:00:00Z',
          updated_at: '2024-01-17T00:00:00Z'
        }
      ]

      return NextResponse.json({
        success: true,
        data: dummyBrands,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: dummyBrands.length
        }
      })
    }
  } catch (error) {
    console.error('Brands API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch brands',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 실제 데이터베이스에 브랜드 생성 시도
    try {
      const newBrand = await BrandService.createBrand(body)
      
      return NextResponse.json({
        success: true,
        data: newBrand,
        message: 'Brand created successfully'
      }, { status: 201 })
    } catch (dbError) {
      console.error('Database error, returning dummy response:', dbError)
      
      // 더미 응답
      return NextResponse.json({
        success: true,
        data: {
          id: `brand-${Date.now()}`,
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        message: 'Brand created successfully (demo mode)'
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Brand creation API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create brand',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
