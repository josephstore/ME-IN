'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Users, Instagram, Youtube, Star, MessageCircle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import BottomNavigation from '@/components/layout/BottomNavigation'

const supabaseUrl = 'https://jltnvoyjnzlswsmddojf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdG52b3lqbnpsc3dzbWRkb2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODk5MjQsImV4cCI6MjA3MDk2NTkyNH0.5blt8JeShSgBA50l5bcE30Um1nGlYJAl685XBdVrqdg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Influencer {
  id: string
  username: string
  display_name: string
  bio: string
  profile_image?: string
  location?: string
  languages: string[]
  categories: string[]
  social_media: {
    instagram?: { followers: number; username: string }
    youtube?: { subscribers: number; channel: string }
    tiktok?: { followers: number; username: string }
  }
  total_followers: number
  engagement_rate: number
  rating: number
  portfolio_count: number
  is_verified: boolean
}

// 샘플 인플루언서 데이터
const sampleInfluencers: Influencer[] = [
  {
    id: '1',
    username: 'sarah_beauty',
    display_name: 'Sarah Kim',
    bio: '한국 뷰티 & 라이프스타일 인플루언서 | Dubai based 🇦🇪🇰🇷',
    profile_image: '/images/default-avatar.jpg',
    location: 'Dubai, UAE',
    languages: ['Korean', 'English', 'Arabic'],
    categories: ['Beauty', 'Lifestyle', 'Fashion'],
    social_media: {
      instagram: { followers: 125000, username: 'sarah_beauty' },
      youtube: { subscribers: 45000, channel: 'Sarah Kim' },
      tiktok: { followers: 89000, username: 'sarah_beauty' }
    },
    total_followers: 259000,
    engagement_rate: 4.2,
    rating: 4.8,
    portfolio_count: 12,
    is_verified: true
  },
  {
    id: '2',
    username: 'ahmed_foodie',
    display_name: 'Ahmed Al-Rashid',
    bio: '중동 지역 한식 전문 인플루언서 | Korean Food Lover 🇰🇷🇸🇦',
    profile_image: '/images/default-avatar.jpg',
    location: 'Riyadh, Saudi Arabia',
    languages: ['Arabic', 'English', 'Korean'],
    categories: ['Food', 'Culture', 'Travel'],
    social_media: {
      instagram: { followers: 89000, username: 'ahmed_foodie' },
      youtube: { subscribers: 67000, channel: 'Ahmed Foodie' }
    },
    total_followers: 156000,
    engagement_rate: 5.1,
    rating: 4.6,
    portfolio_count: 8,
    is_verified: true
  },
  {
    id: '3',
    username: 'lisa_kpop',
    display_name: 'Lisa Park',
    bio: 'K-POP & K-Culture 전문 인플루언서 | Middle East K-POP Ambassador 🎵',
    profile_image: '/images/default-avatar.jpg',
    location: 'Abu Dhabi, UAE',
    languages: ['Korean', 'English', 'Arabic'],
    categories: ['Entertainment', 'Music', 'Culture'],
    social_media: {
      instagram: { followers: 210000, username: 'lisa_kpop' },
      youtube: { subscribers: 120000, channel: 'Lisa K-POP' },
      tiktok: { followers: 180000, username: 'lisa_kpop' }
    },
    total_followers: 510000,
    engagement_rate: 6.8,
    rating: 4.9,
    portfolio_count: 25,
    is_verified: true
  }
]

