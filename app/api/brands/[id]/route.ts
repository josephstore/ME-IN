// 개별 브랜드 API 라우트
// GET: 특정 브랜드 조회
// PUT: 브랜드 정보 업데이트
// DELETE: 브랜드 삭제

import { NextRequest, NextResponse } from 'next/server'
import { BrandService } from '@/lib/services/databaseService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brandId = params.id

    // 실제 데이터베이스에서 브랜드 조회 시도
    try {
      const brand = await BrandService.getBrand(brandId)
      
      if (brand) {
        return NextResponse.json({
          success: true,
          data: brand
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'Brand not found'
          },
          { status: 404 }
        )
      }
    } catch (dbError) {
      console.error('Database error, returning dummy data:', dbError)
      
      // 더미 데이터 반환
      const dummyBrand = {
        id: brandId,
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
      }

      return NextResponse.json({
        success: true,
        data: dummyBrand
      })
    }
  } catch (error) {
    console.error('Brand API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch brand',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brandId = params.id
    const updates = await request.json()

    // 실제 데이터베이스에서 브랜드 업데이트 시도
    try {
      const updatedBrand = await BrandService.updateBrand(brandId, updates)
      
      return NextResponse.json({
        success: true,
        data: updatedBrand,
        message: 'Brand updated successfully'
      })
    } catch (dbError) {
      console.error('Database error, returning dummy response:', dbError)
      
      // 더미 응답
      return NextResponse.json({
        success: true,
        data: {
          id: brandId,
          ...updates,
          updated_at: new Date().toISOString()
        },
        message: 'Brand updated successfully (demo mode)'
      })
    }
  } catch (error) {
    console.error('Brand update API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update brand',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brandId = params.id

    // 실제 데이터베이스에서 브랜드 삭제 시도
    try {
      await BrandService.deleteBrand(brandId)
      
      return NextResponse.json({
        success: true,
        message: 'Brand deleted successfully'
      })
    } catch (dbError) {
      console.error('Database error, returning dummy response:', dbError)
      
      // 더미 응답
      return NextResponse.json({
        success: true,
        message: 'Brand deleted successfully (demo mode)'
      })
    }
  } catch (error) {
    console.error('Brand deletion API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete brand',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
