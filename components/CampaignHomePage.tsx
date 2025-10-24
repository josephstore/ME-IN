'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Bell, X, MessageCircle, Calendar, Heart, User, Plus, CheckCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSimpleAuth } from '@/lib/SimpleAuthContext'
import { CampaignService } from '@/lib/services/databaseService'
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
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop',
    media_assets: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1596760227605-25c4302f89c1?w=600&h=600&fit=crop'],
    price: 'From $600 - $2,500',
    category: 'Beauty'
  },
  {
    id: '2',
    title: 'K-pop Concert in Arab',
    title_kr: '케이팝 콘서트 인 아랍',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=600&fit=crop',
    media_assets: ['https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=600&fit=crop'],
    price: 'From $1,500 - $6,000',
    category: 'Entertainment'
  },
  {
    id: '3',
    title: 'Korean Food Festival',
    title_kr: '한국 음식 축제',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop',
    media_assets: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop'],
    price: 'From $800 - $3,000',
    category: 'Food'
  },
  {
    id: '4',
    title: 'Dubai Travel Guide',
    title_kr: '두바이 여행 가이드',
    image: 'https://images.unsplash.com/photo-1512453333589-d3bb32f07e03?w=600&h=600&fit=crop',
    media_assets: ['https://images.unsplash.com/photo-1512453333589-d3bb32f07e03?w=600&h=600&fit=crop'],
    price: 'From $1,000 - $5,000',
    category: 'Travel'
  }
]

export default function CampaignHomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useSimpleAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('search')
  const [campaigns, setCampaigns] = useState<Campaign[]>(defaultCampaigns)
  const [loading, setLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessageType, setSuccessMessageType] = useState<'campaign' | 'influencer' | null>(null)

  // 실제 캠페인 데이터 로드
  useEffect(() => {
    loadCampaigns()
    
    // URL 파라미터 확인하여 성공 메시지 표시
    if (searchParams.get('campaign_created') === 'true') {
      setShowSuccessMessage(true)
      setSuccessMessageType('campaign')
      loadCampaigns()
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('campaign_created')
      window.history.replaceState({}, '', newUrl.toString())
      
      setTimeout(() => {
        setShowSuccessMessage(false)
        setSuccessMessageType(null)
      }, 5000)
    } else if (searchParams.get('influencer_registered') === 'true') {
      setShowSuccessMessage(true)
      setSuccessMessageType('influencer')
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('influencer_registered')
      window.history.replaceState({}, '', newUrl.toString())
      
      setTimeout(() => {
        setShowSuccessMessage(false)
        setSuccessMessageType(null)
      }, 5000)
    }
  }, [searchParams])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const response = await CampaignService.getCampaigns()
      
      if (response && Array.isArray(response) && response.length > 0) {
        const convertedCampaigns = response.map((campaign: any) => ({
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
        setCampaigns(defaultCampaigns)
      }
    } catch (error) {
      console.error('캠페인 로드 오류:', error)
      setCampaigns(defaultCampaigns)
    } finally {
      setLoading(false)
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter))
  }

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const clearAllFilters = () => {
    setActiveFilters([])
  }

  const availableFilters = ['Food', 'Entertainment', 'Beauty', 'Travel', 'Technology', 'Fashion', 'Health', 'Sports', 'Education', 'Gaming']

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.title_kr.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(campaign.category)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-beige-50">
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

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="px-4 pb-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                {successMessageType === 'campaign' 
                  ? '캠페인이 성공적으로 생성되었습니다! / تم إنشاء الحملة بنجاح!'
                  : '인플루언서 등록이 완료되었습니다! / تم تسجيل المؤثر بنجاح!'
                }
              </p>
              <p className="text-xs text-green-600 mt-1">
                {successMessageType === 'campaign'
                  ? '아래에서 새로 생성된 캠페인을 확인할 수 있습니다.'
                  : '이제 캠페인에 참여하고 브랜드와 협업할 수 있습니다.'
                }
              </p>
            </div>
            <button
              onClick={() => {
                setShowSuccessMessage(false)
                setSuccessMessageType(null)
              }}
              className="text-green-400 hover:text-green-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-navy-600">필터</h3>
          {activeFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-navy-400 hover:text-navy-600"
            >
              모두 지우기
            </button>
          )}
        </div>
        
        {/* Available Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          {availableFilters.map(filter => (
            <button
              key={filter}
              onClick={() => activeFilters.includes(filter) ? removeFilter(filter) : addFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                activeFilters.includes(filter)
                  ? 'bg-navy-600 text-white'
                  : 'bg-white border border-beige-300 text-navy-600 hover:bg-navy-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-navy-500">선택된 필터:</span>
            {activeFilters.map(filter => (
              <div
                key={filter}
                className="flex items-center space-x-1 bg-navy-100 border border-navy-200 rounded-full px-3 py-1"
              >
                <span className="text-sm text-navy-700">{filter}</span>
                <button
                  onClick={() => removeFilter(filter)}
                  className="ml-1 hover:bg-navy-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3 text-navy-500" />
                </button>
              </div>
            ))}
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
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjIwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiPkltYWdlPC90ZXh0Pjwvc3ZnPg=='
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
                  
                  <h3 className="font-semibold text-navy-600 mb-1 text-lg">{campaign.title}</h3>
                  <p className="text-sm text-navy-500 mb-3">{campaign.title_kr}</p>
                  
                  {/* Campaign Description */}
                  <div className="mb-4">
                    {campaign.description && (
                      <p className="text-sm text-navy-400 mb-2">
                        {campaign.description}
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