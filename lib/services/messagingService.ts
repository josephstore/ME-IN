/**
 * ME-IN 실시간 메시징 서비스
 * 브랜드와 인플루언서 간의 실시간 채팅 기능
 */

import { supabase } from '@/lib/supabase'

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  campaign_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'system'
  attachments: string[]
  read_at: string | null
  created_at: string
}

export interface ChatRoom {
  id: string
  campaign_id: string
  brand_id: string
  influencer_id: string
  last_message: Message | null
  unread_count: number
  created_at: string
}

export interface User {
  id: string
  name: string
  avatar: string
  type: 'brand' | 'influencer'
}

export class MessagingService {
  /**
   * 채팅방 목록 조회
   */
  static async getChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          campaign_id,
          sender_id,
          receiver_id,
          content,
          message_type,
          created_at,
          read_at,
          campaigns!inner(
            id,
            title,
            brand_profiles!inner(
              id,
              company_name,
              user_id
            )
          )
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      // 채팅방별로 그룹화
      const chatRoomsMap = new Map<string, ChatRoom>()
      
      data?.forEach((message: any) => {
        const campaignId = message.campaign_id
        const isSender = message.sender_id === userId
        const otherUserId = isSender ? message.receiver_id : message.sender_id

        if (!chatRoomsMap.has(campaignId)) {
          chatRoomsMap.set(campaignId, {
            id: campaignId,
            campaign_id: campaignId,
            brand_id: message.campaigns.brand_profiles.user_id,
            influencer_id: otherUserId,
            last_message: {
              id: message.id,
              sender_id: message.sender_id,
              receiver_id: message.receiver_id,
              campaign_id: message.campaign_id,
              content: message.content,
              message_type: message.message_type,
              attachments: [],
              read_at: message.read_at,
              created_at: message.created_at
            },
            unread_count: 0,
            created_at: message.created_at
          })
        }
      })

      return Array.from(chatRoomsMap.values())
    } catch (error) {
      console.error('Error fetching chat rooms:', error)
      return []
    }
  }

  /**
   * 특정 채팅방의 메시지 조회
   */
  static async getMessages(
    campaignId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('campaign_id', campaignId)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  /**
   * 메시지 전송
   */
  static async sendMessage(
    senderId: string,
    receiverId: string,
    campaignId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' = 'text',
    attachments: string[] = []
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          campaign_id: campaignId,
          content,
          message_type: messageType,
          attachments
        })
        .select()
        .single()

      if (error) throw error

      // 실시간 업데이트를 위한 알림 생성
      await this.createNotification(
        receiverId,
        'message',
        '새로운 메시지',
        content,
        { campaign_id: campaignId, sender_id: senderId }
      )

      return data
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  }

  /**
   * 메시지 읽음 처리
   */
  static async markAsRead(messageId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('receiver_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking message as read:', error)
      return false
    }
  }

  /**
   * 채팅방의 모든 메시지 읽음 처리
   */
  static async markAllAsRead(campaignId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('campaign_id', campaignId)
        .eq('receiver_id', userId)
        .is('read_at', null)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking all messages as read:', error)
      return false
    }
  }

  /**
   * 파일 업로드
   */
  static async uploadFile(
    file: File,
    campaignId: string,
    userId: string
  ): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${campaignId}/${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      return null
    }
  }

  /**
   * 실시간 메시지 구독
   */
  static subscribeToMessages(
    campaignId: string,
    userId: string,
    onMessage: (message: Message) => void
  ) {
    return supabase
      .channel(`messages:${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `campaign_id=eq.${campaignId}`
        },
        (payload) => {
          const message = payload.new as Message
          if (message.sender_id !== userId) {
            onMessage(message)
          }
        }
      )
      .subscribe()
  }

  /**
   * 실시간 채팅방 업데이트 구독
   */
  static subscribeToChatRooms(
    userId: string,
    onUpdate: (chatRoom: ChatRoom) => void
  ) {
    return supabase
      .channel(`chat_rooms:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${userId},receiver_id.eq.${userId})`
        },
        async (payload) => {
          // 채팅방 정보 업데이트
          const message = payload.new as Message
          const chatRoom = await this.getChatRoomByCampaign(message.campaign_id, userId)
          if (chatRoom) {
            onUpdate(chatRoom)
          }
        }
      )
      .subscribe()
  }

  /**
   * 특정 캠페인의 채팅방 정보 조회
   */
  private static async getChatRoomByCampaign(
    campaignId: string,
    userId: string
  ): Promise<ChatRoom | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          campaign_id,
          sender_id,
          receiver_id,
          content,
          message_type,
          created_at,
          read_at
        `)
        .eq('campaign_id', campaignId)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      const isSender = data.sender_id === userId
      const otherUserId = isSender ? data.receiver_id : data.sender_id

      return {
        id: campaignId,
        campaign_id: campaignId,
        brand_id: otherUserId, // 실제로는 캠페인에서 브랜드 ID를 가져와야 함
        influencer_id: otherUserId,
        last_message: {
          id: 'dummy-message-id',
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          campaign_id: data.campaign_id,
          content: data.content,
          message_type: data.message_type,
          attachments: [],
          read_at: data.read_at,
          created_at: data.created_at
        },
        unread_count: 0,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error fetching chat room:', error)
      return null
    }
  }

  /**
   * 알림 생성
   */
  private static async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data: any = {}
  ): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data
        })
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  /**
   * 사용자 정보 조회
   */
  static async getUserInfo(userId: string): Promise<User | null> {
    try {
      // 브랜드 프로필에서 조회
      const { data: brandData } = await supabase
        .from('brand_profiles')
        .select('company_name, user_id')
        .eq('user_id', userId)
        .single()

      if (brandData) {
        return {
          id: userId,
          name: brandData.company_name,
          avatar: '/images/logo-arabic.png',
          type: 'brand'
        }
      }

      // 인플루언서 프로필에서 조회
      const { data: influencerData } = await supabase
        .from('influencer_profiles')
        .select('display_name, avatar_url, user_id')
        .eq('user_id', userId)
        .single()

      if (influencerData) {
        return {
          id: userId,
          name: influencerData.display_name,
          avatar: influencerData.avatar_url || '/images/avatar.jpg',
          type: 'influencer'
        }
      }

      return null
    } catch (error) {
      console.error('Error fetching user info:', error)
      return null
    }
  }

  /**
   * 채팅방 생성 (캠페인 신청 시)
   */
  static async createChatRoom(
    campaignId: string,
    brandId: string,
    influencerId: string
  ): Promise<boolean> {
    try {
      // 첫 메시지로 채팅방 생성
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: brandId,
          receiver_id: influencerId,
          campaign_id: campaignId,
          content: '캠페인에 대한 협업을 시작합니다!',
          message_type: 'system'
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error creating chat room:', error)
      return false
    }
  }
}