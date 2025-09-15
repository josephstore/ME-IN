'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChatRoom } from '@/lib/services/realtimeChatService'
import ChatRoomList from '@/components/chat/ChatRoomList'
import RealtimeChat from '@/components/chat/RealtimeChat'

export default function MessagesPage() {
  const router = useRouter()
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room)
  }

  const handleBackToList = () => {
    setSelectedRoom(null)
  }

  const handleCreateRoom = () => {
    // TODO: 새 채팅방 생성 로직 구현
    console.log('새 채팅방 생성')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* 채팅방 목록 */}
        <div className={`${selectedRoom ? 'hidden md:block md:w-1/3' : 'w-full'} border-r border-gray-200`}>
          <ChatRoomList
            onSelectRoom={handleSelectRoom}
            onCreateRoom={handleCreateRoom}
          />
        </div>

        {/* 채팅 화면 */}
        {selectedRoom ? (
          <div className="flex-1 flex flex-col">
            <RealtimeChat
              roomId={selectedRoom.id}
              onBack={handleBackToList}
            />
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">채팅을 시작하세요</h3>
              <p className="text-gray-500">좌측에서 채팅방을 선택하거나 새 채팅방을 만들어보세요.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}