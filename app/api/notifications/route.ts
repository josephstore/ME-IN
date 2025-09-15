// 알림 API 라우트
// GET: 사용자 알림 조회
// PUT: 알림 읽음 처리

import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/services/databaseService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const notifications = await NotificationService.getUserNotifications(userId, limit)
    
    return NextResponse.json({
      success: true,
      data: notifications
    })
  } catch (error) {
    console.error('Notifications GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, notification_id, mark_all = false } = body

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    let result
    if (mark_all) {
      result = await NotificationService.markAllNotificationsAsRead(user_id)
    } else if (notification_id) {
      result = await NotificationService.markNotificationAsRead(notification_id)
    } else {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required for single notification' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Notifications PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}
