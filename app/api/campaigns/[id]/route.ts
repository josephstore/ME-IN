// 개별 캠페인 API 라우트
// GET: 캠페인 상세 조회
// PUT: 캠페인 수정
// DELETE: 캠페인 삭제

import { NextRequest, NextResponse } from 'next/server'
import { CampaignService } from '@/lib/services/databaseService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await CampaignService.getCampaignById(params.id)
    
    return NextResponse.json({
      success: true,
      data: campaign
    })
  } catch (error) {
    console.error('Campaign GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Campaign not found' },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const campaign = await CampaignService.updateCampaign(params.id, body)
    
    return NextResponse.json({
      success: true,
      data: campaign
    })
  } catch (error) {
    console.error('Campaign PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 캠페인 상태를 cancelled로 변경 (실제 삭제 대신)
    const campaign = await CampaignService.updateCampaign(params.id, {
      status: 'cancelled'
    })
    
    return NextResponse.json({
      success: true,
      data: campaign
    })
  } catch (error) {
    console.error('Campaign DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}
