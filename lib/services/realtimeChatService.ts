/**
 * ME-IN 실시간 채팅 서비스
 * Supabase Realtime을 활용한 실시간 메시징 시스템
 */

import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface ChatMessage {
  id: string
  room_id: string
  sender_id: string
  receiver_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'system'
  attachments?: string[]
  read_at?: string | null
  created_at: string
  updated_at: string
}

export interface ChatRoom {
  id: string
  campaign_id: string
  brand_id: string
  influencer_id: string
  last_message?: ChatMessage
  unread_count: number
  created_at: string
  updated_at: string
}

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  type: 'brand' | 'influencer'
  is_online?: boolean
}

export class RealtimeChatService {
  private static channels: Map<string, RealtimeChannel> = new Map()

  /**
   * 채팅방 생성
   */
  static async createChatRoom(campaignId: string, brandId: string, influencerId: string): Promise<ChatRoom | null> {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          campaign_id: campaignId,
          brand_id: brandId,
          influencer_id: influencerId
        })
        .select()
        .single()

      if (error) {
        console.error('채팅방 생성 오류:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('채팅방 생성 중 오류:', error)
      return null
    }
  }

  /**
   * 사용자의 채팅방 목록 조회
   */
  static async getChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          last_message:chat_messages(*),
          brand:brands(company_name_ko, company_name_en, logo_url),
          influencer:influencers(display_name, avatar_url)
        `)
        .or(`brand_id.eq.${userId},influencer_id.eq.${userId}`)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('채팅방 목록 조회 오류:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('채팅방 목록 조회 중 오류:', error)
      return []
    }
  }

  /**
   * 채팅방의 메시지 목록 조회
   */
  static async getMessages(roomId: string, limit: number = 50): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('메시지 조회 오류:', error)
        return []
      }

      return (data || []).reverse()
    } catch (error) {
      console.error('메시지 조회 중 오류:', error)
      return []
    }
  }

  /**
   * 메시지 전송
   */
  static async sendMessage(
    roomId: string,
    senderId: string,
    receiverId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' = 'text',
    attachments?: string[]
  ): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: senderId,
          receiver_id: receiverId,
          content,
          message_type: messageType,
          attachments: attachments || []
        })
        .select()
        .single()

      if (error) {
        console.error('메시지 전송 오류:', error)
        return null
      }

      // 채팅방의 마지막 메시지 업데이트
      await supabase
        .from('chat_rooms')
        .update({ 
          last_message_id: data.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', roomId)

      return data
    } catch (error) {
      console.error('메시지 전송 중 오류:', error)
      return null
    }
  }

  /**
   * 실시간 메시지 구독
   */
  static subscribeToMessages(
    roomId: string,
    onMessage: (message: ChatMessage) => void,
    onError?: (error: any) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`chat_room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          onMessage(payload.new as ChatMessage)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          onMessage(payload.new as ChatMessage)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('메시지 구독 성공:', roomId)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('메시지 구독 오류:', roomId)
          onError?.(new Error('채널 구독 실패'))
        }
      })

    this.channels.set(roomId, channel)
    return channel
  }

  /**
   * 실시간 온라인 상태 구독
   */
  static subscribeToPresence(
    roomId: string,
    userId: string,
    onPresenceChange: (users: ChatUser[]) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`presence_${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        const users = Object.values(presenceState).flat().map((presence: any) => ({
          id: presence.presence_ref || presence.user_id || 'unknown',
          name: presence.name || 'Unknown User',
          type: presence.type || 'user'
        })) as ChatUser[]
        onPresenceChange(users)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('사용자 입장:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('사용자 퇴장:', key, leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString()
          })
        }
      })

    return channel
  }

  /**
   * 메시지 읽음 처리
   */
  static async markAsRead(roomId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('room_id', roomId)
        .eq('receiver_id', userId)
        .is('read_at', null)

      if (error) {
        console.error('읽음 처리 오류:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('읽음 처리 중 오류:', error)
      return false
    }
  }

  /**
   * 채널 구독 해제
   */
  static unsubscribe(roomId: string): void {
    const channel = this.channels.get(roomId)
    if (channel) {
      supabase.removeChannel(channel)
      this.channels.delete(roomId)
    }
  }

  /**
   * 모든 채널 구독 해제
   */
  static unsubscribeAll(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel)
    })
    this.channels.clear()
  }

  /**
   * 파일 업로드
   */
  static async uploadFile(file: File, roomId: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${roomId}_${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file)

      if (error) {
        console.error('파일 업로드 오류:', error)
        return null
      }

      const { data: publicData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName)

      return publicData.publicUrl
    } catch (error) {
      console.error('파일 업로드 중 오류:', error)
      return null
    }
  }

  /**
   * 사용자 정보 조회
   */
  static async getUserInfo(userId: string): Promise<ChatUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          display_name,
          avatar_url,
          user_type,
          brands(company_name_ko, company_name_en, logo_url),
          influencers(display_name, avatar_url)
        `)
        .eq('id', userId)
        .single()

      if (error) {
        console.error('사용자 정보 조회 오류:', error)
        return null
      }

      return {
        id: data.id,
        name: data.display_name || 'Unknown User',
        avatar: data.avatar_url,
        type: data.user_type,
        is_online: false
      }
    } catch (error) {
      console.error('사용자 정보 조회 중 오류:', error)
      return null
    }
  }
}
