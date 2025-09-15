// 데이터베이스 연결 상태 확인 API
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/services/databaseService'

export async function GET() {
  try {
    // 간단한 테스트 쿼리로 데이터베이스 연결 확인
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'disconnected',
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }

    // 연결 성공 시 추가 정보 수집
    const [brandsCount, influencersCount, campaignsCount] = await Promise.all([
      supabase.from('brands').select('id', { count: 'exact', head: true }),
      supabase.from('influencers').select('id', { count: 'exact', head: true }),
      supabase.from('campaigns').select('id', { count: 'exact', head: true })
    ])

    return NextResponse.json({
      status: 'connected',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      data: {
        brands_count: brandsCount.count || 0,
        influencers_count: influencersCount.count || 0,
        campaigns_count: campaignsCount.count || 0,
        system_settings: data?.length || 0
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Database connection error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}
