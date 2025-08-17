'use client'

import React, { useState } from 'react'
import { Search, Filter, Bell, X, MessageCircle, Calendar, Heart, User } from 'lucide-react'

interface Campaign {
  id: string
  title: string
  titleKr: string
  image: string
  price: string
  category: string
}

const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Carery Cooling Toner',
    titleKr: '캐어리 쿨링 토너',
    image: '/images/carery-toner.jpg',
    price: 'From $100 -',
    category: 'Cosmetics'
  },
  {
    id: '2',
    title: 'K-pop Concert in Arab',
    titleKr: '케이팝 콘서트 인 아랍',
    image: '/images/kpop-concert.jpg',
    price: 'From $100 -',
    category: 'K-pop'
  },
  {
    id: '3',
    title: 'Korean Food Festival',
    titleKr: '한국 음식 축제',
    image: '/images/korean-food.jpg',
    price: 'From $150 -',
    category: 'Food'
  },
  {
    id: '4',
    title: 'Dubai Travel Guide',
    titleKr: '두바이 여행 가이드',
    image: '/images/dubai-travel.jpg',
    price: 'From $200 -',
    category: 'Travel'
  }
]

// const categories = ['Food', 'K-pop', 'Cosmetics', 'Travel', 'Fashion', 'Technology']

export default function CampaignHomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>(['Food', 'K-pop', 'Cosmetics', 'Travel'])
  const [activeTab, setActiveTab] = useState('search')

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter))
  }

  // const addFilter = (filter: string) => {
  //   if (!activeFilters.includes(filter)) {
  //     setActiveFilters([...activeFilters, filter])
  //   }
  // }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.titleKr.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(campaign.category)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                             <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                 <img 
                   src="/images/logo.png" 
                   alt="ME-IN Logo" 
                   className="w-6 h-6 object-contain"
                   onError={(e) => {
                     // 로고 로드 실패 시 텍스트로 대체
                     const target = e.target as HTMLImageElement
                     target.style.display = 'none'
                     target.parentElement!.innerHTML = '<span class="text-white font-bold text-sm">M</span>'
                   }}
                 />
               </div>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Filter className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="px-4 pb-3">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(filter => (
                <div
                  key={filter}
                  className="flex items-center space-x-1 bg-white border border-gray-300 rounded-full px-3 py-1"
                >
                  <span className="text-sm text-gray-700">{filter}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-1"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Campaign Cards */}
      <div className="px-4 py-4">
        <div className="space-y-4">
          {filteredCampaigns.map(campaign => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Campaign Image */}
                             <div className="relative h-48 overflow-hidden">
                 <img 
                   src={campaign.image}
                   alt={campaign.title}
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     // 이미지 로드 실패 시 기본 이미지로 대체
                     const target = e.target as HTMLImageElement
                     target.src = `data:image/svg+xml;base64,${btoa(`
                       <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
                         <rect width="400" height="200" fill="#f3f4f6"/>
                         <text x="200" y="100" font-family="Arial, sans-serif" font-size="16" 
                               text-anchor="middle" fill="#6b7280">
                           ${campaign.title}
                         </text>
                       </svg>
                     `)}`
                   }}
                 />
               </div>
              
              {/* Campaign Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{campaign.titleKr}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{campaign.price}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                    JOIN
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 rounded-t-2xl shadow-lg">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'search' ? 'text-white' : 'text-blue-200'}`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </button>
          
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'messages' ? 'text-white' : 'text-blue-200'}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Messages</span>
          </button>
          
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'calendar' ? 'text-white' : 'text-blue-200'}`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Calendar</span>
          </button>
          
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'favorites' ? 'text-white' : 'text-blue-200'}`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs">Favorites</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'profile' ? 'text-white' : 'text-blue-200'}`}
          >
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* Bottom Spacing for Navigation */}
      <div className="h-20"></div>
    </div>
  )
}
