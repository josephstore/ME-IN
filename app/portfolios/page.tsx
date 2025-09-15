'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { PortfolioService, ProfileService } from '@/lib/services/databaseService'
import { Portfolio, UserProfile, InfluencerProfile } from '../../lib/types/database'
import { 
  Plus, Search, Filter, Heart, Eye, Edit, Trash2, Grid, List, Star, 
  Calendar, Tag, User, Camera, Video, FileText, ExternalLink, Share2
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const categories = [
  '패션/뷰티',
  '푸드/요리',
  '여행/라이프스타일',
  '테크/가전',
  '게임/엔터테인먼트',
  '교육/지식',
  '건강/피트니스',
  '패러디/유머',
  '뷰티/메이크업',
  '육아/가족',
  '반려동물',
  '기타'
]

export default function PortfoliosPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [influencerProfile, setInfluencerProfile] = useState<InfluencerProfile | null>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [myPortfolios, setMyPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState<'public' | 'my'>('public')
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'views'>('latest')

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadUserProfile()
      loadPortfolios()
    }
  }, [user, activeTab, selectedCategory, sortBy])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const loadUserProfile = async () => {
    if (!user) return

    const response = await ProfileService.getCompleteProfile()
    if (response.success && response.data) {
      setUserProfile(response.data.userProfile)
      setInfluencerProfile(response.data.influencerProfile || null)
      
      if (response.data.influencerProfile) {
        loadMyPortfolios(response.data.influencerProfile.id)
      }
    }
  }

  const loadPortfolios = async () => {
    if (activeTab === 'public') {
      const response = await PortfolioService.getPublicPortfolios(selectedCategory || undefined)
      if (response.success && response.data) {
        const sortedPortfolios = [...response.data]
        
        switch (sortBy) {
          case 'popular':
            sortedPortfolios.sort((a, b) => b.like_count - a.like_count)
            break
          case 'views':
            sortedPortfolios.sort((a, b) => b.view_count - a.view_count)
            break
          default:
            sortedPortfolios.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        }
        
        setPortfolios(sortedPortfolios)
      }
    }
  }

  const loadMyPortfolios = async (influencerProfileId: string) => {
    const response = await PortfolioService.getMyPortfolios(influencerProfileId)
    if (response.success && response.data) {
      setMyPortfolios(response.data)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPortfolios()
      return
    }

    const response = await PortfolioService.searchPortfolios(searchQuery, selectedCategory || undefined)
    if (response.success && response.data) {
      setPortfolios(response.data)
    }
  }

  const handleCreatePortfolio = () => {
    router.push('/portfolios/create')
  }

  const handleEditPortfolio = (portfolioId: string) => {
    router.push(`/portfolios/${portfolioId}/edit`)
  }

  const handleDeletePortfolio = async (portfolioId: string) => {
    if (!confirm('정말로 이 포트폴리오를 삭제하시겠습니까?')) return

    const response = await PortfolioService.deletePortfolio(portfolioId)
    if (response.success) {
      loadPortfolios()
      if (influencerProfile) {
        loadMyPortfolios(influencerProfile.id)
      }
    } else {
      alert('포트폴리오 삭제에 실패했습니다.')
    }
  }

  const handleLikePortfolio = async (portfolioId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    const response = await PortfolioService.togglePortfolioLike(portfolioId, user.id)
    if (response.success) {
      loadPortfolios()
    }
  }

  const handleViewPortfolio = async (portfolioId: string) => {
    await PortfolioService.incrementViewCount(portfolioId)
    router.push(`/portfolios/${portfolioId}`)
  }

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return <Camera className="w-4 h-4" />
      case 'video':
        return <Video className="w-4 h-4" />
      case 'document':
        return <FileText className="w-4 h-4" />
      default:
        return <Camera className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">포트폴리오</h1>
              <p className="mt-1 text-gray-600">인플루언서들의 창작물을 둘러보세요</p>
            </div>
            {influencerProfile && (
              <button
                onClick={handleCreatePortfolio}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                포트폴리오 등록
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-8 mb-8">
          <button
            onClick={() => setActiveTab('public')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'public'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            전체 포트폴리오
          </button>
          {influencerProfile && (
            <button
              onClick={() => setActiveTab('my')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              내 포트폴리오
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="포트폴리오 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">모든 카테고리</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-32">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'views')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="latest">최신순</option>
                <option value="popular">인기순</option>
                <option value="views">조회순</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {(activeTab === 'public' ? portfolios : myPortfolios).map((portfolio) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              viewMode={viewMode}
              isMyPortfolio={activeTab === 'my'}
              onEdit={handleEditPortfolio}
              onDelete={handleDeletePortfolio}
              onLike={handleLikePortfolio}
              onView={handleViewPortfolio}
              getMediaIcon={getMediaIcon}
            />
          ))}
        </div>

        {(activeTab === 'public' ? portfolios : myPortfolios).length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Camera className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'public' ? '표시할 포트폴리오가 없습니다' : '등록된 포트폴리오가 없습니다'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'public' 
                ? '다른 검색어나 카테고리를 시도해보세요' 
                : '첫 번째 포트폴리오를 등록해보세요'
              }
            </p>
            {activeTab === 'my' && influencerProfile && (
              <button
                onClick={handleCreatePortfolio}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                포트폴리오 등록하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function PortfolioCard({ 
  portfolio, 
  viewMode, 
  isMyPortfolio, 
  onEdit, 
  onDelete, 
  onLike, 
  onView,
  getMediaIcon 
}: {
  portfolio: Portfolio
  viewMode: 'grid' | 'list'
  isMyPortfolio: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onLike: (id: string) => void
  onView: (id: string) => void
  getMediaIcon: (type: string) => JSX.Element
}) {
  const [isLiked, setIsLiked] = useState(false)

  const thumbnailUrl = portfolio.portfolio_media?.[0]?.media_url || portfolio.media_urls?.[0]

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex gap-6">
          {/* Thumbnail */}
          <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={portfolio.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Camera className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {portfolio.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {portfolio.description}
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {portfolio.influencer_profiles?.user_profiles?.display_name || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {portfolio.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(portfolio.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onView(portfolio.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="보기"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onLike(portfolio.id)}
                  className={`p-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  title="좋아요"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                {isMyPortfolio && (
                  <>
                    <button
                      onClick={() => onEdit(portfolio.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="편집"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(portfolio.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {portfolio.view_count} 조회
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {portfolio.like_count} 좋아요
              </span>
              {portfolio.portfolio_media && portfolio.portfolio_media.length > 0 && (
                <span className="flex items-center gap-1">
                  {getMediaIcon(portfolio.portfolio_media[0].media_type)}
                  {portfolio.portfolio_media.length}개 미디어
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-200 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={portfolio.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Camera className="w-12 h-12" />
          </div>
        )}
        {portfolio.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
            <Star className="w-3 h-3 inline mr-1" />
            추천
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {portfolio.title}
          </h3>
          {isMyPortfolio && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onEdit(portfolio.id)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="편집"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(portfolio.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="삭제"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {portfolio.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {portfolio.influencer_profiles?.user_profiles?.display_name || 'Unknown'}
          </span>
          <span className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            {portfolio.category}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {portfolio.view_count}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {portfolio.like_count}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onView(portfolio.id)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              보기
            </button>
            <button
              onClick={() => onLike(portfolio.id)}
              className={`p-1 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
