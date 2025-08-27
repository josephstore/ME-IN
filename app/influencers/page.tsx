'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  DollarSign, Users, TrendingUp, Globe, Shield, BarChart3, 
  CheckCircle, ArrowRight, Star, Award, Zap, Headphones, Camera, Video
} from 'lucide-react'

export default function InfluencersPage() {
  const router = useRouter()

  const benefits = [
    {
      icon: DollarSign,
      title: '수익 창출',
      description: '다양한 브랜드와 협업하여 안정적인 수익을 만들어보세요'
    },
    {
      icon: Users,
      title: '글로벌 네트워크',
      description: '한국 브랜드와 연결되어 글로벌 시장에 진출할 수 있습니다'
    },
    {
      icon: TrendingUp,
      title: '성장 기회',
      description: 'AI 매칭으로 최적의 브랜드와 연결되어 함께 성장하세요'
    },
    {
      icon: Globe,
      title: '문화 교류',
      description: '한국과 중동 문화를 연결하는 브리지 역할을 해보세요'
    },
    {
      icon: Shield,
      title: '안전한 협업',
      description: '검증된 브랜드와 안전하게 협업할 수 있습니다'
    },
    {
      icon: BarChart3,
      title: '성과 분석',
      description: '상세한 성과 분석으로 더 나은 콘텐츠를 만들어보세요'
    }
  ]

  const successStories = [
    {
      name: '사라 알리',
      category: '뷰티 인플루언서',
      followers: '150K',
      content: '한국 화장품 브랜드와 협업하면서 수익이 3배 증가했어요!',
      rating: 5,
      avatar: '/api/placeholder/60/60'
    },
    {
      name: '아흐메드 칸',
      category: '푸드 인플루언서',
      followers: '200K',
      content: 'ME-IN을 통해 한국 음식 브랜드와 연결되어 새로운 기회를 얻었습니다.',
      rating: 5,
      avatar: '/api/placeholder/60/60'
    },
    {
      name: '파티마 알자브리',
      category: '패션 인플루언서',
      followers: '300K',
      content: '한국 패션 브랜드와의 협업이 정말 만족스러워요. 수익도 크게 늘었습니다.',
      rating: 5,
      avatar: '/api/placeholder/60/60'
    }
  ]

  const categories = [
    { name: '뷰티/메이크업', icon: Camera, count: '2,500+' },
    { name: '패션/스타일', icon: Video, count: '3,200+' },
    { name: '푸드/요리', icon: Camera, count: '1,800+' },
    { name: '여행/라이프스타일', icon: Video, count: '2,100+' },
    { name: '테크/가전', icon: Camera, count: '900+' },
    { name: '게임/엔터테인먼트', icon: Video, count: '1,500+' },
    { name: '교육/지식', icon: Camera, count: '800+' },
    { name: '건강/피트니스', icon: Video, count: '1,200+' }
  ]

  const earnings = [
    {
      range: '1K - 10K 팔로워',
      avgEarnings: '$500 - $2,000',
      description: '월 평균 수익'
    },
    {
      range: '10K - 100K 팔로워',
      avgEarnings: '$2,000 - $10,000',
      description: '월 평균 수익'
    },
    {
      range: '100K+ 팔로워',
      avgEarnings: '$10,000+',
      description: '월 평균 수익'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              당신의 영향력을<br />
              <span className="text-yellow-300">수익으로</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              한국 브랜드와 연결되어 새로운 수익 창출 기회를 만들어보세요<br />
              AI 매칭으로 최적의 브랜드를 찾아드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/auth/register/influencer')}
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                인플루언서 등록하기
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/guide')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors"
              >
                가이드 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              인플루언서를 위한 특별한 혜택
            </h2>
            <p className="text-xl text-gray-600">
              ME-IN에서만 누릴 수 있는 독특한 기회들
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              인플루언서들의 놀라운 성과
            </h2>
            <p className="text-xl text-gray-300">
              ME-IN과 함께한 인플루언서들의 실제 성과를 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">15,000+</div>
              <div className="text-gray-300">등록된 인플루언서</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">₩50억+</div>
              <div className="text-gray-300">총 수익 창출</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-gray-300">만족도</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">8개</div>
              <div className="text-gray-300">카테고리</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              다양한 콘텐츠 카테고리
            </h2>
            <p className="text-xl text-gray-600">
              어떤 분야든 ME-IN에서 성공할 수 있습니다
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <category.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-purple-600 font-medium">{category.count} 인플루언서</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earnings Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              팔로워 수별 예상 수익
            </h2>
            <p className="text-xl text-gray-600">
              실제 인플루언서들의 평균 수익을 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {earnings.map((earning, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{earning.range}</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">{earning.avgEarnings}</div>
                <p className="text-gray-600">{earning.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              성공 스토리
            </h2>
            <p className="text-xl text-gray-600">
              ME-IN과 함께 성장한 인플루언서들의 실제 경험담
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-semibold">{story.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{story.name}</div>
                    <div className="text-sm text-gray-600">{story.category} • {story.followers} 팔로워</div>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">&quot;{story.content}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              간단한 3단계로 시작하세요
            </h2>
            <p className="text-xl text-gray-300">
              ME-IN에서 인플루언서 활동을 시작하는 방법
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">프로필 등록</h3>
              <p className="text-gray-300">간단한 정보 입력으로 프로필을 완성하세요</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI 매칭</h3>
              <p className="text-gray-300">AI가 최적의 브랜드를 찾아 매칭해드립니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">수익 창출</h3>
              <p className="text-gray-300">브랜드와 협업하여 수익을 만들어보세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            한국 브랜드와 연결되어 새로운 수익 창출 기회를 만들어보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/register/influencer')}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              무료로 등록하기
            </button>
            <button
              onClick={() => router.push('/guide')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              가이드 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
