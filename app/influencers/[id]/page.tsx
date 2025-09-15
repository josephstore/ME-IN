'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Users, Instagram, Youtube, Star, MessageCircle, Heart, Share2, Calendar, Award, Globe } from 'lucide-react'
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
  about?: string
  experience?: string
  achievements?: string[]
  portfolio_items?: PortfolioItem[]
}

interface PortfolioItem {
  id: string
  title: string
  description: string
  image: string
  category: string
  created_at: string
  likes: number
  views: number
}

// 샘플 데이터 - 이미지 레이아웃에 맞춰 수정
const sampleInfluencer: Influencer = {
  id: '1',
  username: 'nour_ali_ahmad',
  display_name: 'Nour Ali Ahmad',
  bio: 'Social Media Influencer',
  profile_image: '/images/nour-profile.jpg',
  location: 'Dubai, UAE',
  languages: ['Korean', 'Arabic'],
  categories: ['Beauty', 'Lifestyle', 'Korean Culture'],
  social_media: {
    instagram: { followers: 3600, username: 'nour_ali_ahmad' },
    youtube: { subscribers: 500000, channel: 'Nour Ali Ahmad' }
  },
  total_followers: 3600,
  engagement_rate: 4.2,
  rating: 4.8,
  portfolio_count: 17,
  is_verified: true,
  about: '안녕하세요. Nour 입니다.\nأعرفكم على الثقافة الكورية بعيون عربية',
  experience: '한국 문화를 아랍의 시각으로 소개하는 인플루언서',
  achievements: [
    '2023년 중동 지역 최고 한국 문화 인플루언서 상',
    '한국 브랜드 30+개와 성공적인 협업',
    '총 조회수 500만+ 달성',
    '평균 참여율 4.2% 유지'
  ],
  portfolio_items: [
    {
      id: '1',
      title: 'Korean Beauty Product Review',
      description: '한국 뷰티 제품을 아랍 시청자들에게 소개',
      image: '/images/carery-toner.jpg',
      category: 'Beauty',
      created_at: '2024-01-15',
      likes: 1250,
      views: 45000
    },
    {
      id: '2',
      title: 'Korean Food Experience',
      description: '한국 음식을 맛보며 문화를 체험하는 콘텐츠',
      image: '/images/korean-food.jpg',
      category: 'Food',
      created_at: '2024-01-10',
      likes: 890,
      views: 32000
    },
    {
      id: '3',
      title: 'Dubai Travel Vlog',
      description: 'Dubai의 한국 문화 관련 장소들을 탐방',
      image: '/images/dubai-travel.jpg',
      category: 'Travel',
      created_at: '2024-01-05',
      likes: 650,
      views: 28000
    },
    {
      id: '4',
      title: 'Korean Fashion Style',
      description: '한국 패션을 아랍 스타일과 조합한 코디',
      image: '/images/kpop-concert.jpg',
      category: 'Fashion',
      created_at: '2024-01-01',
      likes: 420,
      views: 15000
    }
  ]
}

export default function InfluencerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [influencer, setInfluencer] = useState<Influencer | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('portfolio')

  useEffect(() => {
    fetchInfluencerProfile()
  }, [params.id])

  const fetchInfluencerProfile = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('influencer_profiles')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching influencer profile:', error)
        // 에러가 있어도 샘플 데이터는 표시
        setInfluencer(sampleInfluencer)
      } else if (data) {
        setInfluencer(data)
      } else {
        setInfluencer(sampleInfluencer)
      }
    } catch (error) {
      console.error('Error fetching influencer profile:', error)
      setInfluencer(sampleInfluencer)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!influencer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">인플루언서를 찾을 수 없습니다</h1>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header with Back Button */}
      <div className="absolute top-0 left-0 z-10 p-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Main Background Image */}
      <div className="relative h-80 bg-gradient-to-br from-amber-100 to-orange-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Social Media Icons Overlay */}
        <div className="absolute left-4 top-20 space-y-3">
          <div className="w-12 h-12 bg-black/80 rounded-full flex items-center justify-center">
            <Youtube className="w-6 h-6 text-white" />
          </div>
          <div className="w-12 h-12 bg-black/80 rounded-full flex items-center justify-center">
            <Instagram className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative -mt-16 px-4 pb-6">
        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center overflow-hidden">
              {influencer.profile_image ? (
                <img
                  src={influencer.profile_image}
                  alt={influencer.display_name}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              <div className="w-full h-full rounded-full flex items-center justify-center hidden">
                <Users className="w-16 h-16 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {influencer.display_name}
            </h1>
            {influencer.is_verified && (
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white fill-current" />
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm">{influencer.bio}</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center space-x-8 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{influencer.total_followers.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{influencer.social_media.youtube?.subscribers.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Views</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{influencer.portfolio_count}</div>
            <div className="text-xs text-gray-500">Connections</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'info'
                  ? 'bg-stone-100 text-gray-900 border border-gray-300'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Info
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'portfolio'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Portfolio
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* Bio */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <span className="text-sm text-gray-700">안녕하세요. Nour 입니다.</span>
                  <span className="text-lg">🇰🇷</span>
                </div>
                <div className="text-sm text-gray-700">
                  أعرفكم على الثقافة الكورية بعيون عربية
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            {/* Portfolio Grid */}
            <div className="grid grid-cols-3 gap-2">
              {influencer.portfolio_items?.slice(0, 3).map((item, index) => (
                <div key={item.id} className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="200" fill="#f8f3eb"/>
                          <text x="100" y="100" font-family="Arial, sans-serif" font-size="14" 
                                text-anchor="middle" fill="#1c2b4a">
                            ${item.title}
                          </text>
                        </svg>
                      `)}`
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Additional Portfolio Item */}
            {influencer.portfolio_items?.[3] && (
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-video">
                  <img
                    src={influencer.portfolio_items[3].image}
                    alt={influencer.portfolio_items[3].title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
                          <rect width="400" height="200" fill="#f8f3eb"/>
                          <text x="200" y="100" font-family="Arial, sans-serif" font-size="16" 
                                text-anchor="middle" fill="#1c2b4a">
                            ${influencer.portfolio_items?.[3]?.title || '포트폴리오'}
                          </text>
                        </svg>
                      `)}`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40">
        <button className="w-full bg-gray-800 text-white py-4 rounded-lg font-medium text-lg">
          Contact influencer
        </button>
      </div>
      
      {/* Global Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
