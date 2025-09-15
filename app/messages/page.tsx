'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessagingService } from '@/lib/services/databaseService'
import { Message, Notification } from '@/lib/types/database'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Image as ImageIcon,
  File,
  Bell,
  Check,
  X,
  Search,
  MoreVertical
} from 'lucide-react'

export default function MessagesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCounts, setUnreadCounts] = useState({
    messages: 0,
    notifications: 0
  })

  useEffect(() => {
    loadConversations()
    loadNotifications()
    loadUnreadCounts()
    setupRealtimeSubscriptions()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.conversation_id)
    }
  }, [selectedConversation])

  const setupRealtimeSubscriptions = () => {
    // 메시지 실시간 구독
    // TODO: 실시간 구독 기능 구현 필요
    // const messageSubscription = MessagingService.subscribeToMessages((message) => {
    //   if (selectedConversation && 
    //       (message.sender_id === selectedConversation.conversation_id || 
    //        message.receiver_id === selectedConversation.conversation_id)) {
    //     setMessages(prev => [...prev, message])
    //   }
    //   loadConversations() // 대화 목록 업데이트
    //   loadUnreadCounts()
    // })

    // 알림 실시간 구독
    // TODO: 실시간 구독 기능 구현 필요
    // const notificationSubscription = MessagingService.subscribeToNotifications((notification) => {
    //   setNotifications(prev => [notification, ...prev])
    //   loadUnreadCounts()
    // })

    return () => {
      // messageSubscription.unsubscribe()
      // notificationSubscription.unsubscribe()
    }
  }

  const loadConversations = async () => {
    try {
      setLoading(true)
      // TODO: 실제 대화 목록 로드 기능 구현 필요
      // const response = await MessagingService.getUserChatRooms('demo-user')
      // if (response.success) {
      //   setConversations(response.data || [])
      // }
      setConversations([]) // 더미 데이터
    } catch (error) {
      console.error('대화 목록 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      // TODO: 실제 메시지 로드 기능 구현 필요
      // const response = await MessagingService.getChatMessages(conversationId)
      // if (response.success) {
      //   setMessages(response.data || [])
      // }
      setMessages([]) // 더미 데이터
    } catch (error) {
      console.error('메시지 로드 오류:', error)
    }
  }

  const loadNotifications = async () => {
    try {
      // TODO: 실제 알림 로드 기능 구현 필요
      // const response = await MessagingService.getUserNotifications('demo-user')
      // if (response.success) {
      //   setNotifications(response.data || [])
      // }
      setNotifications([]) // 더미 데이터
    } catch (error) {
      console.error('알림 로드 오류:', error)
    }
  }

  const loadUnreadCounts = async () => {
    try {
      // TODO: 실제 읽지 않은 메시지 수 로드 기능 구현 필요
      // const [messageCount, notificationCount] = await Promise.all([
      //   MessagingService.getUnreadMessageCount(),
      //   MessagingService.getUnreadNotificationCount()
      // ])

      setUnreadCounts({
        messages: 0, // 더미 데이터
        notifications: 0 // 더미 데이터
      })
    } catch (error) {
      console.error('읽지 않은 수 로드 오류:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      setSending(true)
      // TODO: 실제 메시지 전송 기능 구현 필요
      // const response = await MessagingService.sendMessage(
      //   selectedConversation.conversation_id,
      //   'demo-user',
      //   newMessage,
      //   'text'
      // )

      // if (response.success) {
      //   setNewMessage('')
      //   setMessages(prev => [...prev, response.data!])
      // }
      setNewMessage('') // 더미 데이터
    } catch (error) {
      console.error('메시지 전송 오류:', error)
    } finally {
      setSending(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedConversation) return

    try {
      setSending(true)
      // TODO: 실제 파일 업로드 기능 구현 필요
      // const uploadResponse = await MessagingService.uploadFile(file)
      
      // if (uploadResponse.success) {
      //   const messageType = file.type.startsWith('image/') ? 'image' : 'file'
      //   const response = await MessagingService.sendMessage(
      //     selectedConversation.conversation_id,
      //     'demo-user',
      //     file.name,
      //     messageType
      //   )

      //   if (response.success) {
      //     setMessages(prev => [...prev, response.data!])
      //   }
      // }
      console.log('파일 업로드:', file.name) // 더미 데이터
    } catch (error) {
      console.error('파일 업로드 오류:', error)
    } finally {
      setSending(false)
    }
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      // TODO: 실제 알림 읽음 처리 기능 구현 필요
      // await MessagingService.markNotificationAsRead(notificationId)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      )
      loadUnreadCounts()
    } catch (error) {
      console.error('알림 읽음 처리 오류:', error)
    }
  }

  const markAllNotificationsAsRead = async () => {
    try {
      // TODO: 실제 모든 알림 읽음 처리 기능 구현 필요
      // await MessagingService.markAllNotificationsAsRead()
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
      loadUnreadCounts()
    } catch (error) {
      console.error('모든 알림 읽음 처리 오류:', error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else {
      return date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.sender_id === selectedConversation?.conversation_id
    const isFile = message.message_type === 'file' || message.message_type === 'image'

    return (
      <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'} rounded-lg px-4 py-2`}>
          {isFile ? (
            <div className="flex items-center space-x-2">
              {message.message_type === 'image' ? (
                <ImageIcon className="w-4 h-4" />
              ) : (
                <File className="w-4 h-4" />
              )}
              <a 
                href={message.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                {message.content}
              </a>
            </div>
          ) : (
            <p className="text-sm">{message.content}</p>
          )}
          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatTime(message.created_at)}
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">메시지를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* 사이드바 */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* 헤더 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">메시지</h1>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setShowNotifications(!showNotifications)}
                  variant="outline"
                  size="sm"
                  className="relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCounts.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCounts.notifications}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* 알림 패널 */}
          {showNotifications && (
            <div className="border-b border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">알림</h3>
                <Button
                  onClick={markAllNotificationsAsRead}
                  size="sm"
                  variant="outline"
                >
                  모두 읽음
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {notifications.slice(0, 5).map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-2 rounded text-sm ${notification.is_read ? 'bg-white' : 'bg-blue-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      {!notification.is_read && (
                        <Button
                          onClick={() => markNotificationAsRead(notification.id)}
                          size="sm"
                          variant="ghost"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs">{notification.message}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 대화 목록 */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>아직 대화가 없습니다.</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.conversation_id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation?.conversation_id === conversation.conversation_id 
                      ? 'bg-blue-50 border-blue-200' 
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {conversation.other_user?.display_name?.[0] || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {conversation.other_user?.display_name || '사용자'}
                        </p>
                        {conversation.unread_count > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.last_message.content}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(conversation.last_message.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 메인 채팅 영역 */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* 채팅 헤더 */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {selectedConversation.other_user?.display_name?.[0] || 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {selectedConversation.other_user?.display_name || '사용자'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.other_user?.user_type === 'brand' ? '브랜드' : '인플루언서'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 메시지 영역 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>아직 메시지가 없습니다.</p>
                    <p className="text-sm">첫 번째 메시지를 보내보세요!</p>
                  </div>
                ) : (
                  messages.map(renderMessage)
                )}
              </div>

              {/* 메시지 입력 */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Paperclip className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </label>
                  
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={sending}
                  />
                  
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">대화를 선택하세요</h3>
                <p>왼쪽에서 대화를 선택하여 메시지를 주고받을 수 있습니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
