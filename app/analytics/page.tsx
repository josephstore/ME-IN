'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnalyticsService } from '@/lib/services/databaseService'
import { Button } from '@/components/ui/Button'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    total_campaigns: number
    total_influencers: number
    total_reach: number
    total_engagement: number
    total_revenue: number
    avg_roi: number
  }
  campaign_performance: Array<{
    id: string
    title: string
    reach: number
    engagement: number
    clicks: number
    conversions: number
    revenue: number
    roi: number
  }>
  influencer_performance: Array<{
    id: string
    name: string
    followers: number
    engagement_rate: number
    campaigns_count: number
    total_revenue: number
  }>
  monthly_trends: Array<{
    month: string
    campaigns: number
    reach: number
    engagement: number
    revenue: number
  }>
  category_breakdown: Array<{
    category: string
    campaigns: number
    reach: number
    engagement: number
    revenue: number
  }>
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [refreshing, setRefreshing] = useState(false)

  const periods = [
    { value: '7d', label: '최근 7일' },
    { value: '30d', label: '최근 30일' },
    { value: '90d', label: '최근 90일' },
    { value: '1y', label: '최근 1년' }
  ]

  const metrics = [
    { value: 'revenue', label: '수익', icon: DollarSign },
    { value: 'reach', label: '도달률', icon: Eye },
    { value: 'engagement', label: '참여도', icon: Heart },
    { value: 'campaigns', label: '캠페인', icon: BarChart3 }
  ]

  useEffect(() => {
    loadAnalytics()
  }, [selectedPeriod])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await AnalyticsService.getDashboardStats('demo', 'brand')
      
      if (response.success && response.data) {
        setAnalytics(response.data)
      } else {
        // 더미 데이터 사용
        setAnalytics({
          overview: {
            total_campaigns: 24,
            total_influencers: 156,
            total_reach: 2500000,
            total_engagement: 125000,
            total_revenue: 450000,
            avg_roi: 285
          },
          campaign_performance: [
            {
              id: '1',
              title: '캐어리 쿨링 토너 캠페인',
              reach: 450000,
              engagement: 22500,
              clicks: 12500,
              conversions: 850,
              revenue: 85000,
              roi: 320
            },
            {
              id: '2',
              title: '한국 음식 브랜드 캠페인',
              reach: 380000,
              engagement: 19000,
              clicks: 9800,
              conversions: 620,
              revenue: 62000,
              roi: 280
            },
            {
              id: '3',
              title: 'K-뷰티 메이크업 캠페인',
              reach: 520000,
              engagement: 26000,
              clicks: 15200,
              conversions: 1100,
              revenue: 110000,
              roi: 350
            }
          ],
          influencer_performance: [
            {
              id: '1',
              name: 'Aisha Al-Rashid',
              followers: 150000,
              engagement_rate: 4.5,
              campaigns_count: 8,
              total_revenue: 45000
            },
            {
              id: '2',
              name: 'Mohammed Al-Zahra',
              followers: 200000,
              engagement_rate: 3.8,
              campaigns_count: 6,
              total_revenue: 38000
            },
            {
              id: '3',
              name: 'Fatima Al-Mansouri',
              followers: 120000,
              engagement_rate: 5.2,
              campaigns_count: 10,
              total_revenue: 52000
            }
          ],
          monthly_trends: [
            { month: '1월', campaigns: 3, reach: 450000, engagement: 22500, revenue: 45000 },
            { month: '2월', campaigns: 5, reach: 680000, engagement: 34000, revenue: 68000 },
            { month: '3월', campaigns: 7, reach: 920000, engagement: 46000, revenue: 92000 },
            { month: '4월', campaigns: 9, reach: 1200000, engagement: 60000, revenue: 120000 }
          ],
          category_breakdown: [
            { category: '뷰티/화장품', campaigns: 12, reach: 1200000, engagement: 60000, revenue: 120000 },
            { category: '패션/의류', campaigns: 8, reach: 800000, engagement: 40000, revenue: 80000 },
            { category: '음식/레스토랑', campaigns: 4, reach: 500000, engagement: 25000, revenue: 50000 }
          ]
        })
      }
    } catch (error) {
      console.error('분석 데이터 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await loadAnalytics()
    setRefreshing(false)
  }

  const exportData = () => {
    // 데이터 내보내기 기능
    const dataStr = JSON.stringify(analytics, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">분석 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">분석 데이터를 불러올 수 없습니다</h1>
          <Button onClick={loadAnalytics}>다시 시도</Button>
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
              <h1 className="text-2xl font-bold text-gray-900">분석 대시보드</h1>
              <p className="text-gray-600 mt-1">
                캠페인 성과와 ROI를 종합적으로 분석해보세요
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={refreshData}
                disabled={refreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
              <Button
                onClick={exportData}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                내보내기
              </Button>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">기간:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">지표:</span>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {metrics.map((metric) => (
                  <option key={metric.value} value={metric.value}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 개요 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 캠페인</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.total_campaigns}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 인플루언서</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.total_influencers}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 도달률</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.total_reach)}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 참여도</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.total_engagement)}</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 수익</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.total_revenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평균 ROI</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.avg_roi}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 캠페인 성과 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">캠페인 성과</h3>
            <div className="space-y-4">
              {analytics.campaign_performance.map((campaign) => (
                <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{campaign.title}</h4>
                    <span className="text-sm font-medium text-green-600">ROI {campaign.roi}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">도달률:</span>
                      <span className="ml-2 font-medium">{formatNumber(campaign.reach)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">참여도:</span>
                      <span className="ml-2 font-medium">{formatNumber(campaign.engagement)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">클릭:</span>
                      <span className="ml-2 font-medium">{formatNumber(campaign.clicks)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">수익:</span>
                      <span className="ml-2 font-medium">{formatCurrency(campaign.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 인플루언서 성과 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">인플루언서 성과</h3>
            <div className="space-y-4">
              {analytics.influencer_performance.map((influencer) => (
                <div key={influencer.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{influencer.name}</h4>
                    <span className="text-sm font-medium text-blue-600">{influencer.engagement_rate}% 참여도</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">팔로워:</span>
                      <span className="ml-2 font-medium">{formatNumber(influencer.followers)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">캠페인:</span>
                      <span className="ml-2 font-medium">{influencer.campaigns_count}개</span>
                    </div>
                    <div>
                      <span className="text-gray-600">수익:</span>
                      <span className="ml-2 font-medium">{formatCurrency(influencer.total_revenue)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">평균:</span>
                      <span className="ml-2 font-medium">{formatCurrency(influencer.total_revenue / influencer.campaigns_count)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 월별 트렌드 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 트렌드</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">월</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">캠페인</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">도달률</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">참여도</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수익</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.monthly_trends.map((trend, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trend.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trend.campaigns}개</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(trend.reach)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(trend.engagement)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(trend.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 카테고리별 분석 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 분석</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.category_breakdown.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{category.category}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">캠페인:</span>
                    <span className="font-medium">{category.campaigns}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">도달률:</span>
                    <span className="font-medium">{formatNumber(category.reach)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">참여도:</span>
                    <span className="font-medium">{formatNumber(category.engagement)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">수익:</span>
                    <span className="font-medium">{formatCurrency(category.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}