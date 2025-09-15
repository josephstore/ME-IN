// 메시지 API 라우트
// POST: 새 메시지 전송

import { NextRequest, NextResponse } from 'next/server'
import { MessagingService } from '@/lib/services/databaseService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { room_id, sender_id, content, message_type = 'text' } = body

    if (!room_id || !sender_id || !content) {
      return NextResponse.json(
        { success: false, error: 'Room ID, Sender ID, and content are required' },
        { status: 400 }
      )
    }

    const message = await MessagingService.sendMessage(
      room_id,
      sender_id,
      content,
      message_type
    )
    
    return NextResponse.json({
      success: true,
      data: message
    }, { status: 201 })
  } catch (error) {
    console.error('Messages POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
