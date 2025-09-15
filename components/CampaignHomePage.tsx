'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Bell, X, MessageCircle, Calendar, Heart, User, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSimpleAuth } from '@/lib/SimpleAuthContext'
import { RealCampaignService } from '@/lib/services/realDatabaseService'
import BottomNavigation from './layout/BottomNavigation'

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

export default function CampaignHomePage() {
  const router = useRouter()
  const { isAuthenticated } = useSimpleAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>(['Food', 'Entertainment', 'Beauty', 'Travel', 'Technology', 'Fashion'])
  const [activeTab, setActiveTab] = useState('search')
  const [campaigns, setCampaigns] = useState<Campaign[]>(defaultCampaigns)
  const [loading, setLoading] = useState(false)

  // 실제 캠페인 데이터 로드
  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const response = await RealCampaignService.getCampaigns()
      
      if (response.success && response.data) {
        // 실제 데이터를 Campaign 인터페이스에 맞게 변환
        const convertedCampaigns = response.data.map((campaign: any) => ({
          id: campaign.id,
          title: campaign.title,
          title_kr: campaign.title,
          description: campaign.description,
          description_kr: campaign.description,
          budget_min: campaign.budget_min,
          budget_max: campaign.budget_max,
          currency: campaign.currency,
          category: campaign.category,
          target_regions: campaign.target_regions,
          target_languages: campaign.target_languages,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          application_deadline: campaign.application_deadline,
          max_applications: campaign.max_applications,
          status: campaign.status,
          created_at: campaign.created_at,
          media_assets: campaign.media_assets
        }))
        setCampaigns(convertedCampaigns)
      } else {
        // 데이터 로드 실패 시 기본 데이터 사용
        setCampaigns(defaultCampaigns)
      }
    } catch (error) {
      console.error('캠페인 로드 오류:', error)
      // 오류 시 기본 데이터 사용
      setCampaigns(defaultCampaigns)
    } finally {
      setLoading(false)
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter))
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.title_kr.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(campaign.category)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-beige-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-beige-400 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/logo-arabic.png" 
                  alt="ME-IN Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <span className="text-navy-600 font-bold text-sm hidden">مين</span>
              </div>
            </div>
            
            {/* Notifications */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="w-6 h-6 text-navy-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-salmon-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-beige-100 rounded-lg text-navy-600 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-salmon-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy-400" />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Filter className="w-5 h-5 text-navy-400" />
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
                  className="flex items-center space-x-1 bg-white border border-beige-300 rounded-full px-3 py-1"
                >
                  <span className="text-sm text-navy-600">{filter}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-1"
                  >
                    <X className="w-3 h-3 text-navy-400" />
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-salmon-500"></div>
            <span className="ml-2 text-navy-600">캠페인을 불러오는 중...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCampaigns.map(campaign => (
              <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-beige-200 overflow-hidden hover:shadow-md transition-shadow">
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
                    <span className="inline-block bg-salmon-100 text-salmon-800 text-xs px-2 py-1 rounded-full font-medium">
                      {campaign.category}
                    </span>
                    <span className="text-sm font-medium text-navy-600">{campaign.price}</span>
                  </div>
                  
                  <h3 className="font-semibold text-navy-600 mb-1 text-responsive-lg text-wrap-balance">{campaign.title}</h3>
                  <p className="text-responsive-sm text-navy-500 mb-3 text-wrap-pretty">{campaign.title_kr}</p>
                  
                  {/* Campaign Description */}
                  <div className="mb-4">
                    {campaign.description && (
                      <p className="text-responsive-sm text-navy-400 mb-2 text-wrap-pretty">
                        {campaign.description}
                      </p>
                    )}
                    {!campaign.description && campaign.id === '1' && (
                      <p className="text-responsive-sm text-navy-400 mb-2 text-wrap-pretty">
                        Carery 토너의 효과와 사용법을 소개하는 뷰티 콘텐츠를 제작해주세요.
                      </p>
                    )}
                    {!campaign.description && campaign.id === '2' && (
                      <p className="text-responsive-sm text-navy-400 mb-2 text-wrap-pretty">
                        중동 지역 K-POP 콘서트를 홍보하는 에너지 넘치는 콘텐츠를 제작해주세요.
                      </p>
                    )}
                    {!campaign.description && campaign.id === '3' && (
                      <p className="text-responsive-sm text-navy-400 mb-2 text-wrap-pretty">
                        한국의 전통 음식과 현대적인 한식을 소개하는 콘텐츠를 제작해주세요.
                      </p>
                    )}
                    {!campaign.description && campaign.id === '4' && (
                      <p className="text-responsive-sm text-navy-400 mb-2 text-wrap-pretty">
                        두바이의 아름다운 관광지를 소개하는 여행 콘텐츠를 제작해주세요.
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-navy-400">• Instagram</span>
                      <span className="text-xs text-navy-400">• TikTok</span>
                      <span className="text-xs text-navy-400">• YouTube</span>
                    </div>
                    <button 
                      onClick={() => router.push(`/campaigns/${campaign.id}`)}
                      className="bg-navy-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-navy-700 transition-colors"
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
      <div 
        style={{ 
          position: 'fixed', 
          bottom: '90px', 
          right: '20px', 
          zIndex: 999999,
          display: 'block',
          visibility: 'visible',
          opacity: 1
        }}
      >
        <button
          onClick={() => {
            if (isAuthenticated) {
              router.push('/campaigns/create')
            } else {
              router.push('/auth/login?redirect=/campaigns/create')
            }
          }}
          className="floating-button"
          style={{
            position: 'relative',
            display: 'flex',
            visibility: 'visible',
            opacity: 1
          }}
        >
          +
        </button>
      </div>


      {/* Bottom Spacing for Navigation */}
      <div className="h-20"></div>
      
      {/* Global Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
