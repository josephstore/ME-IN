import { supabase } from '../supabase'
import { networkService } from './networkService'
import { sampleCampaigns } from '../data/sampleCampaigns'
import {
  Campaign,
  CreateCampaignRequest,
  ApiResponse
} from '../types/database'

export class CampaignService {
  // 캠페인 생성
  static async createCampaign(data: CreateCampaignRequest): Promise<ApiResponse<Campaign>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 브랜드 프로필 확인
      const { data: brandProfile, error: brandError } = await supabase
        .from('brand_profiles')
        .select('id')
        .eq('user_profile_id', (
          await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        ).data?.id)
        .single()

      if (brandError || !brandProfile) {
        return { data: null, error: '브랜드 프로필을 먼저 생성해주세요.', success: false }
      }

      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert({
          brand_profile_id: brandProfile.id,
          ...data
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: campaign, error: null, success: true }
    } catch (error) {
      return { data: null, error: '캠페인 생성 중 오류가 발생했습니다.', success: false }
    }
  }

  // 캠페인 조회 (단일)
  static async getCampaign(campaignId: string): Promise<ApiResponse<Campaign>> {
    try {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          brand_profiles (
            *,
            user_profiles (
              display_name,
              avatar_url
            )
          )
        `)
        .eq('id', campaignId)
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: campaign, error: null, success: true }
    } catch (error) {
      return { data: null, error: '캠페인 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 캠페인 목록 조회 (브랜드용)
  static async getMyCampaigns(): Promise<ApiResponse<Campaign[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          brand_profiles (
            *,
            user_profiles (
              display_name,
              avatar_url
            )
          )
        `)
        .eq('brand_profiles.user_profile_id', (
          await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        ).data?.id)
        .order('created_at', { ascending: false })

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: campaigns, error: null, success: true }
    } catch (error) {
      return { data: null, error: '캠페인 목록 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 활성 캠페인 목록 조회 (인플루언서용)
  static async getActiveCampaigns(filters?: {
    category?: string
    minBudget?: number
    maxBudget?: number
    targetLanguages?: string[]
    targetRegions?: string[]
    minFollowers?: number
  }): Promise<ApiResponse<Campaign[]>> {
    try {
      // 네트워크 연결 확인
      const networkStatus = networkService.getNetworkStatus()
      if (!networkStatus.isOnline) {
        // 오프라인 데이터 반환 (샘플 데이터 포함)
        const offlineData = networkService.getOfflineData('active_campaigns', sampleCampaigns)
        return { data: offlineData, error: '오프라인 모드: 캐시된 데이터를 표시합니다.', success: true }
      }

      // 재시도 로직으로 네트워크 요청
      const result = await networkService.retryWithBackoff(async () => {
        let query = supabase
          .from('campaigns')
          .select(`
            *,
            brand_profiles (
              *,
              user_profiles (
                display_name,
                avatar_url
              )
            )
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })

        // 필터 적용
        if (filters?.category) {
          query = query.eq('category', filters.category)
        }
        if (filters?.minBudget) {
          query = query.gte('budget_min', filters.minBudget)
        }
        if (filters?.maxBudget) {
          query = query.lte('budget_max', filters.maxBudget)
        }
        if (filters?.targetLanguages?.length) {
          query = query.overlaps('target_languages', filters.targetLanguages)
        }
        if (filters?.targetRegions?.length) {
          query = query.overlaps('target_regions', filters.targetRegions)
        }
        if (filters?.minFollowers) {
          query = query.gte('min_followers', filters.minFollowers)
        }

        const { data: campaigns, error } = await query

        if (error) {
          throw error
        }

        return campaigns
      })

      // 성공 시 오프라인 캐시에 저장
      networkService.setOfflineData('active_campaigns', result)

      // 샘플 데이터와 병합 (네트워크 데이터가 비어있는 경우)
      const finalResult = result && result.length > 0 ? result : sampleCampaigns

      return { data: finalResult, error: null, success: true }
    } catch (error) {
      console.error('캠페인 목록 조회 오류:', error)
      
      // 네트워크 오류인 경우 오프라인 데이터 반환 (샘플 데이터 포함)
      if (networkService.isNetworkError(error)) {
        const offlineData = networkService.getOfflineData('active_campaigns', sampleCampaigns)
        return { 
          data: offlineData, 
          error: '네트워크 연결 문제로 샘플 데이터를 표시합니다.', 
          success: true 
        }
      }

      return { data: null, error: '활성 캠페인 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 캠페인 업데이트
  static async updateCampaign(campaignId: string, updates: Partial<CreateCampaignRequest>): Promise<ApiResponse<Campaign>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 권한 확인
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('brand_profile_id')
        .eq('id', campaignId)
        .single()

      if (campaignError) {
        return { data: null, error: '캠페인을 찾을 수 없습니다.', success: false }
      }

      const { data: brandProfile, error: brandError } = await supabase
        .from('brand_profiles')
        .select('id')
        .eq('id', campaign.brand_profile_id)
        .eq('user_profile_id', (
          await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        ).data?.id)
        .single()

      if (brandError || !brandProfile) {
        return { data: null, error: '캠페인을 수정할 권한이 없습니다.', success: false }
      }

      const { data: updatedCampaign, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', campaignId)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: updatedCampaign, error: null, success: true }
    } catch (error) {
      return { data: null, error: '캠페인 업데이트 중 오류가 발생했습니다.', success: false }
    }
  }

  // 캠페인 상태 변경
  static async updateCampaignStatus(campaignId: string, status: Campaign['status']): Promise<ApiResponse<Campaign>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 권한 확인
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('brand_profile_id')
        .eq('id', campaignId)
        .single()

      if (campaignError) {
        return { data: null, error: '캠페인을 찾을 수 없습니다.', success: false }
      }

      const { data: brandProfile, error: brandError } = await supabase
        .from('brand_profiles')
        .select('id')
        .eq('id', campaign.brand_profile_id)
        .eq('user_profile_id', (
          await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        ).data?.id)
        .single()

      if (brandError || !brandProfile) {
        return { data: null, error: '캠페인을 수정할 권한이 없습니다.', success: false }
      }

      const { data: updatedCampaign, error } = await supabase
        .from('campaigns')
        .update({ status })
        .eq('id', campaignId)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: updatedCampaign, error: null, success: true }
    } catch (error) {
      return { data: null, error: '캠페인 상태 변경 중 오류가 발생했습니다.', success: false }
    }
  }

  // 캠페인 삭제
  static async deleteCampaign(campaignId: string): Promise<ApiResponse<null>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 권한 확인
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('brand_profile_id')
        .eq('id', campaignId)
        .single()

      if (campaignError) {
        return { data: null, error: '캠페인을 찾을 수 없습니다.', success: false }
      }

      const { data: brandProfile, error: brandError } = await supabase
        .from('brand_profiles')
        .select('id')
        .eq('id', campaign.brand_profile_id)
        .eq('user_profile_id', (
          await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        ).data?.id)
        .single()

      if (brandError || !brandProfile) {
        return { data: null, error: '캠페인을 삭제할 권한이 없습니다.', success: false }
      }

      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: null, error: null, success: true }
    } catch (error) {
      return { data: null, error: '캠페인 삭제 중 오류가 발생했습니다.', success: false }
    }
  }

  // 캠페인 통계 조회
  static async getCampaignStats(campaignId: string): Promise<ApiResponse<{
    totalApplications: number
    pendingApplications: number
    approvedApplications: number
    rejectedApplications: number
    avgProposedBudget: number
  }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 권한 확인
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('brand_profile_id')
        .eq('id', campaignId)
        .single()

      if (campaignError) {
        return { data: null, error: '캠페인을 찾을 수 없습니다.', success: false }
      }

      const { data: brandProfile, error: brandError } = await supabase
        .from('brand_profiles')
        .select('id')
        .eq('id', campaign.brand_profile_id)
        .eq('user_profile_id', (
          await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        ).data?.id)
        .single()

      if (brandError || !brandProfile) {
        return { data: null, error: '캠페인 통계를 조회할 권한이 없습니다.', success: false }
      }

      // 신청 통계 조회
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('status, proposed_budget')
        .eq('campaign_id', campaignId)

      if (applicationsError) {
        return { data: null, error: applicationsError.message, success: false }
      }

      const stats = {
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        approvedApplications: applications.filter(app => app.status === 'approved').length,
        rejectedApplications: applications.filter(app => app.status === 'rejected').length,
        avgProposedBudget: applications.length > 0 
          ? applications.reduce((sum, app) => sum + (app.proposed_budget || 0), 0) / applications.length
          : 0
      }

      return { data: stats, error: null, success: true }
    } catch (error) {
      return { data: null, error: '캠페인 통계 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 추천 캠페인 조회 (인플루언서용)
  static async getRecommendedCampaigns(): Promise<ApiResponse<Campaign[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 인플루언서 프로필 조회
      const { data: influencerProfile, error: profileError } = await supabase
        .from('influencer_profiles')
        .select(`
          *,
          user_profiles (
            languages,
            location
          )
        `)
        .eq('user_profile_id', (
          await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        ).data?.id)
        .single()

      if (profileError || !influencerProfile) {
        return { data: null, error: '인플루언서 프로필을 찾을 수 없습니다.', success: false }
      }

      // 매칭 조건으로 캠페인 조회
      let query = supabase
        .from('campaigns')
        .select(`
          *,
          brand_profiles (
            *,
            user_profiles (
              display_name,
              avatar_url
            )
          )
        `)
        .eq('status', 'active')
        .lte('min_followers', influencerProfile.total_followers)
        .order('created_at', { ascending: false })

      // 언어 매칭
      if (influencerProfile.user_profiles?.languages?.length) {
        query = query.overlaps('target_languages', influencerProfile.user_profiles.languages)
      }

      const { data: campaigns, error } = await query

      if (error) {
        return { data: null, error: error.message, success: false }
      }

            // 콘텐츠 카테고리 매칭으로 정렬
      const scoredCampaigns = campaigns?.map(campaign => {
        let score = 0
        if (influencerProfile.content_categories?.some((cat: string) =>
          campaign.category?.toLowerCase().includes(cat.toLowerCase())
        )) {
          score += 10
        }
        return { ...campaign, score }
      }).sort((a, b) => b.score - a.score) || []

      return { data: scoredCampaigns, error: null, success: true }
    } catch (error) {
      return { data: null, error: '추천 캠페인 조회 중 오류가 발생했습니다.', success: false }
    }
  }
}
