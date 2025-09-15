// 테스트 API - 데이터베이스 연결 확인
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/services/databaseService'

export async function GET() {
  try {
    // 간단한 테스트 쿼리
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .limit(1)

    if (error) {
      console.error('Database connection error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed',
          details: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: data
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
