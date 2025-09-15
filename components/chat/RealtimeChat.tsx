'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Languages
} from 'lucide-react'
import { RealtimeChatService, ChatMessage, ChatRoom, ChatUser } from '@/lib/services/realtimeChatService'
import { useSimpleAuth } from '@/lib/SimpleAuthContext'
import TranslationWidget from '@/components/translation/TranslationWidget'

interface RealtimeChatProps {
  roomId: string
  onBack?: () => void
}

export default function RealtimeChat({ roomId, onBack }: RealtimeChatProps) {
  const { user } = useSimpleAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 메시지 목록 로드
  useEffect(() => {
    loadMessages()
  }, [roomId])

  // 실시간 구독 설정
  useEffect(() => {
    if (!roomId || !user) return

    // 메시지 구독
    const messageChannel = RealtimeChatService.subscribeToMessages(
      roomId,
      (message) => {
        setMessages(prev => [...prev, message])
        scrollToBottom()
      },
      (error) => {
        console.error('메시지 구독 오류:', error)
      }
    )

    // 온라인 상태 구독
    const presenceChannel = RealtimeChatService.subscribeToPresence(
      roomId,
      user.id,
      (users) => {
        setOnlineUsers(users)
      }
    )

    return () => {
      RealtimeChatService.unsubscribe(roomId)
    }
  }, [roomId, user])

  // 메시지 목록 자동 스크롤
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      const messageList = await RealtimeChatService.getMessages(roomId)
      setMessages(messageList)
    } catch (error) {
      console.error('메시지 로드 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || isSending) return

    setIsSending(true)
    try {
      const message = await RealtimeChatService.sendMessage(
        roomId,
        user.id,
        '', // receiver_id는 서버에서 처리
        newMessage.trim()
      )

      if (message) {
        setNewMessage('')
        // 메시지 읽음 처리
        await RealtimeChatService.markAsRead(roomId, user.id)
      }
    } catch (error) {
      console.error('메시지 전송 오류:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      const fileUrl = await RealtimeChatService.uploadFile(file, roomId)
      if (fileUrl) {
        await RealtimeChatService.sendMessage(
          roomId,
          user.id,
          '',
          file.name,
          file.type.startsWith('image/') ? 'image' : 'file',
          [fileUrl]
        )
      }
    } catch (error) {
      console.error('파일 업로드 오류:', error)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getMessageStatus = (message: ChatMessage) => {
    if (message.sender_id === user?.id) {
      if (message.read_at) {
        return <CheckCheck className="w-4 h-4 text-blue-500" />
      } else {
        return <Check className="w-4 h-4 text-gray-400" />
      }
    }
    return null
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
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">채팅방</h3>
            <p className="text-sm text-gray-500">
              {onlineUsers.length}명 온라인
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender_id === user?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.message_type === 'image' && message.attachments?.[0] && (
                <div className="mb-2">
                  <img
                    src={message.attachments[0]}
                    alt="첨부 이미지"
                    className="rounded-lg max-w-full h-auto"
                  />
                </div>
              )}
              {message.message_type === 'file' && message.attachments?.[0] && (
                <div className="mb-2 p-2 bg-white bg-opacity-20 rounded">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4" />
                    <span className="text-sm">{message.content}</span>
                  </div>
                </div>
              )}
              {message.message_type === 'text' && (
                <div>
                  <p className="text-sm break-words">{message.content}</p>
                  {message.sender_id !== user?.id && (
                    <button
                      onClick={() => {
                        setSelectedMessage(message)
                        setShowTranslation(true)
                      }}
                      className="mt-1 text-xs text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <Languages className="w-3 h-3" />
                      <span>번역</span>
                    </button>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs opacity-70">
                  {formatTime(message.created_at)}
                </span>
                {getMessageStatus(message)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 번역 위젯 */}
      {showTranslation && selectedMessage && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">메시지 번역</h4>
            <button
              onClick={() => {
                setShowTranslation(false)
                setSelectedMessage(null)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <TranslationWidget
            text={selectedMessage.content}
            defaultTargetLanguage="ko"
            className="text-sm"
          />
        </div>
      )}

      {/* 메시지 입력 */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}
