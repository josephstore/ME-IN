'use client'

import React, { useState, useEffect } from 'react'
import { useSupabaseAuth } from '@/lib/SupabaseAuthContext'
import { ProfileService } from '@/lib/services/profileService'
import { ProfileWithDetails } from '@/lib/types/database'
import { Camera, Edit, Save, X, Globe, MapPin, Phone, Mail } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useSupabaseAuth()
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [completion, setCompletion] = useState(0)

  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    website: '',
    location: '',
    phone: '',
    social_links: {
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    }
  })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      const profileData = await ProfileService.getProfileWithDetails(user.id)
      if (profileData) {
        setProfile(profileData)
        setFormData({
          name: profileData.name || '',
          bio: profileData.bio || '',
          website: profileData.website || '',
          location: profileData.location || '',
          phone: profileData.phone || '',
          social_links: {
            instagram: (profileData.social_links as Record<string, string>)?.instagram || '',
            twitter: (profileData.social_links as Record<string, string>)?.twitter || '',
            linkedin: (profileData.social_links as Record<string, string>)?.linkedin || '',
            youtube: (profileData.social_links as Record<string, string>)?.youtube || ''
          }
        })
        setCompletion(ProfileService.calculateProfileCompletion(profileData))
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files?.[0]) return

    try {
      setUploading(true)
      const file = event.target.files[0]
      
      // 이미지 최적화 (선택사항)
      const { ImageService } = await import('@/lib/services/imageService')
      let optimizedFile = file
      
      try {
        optimizedFile = await ImageService.optimizeImage(file, 800, 0.8)
      } catch (error) {
        console.warn('Image optimization failed, using original file:', error)
      }
      
      const imageUrl = await ProfileService.uploadProfileImage(user.id, optimizedFile)
      
      if (imageUrl) {
        await ProfileService.updateProfile(user.id, { avatar_url: imageUrl })
        await loadProfile() // 프로필 다시 로드
      } else {
        alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    try {
      setLoading(true)
      await ProfileService.updateProfile(user.id, {
        name: formData.name,
        bio: formData.bio,
        website: formData.website,
        location: formData.location,
        phone: formData.phone,
        social_links: formData.social_links
      })
      
      await loadProfile()
      setEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
        phone: profile.phone || '',
                  social_links: {
            instagram: (profile.social_links as Record<string, string>)?.instagram || '',
            twitter: (profile.social_links as Record<string, string>)?.twitter || '',
            linkedin: (profile.social_links as Record<string, string>)?.linkedin || '',
            youtube: (profile.social_links as Record<string, string>)?.youtube || ''
          }
      })
    }
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">프로필을 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">프로필</h1>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>편집</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>취소</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>저장</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Profile Completion */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">프로필 완성도</h2>
            <span className="text-sm text-gray-600">{completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            프로필을 완성하면 더 많은 브랜드와 연결할 수 있습니다.
          </p>
        </div>

        {/* Profile Image */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
                             <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                 {profile.avatar_url ? (
                   <img 
                     src={profile.avatar_url} 
                     alt="Profile" 
                     className="w-full h-full object-cover"
                     onError={(e) => {
                       // 이미지 로드 실패 시 기본 이미지로 대체
                       const target = e.target as HTMLImageElement
                       target.style.display = 'none'
                       target.nextElementSibling?.classList.remove('hidden')
                     }}
                   />
                 ) : null}
                 <div className={`w-full h-full flex items-center justify-center text-gray-400 ${profile.avatar_url ? 'hidden' : ''}`}>
                   <Camera className="w-8 h-8" />
                 </div>
               </div>
              {editing && (
                <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.name || '이름을 입력해주세요'}
              </h2>
              <p className="text-gray-600">
                {profile.user_type === 'brand' ? '브랜드' : '인플루언서'}
              </p>
              {uploading && (
                <p className="text-sm text-orange-500 mt-1">이미지 업로드 중...</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="이름을 입력하세요"
                />
              ) : (
                <p className="text-gray-900">{profile.name || '입력되지 않음'}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                자기소개
              </label>
              {editing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="자기소개를 입력하세요"
                />
              ) : (
                <p className="text-gray-900">{profile.bio || '입력되지 않음'}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                웹사이트
              </label>
              {editing ? (
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  {profile.website ? (
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.website}
                    </a>
                  ) : (
                    <span className="text-gray-500">입력되지 않음</span>
                  )}
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                위치
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="도시, 국가"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{profile.location || '입력되지 않음'}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+82 10-1234-5678"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{profile.phone || '입력되지 않음'}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">소셜 미디어</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['instagram', 'twitter', 'linkedin', 'youtube'].map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {platform}
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.social_links[platform as keyof typeof formData.social_links]}
                    onChange={(e) => setFormData({
                      ...formData,
                      social_links: {
                        ...formData.social_links,
                        [platform]: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={`@username`}
                  />
                ) : (
                                     <p className="text-gray-900">
                     {(profile.social_links as Record<string, string>)?.[platform] || '입력되지 않음'}
                   </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* User Type Specific Information */}
        {profile.user_type === 'brand' && profile.brand_profile && (
          <div className="bg-white rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">브랜드 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  회사명
                </label>
                <p className="text-gray-900">{profile.brand_profile.company_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  업계
                </label>
                <p className="text-gray-900">{profile.brand_profile.industry || '입력되지 않음'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  회사 규모
                </label>
                <p className="text-gray-900">
                  {profile.brand_profile.company_size === 'startup' && '스타트업'}
                  {profile.brand_profile.company_size === 'small' && '소규모'}
                  {profile.brand_profile.company_size === 'medium' && '중규모'}
                  {profile.brand_profile.company_size === 'large' && '대규모'}
                  {!profile.brand_profile.company_size && '입력되지 않음'}
                </p>
              </div>
            </div>
          </div>
        )}

        {profile.user_type === 'influencer' && profile.influencer_profile && (
          <div className="bg-white rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">인플루언서 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  표시명
                </label>
                <p className="text-gray-900">{profile.influencer_profile.display_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  총 팔로워 수
                </label>
                <p className="text-gray-900">
                  {profile.influencer_profile.total_followers.toLocaleString()}명
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  콘텐츠 카테고리
                </label>
                <p className="text-gray-900">
                  {profile.influencer_profile.content_categories?.join(', ') || '입력되지 않음'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
