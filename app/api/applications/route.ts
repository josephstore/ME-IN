// 애플리케이션 API 라우트
// POST: 새 애플리케이션 생성

import { NextRequest, NextResponse } from 'next/server'
import { ApplicationService, NotificationService } from '@/lib/services/databaseService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaign_id, influencer_id, ...applicationData } = body

    if (!campaign_id || !influencer_id) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID and Influencer ID are required' },
        { status: 400 }
      )
    }

    // 임시로 더미 응답 반환 (자동 승인)
    const dummyApplication = {
      id: Date.now().toString(),
      campaign_id,
      influencer_id,
      status: 'approved', // 자동 승인
      application_message: applicationData.application_message || '캠페인에 참여하고 싶습니다.',
      proposed_fee: applicationData.proposed_fee || 500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: dummyApplication,
      message: 'Application created and automatically approved'
    }, { status: 201 })
  } catch (error) {
    console.error('Applications POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create application',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
