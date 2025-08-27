import { supabase } from '../supabase'
import {
  UserProfile,
  BrandProfile,
  InfluencerProfile,
  SocialAccount,
  CreateUserProfileRequest,
  CreateBrandProfileRequest,
  CreateInfluencerProfileRequest,
  CreateSocialAccountRequest,
  ApiResponse
} from '../types/database'

export class ProfileService {
  // 사용자 프로필 관리
  static async createUserProfile(data: CreateUserProfileRequest): Promise<ApiResponse<UserProfile>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .insert(data)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: profile, error: null, success: true }
    } catch (error) {
      return { data: null, error: '프로필 생성 중 오류가 발생했습니다.', success: false }
    }
  }

  static async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: profile, error: null, success: true }
    } catch (error) {
      return { data: null, error: '프로필 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  static async updateUserProfile(updates: Partial<CreateUserProfileRequest>): Promise<ApiResponse<UserProfile>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: '사용자가 인증되지 않았습니다.', success: false }
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: profile, error: null, success: true }
    } catch (error) {
      return { data: null, error: '프로필 업데이트 중 오류가 발생했습니다.', success: false }
    }
  }

  // 브랜드 프로필 관리
  static async createBrandProfile(data: CreateBrandProfileRequest): Promise<ApiResponse<BrandProfile>> {
    try {
      const userProfileResponse = await this.getUserProfile()
      if (!userProfileResponse.success || !userProfileResponse.data) {
        return { data: null, error: '사용자 프로필을 먼저 생성해주세요.', success: false }
      }

      const { data: brandProfile, error } = await supabase
        .from('brand_profiles')
        .insert({
          user_profile_id: userProfileResponse.data.id,
          ...data
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: brandProfile, error: null, success: true }
    } catch (error) {
      return { data: null, error: '브랜드 프로필 생성 중 오류가 발생했습니다.', success: false }
    }
  }

  static async getBrandProfile(): Promise<ApiResponse<BrandProfile>> {
    try {
      const userProfileResponse = await this.getUserProfile()
      if (!userProfileResponse.success || !userProfileResponse.data) {
        return { data: null, error: '사용자 프로필을 찾을 수 없습니다.', success: false }
      }

      const { data: brandProfile, error } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('user_profile_id', userProfileResponse.data.id)
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: brandProfile, error: null, success: true }
    } catch (error) {
      return { data: null, error: '브랜드 프로필 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  static async updateBrandProfile(updates: Partial<CreateBrandProfileRequest>): Promise<ApiResponse<BrandProfile>> {
    try {
      const userProfileResponse = await this.getUserProfile()
      if (!userProfileResponse.success || !userProfileResponse.data) {
        return { data: null, error: '사용자 프로필을 찾을 수 없습니다.', success: false }
      }

      const { data: brandProfile, error } = await supabase
        .from('brand_profiles')
        .update(updates)
        .eq('user_profile_id', userProfileResponse.data.id)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: brandProfile, error: null, success: true }
    } catch (error) {
      return { data: null, error: '브랜드 프로필 업데이트 중 오류가 발생했습니다.', success: false }
    }
  }

  // 인플루언서 프로필 관리
  static async createInfluencerProfile(data: CreateInfluencerProfileRequest): Promise<ApiResponse<InfluencerProfile>> {
    try {
      const userProfileResponse = await this.getUserProfile()
      if (!userProfileResponse.success || !userProfileResponse.data) {
        return { data: null, error: '사용자 프로필을 먼저 생성해주세요.', success: false }
      }

      const { data: influencerProfile, error } = await supabase
        .from('influencer_profiles')
        .insert(data)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: influencerProfile, error: null, success: true }
    } catch (error) {
      return { data: null, error: '인플루언서 프로필 생성 중 오류가 발생했습니다.', success: false }
    }
  }

  static async getInfluencerProfile(): Promise<ApiResponse<InfluencerProfile>> {
    try {
      const userProfileResponse = await this.getUserProfile()
      if (!userProfileResponse.success || !userProfileResponse.data) {
        return { data: null, error: '사용자 프로필을 찾을 수 없습니다.', success: false }
      }

      const { data: influencerProfile, error } = await supabase
        .from('influencer_profiles')
        .select('*')
        .eq('user_profile_id', userProfileResponse.data.id)
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: influencerProfile, error: null, success: true }
    } catch (error) {
      return { data: null, error: '인플루언서 프로필 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  static async updateInfluencerProfile(updates: Partial<CreateInfluencerProfileRequest>): Promise<ApiResponse<InfluencerProfile>> {
    try {
      const userProfileResponse = await this.getUserProfile()
      if (!userProfileResponse.success || !userProfileResponse.data) {
        return { data: null, error: '사용자 프로필을 찾을 수 없습니다.', success: false }
      }

      const { data: influencerProfile, error } = await supabase
        .from('influencer_profiles')
        .update(updates)
        .eq('user_profile_id', userProfileResponse.data.id)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: influencerProfile, error: null, success: true }
    } catch (error) {
      return { data: null, error: '인플루언서 프로필 업데이트 중 오류가 발생했습니다.', success: false }
    }
  }

  // 소셜 미디어 계정 관리
  static async addSocialAccount(data: CreateSocialAccountRequest): Promise<ApiResponse<SocialAccount>> {
    try {
      const influencerProfileResponse = await this.getInfluencerProfile()
      if (!influencerProfileResponse.success || !influencerProfileResponse.data) {
        return { data: null, error: '인플루언서 프로필을 먼저 생성해주세요.', success: false }
      }

      const { data: socialAccount, error } = await supabase
        .from('social_accounts')
        .insert({
          influencer_profile_id: influencerProfileResponse.data.id,
          ...data
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: socialAccount, error: null, success: true }
    } catch (error) {
      return { data: null, error: '소셜 계정 추가 중 오류가 발생했습니다.', success: false }
    }
  }

  static async getSocialAccounts(): Promise<ApiResponse<SocialAccount[]>> {
    try {
      const influencerProfileResponse = await this.getInfluencerProfile()
      if (!influencerProfileResponse.success || !influencerProfileResponse.data) {
        return { data: null, error: '인플루언서 프로필을 찾을 수 없습니다.', success: false }
      }

      const { data: socialAccounts, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('influencer_profile_id', influencerProfileResponse.data.id)

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: socialAccounts, error: null, success: true }
    } catch (error) {
      return { data: null, error: '소셜 계정 조회 중 오류가 발생했습니다.', success: false }
    }
  }

  static async updateSocialAccount(accountId: string, updates: Partial<CreateSocialAccountRequest>): Promise<ApiResponse<SocialAccount>> {
    try {
      const { data: socialAccount, error } = await supabase
        .from('social_accounts')
        .update(updates)
        .eq('id', accountId)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: socialAccount, error: null, success: true }
    } catch (error) {
      return { data: null, error: '소셜 계정 업데이트 중 오류가 발생했습니다.', success: false }
    }
  }

  static async deleteSocialAccount(accountId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId)

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      return { data: null, error: null, success: true }
    } catch (error) {
      return { data: null, error: '소셜 계정 삭제 중 오류가 발생했습니다.', success: false }
    }
  }

  // 통합 프로필 조회
  static async getCompleteProfile(): Promise<ApiResponse<{
    userProfile: UserProfile
    brandProfile?: BrandProfile
    influencerProfile?: InfluencerProfile
    socialAccounts?: SocialAccount[]
  }>> {
    try {
      const userProfileResponse = await this.getUserProfile()
      if (!userProfileResponse.success || !userProfileResponse.data) {
        return { data: null, error: '사용자 프로필을 찾을 수 없습니다.', success: false }
      }

      const userProfile = userProfileResponse.data
      let brandProfile: BrandProfile | undefined
      let influencerProfile: InfluencerProfile | undefined
      let socialAccounts: SocialAccount[] | undefined

      if (userProfile.user_type === 'brand') {
        const brandResponse = await this.getBrandProfile()
        if (brandResponse.success) {
          brandProfile = brandResponse.data || undefined
        }
      } else if (userProfile.user_type === 'influencer') {
        const influencerResponse = await this.getInfluencerProfile()
        if (influencerResponse.success) {
          influencerProfile = influencerResponse.data || undefined
        }

        const socialResponse = await this.getSocialAccounts()
        if (socialResponse.success) {
          socialAccounts = socialResponse.data || undefined
        }
      }

      return {
        data: {
          userProfile,
          brandProfile,
          influencerProfile,
          socialAccounts
        },
        error: null,
        success: true
      }
    } catch (error) {
      return { data: null, error: '프로필 조회 중 오류가 발생했습니다.', success: false }
    }
  }
}
