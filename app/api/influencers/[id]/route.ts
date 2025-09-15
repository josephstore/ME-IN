// 개별 인플루언서 API 라우트
// GET: 인플루언서 상세 조회

import { NextRequest, NextResponse } from 'next/server'
import { InfluencerService } from '@/lib/services/databaseService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const influencer = await InfluencerService.getInfluencerById(params.id)
    
    return NextResponse.json({
      success: true,
      data: influencer
    })
  } catch (error) {
    console.error('Influencer GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Influencer not found' },
      { status: 404 }
    )
  }
}
