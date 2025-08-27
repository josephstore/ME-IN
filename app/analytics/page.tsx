'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { AnalyticsService, AnalyticsData, CampaignAnalytics, InfluencerAnalytics } from '../../lib/services/analyticsService'
import { UserProfile, BrandProfile, InfluencerProfile } from '../../lib/types/database'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Calendar,
  PieChart,
  Activity,
  Award,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null)
  const [influencerProfile, setInfluencerProfile] = useState<InfluencerProfile | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [campaignAnalytics, setCampaignAnalytics] = useState<CampaignAnalytics[]>([])
  const [influencerAnalytics, setInfluencerAnalytics] = useState<InfluencerAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'performance'>('overview')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      await loadUserProfile(user.id)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    }
  }

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profile) {
        setUserProfile(profile)
        
        if (profile.user_type === 'brand') {
          const { data: brandProfile } = await supabase
            .from('brand_profiles')
            .select('*')
            .eq('user_profile_id', profile.id)
            .single()
          
          if (brandProfile) {
            setBrandProfile(brandProfile)
            await loadBrandAnalytics(brandProfile.id)
          }
        } else if (profile.user_type === 'influencer') {
          const { data: influencerProfile } = await supabase
            .from('influencer_profiles')
            .select('*')
            .eq('user_profile_id', profile.id)
            .single()
          
          if (influencerProfile) {
            setInfluencerProfile(influencerProfile)
            await loadInfluencerAnalytics(influencerProfile.id)
          }
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBrandAnalytics = async (brandProfileId: string) => {
    try {
      const data = await AnalyticsService.getBrandAnalytics(brandProfileId)
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error loading brand analytics:', error)
    }
  }

  const loadInfluencerAnalytics = async (influencerProfileId: string) => {
    try {
      const data = await AnalyticsService.getInfluencerAnalytics(influencerProfileId)
      setInfluencerAnalytics(data)
    } catch (error) {
      console.error('Error loading influencer analytics:', error)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    if (brandProfile) {
      await loadBrandAnalytics(brandProfile.id)
    } else if (influencerProfile) {
      await loadInfluencerAnalytics(influencerProfile.id)
    }
    setLoading(false)
  }

  const exportReport = () => {
    // PDF 내보내기 기능 (향후 구현)
    alert('리포트 내보내기 기능은 곧 추가될 예정입니다.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">프로필을 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">성과 분석 대시보드</h1>
              <p className="text-gray-600 mt-1">
                {userProfile.user_type === 'brand' ? '브랜드' : '인플루언서'} 성과를 한눈에 확인하세요
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="7d">최근 7일</option>
                <option value="30d">최근 30일</option>
                <option value="90d">최근 90일</option>
                <option value="1y">최근 1년</option>
              </select>
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>새로고침</span>
              </button>
              <button
                onClick={exportReport}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>내보내기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              개요
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'campaigns'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              캠페인 분석
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Activity className="h-4 w-4 inline mr-2" />
              성과 지표
            </button>
          </nav>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            analyticsData={analyticsData}
            influencerAnalytics={influencerAnalytics}
            userType={userProfile.user_type}
          />
        )}
        
        {activeTab === 'campaigns' && (
          <CampaignsTab 
            campaignAnalytics={campaignAnalytics}
            userType={userProfile.user_type}
          />
        )}
        
        {activeTab === 'performance' && (
          <PerformanceTab 
            analyticsData={analyticsData}
            influencerAnalytics={influencerAnalytics}
            userType={userProfile.user_type}
          />
        )}
      </div>
    </div>
  )
}

// 개요 탭 컴포넌트
function OverviewTab({ 
  analyticsData, 
  influencerAnalytics, 
  userType 
}: { 
  analyticsData: AnalyticsData | null
  influencerAnalytics: InfluencerAnalytics | null
  userType: string 
}) {
  if (userType === 'brand' && analyticsData) {
    return (
      <div className="space-y-6">
        {/* 주요 지표 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 캠페인</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalCampaigns}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 신청</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">승인된 신청</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.approvedApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 예산</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${analyticsData.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 캠페인</h3>
            <div className="space-y-3">
              {analyticsData.topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{category.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(category.count / analyticsData.totalCampaigns) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 통계</h3>
            <div className="space-y-3">
              {analyticsData.monthlyStats.slice(-6).map((stat) => (
                <div key={stat.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stat.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">캠페인: {stat.campaigns}</span>
                    <span className="text-sm text-gray-600">신청: {stat.applications}</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${stat.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (userType === 'influencer' && influencerAnalytics) {
    return (
      <div className="space-y-6">
        {/* 주요 지표 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 신청</p>
                <p className="text-2xl font-bold text-gray-900">{influencerAnalytics.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">승인된 신청</p>
                <p className="text-2xl font-bold text-gray-900">{influencerAnalytics.approvedApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">성공률</p>
                <p className="text-2xl font-bold text-gray-900">{influencerAnalytics.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 수익</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${influencerAnalytics.totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 카테고리</h3>
            <div className="space-y-2">
              {influencerAnalytics.topCategories.map((category, index) => (
                <div key={category} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full" />
                  <span className="text-sm text-gray-600">{category}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">수익 분석</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">평균 수익</span>
                <span className="text-sm font-medium text-gray-900">
                  ${influencerAnalytics.averageEarnings.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">팔로워 성장</span>
                <span className="text-sm font-medium text-gray-900">
                  +{influencerAnalytics.followerGrowth?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-600">데이터를 불러올 수 없습니다.</p>
    </div>
  )
}

// 캠페인 분석 탭 컴포넌트
function CampaignsTab({ 
  campaignAnalytics, 
  userType 
}: { 
  campaignAnalytics: CampaignAnalytics[]
  userType: string 
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">캠페인별 상세 분석</h3>
        {campaignAnalytics.length > 0 ? (
          <div className="space-y-4">
            {campaignAnalytics.map((campaign) => (
              <div key={campaign.campaignId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900">{campaign.title}</h4>
                  <span className="text-sm text-gray-500">
                    완료율: {campaign.completionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">신청 수</p>
                    <p className="font-medium">{campaign.applications}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">승인 수</p>
                    <p className="font-medium">{campaign.approvedApplications}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">총 예산</p>
                    <p className="font-medium">${campaign.totalBudget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">평균 제안 예산</p>
                    <p className="font-medium">${campaign.averageProposedBudget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">캠페인 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  )
}

// 성과 지표 탭 컴포넌트
function PerformanceTab({ 
  analyticsData, 
  influencerAnalytics, 
  userType 
}: { 
  analyticsData: AnalyticsData | null
  influencerAnalytics: InfluencerAnalytics | null
  userType: string 
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">성과 지표</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">주요 KPI</h4>
            <div className="space-y-3">
              {userType === 'brand' && analyticsData && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">캠페인 성공률</span>
                    <span className="text-sm font-medium text-gray-900">
                      {analyticsData.totalCampaigns > 0 
                        ? ((analyticsData.completedCampaigns / analyticsData.totalCampaigns) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">신청 승인률</span>
                    <span className="text-sm font-medium text-gray-900">
                      {analyticsData.totalApplications > 0 
                        ? ((analyticsData.approvedApplications / analyticsData.totalApplications) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">평균 예산</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${analyticsData.averageBudget.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              
              {userType === 'influencer' && influencerAnalytics && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">신청 성공률</span>
                    <span className="text-sm font-medium text-gray-900">
                      {influencerAnalytics.successRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">평균 수익</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${influencerAnalytics.averageEarnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">총 수익</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${influencerAnalytics.totalEarnings.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">성장 추이</h4>
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">차트 기능은 곧 추가될 예정입니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
