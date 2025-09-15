'use client'

import React, { useState, useEffect } from 'react'
import { Settings, Edit, Bell, Shield, HelpCircle, LogOut, User, Mail, Phone, MapPin, Calendar, Award, Star, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BottomNavigation from '@/components/layout/BottomNavigation'

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  type: 'Brand' | 'Influencer'
  avatar: string
  bio?: string
  website?: string
  social_media?: {
    instagram?: string
    youtube?: string
    tiktok?: string
  }
  stats: {
    campaigns: number
    collaborations: number
    rating: number
    followers: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'info' | 'campaigns' | 'settings'>('info')
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData>({
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
    },
    stats: {
      campaigns: 12,
      collaborations: 45,
      rating: 4.8,
      followers: 12500
    }
  })

  // 프로필 데이터 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        
        // 로컬 스토리지에서 프로필 데이터 불러오기
        const savedProfile = localStorage.getItem('user_profile')
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile)
          const userType = profileData.user_type === 'brand' ? 'Brand' : 'Influencer'
          
          setUserData(prev => ({
            ...prev,
            name: profileData.display_name || prev.name,
            email: profileData.email || prev.email,
            phone: profileData.phone || prev.phone,
            location: profileData.location || prev.location,
            avatar: profileData.profile_image || prev.avatar,
            bio: profileData.bio || prev.bio,
            website: profileData.website || prev.website,
            social_media: profileData.social_media || prev.social_media,
            type: userType
          }))

          // 사용자 타입에 따라 적절한 프로필 페이지로 리다이렉트
          if (userType === 'Brand') {
            router.push('/profile/brand')
            return
          } else if (userType === 'Influencer') {
            router.push('/profile/influencer')
            return
          }
        }

        // TODO: Supabase 데이터베이스 테이블 생성 후 아래 코드 활성화
        /*
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userData.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          // 에러가 있어도 기본 데이터는 표시
        } else if (data) {
          setUserData(prev => ({
            ...prev,
            name: data.display_name || prev.name,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            location: data.location || prev.location,
            avatar: data.profile_image || prev.avatar,
            bio: data.bio || prev.bio,
            website: data.website || prev.website,
            social_media: data.social_media || prev.social_media,
            type: (data.user_type === 'brand' ? 'Brand' : 'Influencer') || prev.type
          }))
        }
        */
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userData.id])

  const recentCampaigns = [
    {
      id: '1',
      title: 'Beauty Product Launch',
      status: 'Active',
      participants: 8,
      budget: '$5,000'
    },
    {
      id: '2',
      title: 'Fashion Week Campaign',
      status: 'Completed',
      participants: 15,
      budget: '$12,000'
    },
    {
      id: '3',
      title: 'Food Review Series',
      status: 'Planning',
      participants: 5,
      budget: '$3,500'
    }
  ]

  const handleLogout = () => {
    // Handle logout logic here
    router.push('/auth/login')
  }

    if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-salmon-500 mx-auto mb-4"></div>
          <p className="text-navy-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-white border-b border-beige-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-navy-600">Profile</h1>
          <button className="p-2 hover:bg-beige-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-navy-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-beige-200">
            <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-navy-600 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={userData.avatar}
                alt={userData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <span className="text-white text-2xl font-bold hidden">
                {userData.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-navy-600">{userData.name}</h2>
              <p className="text-navy-500">{userData.type}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-navy-600">{userData.stats.rating}</span>
                </div>
                <span className="text-sm text-navy-500">•</span>
                <span className="text-sm text-navy-500">{userData.stats.followers.toLocaleString()} followers</span>
              </div>
            </div>
            <button 
              onClick={() => router.push('/profile/edit')}
              className="bg-salmon-500 text-white px-4 py-2 rounded-lg hover:bg-salmon-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-salmon-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-salmon-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-600">{userData.stats.campaigns}</p>
                <p className="text-sm text-navy-500">Campaigns</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-navy-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-600">{userData.stats.collaborations}</p>
                <p className="text-sm text-navy-500">Collaborations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl mb-4 shadow-sm border border-beige-200">
          <div className="flex border-b border-beige-200">
            {[
              { id: 'info', label: 'Info' },
              { id: 'campaigns', label: 'Campaigns' },
              { id: 'settings', label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-salmon-600 border-b-2 border-salmon-600'
                    : 'text-navy-500 hover:text-navy-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
                </div>

          <div className="p-4">
            {activeTab === 'info' && (
              <div className="space-y-4">
                {userData.bio && (
                  <div className="mb-4">
                    <h4 className="font-medium text-navy-600 mb-2">소개</h4>
                    <p className="text-navy-500 text-sm">{userData.bio}</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-navy-400" />
                    <span className="text-navy-600">{userData.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-navy-400" />
                    <span className="text-navy-600">{userData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-navy-400" />
                    <span className="text-navy-600">{userData.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-navy-400" />
                    <span className="text-navy-600">Joined {userData.joinDate}</span>
                  </div>
                  {userData.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-navy-400" />
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-salmon-600 hover:text-salmon-700">
                        {userData.website}
                      </a>
                    </div>
                  )}
                </div>

                {userData.social_media && (
                  <div className="mt-4">
                    <h4 className="font-medium text-navy-600 mb-3">소셜 미디어</h4>
                    <div className="space-y-2">
                      {userData.social_media.instagram && (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">IG</span>
                          </div>
                          <span className="text-navy-600">{userData.social_media.instagram}</span>
                        </div>
                      )}
                      {userData.social_media.youtube && (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">YT</span>
                          </div>
                          <span className="text-navy-600">{userData.social_media.youtube}</span>
                        </div>
                      )}
                      {userData.social_media.tiktok && (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">TT</span>
                          </div>
                          <span className="text-navy-600">{userData.social_media.tiktok}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="space-y-3">
                {recentCampaigns.map(campaign => (
                  <div key={campaign.id} className="border border-beige-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                  <div>
                        <h4 className="font-medium text-navy-600">{campaign.title}</h4>
                        <p className="text-sm text-navy-500">{campaign.participants} participants • {campaign.budget}</p>
                  </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status}
                      </span>
                  </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-beige-50 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-navy-400" />
                  <span className="text-navy-600">Notifications</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-beige-50 rounded-lg transition-colors">
                  <Shield className="w-5 h-5 text-navy-400" />
                  <span className="text-navy-600">Privacy & Security</span>
                </button>
                <button 
                  onClick={() => router.push('/favorites')}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-beige-50 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5 text-navy-400" />
                  <span className="text-navy-600">Favorites</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-beige-50 rounded-lg transition-colors">
                  <HelpCircle className="w-5 h-5 text-navy-400" />
                  <span className="text-navy-600">Help & Support</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
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