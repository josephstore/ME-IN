'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BrandService } from '@/lib/services/databaseService'
import { BrandProfile } from '@/lib/types/database'
import { Button } from '@/components/ui/Button'
import { 
  Search, 
  Filter, 
  Building2, 
  Globe, 
  Star,
  Eye,
  MapPin,
  Calendar,
  Users,
  Award,
  CheckCircle,
  MessageCircle,
  TrendingUp
} from 'lucide-react'

export default function BrandsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState<BrandProfile[]>([])
  const [filteredBrands, setFilteredBrands] = useState<BrandProfile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [sortBy, setSortBy] = useState('campaigns')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const industries = [
    '뷰티/화장품',
    '패션/의류',
    '음식/레스토랑',
    '여행/호텔',
    '테크/전자제품',
    '건강/운동',
    '교육/온라인강의',
    '게임/엔터테인먼트',
    '라이프스타일',
    '자동차',
    '금융',
    '부동산',
    '기타'
  ]

  const locations = [
    'Seoul, South Korea',
    'Busan, South Korea',
    'Incheon, South Korea',
    'Daegu, South Korea',
    'Daejeon, South Korea',
    'Gwangju, South Korea',
    'Ulsan, South Korea',
    'Sejong, South Korea',
    '기타'
  ]

  const companySizes = [
    { value: 'startup', label: '스타트업 (1-10명)' },
    { value: 'small', label: '소기업 (11-50명)' },
    { value: 'medium', label: '중기업 (51-200명)' },
    { value: 'large', label: '대기업 (200명+)' }
  ]

  useEffect(() => {
    loadBrands()
  }, [])

  useEffect(() => {
    filterAndSortBrands()
  }, [brands, searchTerm, selectedIndustry, selectedLocation, selectedSize, sortBy, sortOrder])

  const loadBrands = async () => {
    try {
      setLoading(true)
      const response = await BrandService.getBrands({
        limit: 50,
        offset: 0
      })
      
      if (response && Array.isArray(response)) {
        setBrands(response)
      }
    } catch (error) {
      console.error('브랜드 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortBrands = () => {
    let filtered = [...brands]

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(brand =>
        brand.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.company_name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 산업 필터
    if (selectedIndustry) {
      filtered = filtered.filter(brand => brand.industry === selectedIndustry)
    }

    // 지역 필터
    if (selectedLocation) {
      filtered = filtered.filter(brand => 
        brand.target_markets?.includes(selectedLocation)
      )
    }

    // 회사 규모 필터
    if (selectedSize) {
      filtered = filtered.filter(brand => brand.company_size === selectedSize)
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.company_name || ''
          bValue = b.company_name || ''
          break
        case 'campaigns':
          aValue = 0 // 더미 데이터
          bValue = 0 // 더미 데이터
          break
        case 'followers':
          aValue = 0 // 더미 데이터
          bValue = 0 // 더미 데이터
          break
        case 'created_at':
          aValue = new Date(a.created_at || 0)
          bValue = new Date(b.created_at || 0)
          break
        default:
          aValue = 0 // 더미 데이터
          bValue = 0 // 더미 데이터
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredBrands(filtered)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getCompanySizeColor = (size: string) => {
    switch (size) {
      case 'startup': return 'bg-green-100 text-green-800'
      case 'small': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'large': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompanySizeLabel = (size: string) => {
    const sizeObj = companySizes.find(s => s.value === size)
    return sizeObj ? sizeObj.label : size
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">브랜드를 불러오는 중...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">브랜드 탐색</h1>
              <p className="text-gray-600 mt-1">
                다양한 브랜드와 협업 기회를 찾아보세요
              </p>
            </div>
            <div className="text-sm text-gray-500">
              총 {filteredBrands.length}개의 브랜드
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
                placeholder="브랜드 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 산업 필터 */}
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">모든 산업</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
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

            {/* 회사 규모 필터 */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">모든 규모</option>
              {companySizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
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
              <option value="campaigns-desc">캠페인 많은순</option>
              <option value="campaigns-asc">캠페인 적은순</option>
              <option value="followers-desc">팔로워 많은순</option>
              <option value="followers-asc">팔로워 적은순</option>
              <option value="name-asc">이름순</option>
              <option value="created_at-desc">최신순</option>
            </select>
          </div>
        </div>

        {/* 브랜드 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* 브랜드 헤더 */}
              <div className="p-6 pb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.company_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {brand.company_name}
                      </h3>
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {brand.company_name_en}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {brand.target_markets?.join(', ') || '전세계'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 브랜드 정보 */}
              <div className="px-6 pb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">산업</span>
                    <span className="text-sm font-medium text-gray-900">
                      {brand.industry}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">회사 규모</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompanySizeColor(brand.company_size || '')}`}>
                      {getCompanySizeLabel(brand.company_size || '')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">설립년도</span>
                    <span className="text-sm font-medium text-gray-900">
                      2020
                    </span>
                  </div>
                </div>
              </div>

              {/* 설명 */}
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {brand.company_name}의 브랜드 프로필입니다.
                </p>
              </div>

              {/* 통계 */}
              <div className="px-6 pb-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      5
                    </div>
                    <div className="text-xs text-gray-500">캠페인</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      1.2M
                    </div>
                    <div className="text-xs text-gray-500">총 팔로워</div>
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
                    onClick={() => router.push(`/brands/${brand.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    프로필 보기
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    협업 제안
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        {filteredBrands.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">브랜드를 찾을 수 없습니다</h3>
            <p className="text-gray-600 mb-4">
              검색 조건을 변경하거나 다른 필터를 시도해보세요.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedIndustry('')
                setSelectedLocation('')
                setSelectedSize('')
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