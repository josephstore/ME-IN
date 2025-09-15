'use client'

import React, { useState, useRef } from 'react'
import { ArrowLeft, Camera, Save, X, User, Mail, Phone, MapPin, Calendar, Award, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BottomNavigation from '@/components/layout/BottomNavigation'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  type: 'Brand' | 'Influencer'
  avatar: string
  bio: string
  website?: string
  social_media?: {
    instagram?: string
    youtube?: string
    tiktok?: string
  }
}

export default function ProfileEditPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Ahmed Al-Mansouri',
    email: 'ahmed@example.com',
    phone: '+971 50 123 4567',
    location: 'Dubai, UAE',
    joinDate: 'January 2024',
    type: 'Brand',
    avatar: '/images/avatar.jpg',
    bio: 'Passionate about connecting Korean and Middle Eastern cultures through digital content.',
    website: 'https://ahmed.com',
    social_media: {
      instagram: '@ahmed_almansouri',
      youtube: 'Ahmed Al-Mansouri',
      tiktok: '@ahmed_korea'
    }
  })

  const [formData, setFormData] = useState(profile)

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value
      }
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    setUploading(true)

    try {
      // 임시 해결책: FileReader를 사용하여 로컬 URL 생성
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          // 프로필 데이터 업데이트 (로컬 URL 사용)
          setFormData(prev => ({
            ...prev,
            avatar: result
          }))
          alert('프로필 사진이 성공적으로 업로드되었습니다! (로컬 미리보기)')
        }
        setUploading(false)
      }
      reader.onerror = () => {
        alert('이미지 읽기에 실패했습니다.')
        setUploading(false)
      }
      reader.readAsDataURL(file)

      // Supabase Storage 버킷이 생성되면 아래 코드를 활성화하세요
      // 현재는 로컬 미리보기만 지원합니다
      
      // TODO: Supabase Storage 버킷 생성 후 아래 주석을 해제하세요
      /*
      try {
        // 파일명 생성 (사용자 ID + 타임스탬프)
        const fileExt = file.name.split('.').pop()
        const fileName = `${formData.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = fileName

        // Supabase Storage에 업로드
        const { data, error } = await supabase.storage
          .from('profile-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true // 기존 파일이 있으면 덮어쓰기
          })

        if (error) {
          console.error('Upload error:', error)
          alert('이미지 업로드에 실패했습니다: ' + error.message)
          return
        }

        // 업로드된 이미지 URL 가져오기
        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath)

        // 프로필 데이터 업데이트
        setFormData(prev => ({
          ...prev,
          avatar: publicUrl
        }))

        alert('프로필 사진이 성공적으로 업로드되었습니다!')
        setUploading(false)
        return
      } catch (storageError) {
        console.error('Storage upload error:', storageError)
        // Storage 업로드 실패 시 로컬 미리보기로 fallback
      }
      */

    } catch (error) {
      console.error('Upload error:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      // 임시 해결책: 로컬 스토리지에 저장
      const profileData = {
        id: formData.id,
        display_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        website: formData.website,
        profile_image: formData.avatar,
        social_media: formData.social_media,
        user_type: formData.type.toLowerCase(),
        updated_at: new Date().toISOString()
      }

      // 로컬 스토리지에 저장
      localStorage.setItem('user_profile', JSON.stringify(profileData))

      // 로컬 상태 업데이트
      setProfile(formData)
      
      // 성공 메시지
      alert('프로필이 성공적으로 저장되었습니다! (로컬 저장)')
      
      // 프로필 페이지로 돌아가기
      router.push('/profile')

      // TODO: Supabase 데이터베이스 테이블 생성 후 아래 코드 활성화
      /*
      // Supabase의 user_profiles 테이블에 업데이트
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: formData.id,
          display_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          website: formData.website,
          profile_image: formData.avatar,
          social_media: formData.social_media,
          user_type: formData.type.toLowerCase(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Save error:', error)
        alert('프로필 저장 중 오류가 발생했습니다: ' + error.message)
        return
      }

      alert('프로필이 성공적으로 저장되었습니다!')
      */
      
    } catch (error) {
      console.error('Save error:', error)
      alert('프로필 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-white border-b border-beige-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 text-navy-600 hover:text-navy-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>취소</span>
          </button>
          <h1 className="text-xl font-bold text-navy-600">프로필 편집</h1>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-navy-600 text-white px-4 py-2 rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-50"
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Image Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <h2 className="text-lg font-semibold text-navy-600 mb-4">프로필 사진</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-24 h-24 bg-navy-600 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <span className="text-white text-2xl font-bold hidden">
                  {formData.name.charAt(0)}
                </span>
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-salmon-500 rounded-full flex items-center justify-center hover:bg-salmon-600 transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-navy-600 mb-1">프로필 사진 변경</h3>
              <p className="text-sm text-navy-500 mb-2">
                JPG, PNG 파일만 업로드 가능 (최대 5MB)
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-sm text-salmon-600 hover:text-salmon-700 font-medium disabled:opacity-50"
              >
                {uploading ? '업로드 중...' : '사진 선택'}
              </button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <h2 className="text-lg font-semibold text-navy-600 mb-4">기본 정보</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-600 mb-2">
                이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-salmon-500 focus:border-transparent"
                placeholder="이름을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-600 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-salmon-500 focus:border-transparent"
                placeholder="이메일을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-600 mb-2">
                전화번호
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-salmon-500 focus:border-transparent"
                placeholder="전화번호를 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-600 mb-2">
                위치
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-salmon-500 focus:border-transparent"
                placeholder="위치를 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-600 mb-2">
                소개
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-salmon-500 focus:border-transparent resize-none"
                placeholder="자기소개를 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-600 mb-2">
                웹사이트
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-salmon-500 focus:border-transparent"
                placeholder="https://your-website.com"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <h2 className="text-lg font-semibold text-navy-600 mb-4">소셜 미디어</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-600 mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={formData.social_media?.instagram || ''}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-salmon-500 focus:border-transparent"
                placeholder="@username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-600 mb-2">
                YouTube
              </label>
              <input
                type="text"
                value={formData.social_media?.youtube || ''}
                onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-salmon-500 focus:border-transparent"
                placeholder="채널명"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-600 mb-2">
                TikTok
              </label>
              <input
                type="text"
                value={formData.social_media?.tiktok || ''}
                onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                className="w-full px-4 py-3 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-salmon-500 focus:border-transparent"
                placeholder="@username"
              />
            </div>
          </div>
        </div>

        {/* Account Type */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <h2 className="text-lg font-semibold text-navy-600 mb-4">계정 유형</h2>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="accountType"
                value="Brand"
                checked={formData.type === 'Brand'}
                onChange={(e) => handleInputChange('type', e.target.value as 'Brand' | 'Influencer')}
                className="w-4 h-4 text-salmon-500 focus:ring-salmon-500"
              />
              <span className="text-navy-600">브랜드</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="accountType"
                value="Influencer"
                checked={formData.type === 'Influencer'}
                onChange={(e) => handleInputChange('type', e.target.value as 'Brand' | 'Influencer')}
                className="w-4 h-4 text-salmon-500 focus:ring-salmon-500"
              />
              <span className="text-navy-600">인플루언서</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Spacing for Navigation */}
      <div className="h-20"></div>
      
      {/* Global Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
