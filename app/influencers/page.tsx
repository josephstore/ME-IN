'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { InfluencerService } from '@/lib/services/databaseService'
import { InfluencerProfile } from '@/lib/types/database'
import { Button } from '@/components/ui/Button'
import { 
  Search, 
  Filter, 
  Users, 
  Globe, 
  Star,
  Eye,
  MapPin,
  Calendar,
  Instagram,
  Youtube,
  Twitter,
  CheckCircle,
  Award,
  Heart,
  MessageCircle
} from 'lucide-react'

export default function InfluencersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([])
  const [filteredInfluencers, setFilteredInfluencers] = useState<InfluencerProfile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [minFollowers, setMinFollowers] = useState('')
  const [sortBy, setSortBy] = useState('followers')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

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

  const locations = [
    'Saudi Arabia',
    'UAE',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'Jordan',
    'Lebanon',
    'Egypt',
    'Morocco',
    'Turkey',
    '기타'
  ]

  const followerRanges = [
    { value: '1000', label: '1K+' },
    { value: '10000', label: '10K+' },
    { value: '100000', label: '100K+' },
    { value: '500000', label: '500K+' },
    { value: '1000000', label: '1M+' }
  ]

  useEffect(() => {
    loadInfluencers()
  }, [])

  useEffect(() => {
    filterAndSortInfluencers()
  }, [influencers, searchTerm, selectedCategory, selectedLocation, minFollowers, sortBy, sortOrder])

  const loadInfluencers = async () => {
    try {
      setLoading(true)
      const response = await InfluencerService.getInfluencers({
        limit: 50,
        offset: 0
      })
      
      if (response && Array.isArray(response)) {
        setInfluencers(response)
      }
    } catch (error) {
      console.error('인플루언서 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortInfluencers = () => {
    let filtered = [...influencers]

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(influencer =>
        influencer.content_categories?.some(category => 
          category.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        influencer.collaboration_history?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter(influencer => 
        influencer.content_categories?.includes(selectedCategory)
      )
    }

    // 지역 필터
    if (selectedLocation) {
      filtered = filtered.filter(influencer => 
        influencer.collaboration_history?.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    // 최소 팔로워 필터
    if (minFollowers) {
      const minFollowersNum = parseInt(minFollowers)
      filtered = filtered.filter(influencer => {
        return (influencer.total_followers || 0) >= minFollowersNum
      })
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.id || ''
          bValue = b.id || ''
          break
        case 'followers':
          aValue = a.total_followers || 0
          bValue = b.total_followers || 0
          break
        case 'engagement':
          aValue = a.avg_engagement_rate || 0
          bValue = b.avg_engagement_rate || 0
          break
        case 'created_at':
          aValue = new Date(a.created_at || 0)
          bValue = new Date(b.created_at || 0)
          break
        default:
          aValue = a.total_followers || 0
          bValue = b.total_followers || 0
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredInfluencers(filtered)
  }

  const getTotalFollowers = (influencer: InfluencerProfile) => {
    return influencer.total_followers || 0
  }

  const getAverageEngagement = (influencer: InfluencerProfile) => {
    return influencer.avg_engagement_rate || 0
  }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />
      case 'youtube':
        return <Youtube className="w-4 h-4" />
      case 'twitter':
        return <Twitter className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">인플루언서를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">인플루언서 탐색</h1>
              <p className="text-gray-600 mt-1">
                브랜드에 최적의 인플루언서를 찾아보세요
              </p>
            </div>
            <div className="text-sm text-gray-500">
              총 {filteredInfluencers.length}명의 인플루언서
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="인플루언서 검색..."
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

            {/* 지역 필터 */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">모든 지역</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            {/* 최소 팔로워 필터 */}
            <select
              value={minFollowers}
              onChange={(e) => setMinFollowers(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">모든 팔로워</option>
              {followerRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label} 팔로워
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
              <option value="followers-desc">팔로워 많은순</option>
              <option value="followers-asc">팔로워 적은순</option>
              <option value="engagement-desc">참여도 높은순</option>
              <option value="engagement-asc">참여도 낮은순</option>
              <option value="name-asc">이름순</option>
              <option value="created_at-desc">최신순</option>
            </select>
          </div>
        </div>

        {/* 인플루언서 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers.map((influencer) => (
            <div
              key={influencer.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* 프로필 헤더 */}
              <div className="p-6 pb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {influencer.id?.charAt(0) || 'I'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        인플루언서 {influencer.id}
                      </h3>
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      인플루언서
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {influencer.rating || 0}점
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 소셜 계정 정보 */}
              <div className="px-6 pb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm text-gray-600">Instagram</span>
                      <CheckCircle className="w-3 h-3 text-blue-500" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatFollowers(influencer.total_followers || 0)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {influencer.avg_engagement_rate?.toFixed(1)}% 참여도
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 전문 분야 */}
              <div className="px-6 pb-4">
                <div className="flex flex-wrap gap-1">
                  {influencer.content_categories?.slice(0, 3).map((category, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                  {influencer.content_categories && influencer.content_categories.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{influencer.content_categories.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* 통계 */}
              <div className="px-6 pb-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatFollowers(getTotalFollowers(influencer))}
                    </div>
                    <div className="text-xs text-gray-500">총 팔로워</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {getAverageEngagement(influencer).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">평균 참여도</div>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="px-6 pb-6">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/influencers/${influencer.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    프로필 보기
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    연락하기
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        {filteredInfluencers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">인플루언서를 찾을 수 없습니다</h3>
            <p className="text-gray-600 mb-4">
              검색 조건을 변경하거나 다른 필터를 시도해보세요.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setSelectedLocation('')
                setMinFollowers('')
              }}
              variant="outline"
            >
              필터 초기화
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}