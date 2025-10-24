'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CampaignService } from '@/lib/services/campaignService'
import { Campaign } from '@/lib/types/database'
import { Button } from '@/components/ui/Button'
import { networkService } from '@/lib/services/networkService'
import { 
  Search, 
  Filter, 
  Plus, 
  DollarSign, 
  Users, 
  Calendar, 
  Globe, 
  Tag,
  Star,
  Eye,
  MapPin,
  Clock,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react'

function CampaignsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: true,
    isSupabaseConnected: true,
    lastChecked: new Date()
  })
  const [networkMessage, setNetworkMessage] = useState('')

  const categories = [
    '뷰티/화장품',
    '패션/의류',
    '음식/레스토랑',
    '여행/호텔',
    '테크/전자제품',
    '건강/운동',
    '교육/온라인강의',
    '게임/엔터테인먼트',
    '라이프스타일',
    '기타'
  ]

  const statuses = [
    { value: 'active', label: '진행중' },
    { value: 'draft', label: '초안' },
    { value: 'completed', label: '완료' },
    { value: 'cancelled', label: '취소' }
  ]

  useEffect(() => {
    loadCampaigns()
    
    // URL에 refresh 파라미터가 있으면 데이터 새로고침
    if (searchParams.get('refresh') === 'true') {
      // URL에서 refresh 파라미터 제거
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('refresh')
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [searchParams])

  // 네트워크 상태 모니터링
  useEffect(() => {
    const unsubscribe = networkService.subscribe((status) => {
      setNetworkStatus(status)
      
      if (!status.isOnline) {
        setNetworkMessage('인터넷 연결이 끊어졌습니다. 오프라인 모드로 전환됩니다.')
      } else if (!status.isSupabaseConnected) {
        setNetworkMessage('서버 연결에 문제가 있습니다. 캐시된 데이터를 표시합니다.')
      } else {
        setNetworkMessage('')
      }
    })

    return unsubscribe
  }, [])

  // 페이지 포커스 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      loadCampaigns()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  useEffect(() => {
    filterAndSortCampaigns()
  }, [campaigns, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const response = await CampaignService.getActiveCampaigns()
      
      if (response?.success && response.data) {
        setCampaigns(response.data)
        
        // 네트워크 메시지 표시
        if (response.error && response.error.includes('캐시된 데이터')) {
          setNetworkMessage(response.error)
        }
      } else {
        console.error('캠페인 로드 오류:', response?.error)
        setNetworkMessage(response?.error || '캠페인을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('캠페인 로드 오류:', error)
      setNetworkMessage('캠페인을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortCampaigns = () => {
    let filtered = [...campaigns]

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.brand_profiles?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter(campaign => campaign.category === selectedCategory)
    }

    // 상태 필터
    if (selectedStatus) {
      filtered = filtered.filter(campaign => campaign.status === selectedStatus)
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'title':
          aValue = a.title || ''
          bValue = b.title || ''
          break
        case 'budget':
          aValue = a.budget_min || 0
          bValue = b.budget_min || 0
          break
        case 'created_at':
          aValue = new Date(a.created_at || 0)
          bValue = new Date(b.created_at || 0)
          break
        case 'deadline':
          aValue = new Date(a.application_deadline || 0)
          bValue = new Date(b.application_deadline || 0)
          break
        default:
          aValue = a.created_at || 0
          bValue = b.created_at || 0
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredCampaigns(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '진행중'
      case 'draft': return '초안'
      case 'completed': return '완료'
      case 'cancelled': return '취소'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '미정'
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">캠페인을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 네트워크 상태 알림 */}
        {networkMessage && (
          <div className="mb-4 p-4 rounded-lg border-l-4 border-yellow-400 bg-yellow-50">
            <div className="flex items-center">
              {!networkStatus.isOnline ? (
                <WifiOff className="w-5 h-5 text-yellow-600 mr-2" />
              ) : !networkStatus.isSupabaseConnected ? (
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              ) : (
                <Wifi className="w-5 h-5 text-green-600 mr-2" />
              )}
              <p className="text-yellow-800 text-sm">{networkMessage}</p>
            </div>
          </div>
        )}

        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">캠페인 탐색</h1>
              <p className="text-gray-600 mt-1">
                브랜드와 인플루언서를 연결하는 다양한 캠페인을 만나보세요
              </p>
            </div>
            <Button
              onClick={loadCampaigns}
              variant="outline"
              disabled={loading}
              className="text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="캠페인 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 카테고리 필터 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">모든 카테고리</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* 상태 필터 */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">모든 상태</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* 정렬 */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at-desc">최신순</option>
              <option value="created_at-asc">오래된순</option>
              <option value="budget-desc">예산 높은순</option>
              <option value="budget-asc">예산 낮은순</option>
              <option value="title-asc">제목순</option>
              <option value="deadline-asc">마감일순</option>
            </select>
          </div>
        </div>

        {/* 캠페인 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => router.push(`/campaigns/${campaign.id}`)}
            >
              {/* 캠페인 이미지 */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
                {campaign.media_assets && campaign.media_assets.length > 0 ? (
                  <img
                    src={campaign.media_assets[0]}
                    alt={campaign.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Tag className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-600 font-medium">{campaign.category}</p>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* 헤더 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {campaign.brand_profiles?.company_name || '브랜드'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {getStatusText(campaign.status)}
                  </span>
                </div>

                {/* 설명 */}
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {campaign.description}
                </p>

                {/* 정보 */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>
                      {formatCurrency(campaign.budget_min, campaign.currency)} - {formatCurrency(campaign.budget_max, campaign.currency)}
                    </span>
                  </div>

                  {campaign.min_followers && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>최소 {campaign.min_followers.toLocaleString()}명 팔로워</span>
                    </div>
                  )}

                  {campaign.application_deadline && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>신청 마감: {formatDate(campaign.application_deadline)}</span>
                    </div>
                  )}

                  {campaign.target_languages && campaign.target_languages.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>{campaign.target_languages.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/campaigns/${campaign.id}`)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    자세히 보기
                  </Button>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(campaign.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        {filteredCampaigns.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">캠페인을 찾을 수 없습니다</h3>
            <p className="text-gray-600 mb-4">
              검색 조건을 변경하거나 새로운 캠페인을 생성해보세요.
            </p>
            <Button
              onClick={() => router.push('/campaigns/create')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              캠페인 생성
            </Button>
          </div>
        )}

        {/* 플로팅 액션 버튼 - 캠페인 생성 */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => router.push('/campaigns/create')}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            title="새 캠페인 생성"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampaignsPageContent />
    </Suspense>
  )
}
