import { supabase } from './supabase'

export const uploadImage = async (file: File, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('campaign-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // 공개 URL 반환
    const { data: { publicUrl } } = supabase.storage
      .from('campaign-images')
      .getPublicUrl(path)

    return publicUrl
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
