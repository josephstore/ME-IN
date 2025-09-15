import { supabase } from '../supabase'
import {
  Application,
  CreateApplicationRequest,
  ApiResponse
} from '../types/database'

export class ApplicationService {
  // 신청 생성
  static async createApplication(data: CreateApplicationRequest): Promise<ApiResponse<Application>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 인플루언서 프로필 확인
      const { data: influencerProfile, error: influencerError } = await supabase
        .from('influencer_profiles')
        .select('id')
        .eq('user_profile_id', (
          await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        ).data?.id)
        .single()

      if (influencerError || !influencerProfile) {
        return { data: null, error: '인플루언서 프로필을 먼저 생성해주세요.', success: false }
      }

      // 이미 신청했는지 확인
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('campaign_id', data.campaign_id)
        .eq('influencer_profile_id', influencerProfile.id)
        .single()

      if (existingApplication) {
        return { data: null, error: '이미 신청한 캠페인입니다.', success: false }
      }

      const { data: application, error } = await supabase
        .from('applications')
        .insert({
          campaign_id: data.campaign_id,
          influencer_profile_id: influencerProfile.id,
          proposal: data.proposal,
          proposed_budget: data.proposed_budget,
          proposed_timeline: data.proposed_timeline,
          portfolio_links: data.portfolio_links || [],
          status: 'approved' // 자동 승인
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: application, error: null, success: true }
    } catch (error) {
      return { data: null, error: '신청 생성 중 오류가 발생했습니다.', success: false }
    }
  }

  // 신청 조회 (단일)
  static async getApplication(applicationId: string): Promise<ApiResponse<Application>> {
    try {
      const { data: application, error } = await supabase
        .from('applications')
        .select(`
          *,
          campaigns (
            *,
            brand_profiles (
              *,
              user_profiles (
                display_name,
                avatar_url
              )
            )
          ),
          influencer_profiles (
            *,
            user_profiles (
              display_name,
              avatar_url
            )
          )
        `)
        .eq('id', applicationId)
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: application, error: null, success: true }
    } catch (error) {
      return { data: null, error: '신청 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 내 신청 목록 조회 (인플루언서용)
  static async getMyApplications(): Promise<ApiResponse<Application[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          campaigns (
            *,
            brand_profiles (
              *,
              user_profiles (
                display_name,
                avatar_url
              )
            )
          )
        `)
        .eq('influencer_profiles.user_profile_id', (
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

      return { data: applications, error: null, success: true }
    } catch (error) {
      return { data: null, error: '신청 목록 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 캠페인별 신청 목록 조회 (브랜드용)
  static async getCampaignApplications(campaignId: string): Promise<ApiResponse<Application[]>> {
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
        return { data: null, error: '캠페인 신청을 조회할 권한이 없습니다.', success: false }
      }

      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          influencer_profiles (
            *,
            user_profiles (
              display_name,
              avatar_url
            )
          )
        `)
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false })

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: applications, error: null, success: true }
    } catch (error) {
      return { data: null, error: '캠페인 신청 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 신청 상태 업데이트 (브랜드용)
  static async updateApplicationStatus(
    applicationId: string, 
    status: Application['status'], 
    feedback?: string
  ): Promise<ApiResponse<Application>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 권한 확인
      const { data: application, error: applicationError } = await supabase
        .from('applications')
        .select(`
          id,
          campaigns (
            brand_profile_id
          )
        `)
        .eq('id', applicationId)
        .single()

      if (applicationError) {
        return { data: null, error: '신청을 찾을 수 없습니다.', success: false }
      }

      const { data: brandProfile, error: brandError } = await supabase
        .from('brand_profiles')
        .select('id')
        .eq('id', (application as any).campaigns?.brand_profile_id)
        .eq('user_profile_id', (
          await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        ).data?.id)
        .single()

      if (brandError || !brandProfile) {
        return { data: null, error: '신청 상태를 변경할 권한이 없습니다.', success: false }
      }

      const updateData: any = { status }
      if (feedback) {
        updateData.brand_feedback = feedback
      }

      const { data: updatedApplication, error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', applicationId)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: updatedApplication, error: null, success: true }
    } catch (error) {
      return { data: null, error: '신청 상태 업데이트 중 오류가 발생했습니다.', success: false }
    }
  }

  // 신청 철회 (인플루언서용)
  static async withdrawApplication(applicationId: string): Promise<ApiResponse<Application>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 권한 확인
      const { data: application, error: applicationError } = await supabase
        .from('applications')
        .select(`
          id,
          influencer_profiles (
            user_profile_id
          )
        `)
        .eq('id', applicationId)
        .single()

      if (applicationError) {
        return { data: null, error: '신청을 찾을 수 없습니다.', success: false }
      }

      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', (application as any).influencer_profiles?.user_profile_id)
        .eq('user_id', user.id)
        .single()

      if (userError || !userProfile) {
        return { data: null, error: '신청을 철회할 권한이 없습니다.', success: false }
      }

      const { data: updatedApplication, error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', applicationId)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: updatedApplication, error: null, success: true }
    } catch (error) {
      return { data: null, error: '신청 철회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 신청 통계 조회
  static async getApplicationStats(): Promise<ApiResponse<{
    totalApplications: number
    pendingApplications: number
    approvedApplications: number
    rejectedApplications: number
    withdrawnApplications: number
    avgResponseTime: number
  }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 사용자 타입 확인
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_type, id')
        .eq('user_id', user.id)
        .single()

      if (profileError) {
        return { data: null, error: '사용자 프로필을 찾을 수 없습니다.', success: false }
      }

      let applications: any[] = []

      if (userProfile.user_type === 'influencer') {
        // 인플루언서의 신청 통계
        const { data: influencerProfile } = await supabase
          .from('influencer_profiles')
          .select('id')
          .eq('user_profile_id', userProfile.id)
          .single()

        if (influencerProfile) {
          const { data } = await supabase
            .from('applications')
            .select('status, created_at, updated_at')
            .eq('influencer_profile_id', influencerProfile.id)
          
          applications = data || []
        }
      } else if (userProfile.user_type === 'brand') {
        // 브랜드의 신청 통계
        const { data: brandProfile } = await supabase
          .from('brand_profiles')
          .select('id')
          .eq('user_profile_id', userProfile.id)
          .single()

        if (brandProfile) {
          const { data } = await supabase
            .from('applications')
            .select('status, created_at, updated_at')
            .eq('campaigns.brand_profile_id', brandProfile.id)
          
          applications = data || []
        }
      }

      const stats = {
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        approvedApplications: applications.filter(app => app.status === 'approved').length,
        rejectedApplications: applications.filter(app => app.status === 'rejected').length,
        withdrawnApplications: applications.filter(app => app.status === 'withdrawn').length,
        avgResponseTime: 0 // 실제 구현에서는 응답 시간 계산
      }

      return { data: stats, error: null, success: true }
    } catch (error) {
      return { data: null, error: '신청 통계 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  // 매칭 점수 계산
  static async calculateMatchScore(campaignId: string, influencerProfileId: string): Promise<ApiResponse<number>> {
    try {
      // 캠페인 정보 조회
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()

      if (campaignError) {
        return { data: null, error: '캠페인을 찾을 수 없습니다.', success: false }
      }

      // 인플루언서 프로필 조회
      const { data: influencerProfile, error: influencerError } = await supabase
        .from('influencer_profiles')
        .select(`
          *,
          user_profiles (
            languages,
            location
          )
        `)
        .eq('id', influencerProfileId)
        .single()

      if (influencerError) {
        return { data: null, error: '인플루언서 프로필을 찾을 수 없습니다.', success: false }
      }

      let score = 0

      // 팔로워 수 매칭 (30%)
      if (influencerProfile.total_followers >= campaign.min_followers) {
        score += 30
      } else {
        score += (influencerProfile.total_followers / campaign.min_followers) * 30
      }

      // 언어 매칭 (25%)
      if (campaign.target_languages?.length && influencerProfile.user_profiles?.languages?.length) {
        const languageMatch = campaign.target_languages.filter((lang: string) =>
          influencerProfile.user_profiles.languages.includes(lang)
        ).length
        score += (languageMatch / campaign.target_languages.length) * 25
      }

      // 콘텐츠 카테고리 매칭 (25%)
      if (campaign.category && influencerProfile.content_categories?.length) {
        const categoryMatch = influencerProfile.content_categories.some((cat: string) =>
          campaign.category.toLowerCase().includes(cat.toLowerCase())
        )
        if (categoryMatch) score += 25
      }

      // 참여율 매칭 (20%)
      if (influencerProfile.avg_engagement_rate > 0) {
        score += Math.min(influencerProfile.avg_engagement_rate * 2, 20)
      }

      return { data: Math.round(score), error: null, success: true }
    } catch (error) {
      return { data: null, error: '매칭 점수 계산 중 오류가 발생했습니다.', success: false }
    }
  }

  // 추천 신청 생성
  static async createRecommendedApplication(campaignId: string): Promise<ApiResponse<Application>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      // 인플루언서 프로필 조회
      const { data: influencerProfile, error: influencerError } = await supabase
        .from('influencer_profiles')
        .select(`
          *,
          user_profiles (
            display_name
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

      if (influencerError || !influencerProfile) {
        return { data: null, error: '인플루언서 프로필을 찾을 수 없습니다.', success: false }
      }

      // 캠페인 정보 조회
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()

      if (campaignError) {
        return { data: null, error: '캠페인을 찾을 수 없습니다.', success: false }
      }

      // 자동 제안서 생성
      const proposal = `안녕하세요! ${campaign.title} 캠페인에 관심이 있어 신청드립니다.

저는 ${influencerProfile.user_profiles.display_name}으로, ${influencerProfile.total_followers.toLocaleString()}명의 팔로워를 보유하고 있습니다.

주요 강점:
• 평균 참여율: ${influencerProfile.avg_engagement_rate}%
• 콘텐츠 카테고리: ${influencerProfile.content_categories?.join(', ') || '다양한 분야'}
• 협업 이력: ${influencerProfile.collaboration_history}회

제안 예산: ${campaign.budget_min.toLocaleString()} - ${campaign.budget_max.toLocaleString()} ${campaign.currency}
예상 소요 기간: 2-3주

더 자세한 내용은 개별 연락을 통해 논의하고 싶습니다.
감사합니다!`

      // 신청 생성
      const applicationData: CreateApplicationRequest = {
        campaign_id: campaignId,
        proposal,
        proposed_budget: Math.floor((campaign.budget_min + campaign.budget_max) / 2),
        proposed_timeline: '2-3주',
        portfolio_links: influencerProfile.portfolio_url ? [influencerProfile.portfolio_url] : []
      }

      return await this.createApplication(applicationData)
    } catch (error) {
      return { data: null, error: '추천 신청 생성 중 오류가 발생했습니다.', success: false }
    }
  }
}
