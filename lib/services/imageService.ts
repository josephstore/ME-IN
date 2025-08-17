import { supabase } from '../supabase'

export interface ImageUploadResult {
  success: boolean
  url?: string
  error?: string
}

export interface ImageValidationResult {
  isValid: boolean
  error?: string
}

export class ImageService {
  // 이미지 유효성 검사
  static validateImage(file: File, maxSize: number = 5242880): ImageValidationResult {
    // 파일 크기 검사
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `파일 크기가 너무 큽니다. 최대 ${Math.round(maxSize / 1024 / 1024)}MB까지 업로드 가능합니다.`
      }
    }

    // 파일 타입 검사
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: '지원하지 않는 파일 형식입니다. JPEG, PNG, WebP, GIF 파일만 업로드 가능합니다.'
      }
    }

    return { isValid: true }
  }

  // 프로필 이미지 업로드
  static async uploadProfileImage(userId: string, file: File): Promise<ImageUploadResult> {
    try {
      // 이미지 유효성 검사
      const validation = this.validateImage(file, 5242880) // 5MB
      if (!validation.isValid) {
        return { success: false, error: validation.error }
      }

      // 파일명 생성 (사용자 ID + 타임스탬프)
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const fileName = `${userId}/profile_${timestamp}.${fileExt}`

      // 기존 프로필 이미지 삭제
      await this.deleteProfileImages(userId)

      // 새 이미지 업로드
      const { error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading profile image:', error)
        return { success: false, error: '이미지 업로드에 실패했습니다.' }
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      return { success: true, url: urlData.publicUrl }
    } catch (error) {
      console.error('Error in uploadProfileImage:', error)
      return { success: false, error: '이미지 업로드 중 오류가 발생했습니다.' }
    }
  }

  // 프로필 이미지 삭제
  static async deleteProfileImages(userId: string): Promise<boolean> {
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('profile-images')
        .list(userId)

      if (listError) {
        console.error('Error listing profile images:', listError)
        return false
      }

      if (files && files.length > 0) {
        const fileNames = files.map(file => `${userId}/${file.name}`)
        const { error: deleteError } = await supabase.storage
          .from('profile-images')
          .remove(fileNames)

        if (deleteError) {
          console.error('Error deleting profile images:', deleteError)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error in deleteProfileImages:', error)
      return false
    }
  }

  // 캠페인 이미지 업로드
  static async uploadCampaignImage(campaignId: string, file: File, fileName?: string): Promise<ImageUploadResult> {
    try {
      // 이미지 유효성 검사
      const validation = this.validateImage(file, 10485760) // 10MB
      if (!validation.isValid) {
        return { success: false, error: validation.error }
      }

      // 파일명 생성
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const finalFileName = fileName || `campaign_${timestamp}.${fileExt}`
      const filePath = `${campaignId}/${finalFileName}`

      // 이미지 업로드
      const { error } = await supabase.storage
        .from('campaign-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading campaign image:', error)
        return { success: false, error: '이미지 업로드에 실패했습니다.' }
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(filePath)

      return { success: true, url: urlData.publicUrl }
    } catch (error) {
      console.error('Error in uploadCampaignImage:', error)
      return { success: false, error: '이미지 업로드 중 오류가 발생했습니다.' }
    }
  }

  // 브랜드 로고 업로드
  static async uploadBrandLogo(brandId: string, file: File): Promise<ImageUploadResult> {
    try {
      // 이미지 유효성 검사
      const validation = this.validateImage(file, 2097152) // 2MB
      if (!validation.isValid) {
        return { success: false, error: validation.error }
      }

      // 파일명 생성
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const fileName = `${brandId}/logo_${timestamp}.${fileExt}`

      // 기존 로고 삭제
      await this.deleteBrandLogos(brandId)

      // 새 로고 업로드
      const { error } = await supabase.storage
        .from('logo-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading brand logo:', error)
        return { success: false, error: '로고 업로드에 실패했습니다.' }
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from('logo-images')
        .getPublicUrl(fileName)

      return { success: true, url: urlData.publicUrl }
    } catch (error) {
      console.error('Error in uploadBrandLogo:', error)
      return { success: false, error: '로고 업로드 중 오류가 발생했습니다.' }
    }
  }

  // 브랜드 로고 삭제
  static async deleteBrandLogos(brandId: string): Promise<boolean> {
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('logo-images')
        .list(brandId)

      if (listError) {
        console.error('Error listing brand logos:', listError)
        return false
      }

      if (files && files.length > 0) {
        const fileNames = files.map(file => `${brandId}/${file.name}`)
        const { error: deleteError } = await supabase.storage
          .from('logo-images')
          .remove(fileNames)

        if (deleteError) {
          console.error('Error deleting brand logos:', deleteError)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error in deleteBrandLogos:', error)
      return false
    }
  }

  // 이미지 URL 생성
  static getImageUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  }

  // 이미지 삭제
  static async deleteImage(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        console.error('Error deleting image:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteImage:', error)
      return false
    }
  }

  // 이미지 최적화 (클라이언트 사이드)
  static optimizeImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // 이미지 크기 계산
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        const newWidth = img.width * ratio
        const newHeight = img.height * ratio

        canvas.width = newWidth
        canvas.height = newHeight

        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, newWidth, newHeight)

        // Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(optimizedFile)
            } else {
              reject(new Error('이미지 최적화에 실패했습니다.'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'))
      img.src = URL.createObjectURL(file)
    })
  }

  // 기본 프로필 이미지 URL 생성
  static getDefaultProfileImage(userId: string): string {
    // 사용자 ID를 기반으로 한 기본 아바타 생성 (예: Gravatar 스타일)
    const hash = this.simpleHash(userId)
    const colors = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4']
    const color = colors[hash % colors.length]
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${color}"/>
        <text x="100" y="120" font-family="Arial, sans-serif" font-size="80" 
              text-anchor="middle" fill="white" font-weight="bold">
          ${userId.charAt(0).toUpperCase()}
        </text>
      </svg>
    `)}`
  }

  // 간단한 해시 함수
  private static simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 32bit 정수로 변환
    }
    return Math.abs(hash)
  }
}
