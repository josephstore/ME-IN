import { supabase } from '@/lib/supabase'

export interface StorageUploadResult {
  success: boolean
  url?: string
  error?: string
}

export class StorageService {
  // 로고 이미지 업로드
  static async uploadLogo(file: File, fileName?: string): Promise<StorageUploadResult> {
    try {
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()
      const finalFileName = fileName || `logo_${timestamp}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('logo-images')
        .upload(finalFileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Logo upload error:', error)
        return { success: false, error: error.message }
      }

      const { data: publicData } = supabase.storage
        .from('logo-images')
        .getPublicUrl(finalFileName)

      return {
        success: true,
        url: publicData.publicUrl
      }
    } catch (error) {
      console.error('Error in uploadLogo:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 캠페인 이미지 업로드
  static async uploadCampaignImage(file: File, campaignId?: string): Promise<string | null> {
    try {
      console.log('캠페인 이미지 업로드 시도:', file.name)
      
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()
      const fileName = campaignId 
        ? `campaign_${campaignId}_${timestamp}.${fileExt}`
        : `campaign_temp_${timestamp}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('campaign-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Campaign image upload error:', error)
        return null
      }

      const { data: publicData } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(fileName)

      console.log('캠페인 이미지 업로드 성공:', publicData.publicUrl)
      return publicData.publicUrl
    } catch (error) {
      console.error('Error in uploadCampaignImage:', error)
      return null
    }
  }

  // 프로필 이미지 업로드
  static async uploadProfileImage(file: File, userId: string): Promise<StorageUploadResult> {
    try {
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()
      const fileName = `profile_${userId}_${timestamp}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Profile image upload error:', error)
        return { success: false, error: error.message }
      }

      const { data: publicData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      return {
        success: true,
        url: publicData.publicUrl
      }
    } catch (error) {
      console.error('Error in uploadProfileImage:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 이미지 삭제
  static async deleteImage(bucket: string, fileName: string): Promise<StorageUploadResult> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName])

      if (error) {
        console.error('Image delete error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in deleteImage:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 기본 로고 URL 가져오기
  static getDefaultLogoUrl(): string {
    return '/images/me-in-logo.svg'
  }

  // 기본 프로필 이미지 URL 가져오기
  static getDefaultProfileImageUrl(): string {
    return '/images/default-profile.png'
  }

  // 기본 캠페인 이미지 URL 가져오기
  static getDefaultCampaignImageUrl(): string {
    return '/images/default-campaign.png'
  }
}