export default function InfluencerSearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [minFollowers, setMinFollowers] = useState('')
  const [location, setLocation] = useState('')
  const [influencers, setInfluencers] = useState<Influencer[]>(sampleInfluencers)
  const [loading, setLoading] = useState(false)

  const categories = ['Beauty', 'Food', 'Fashion', 'Travel', 'Technology', 'Entertainment', 'Lifestyle', 'Culture', 'Music', 'Sports']
  const languages = ['Korean', 'English', 'Arabic', 'French', 'Spanish', 'German', 'Chinese', 'Japanese']

  useEffect(() => {
    fetchInfluencers()
  }, [])

  const fetchInfluencers = async () => {
    try {
      setLoading(true)
      // Supabase에서 인플루언서 데이터 가져오기
      const { data, error } = await supabase
        .from('influencer_profiles')
        .select('*')
        .eq('is_active', true)

      if (error) {
        console.error('Error fetching influencers:', error)
        // 에러가 있어도 샘플 데이터는 표시
      } else if (data && data.length > 0) {
        // Supabase 데이터와 샘플 데이터 합치기
        const allInfluencers = [...data, ...sampleInfluencers]
        setInfluencers(allInfluencers)
      }
    } catch (error) {
      console.error('Error fetching influencers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = 
      influencer.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.bio.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.some(cat => influencer.categories.includes(cat))
    
    const matchesLanguages = selectedLanguages.length === 0 || 
      selectedLanguages.some(lang => influencer.languages.includes(lang))
    
    const matchesFollowers = !minFollowers || 
      influencer.total_followers >= parseInt(minFollowers)
    
    const matchesLocation = !location || 
      influencer.location?.toLowerCase().includes(location.toLowerCase())

    return matchesSearch && matchesCategories && matchesLanguages && matchesFollowers && matchesLocation
  })

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedLanguages([])
    setMinFollowers('')
    setLocation('')
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">인플루언서 검색</h1>
            <div className="w-20"></div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="인플루언서 이름, 전문분야, 지역으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">필터</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            필터 초기화
          </button>
        </div>

        {/* Categories */}
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">카테고리</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategories.includes(category)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">언어</h3>
          <div className="flex flex-wrap gap-2">
            {languages.map(language => (
              <button
                key={language}
                onClick={() => toggleLanguage(language)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedLanguages.includes(language)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최소 팔로워 수
            </label>
            <input
              type="number"
              placeholder="예: 10000"
              value={minFollowers}
              onChange={(e) => setMinFollowers(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지역
            </label>
            <input
              type="text"
              placeholder="예: Dubai, UAE"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            검색 결과 ({filteredInfluencers.length}명)
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">인플루언서를 불러오는 중...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInfluencers.map(influencer => (
              <div key={influencer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      {influencer.profile_image ? (
                        <img
                          src={influencer.profile_image}
                          alt={influencer.display_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {influencer.display_name}
                      </h3>
                      {influencer.is_verified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span className="text-sm text-gray-500">@{influencer.username}</span>
                    </div>

                    <p className="text-gray-600 mb-3">{influencer.bio}</p>

                    {/* Location & Languages */}
                    <div className="flex items-center space-x-4 mb-3">
                      {influencer.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{influencer.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{influencer.languages.join(', ')}</span>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {influencer.categories.map(category => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    {/* Social Media Stats */}
                    <div className="flex items-center space-x-4 mb-4">
                      {influencer.social_media.instagram && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Instagram className="w-4 h-4 text-pink-500" />
                          <span>{influencer.social_media.instagram.followers.toLocaleString()}</span>
                        </div>
                      )}
                      {influencer.social_media.youtube && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Youtube className="w-4 h-4 text-red-500" />
                          <span>{influencer.social_media.youtube.subscribers.toLocaleString()}</span>
                        </div>
                      )}

                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">총 팔로워:</span> {influencer.total_followers.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">참여율:</span> {influencer.engagement_rate}%
                      </div>
                      <div>
                        <span className="font-medium">평점:</span> {influencer.rating}/5.0
                      </div>
                      <div>
                        <span className="font-medium">포트폴리오:</span> {influencer.portfolio_count}개
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => router.push(`/influencers/${influencer.id}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      프로필 보기
                    </button>
                    <button
                      onClick={() => router.push(`/messages?to=${influencer.id}`)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>메시지</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Spacing for Navigation */}
      <div className="h-20"></div>
      
      {/* Global Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
