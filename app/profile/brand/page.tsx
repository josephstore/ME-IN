'use client'

import React, { useState, useEffect } from 'react'
import { Building2, Globe, MapPin, Users, DollarSign, Target, Award, TrendingUp, Edit, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BottomNavigation from '@/components/layout/BottomNavigation'

interface BrandProfile {
  id: string
  companyName: string
  businessNumber: string
  industry: string
  description: string
  logo: string
  website: string
  location: string
  targetMarkets: string[]
  budgetRange: {
    min: number
    max: number
  }
  preferredInfluencerTypes: string[]
  stats: {
    totalCampaigns: number
    activeCampaigns: number
    totalSpent: number
    avgROI: number
  }
}

export default function BrandProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [brandProfile, setBrandProfile] = useState<BrandProfile>({
    id: '1',
    companyName: 'K-Beauty Global',
    businessNumber: '123-45-67890',
    industry: 'Beauty & Cosmetics',
    description: '한국 뷰티 브랜드를 중동 시장에 소개하는 글로벌 기업입니다. K-뷰티의 우수한 품질과 혁신적인 제품을 중동 소비자들에게 전달합니다.',
    logo: '/images/logo-arabic.png',
    website: 'https://kbeauty-global.com',
    location: 'Seoul, South Korea',
    targetMarkets: ['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar'],
    budgetRange: {
      min: 5000,
      max: 50000
    },
    preferredInfluencerTypes: ['Beauty', 'Lifestyle', 'Fashion'],
    stats: {
      totalCampaigns: 15,
      activeCampaigns: 3,
      totalSpent: 125000,
      avgROI: 4.2
    }
  })

  useEffect(() => {
    // 브랜드 프로필 데이터 로드
    const loadBrandProfile = async () => {
      try {
        setLoading(true)
        // TODO: Supabase에서 브랜드 프로필 데이터 로드
        // const { data } = await supabase.from('brand_profiles').select('*').eq('id', userId).single()
      } catch (error) {
        console.error('Error loading brand profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBrandProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-salmon-500 mx-auto mb-4"></div>
          <p className="text-navy-600">브랜드 프로필을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-white border-b border-beige-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-navy-600">브랜드 프로필</h1>
          <button 
            onClick={() => router.push('/profile/brand/edit')}
            className="bg-salmon-500 text-white px-4 py-2 rounded-lg hover:bg-salmon-600 transition-colors flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>편집</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Company Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-navy-600 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={brandProfile.logo}
                alt={brandProfile.companyName}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-navy-600">{brandProfile.companyName}</h2>
              <p className="text-navy-500">{brandProfile.industry}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Building2 className="w-4 h-4 text-navy-400" />
                  <span className="text-sm text-navy-600">{brandProfile.businessNumber}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-navy-400" />
                  <span className="text-sm text-navy-600">{brandProfile.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-navy-600 text-sm leading-relaxed">{brandProfile.description}</p>
          </div>

          {brandProfile.website && (
            <div className="mt-4 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-navy-400" />
              <a 
                href={brandProfile.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-salmon-600 hover:text-salmon-700 text-sm"
              >
                {brandProfile.website}
              </a>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-salmon-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-salmon-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-600">{brandProfile.stats.totalCampaigns}</p>
                <p className="text-sm text-navy-500">총 캠페인</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-navy-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-600">{brandProfile.stats.activeCampaigns}</p>
                <p className="text-sm text-navy-500">진행 중</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-600">${brandProfile.stats.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-navy-500">총 투자</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-600">{brandProfile.stats.avgROI}x</p>
                <p className="text-sm text-navy-500">평균 ROI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Target Markets */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <h3 className="text-lg font-semibold text-navy-600 mb-4">타겟 시장</h3>
          <div className="flex flex-wrap gap-2">
            {brandProfile.targetMarkets.map((market, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-salmon-100 text-salmon-800 rounded-full text-sm font-medium"
              >
                {market}
              </span>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <h3 className="text-lg font-semibold text-navy-600 mb-4">예산 범위</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-navy-600 font-medium">
                ${brandProfile.budgetRange.min.toLocaleString()} - ${brandProfile.budgetRange.max.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Preferred Influencer Types */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <h3 className="text-lg font-semibold text-navy-600 mb-4">선호 인플루언서 유형</h3>
          <div className="flex flex-wrap gap-2">
            {brandProfile.preferredInfluencerTypes.map((type, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-navy-100 text-navy-800 rounded-full text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-200">
          <h3 className="text-lg font-semibold text-navy-600 mb-4">빠른 작업</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => router.push('/campaigns/create')}
              className="flex items-center justify-center space-x-2 p-3 bg-salmon-500 text-white rounded-lg hover:bg-salmon-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>새 캠페인</span>
            </button>
            <button 
              onClick={() => router.push('/influencers/search')}
              className="flex items-center justify-center space-x-2 p-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>인플루언서 찾기</span>
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
