import { supabase } from '../supabase'
import { networkService } from './networkService'

export interface ChatMessage {
  id: string
  room_id: string
  sender_id: string
  sender_name: string
  sender_type: 'brand' | 'influencer'
  content: string
  message_type: 'text' | 'image' | 'file'
  created_at: string
  read_at?: string
  is_read: boolean
}

export interface ChatRoom {
  id: string
  campaign_id: string
  brand_id: string
  influencer_id: string
  brand_name: string
  influencer_name: string
  last_message?: string
  last_message_at?: string
  unread_count: number
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export class ChatService {
  // 채팅방 생성
  static async createChatRoom(campaignId: string, influencerId: string): Promise<ApiResponse<ChatRoom>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 기존 채팅방 확인
      const { data: existingRoom } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('influencer_id', influencerId)
        .single()

      if (existingRoom) {
        return { data: existingRoom, error: null, success: true }
      }

      // 새 채팅방 생성
      const { data: room, error } = await supabase
        .from('chat_rooms')
        .insert({
          campaign_id: campaignId,
          brand_id: user.id,
          influencer_id: influencerId
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: room, error: null, success: true }
    } catch (error) {
      return { data: null, error: '채팅방 생성 중 오류가 발생했습니다.', success: false }
    }
  }

  // 채팅방 목록 조회
  static async getChatRooms(): Promise<ApiResponse<ChatRoom[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { data: rooms, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          campaigns (
            title,
            brand_profiles (
              company_name
            )
          ),
          influencer_profiles (
            display_name
          )
        `)
        .or(`brand_id.eq.${user.id},influencer_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: rooms, error: null, success: true }
    } catch (error) {
      return { data: null, error: '채팅방 목록 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 메시지 전송
  static async sendMessage(roomId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text'): Promise<ApiResponse<ChatMessage>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 사용자 정보 조회
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('display_name, user_type')
        .eq('user_id', user.id)
        .single()

      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: user.id,
          sender_name: userProfile?.display_name || user.email,
          sender_type: userProfile?.user_type || 'influencer',
          content,
          message_type: messageType
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      // 채팅방 업데이트 시간 갱신
      await supabase
        .from('chat_rooms')
        .update({ 
          updated_at: new Date().toISOString(),
          last_message: content,
          last_message_at: new Date().toISOString()
        })
        .eq('id', roomId)

      return { data: message, error: null, success: true }
    } catch (error) {
      return { data: null, error: '메시지 전송 중 오류가 발생했습니다.', success: false }
    }
  }

  // 메시지 목록 조회
  static async getMessages(roomId: string, limit: number = 50, offset: number = 0): Promise<ApiResponse<ChatMessage[]>> {
    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: messages.reverse(), error: null, success: true }
    } catch (error) {
      return { data: null, error: '메시지 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 메시지 읽음 처리
  static async markAsRead(roomId: string, messageIds: string[]): Promise<ApiResponse<null>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { error } = await supabase
        .from('chat_messages')
        .update({ 
          read_at: new Date().toISOString(),
          is_read: true
        })
        .in('id', messageIds)
        .neq('sender_id', user.id)

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: null, error: null, success: true }
    } catch (error) {
      return { data: null, error: '읽음 처리 중 오류가 발생했습니다.', success: false }
    }
  }

  // 실시간 메시지 구독
  static subscribeToMessages(roomId: string, onMessage: (message: ChatMessage) => void) {
    const subscription = supabase
      .channel(`chat_room_${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        onMessage(payload.new as ChatMessage)
      })
      .subscribe()

    return subscription
  }

  // 실시간 채팅방 업데이트 구독
  static subscribeToRooms(onRoomUpdate: (room: ChatRoom) => void) {
    const { data: { user } } = supabase.auth.getUser()
    if (!user) return null

    const subscription = supabase
      .channel('chat_rooms')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_rooms',
        filter: `brand_id=eq.${user.id},influencer_id=eq.${user.id}`
      }, (payload) => {
        onRoomUpdate(payload.new as ChatRoom)
      })
      .subscribe()

    return subscription
  }
}


