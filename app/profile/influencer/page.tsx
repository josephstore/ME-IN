'use client'

import React, { useState, useEffect } from 'react'
import { Users, Eye, Heart, MessageCircle, TrendingUp, Award, Globe, MapPin, Calendar, Edit, Plus, Target, CheckCircle, Star, DollarSign, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BottomNavigation from '@/components/layout/BottomNavigation'

interface SocialAccount {
  platform: string
  username: string
  followers: number
  avgViews: number
  engagementRate: number
  verified: boolean
}

interface InfluencerProfile {
  id: string
  name: string
  bio: string
  avatar: string
  location: string
  languages: string[]
  expertise: string[]
  socialAccounts: SocialAccount[]
  stats: {
    totalCampaigns: number
    completedCampaigns: number
    avgRating: number
    totalEarnings: number
  }
  portfolio: {
    id: string
    title: string
    thumbnail: string
    platform: string
    views: number
    likes: number
  }[]
}

export default function InfluencerProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [influencerProfile, setInfluencerProfile] = useState<InfluencerProfile>({
    id: '1',
    name: 'Nour Al-Zahra',
    bio: '중동과 한국 문화를 연결하는 콘텐츠 크리에이터입니다. 뷰티, 패션, 라이프스타일 콘텐츠를 제작하며 K-컬처를 중동에 소개합니다.',
    avatar: '/images/nour-profile.jpg',
    location: 'Dubai, UAE',
    languages: ['Arabic', 'English', 'Korean'],
    expertise: ['Beauty', 'Fashion', 'Lifestyle', 'K-Culture'],
    socialAccounts: [
      {
        platform: 'Instagram',
        username: '@nour_alzahra',
        followers: 125000,
        avgViews: 8500,
        engagementRate: 4.2,
        verified: true
      },
      {
        platform: 'TikTok',
        username: '@nour_korea',
        followers: 89000,
        avgViews: 15000,
        engagementRate: 6.8,
        verified: true
      },
      {
        platform: 'YouTube',
        username: 'Nour Al-Zahra',
        followers: 45000,
        avgViews: 12000,
        engagementRate: 5.5,
        verified: false
      }
    ],
    stats: {
      totalCampaigns: 28,
      completedCampaigns: 25,
      avgRating: 4.8,
      totalEarnings: 45000
    },
    portfolio: [
      {
        id: '1',
        title: 'K-Beauty Skincare Routine',
        thumbnail: '/images/campaign1.jpg',
        platform: 'Instagram',
        views: 12500,
        likes: 890
      },
      {
        id: '2',
        title: 'Korean Fashion Haul',
        thumbnail: '/images/campaign2.jpg',
        platform: 'TikTok',
        views: 18000,
        likes: 1200
      },
      {
        id: '3',
        title: 'Dubai K-Pop Concert Vlog',
        thumbnail: '/images/campaign3.jpg',
        platform: 'YouTube',
        views: 8500,
        likes: 450
      }
    ]
  })

  useEffect(() => {
    // 인플루언서 프로필 데이터 로드
    const loadInfluencerProfile = async () => {
      try {
        setLoading(true)
        // TODO: Supabase에서 인플루언서 프로필 데이터 로드
        // const { data } = await supabase.from('influencer_profiles').select('*').eq('id', userId).single()
      } catch (error) {
        console.error('Error loading influencer profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInfluencerProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-salmon-500 mx-auto mb-4"></div>
          <p className="text-navy-600">인플루언서 프로필을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-white border-b border-beige-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-navy-600">인플루언서 프로필</h1>
          <button 
            onClick={() => router.push('/profile/influencer/edit')}
            className="bg-salmon-500 text-white px-4 py-2 rounded-lg hover:bg-salmon-600 transition-colors flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>편집</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-navy-600 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={influencerProfile.avatar}
                alt={influencerProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-navy-600">{influencerProfile.name}</h2>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-navy-400" />
                  <span className="text-sm text-navy-600">{influencerProfile.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-navy-600">{influencerProfile.stats.avgRating}/5.0</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-navy-600 text-sm leading-relaxed">{influencerProfile.bio}</p>
          </div>

          {/* Languages */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-navy-600 mb-2">지원 언어</h4>
            <div className="flex flex-wrap gap-2">
              {influencerProfile.languages.map((language, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-beige-200 text-navy-700 rounded-full text-xs font-medium"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-salmon-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-salmon-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-600">{influencerProfile.stats.totalCampaigns}</p>
                <p className="text-sm text-navy-500">총 캠페인</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-600">{influencerProfile.stats.completedCampaigns}</p>
                <p className="text-sm text-navy-500">완료</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-600">{influencerProfile.stats.avgRating}</p>
                <p className="text-sm text-navy-500">평균 평점</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-600">${influencerProfile.stats.totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-navy-500">총 수익</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Accounts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <h3 className="text-lg font-semibold text-navy-600 mb-4">소셜 미디어 계정</h3>
          <div className="space-y-4">
            {influencerProfile.socialAccounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-beige-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    account.platform === 'Instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    account.platform === 'TikTok' ? 'bg-black' :
                    'bg-red-600'
                  }`}>
                    <span className="text-white text-xs font-bold">
                      {account.platform === 'Instagram' ? 'IG' :
                       account.platform === 'TikTok' ? 'TT' : 'YT'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-navy-600">{account.username}</p>
                    <p className="text-sm text-navy-500">{account.followers.toLocaleString()} followers</p>
                  </div>
                  {account.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-navy-600">{account.avgViews.toLocaleString()} avg views</p>
                  <p className="text-sm text-navy-500">{account.engagementRate}% engagement</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expertise */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <h3 className="text-lg font-semibold text-navy-600 mb-4">전문 분야</h3>
          <div className="flex flex-wrap gap-2">
            {influencerProfile.expertise.map((field, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-navy-100 text-navy-800 rounded-full text-sm font-medium"
              >
                {field}
              </span>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy-600">포트폴리오</h3>
            <button 
              onClick={() => router.push('/portfolios/create')}
              className="text-salmon-600 hover:text-salmon-700 text-sm font-medium"
            >
              더보기
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {influencerProfile.portfolio.map((item) => (
              <div key={item.id} className="relative">
                <img 
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-60 rounded text-white text-xs p-1">
                  <p className="truncate">{item.title}</p>
                  <div className="flex items-center justify-between">
                    <span>{item.views.toLocaleString()} views</span>
                    <span>{item.likes} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <h3 className="text-lg font-semibold text-navy-600 mb-4">빠른 작업</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => router.push('/campaigns')}
              className="flex items-center justify-center space-x-2 p-3 bg-salmon-500 text-white rounded-lg hover:bg-salmon-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>캠페인 찾기</span>
            </button>
            <button 
              onClick={() => router.push('/portfolios/create')}
              className="flex items-center justify-center space-x-2 p-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>포트폴리오 추가</span>
            </button>
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
