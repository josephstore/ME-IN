'use client'

import React, { useState, useEffect } from 'react'
import { 
  MessageCircle, 
  Search, 
  Plus,
  Clock,
  Check,
  CheckCheck,
  Image as ImageIcon
} from 'lucide-react'
import { RealtimeChatService, ChatRoom, ChatMessage } from '@/lib/services/realtimeChatService'
import { useSimpleAuth } from '@/lib/SimpleAuthContext'

interface ChatRoomListProps {
  onSelectRoom: (room: ChatRoom) => void
  onCreateRoom?: () => void
}

export default function ChatRoomList({ onSelectRoom, onCreateRoom }: ChatRoomListProps) {
  const { user } = useSimpleAuth()
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadChatRooms()
    }
  }, [user])

  const loadChatRooms = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const chatRooms = await RealtimeChatService.getChatRooms(user.id)
      setRooms(chatRooms)
    } catch (error) {
      console.error('채팅방 목록 로드 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRooms = rooms.filter(room => {
    if (!searchQuery) return true
    
    const searchLower = searchQuery.toLowerCase()
    return (
      room.brand_id?.toLowerCase().includes(searchLower) ||
      room.influencer_id?.toLowerCase().includes(searchLower) ||
      room.campaign_id?.toLowerCase().includes(searchLower)
    )
  })

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else if (diffInHours < 168) { // 7일
      return date.toLocaleDateString('ko-KR', { 
        weekday: 'short' 
      })
    } else {
      return date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const getMessageStatus = (message: ChatMessage | null, currentUserId: string) => {
    if (!message || message.sender_id === currentUserId) return null
    
    if (message.read_at) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />
    } else {
      return <Check className="w-4 h-4 text-gray-400" />
    }
  }

  const getMessagePreview = (message: ChatMessage | null) => {
    if (!message) return '메시지가 없습니다.'
    
    switch (message.message_type) {
      case 'image':
        return '📷 이미지'
      case 'file':
        return '📎 파일'
      case 'system':
        return message.content
      default:
        return message.content
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">채팅</h2>
          {onCreateRoom && (
            <button
              onClick={onCreateRoom}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* 검색 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="채팅방 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">채팅방이 없습니다</p>
            <p className="text-sm text-center">
              브랜드나 인플루언서와의<br />
              첫 대화를 시작해보세요
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-3">
                  {/* 프로필 이미지 */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-gray-500" />
                    </div>
                  </div>

                  {/* 채팅방 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {room.brand_id === user?.id ? '인플루언서' : '브랜드'}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {room.last_message && (
                          <span className="text-xs text-gray-500">
                            {formatTime(room.last_message.created_at)}
                          </span>
                        )}
                        {getMessageStatus(room.last_message || null, user?.id || '')}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {getMessagePreview(room.last_message || null)}
                    </p>
                    
                    {room.unread_count > 0 && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          캠페인 ID: {room.campaign_id}
                        </span>
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {room.unread_count}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
