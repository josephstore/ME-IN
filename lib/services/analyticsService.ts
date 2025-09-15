import { supabase } from '@/lib/supabase'
import { Campaign, Application, UserProfile, BrandProfile, InfluencerProfile } from '../types/database'

export interface AnalyticsData {
  totalCampaigns: number
  activeCampaigns: number
  completedCampaigns: number
  totalApplications: number
  approvedApplications: number
  totalRevenue: number
  averageBudget: number
  topCategories: Array<{ category: string; count: number }>
  monthlyStats: Array<{ month: string; campaigns: number; applications: number; revenue: number }>
}

export interface CampaignAnalytics {
  campaignId: string
  title: string
  applications: number
  approvedApplications: number
  totalBudget: number
  averageProposedBudget: number
  matchScores: number[]
  completionRate: number
  engagementRate?: number
}

export interface InfluencerAnalytics {
  influencerId: string
  displayName: string
  totalApplications: number
  approvedApplications: number
  totalEarnings: number
  averageEarnings: number
  successRate: number
  topCategories: string[]
  followerGrowth?: number
}

export class AnalyticsService {
  // 브랜드 분석 데이터 조회
  static async getBrandAnalytics(brandProfileId: string): Promise<AnalyticsData> {
    try {
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('brand_profile_id', brandProfileId)

      if (campaignsError) throw campaignsError

      const campaignIds = campaigns?.map(c => c.id) || []
      
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('*')
        .in('campaign_id', campaignIds)

      if (applicationsError) throw applicationsError

      // 통계 계산
      const totalCampaigns = campaigns?.length || 0
      const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0
      const completedCampaigns = campaigns?.filter(c => c.status === 'completed').length || 0
      const totalApplications = applications?.length || 0
      const approvedApplications = applications?.filter(a => a.status === 'approved').length || 0
      
      const totalRevenue = campaigns?.reduce((sum, c) => sum + (c.budget_max || 0), 0) || 0
      const averageBudget = totalCampaigns > 0 ? totalRevenue / totalCampaigns : 0

      // 카테고리별 통계
      const categoryCounts: Record<string, number> = {}
      campaigns?.forEach(campaign => {
        if (campaign.category) {
          categoryCounts[campaign.category] = (categoryCounts[campaign.category] || 0) + 1
        }
      })

      const topCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // 월별 통계 (최근 6개월)
      const monthlyStats = this.calculateMonthlyStats(campaigns || [], applications || [])

      return {
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        totalApplications,
        approvedApplications,
        totalRevenue,
        averageBudget,
        topCategories,
        monthlyStats
      }
    } catch (error) {
      console.error('Error fetching brand analytics:', error)
      throw error
    }
  }

