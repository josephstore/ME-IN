'use client'

import React, { useState } from 'react'
import { Search, Send, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BottomNavigation from '@/components/layout/BottomNavigation'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isRead: boolean
  isOwn: boolean
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  messages: Message[]
}

export default function MessagesPage() {
  const router = useRouter()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')

  // Sample conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Sarah Ahmed',
      avatar: '/images/avatar1.jpg',
      lastMessage: 'Thank you for the collaboration!',
      timestamp: '2m ago',
      unreadCount: 2,
      messages: [
        {
          id: '1',
          sender: 'Sarah Ahmed',
          content: 'Hi! I\'m interested in your beauty campaign.',
          timestamp: '10:30 AM',
          isRead: true,
          isOwn: false
        },
        {
          id: '2',
          sender: 'You',
          content: 'Great! Let me send you the details.',
          timestamp: '10:32 AM',
          isRead: true,
          isOwn: true
        },
        {
          id: '3',
          sender: 'Sarah Ahmed',
          content: 'Thank you for the collaboration!',
          timestamp: '2m ago',
          isRead: false,
          isOwn: false
        }
      ]
    },
    {
      id: '2',
      name: 'Mohammed Al-Rashid',
      avatar: '/images/avatar2.jpg',
      lastMessage: 'When can we schedule the meeting?',
      timestamp: '1h ago',
      unreadCount: 0,
      messages: [
        {
          id: '1',
          sender: 'Mohammed Al-Rashid',
          content: 'Hello! I saw your fashion campaign.',
          timestamp: '9:15 AM',
          isRead: true,
          isOwn: false
        },
        {
          id: '2',
          sender: 'You',
          content: 'Hi Mohammed! Yes, we\'re looking for influencers.',
          timestamp: '9:20 AM',
          isRead: true,
          isOwn: true
        },
        {
          id: '3',
          sender: 'Mohammed Al-Rashid',
          content: 'When can we schedule the meeting?',
          timestamp: '1h ago',
          isRead: true,
          isOwn: false
        }
      ]
    },
    {
      id: '3',
      name: 'Fatima Hassan',
      avatar: '/images/avatar3.jpg',
      lastMessage: 'Perfect! I\'ll send the content tomorrow.',
      timestamp: '3h ago',
      unreadCount: 1,
      messages: [
        {
          id: '1',
          sender: 'Fatima Hassan',
          content: 'I\'ve completed the food review content.',
          timestamp: '8:00 AM',
          isRead: true,
          isOwn: false
        },
        {
          id: '2',
          sender: 'You',
          content: 'Excellent! Can you send it to me?',
          timestamp: '8:05 AM',
          isRead: true,
          isOwn: true
        },
        {
          id: '3',
          sender: 'Fatima Hassan',
          content: 'Perfect! I\'ll send the content tomorrow.',
          timestamp: '3h ago',
          isRead: false,
          isOwn: false
        }
      ]
    }
  ]

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        isRead: true,
        isOwn: true
      }
      
      // Update the conversation with new message
      setSelectedConversation(prev => {
        if (!prev) return null
        return {
          ...prev,
          messages: [...prev.messages, message],
          lastMessage: newMessage,
          timestamp: 'now'
        }
      })
      
      setNewMessage('')
    }
  }

  if (selectedConversation) {
    return (
      <div className="min-h-screen bg-beige-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-beige-200 px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedConversation(null)}
              className="p-2 hover:bg-beige-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-navy-600" />
            </button>
            <div className="w-10 h-10 bg-navy-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {selectedConversation.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="font-semibold text-navy-600">{selectedConversation.name}</h1>
              <p className="text-sm text-navy-400">Online</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-beige-100 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-navy-600" />
              </button>
              <button className="p-2 hover:bg-beige-100 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-navy-600" />
              </button>
              <button className="p-2 hover:bg-beige-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-navy-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 pb-20">
          {selectedConversation.messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? 'bg-salmon-500 text-white'
                    : 'bg-white text-navy-600 border border-beige-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.isOwn ? 'text-salmon-100' : 'text-navy-400'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-beige-200 p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-beige-100 border border-beige-200 rounded-lg px-4 py-2 text-navy-600 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-salmon-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-salmon-500 text-white p-2 rounded-lg hover:bg-salmon-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Bottom Navigation */}
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-white border-b border-beige-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-navy-600">Messages</h1>
          <button className="p-2 hover:bg-beige-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-navy-600" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-beige-100 border border-beige-200 rounded-lg pl-10 pr-4 py-3 text-navy-600 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-salmon-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="px-4 pb-20">
        {conversations.map(conversation => (
          <div
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation)}
            className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-beige-200 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-navy-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {conversation.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-navy-600 truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-sm text-navy-400">{conversation.timestamp}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-navy-500 truncate">{conversation.lastMessage}</p>
                  {conversation.unreadCount > 0 && (
                    <div className="bg-salmon-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}