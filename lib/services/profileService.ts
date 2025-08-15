import { supabase } from '../supabase'
import { Profile, BrandProfile, InfluencerProfile, ProfileWithDetails } from '../types/database'

export class ProfileService {
  // 기본 프로필 조회
  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getProfile:', error)
      return null
    }
  }

  // 상세 프로필 조회 (브랜드/인플루언서 프로필 포함)
  static async getProfileWithDetails(userId: string): Promise<ProfileWithDetails | null> {
    try {
      // 기본 프로필 조회
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        return null
      }

      let brandProfile: BrandProfile | null = null
      let influencerProfile: InfluencerProfile | null = null

      // 사용자 타입에 따라 추가 프로필 조회
      if (profile.user_type === 'brand') {
        const { data: brandData } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('id', userId)
          .single()
        brandProfile = brandData
      } else if (profile.user_type === 'influencer') {
        const { data: influencerData } = await supabase
          .from('influencer_profiles')
          .select('*')
          .eq('id', userId)
          .single()
        influencerProfile = influencerData
      }

      return {
        ...profile,
        brand_profile: brandProfile,
        influencer_profile: influencerProfile
      }
    } catch (error) {
      console.error('Error in getProfileWithDetails:', error)
      return null
    }
  }

  // 기본 프로필 업데이트
  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in updateProfile:', error)
      return null
    }
  }

  // 브랜드 프로필 생성/업데이트
  static async upsertBrandProfile(userId: string, profileData: Partial<BrandProfile>): Promise<BrandProfile | null> {
    try {
      const { data, error } = await supabase
        .from('brand_profiles')
        .upsert({
          id: userId,
          ...profileData
        })
        .select()
        .single()

      if (error) {
        console.error('Error upserting brand profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in upsertBrandProfile:', error)
      return null
    }
  }

  // 인플루언서 프로필 생성/업데이트
  static async upsertInfluencerProfile(userId: string, profileData: Partial<InfluencerProfile>): Promise<InfluencerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('influencer_profiles')
        .upsert({
          id: userId,
          ...profileData
        })
        .select()
        .single()

      if (error) {
        console.error('Error upserting influencer profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in upsertInfluencerProfile:', error)
      return null
    }
  }

  // 프로필 이미지 업로드
  static async uploadProfileImage(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/profile.${fileExt}`

      const { error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          upsert: true,
          cacheControl: '3600'
        })

      if (error) {
        console.error('Error uploading profile image:', error)
        return null
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error in uploadProfileImage:', error)
      return null
    }
  }

  // 프로필 완성도 계산
  static calculateProfileCompletion(profile: ProfileWithDetails): number {
    let completion = 0
    const totalFields = 10 // 기본 필드 수

    // 기본 프로필 필드 체크
    if (profile.name) completion += 1
    if (profile.bio) completion += 1
    if (profile.avatar_url) completion += 1
    if (profile.website) completion += 1
    if (profile.location) completion += 1
    if (profile.phone) completion += 1
    if (profile.social_links && Object.keys(profile.social_links).length > 0) completion += 1

    // 사용자 타입별 추가 필드 체크
    if (profile.user_type === 'brand' && profile.brand_profile) {
      const brandFields = 5
      if (profile.brand_profile.company_name) completion += 1
      if (profile.brand_profile.industry) completion += 1
      if (profile.brand_profile.description) completion += 1
      if (profile.brand_profile.website) completion += 1
      if (profile.brand_profile.logo_url) completion += 1
      return Math.round((completion / (totalFields + brandFields)) * 100)
    }

    if (profile.user_type === 'influencer' && profile.influencer_profile) {
      const influencerFields = 6
      if (profile.influencer_profile.display_name) completion += 1
      if (profile.influencer_profile.content_categories && profile.influencer_profile.content_categories.length > 0) completion += 1
      if (profile.influencer_profile.platforms && Object.keys(profile.influencer_profile.platforms).length > 0) completion += 1
      if (profile.influencer_profile.total_followers > 0) completion += 1
      if (profile.influencer_profile.languages && profile.influencer_profile.languages.length > 0) completion += 1
      if (profile.influencer_profile.portfolio_url) completion += 1
      return Math.round((completion / (totalFields + influencerFields)) * 100)
    }

    return Math.round((completion / totalFields) * 100)
  }

  // 프로필 검증 상태 확인
  static async checkVerificationStatus(userId: string): Promise<'pending' | 'verified' | 'rejected' | null> {
    try {
      const profile = await this.getProfile(userId)
      if (!profile) return null

      if (profile.user_type === 'brand') {
        const { data } = await supabase
          .from('brand_profiles')
          .select('verification_status')
          .eq('id', userId)
          .single()
        return data?.verification_status || 'pending'
      }

      if (profile.user_type === 'influencer') {
        const { data } = await supabase
          .from('influencer_profiles')
          .select('verification_status')
          .eq('id', userId)
          .single()
        return data?.verification_status || 'pending'
      }

      return 'pending'
    } catch (error) {
      console.error('Error in checkVerificationStatus:', error)
      return null
    }
  }
}