  // 인플루언서 분석 데이터 조회
  static async getInfluencerAnalytics(influencerProfileId: string): Promise<InfluencerAnalytics> {
    try {
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          campaigns (
            *,
            brand_profiles (
              *,
              user_profiles (*)
            )
          )
        `)
        .eq('influencer_profile_id', influencerProfileId)

      if (applicationsError) throw applicationsError

      const totalApplications = applications?.length || 0
      const approvedApplications = applications?.filter(a => a.status === 'approved').length || 0
      const successRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0

      // 수익 계산
      const totalEarnings = applications
        ?.filter(a => a.status === 'approved')
        .reduce((sum, a) => sum + (a.proposed_budget || 0), 0) || 0
      
      const averageEarnings = approvedApplications > 0 ? totalEarnings / approvedApplications : 0

      // 카테고리별 통계
      const categoryCounts: Record<string, number> = {}
      applications?.forEach(app => {
        if (app.campaigns?.category) {
          categoryCounts[app.campaigns.category] = (categoryCounts[app.campaigns.category] || 0) + 1
        }
      })

      const topCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category]) => category)

      // 인플루언서 프로필 정보 조회
      const { data: influencerProfile } = await supabase
        .from('influencer_profiles')
        .select('*, user_profiles(*)')
        .eq('id', influencerProfileId)
        .single()

      return {
        influencerId: influencerProfileId,
        displayName: influencerProfile?.user_profiles?.display_name || 'Unknown',
        totalApplications,
        approvedApplications,
        totalEarnings,
        averageEarnings,
        successRate,
        topCategories,
        followerGrowth: influencerProfile?.follower_growth || 0
      }
    } catch (error) {
      console.error('Error fetching influencer analytics:', error)
      throw error
    }
  }

  // 캠페인별 상세 분석
  static async getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics> {
    try {
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()

      if (campaignError) throw campaignError

      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('*')
        .eq('campaign_id', campaignId)

      if (applicationsError) throw applicationsError

      const applicationsCount = applications?.length || 0
      const approvedApplications = applications?.filter(a => a.status === 'approved').length || 0
      const completionRate = applicationsCount > 0 ? (approvedApplications / applicationsCount) * 100 : 0

      const totalBudget = campaign.budget_max || 0
      const averageProposedBudget = applicationsCount > 0 
        ? applications.reduce((sum, a) => sum + (a.proposed_budget || 0), 0) / applicationsCount 
        : 0

      // 매칭 점수 계산 (ApplicationService의 calculateMatchScore 사용)
      const matchScores = await Promise.all(
        applications?.map(async (app) => {
          // 여기서는 간단한 계산을 위해 기본값 사용
          return Math.random() * 100 // 실제로는 ApplicationService.calculateMatchScore 사용
        }) || []
      )

      return {
        campaignId,
        title: campaign.title,
        applications: applicationsCount,
        approvedApplications,
        totalBudget,
        averageProposedBudget,
        matchScores,
        completionRate,
        engagementRate: Math.random() * 10 // 실제 데이터로 대체 필요
      }
    } catch (error) {
      console.error('Error fetching campaign analytics:', error)
      throw error
    }
  }

  // 플랫폼 전체 통계 (관리자용)
  static async getPlatformAnalytics(): Promise<AnalyticsData> {
    try {
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')

      if (campaignsError) throw campaignsError

      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('*')

      if (applicationsError) throw applicationsError

      const totalCampaigns = campaigns?.length || 0
      const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0
      const completedCampaigns = campaigns?.filter(c => c.status === 'completed').length || 0
      const totalApplications = applications?.length || 0
      const approvedApplications = applications?.filter(a => a.status === 'approved').length || 0
      
      const totalRevenue = campaigns?.reduce((sum, c) => sum + (c.budget_max || 0), 0) || 0
      const averageBudget = totalCampaigns > 0 ? totalRevenue / totalCampaigns : 0

      // 카테고리별 통계
      const categoryCounts: Record<string, number> = {}
      campaigns?.forEach(campaign => {
        if (campaign.category) {
          categoryCounts[campaign.category] = (categoryCounts[campaign.category] || 0) + 1
        }
      })

      const topCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // 월별 통계
      const monthlyStats = this.calculateMonthlyStats(campaigns || [], applications || [])

      return {
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        totalApplications,
        approvedApplications,
        totalRevenue,
        averageBudget,
        topCategories,
        monthlyStats
      }
    } catch (error) {
      console.error('Error fetching platform analytics:', error)
      throw error
    }
  }

  // 월별 통계 계산 헬퍼 함수
  private static calculateMonthlyStats(campaigns: Campaign[], applications: Application[]) {
    const months = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toISOString().slice(0, 7) // YYYY-MM 형식
      
      const monthCampaigns = campaigns.filter(c => 
        new Date(c.created_at).toISOString().slice(0, 7) === monthKey
      )
      
      const monthApplications = applications.filter(a => 
        new Date(a.created_at).toISOString().slice(0, 7) === monthKey
      )
      
      const monthRevenue = monthCampaigns.reduce((sum, c) => sum + (c.budget_max || 0), 0)
      
      months.push({
        month: monthKey,
        campaigns: monthCampaigns.length,
        applications: monthApplications.length,
        revenue: monthRevenue
      })
    }
    
    return months
  }

  // ROI 계산
  static calculateROI(investment: number, returns: number): number {
    if (investment === 0) return 0
    return ((returns - investment) / investment) * 100
  }

  // 성장률 계산
  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }
}
