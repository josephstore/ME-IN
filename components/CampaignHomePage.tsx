'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Bell, X, MessageCircle, Calendar, Heart, User, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jltnvoyjnzlswsmddojf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdG52b3lqbnpsc3dzbWRkb2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODk5MjQsImV4cCI6MjA3MDk2NTkyNH0.5blt8JeShSgBA50l5bcE30Um1nGlYJAl685XBdVrqdg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Campaign {
  id: string
  title: string
  title_kr: string
  image?: string
  media_assets?: string[]
  price?: string
  category: string
  description?: string
  description_kr?: string
  budget_min?: number
  budget_max?: number
  currency?: string
  target_regions?: string[]
  target_languages?: string[]
  requirements?: {
    content_type: string
    min_followers: number
    platforms: string[]
  }
  start_date?: string
  end_date?: string
  application_deadline?: string
  max_applications?: number
  current_applications?: number
  status?: 'active' | 'completed' | 'paused'
  created_at?: string
}

// 기본 캠페인 데이터 (Supabase에서 데이터를 불러올 때까지 표시)
const defaultCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Carery Cooling Toner',
    title_kr: '캐어리 쿨링 토너',
    image: '/images/carery-toner.jpg',
    price: 'From $600 - $2,500',
    category: 'Beauty'
  },
  {
    id: '2',
    title: 'K-pop Concert in Arab',
    title_kr: '케이팝 콘서트 인 아랍',
    image: '/images/kpop-concert.jpg',
    price: 'From $1,500 - $6,000',
    category: 'Entertainment'
  },
  {
    id: '3',
    title: 'Korean Food Festival',
    title_kr: '한국 음식 축제',
    image: '/images/korean-food.jpg',
    price: 'From $800 - $3,000',
    category: 'Food'
  },
  {
    id: '4',
    title: 'Dubai Travel Guide',
    title_kr: '두바이 여행 가이드',
    image: '/images/dubai-travel.jpg',
    price: 'From $1,000 - $5,000',
    category: 'Travel'
  }
]

// const categories = ['Food', 'K-pop', 'Cosmetics', 'Travel', 'Fashion', 'Technology']

export default function CampaignHomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>(['Food', 'Entertainment', 'Beauty', 'Travel', 'Technology', 'Fashion'])
  const [activeTab, setActiveTab] = useState('search')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  // Supabase에서 캠페인 데이터 불러오기
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching campaigns:', error)
          setCampaigns(defaultCampaigns)
        } else {
          // Supabase 데이터와 기본 데이터 합치기
          const allCampaigns = [...(data || []), ...defaultCampaigns]
          setCampaigns(allCampaigns)
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error)
        setCampaigns(defaultCampaigns)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

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
                         campaign.title_kr.toLowerCase().includes(searchQuery.toLowerCase())
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
                     target.parentElement!.innerHTML = '<span class="text-white font-bold text-sm">ME-IN</span>'
                   }}
                 />
               </div>
            </div>
            
                         {/* Notifications */}
             <div className="flex items-center space-x-3">
               <div className="relative">
                 <Bell className="w-6 h-6 text-gray-600" />
                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
               </div>
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
         {loading ? (
           <div className="flex items-center justify-center py-8">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             <span className="ml-2 text-gray-600">캠페인을 불러오는 중...</span>
           </div>
         ) : (
           <div className="space-y-4">
             {filteredCampaigns.map(campaign => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                             {/* Campaign Image */}
               <div className="relative h-48 overflow-hidden">
                 <img 
                   src={campaign.media_assets && campaign.media_assets.length > 0 
                     ? campaign.media_assets[0] 
                     : campaign.image || '/images/default-campaign.jpg'
                   }
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
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    {campaign.category}
                  </span>
                  <span className="text-sm font-medium text-green-600">{campaign.price}</span>
                </div>
                
                                 <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
                 <p className="text-sm text-gray-600 mb-3">{campaign.title_kr}</p>
                
                                 {/* Campaign Description */}
                 <div className="mb-4">
                   {campaign.description && (
                     <p className="text-sm text-gray-500 mb-2">
                       {campaign.description}
                     </p>
                   )}
                   {!campaign.description && campaign.id === '1' && (
                     <p className="text-sm text-gray-500 mb-2">
                       Carery 토너의 효과와 사용법을 소개하는 뷰티 콘텐츠를 제작해주세요.
                     </p>
                   )}
                   {!campaign.description && campaign.id === '2' && (
                     <p className="text-sm text-gray-500 mb-2">
                       중동 지역 K-POP 콘서트를 홍보하는 에너지 넘치는 콘텐츠를 제작해주세요.
                     </p>
                   )}
                   {!campaign.description && campaign.id === '3' && (
                     <p className="text-sm text-gray-500 mb-2">
                       한국의 전통 음식과 현대적인 한식을 소개하는 콘텐츠를 제작해주세요.
                     </p>
                   )}
                   {!campaign.description && campaign.id === '4' && (
                     <p className="text-sm text-gray-500 mb-2">
                       두바이의 아름다운 관광지를 소개하는 여행 콘텐츠를 제작해주세요.
                     </p>
                   )}
                 </div>
                
                                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                     <span className="text-xs text-gray-400">• Instagram</span>
                     <span className="text-xs text-gray-400">• TikTok</span>
                     <span className="text-xs text-gray-400">• YouTube</span>
                   </div>
                   <button 
                     onClick={() => router.push(`/campaigns/${campaign.id}`)}
                     className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                   >
                     VIEW DETAILS
                   </button>
                 </div>
                             </div>
             </div>
           ))}
           </div>
         )}
       </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                               {/* Floating Action Button */}
            <div style={{ position: 'relative', zIndex: 999999 }}>
              <button
                onClick={() => router.push('/campaigns/create')}
                className="floating-button"
              >
                +
              </button>
              <div className="floating-label">
                등록
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
