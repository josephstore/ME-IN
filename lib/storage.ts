import { supabase } from './supabase'
import { ImageService } from './services/imageService'

// 기존 함수들을 ImageService로 리다이렉트
export const uploadImage = async (file: File, path: string) => {
  try {
    const result = await ImageService.uploadCampaignImage('temp', file, path)
    if (result.success && result.url) {
      return result.url
    } else {
      throw new Error(result.error || '이미지 업로드에 실패했습니다.')
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const deleteImage = async (path: string) => {
  try {
    const { error } = await supabase.storage
      .from('campaign-images')
      .remove([path])

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

export const getImageUrl = (path: string) => {
  const { data: { publicUrl } } = supabase.storage
    .from('campaign-images')
    .getPublicUrl(path)

  return publicUrl
}
