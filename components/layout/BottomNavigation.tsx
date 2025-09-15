'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, MessageCircle, Calendar, Heart, User, Home } from 'lucide-react'

export default function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    {
      id: 'campaigns',
      label: '캠페인',
      icon: Home,
      path: '/',
      isActive: pathname === '/' || pathname.startsWith('/campaigns')
    },
    {
      id: 'influencers',
      label: '인플루언서',
      icon: Search,
      path: '/influencers/search',
      isActive: pathname.startsWith('/influencers')
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      path: '/messages',
      isActive: pathname.startsWith('/messages')
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      path: '/calendar',
      isActive: pathname.startsWith('/calendar')
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      isActive: pathname.startsWith('/profile')
    }
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy-600 rounded-t-2xl shadow-lg z-50">
      <div className="flex items-center justify-around py-3">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = item.isActive
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive ? 'text-white' : 'text-blue-200 hover:text-white'
              }`}
            >
              {item.id === 'profile' ? (
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-white' : 'bg-blue-200'
                }`}>
                  <Icon className={`w-3 h-3 ${isActive ? 'text-navy-600' : 'text-navy-600'}`} />
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className="text-xs">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
