// 대시보드 분석 API 라우트
// GET: 사용자 대시보드 통계 조회

import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/lib/services/databaseService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const userType = searchParams.get('user_type') as 'brand' | 'influencer'

    if (!userId || !userType) {
      return NextResponse.json(
        { success: false, error: 'User ID and User Type are required' },
        { status: 400 }
      )
    }

    // 실제 데이터베이스에서 통계 조회 시도
    try {
      const stats = await AnalyticsService.getDashboardStats(userId, userType)
      
      return NextResponse.json({
        success: true,
        data: stats
      })
    } catch (dbError) {
      console.warn('데이터베이스 연결 실패, 더미 데이터 반환:', dbError)
      
      // 데이터베이스 연결 실패 시 더미 통계 데이터 반환
      const dummyStats = userType === 'brand' ? {
        active_campaigns: 12,
        total_applications: 45,
        active_collaborations: 8,
        total_reach: 2100000,
        engagement_rate: 4.2,
        roi: 285
      } : {
        pending_applications: 3,
        active_collaborations: 5,
        total_followers: 150000,
        avg_engagement_rate: 4.5,
        completed_campaigns: 12
      }
      
      return NextResponse.json({
        success: true,
        data: dummyStats,
        note: 'Using demo data - database connection not available'
      })
    }
  } catch (error) {
    console.error('Dashboard analytics GET error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
