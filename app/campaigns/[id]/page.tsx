'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RealCampaignService } from '@/lib/services/realDatabaseService'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Users, 
  Globe, 
  FileText,
  Edit,
  Share2,
  Heart,
  MessageCircle
} from 'lucide-react'

interface Campaign {
  id: string
  brand_id: string
  title: string
  title_en?: string
  title_ar?: string
  description: string
  description_en?: string
  description_ar?: string
  category: string
  budget_min: number
  budget_max: number
  currency: string
  target_languages: string[]
  target_regions: string[]
  min_followers: number
  content_requirements?: string
  start_date?: string
  end_date?: string
  application_deadline?: string
  max_applications?: number
  media_assets: string[]
  status: string
  created_at: string
  brand_name: string
  brand_email: string
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      loadCampaign(params.id as string)
    }
  }, [params.id])

  const loadCampaign = async (campaignId: string) => {
    try {
      setLoading(true)
      const response = await RealCampaignService.getCampaignById(campaignId)
      
      if (response.success && response.data) {
        setCampaign(response.data)
      } else {
        setError(response.error || '캠페인을 찾을 수 없습니다.')
      }
    } catch (error) {
      console.error('캠페인 로드 오류:', error)
      setError('캠페인을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'KRW'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">캠페인을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">캠페인을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/campaigns')}>
            캠페인 목록으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                뒤로
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
                <p className="text-gray-600">by {campaign.brand_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                관심
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                신청하기
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 캠페인 설명 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                캠페인 설명
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{campaign.description}</p>
                {campaign.description_en && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">English</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{campaign.description_en}</p>
                  </div>
                )}
                {campaign.description_ar && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">العربية</h3>
                    <p className="text-gray-700 whitespace-pre-wrap text-right">{campaign.description_ar}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 콘텐츠 요구사항 */}
            {campaign.content_requirements && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">콘텐츠 요구사항</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{campaign.content_requirements}</p>
              </div>
            )}

            {/* 미디어 자산 */}
            {campaign.media_assets && campaign.media_assets.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">미디어 자산</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {campaign.media_assets.map((asset, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">미디어 {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 캠페인 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">캠페인 정보</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">예산</p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(campaign.budget_min, campaign.currency)} - {formatCurrency(campaign.budget_max, campaign.currency)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">최소 팔로워</p>
                    <p className="font-medium text-gray-900">
                      {campaign.min_followers.toLocaleString()}명
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <Globe className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">타겟 언어</p>
                    <p className="font-medium text-gray-900">
                      {campaign.target_languages.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">신청 마감일</p>
                    <p className="font-medium text-gray-900">
                      {campaign.application_deadline ? formatDate(campaign.application_deadline) : '미정'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 브랜드 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">브랜드 정보</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-lg">
                    {campaign.brand_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{campaign.brand_name}</p>
                  <p className="text-sm text-gray-500">{campaign.brand_email}</p>
                </div>
              </div>
            </div>

            {/* 캠페인 기간 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">캠페인 기간</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">시작일</p>
                  <p className="font-medium text-gray-900">
                    {campaign.start_date ? formatDate(campaign.start_date) : '미정'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">종료일</p>
                  <p className="font-medium text-gray-900">
                    {campaign.end_date ? formatDate(campaign.end_date) : '미정'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}