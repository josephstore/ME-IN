import { supabase } from '../supabase'
import {
  Message,
  Notification,
  ApiResponse
} from '../types/database'

export class MessagingService {
  // 메시지 전송
  static async sendMessage(data: {
    receiver_id: string
    application_id?: string
    content: string
    message_type: 'text' | 'file' | 'image'
    file_url?: string
  }): Promise<ApiResponse<Message>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: data.receiver_id,
          application_id: data.application_id,
          content: data.content,
          message_type: data.message_type,
          file_url: data.file_url,
          is_read: false
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      // 알림 생성
      await this.createNotification({
        user_id: data.receiver_id,
        title: '새 메시지',
        message: `새로운 메시지가 도착했습니다.`,
        type: 'message',
        reference_id: message.id,
        reference_type: 'message'
      })

      return { data: message, error: null, success: true }
    } catch (error) {
      return { data: null, error: '메시지 전송 중 오류가 발생했습니다.', success: false }
    }
  }

  // 대화 목록 조회
  static async getConversations(): Promise<ApiResponse<{
    conversation_id: string
    other_user: any
    last_message: Message
    unread_count: number
  }[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 보낸 메시지와 받은 메시지를 모두 조회
      const { data: sentMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false })

      const { data: receivedMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })

      // 대화 상대별로 그룹화
      const conversations = new Map()

      // 보낸 메시지 처리
      sentMessages?.forEach(message => {
        const conversationId = message.receiver_id
        if (!conversations.has(conversationId)) {
          conversations.set(conversationId, {
            conversation_id: conversationId,
            last_message: message,
            unread_count: 0
          })
        }
      })

      // 받은 메시지 처리
      receivedMessages?.forEach(message => {
        const conversationId = message.sender_id
        if (!conversations.has(conversationId)) {
          conversations.set(conversationId, {
            conversation_id: conversationId,
            last_message: message,
            unread_count: message.is_read ? 0 : 1
          })
        } else {
          const conversation = conversations.get(conversationId)
          if (message.created_at > conversation.last_message.created_at) {
            conversation.last_message = message
          }
          if (!message.is_read) {
            conversation.unread_count += 1
          }
        }
      })

      // 사용자 정보 조회
      const conversationList = Array.from(conversations.values())
      for (const conversation of conversationList) {
        const { data: otherUser } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', conversation.conversation_id)
          .single()
        
        conversation.other_user = otherUser
      }

      return { 
        data: conversationList.sort((a, b) => 
          new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime()
        ), 
        error: null, 
        success: true 
      }
    } catch (error) {
      return { data: null, error: '대화 목록 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 특정 대화의 메시지 조회
  static async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      // 읽지 않은 메시지를 읽음으로 표시
      const unreadMessages = messages?.filter(msg => 
        msg.receiver_id === user.id && !msg.is_read
      ) || []

      if (unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessages.map(msg => msg.id))
      }

      return { data: messages, error: null, success: true }
    } catch (error) {
      return { data: null, error: '메시지 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 애플리케이션 관련 메시지 조회
  static async getApplicationMessages(applicationId: string): Promise<ApiResponse<Message[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 애플리케이션 권한 확인
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (appError) {
        return { data: null, error: '애플리케이션을 찾을 수 없습니다.', success: false }
      }

      // 권한 확인 (인플루언서 또는 브랜드)
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('user_type')
        .eq('user_id', user.id)
        .single()

      if (userProfile?.user_type === 'influencer') {
        // 인플루언서는 자신의 애플리케이션만 볼 수 있음
        if (application.influencer_profile_id !== user.id) {
          return { data: null, error: '이 애플리케이션에 접근할 권한이 없습니다.', success: false }
        }
      } else if (userProfile?.user_type === 'brand') {
        // 브랜드는 자신의 캠페인 애플리케이션만 볼 수 있음
        const { data: campaign } = await supabase
          .from('campaigns')
          .select('brand_profile_id')
          .eq('id', application.campaign_id)
          .single()

        if (campaign?.brand_profile_id !== user.id) {
          return { data: null, error: '이 애플리케이션에 접근할 권한이 없습니다.', success: false }
        }
      }

      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true })

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: messages, error: null, success: true }
    } catch (error) {
      return { data: null, error: '애플리케이션 메시지 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 파일 업로드
  static async uploadFile(file: File): Promise<ApiResponse<string>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const fileName = `${Date.now()}_${file.name}`
      
      const { error } = await supabase.storage
        .from('message-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      const { data: urlData } = supabase.storage
        .from('message-files')
        .getPublicUrl(fileName)

      return { data: urlData.publicUrl, error: null, success: true }
    } catch (error) {
      return { data: null, error: '파일 업로드 중 오류가 발생했습니다.', success: false }
    }
  }

  // 알림 생성
  static async createNotification(data: {
    user_id: string
    title: string
    message: string
    type: string
    reference_id?: string
    reference_type?: string
  }): Promise<ApiResponse<Notification>> {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          ...data,
          is_read: false
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: notification, error: null, success: true }
    } catch (error) {
      return { data: null, error: '알림 생성 중 오류가 발생했습니다.', success: false }
    }
  }

  // 알림 목록 조회
  static async getNotifications(): Promise<ApiResponse<Notification[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: notifications, error: null, success: true }
    } catch (error) {
      return { data: null, error: '알림 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 알림 읽음 처리
  static async markNotificationAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { data: notification, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: notification, error: null, success: true }
    } catch (error) {
      return { data: null, error: '알림 읽음 처리 중 오류가 발생했습니다.', success: false }
    }
  }

  // 모든 알림 읽음 처리
  static async markAllNotificationsAsRead(): Promise<ApiResponse<null>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: null, error: null, success: true }
    } catch (error) {
      return { data: null, error: '알림 읽음 처리 중 오류가 발생했습니다.', success: false }
    }
  }

  // 읽지 않은 알림 수 조회
  static async getUnreadNotificationCount(): Promise<ApiResponse<number>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: count || 0, error: null, success: true }
    } catch (error) {
      return { data: null, error: '알림 수 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 읽지 않은 메시지 수 조회
  static async getUnreadMessageCount(): Promise<ApiResponse<number>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false)

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: count || 0, error: null, success: true }
    } catch (error) {
      return { data: null, error: '메시지 수 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 실시간 구독 설정
  static subscribeToMessages(callback: (message: Message) => void) {
    return supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        callback(payload.new as Message)
      })
      .subscribe()
  }

  // 실시간 알림 구독 설정
  static subscribeToNotifications(callback: (notification: Notification) => void) {
    return supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        callback(payload.new as Notification)
      })
      .subscribe()
  }
}
