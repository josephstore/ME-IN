'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Target, Users, TrendingUp, Globe, Shield, BarChart3, 
  CheckCircle, ArrowRight, Star, Award, Zap, Headphones
} from 'lucide-react'

export default function BrandsPage() {
  const router = useRouter()

  const features = [
    {
      icon: Target,
      title: '정확한 타겟팅',
      description: 'AI 기반 매칭으로 최적의 인플루언서를 찾아드립니다'
    },
    {
      icon: Users,
      title: '다양한 인플루언서',
      description: '중동 지역의 다양한 카테고리 인플루언서와 연결'
    },
    {
      icon: TrendingUp,
      title: '성과 분석',
      description: '실시간 캠페인 성과 추적 및 상세 분석 리포트'
    },
    {
      icon: Globe,
      title: '글로벌 진출',
      description: '중동 시장 진출을 위한 전문적인 마케팅 솔루션'
    },
    {
      icon: Shield,
      title: '안전한 거래',
      description: '보안이 강화된 안전한 캠페인 관리 시스템'
    },
    {
      icon: BarChart3,
      title: 'ROI 최적화',
      description: '투자 대비 최고의 성과를 위한 데이터 기반 전략'
    }
  ]

  const testimonials = [
    {
      name: '김민수',
      company: '코스메틱 브랜드 A',
      content: '중동 시장 진출에 성공했습니다. ME-IN의 AI 매칭 시스템이 정말 놀라워요!',
      rating: 5
    },
    {
      name: '박지영',
      company: '패션 브랜드 B',
      content: '인플루언서와의 협업이 훨씬 쉬워졌어요. 성과도 기대 이상입니다.',
      rating: 5
    },
    {
      name: '이준호',
      company: '푸드 브랜드 C',
      content: '중동 지역의 문화를 이해하는 인플루언서들과 연결되어 만족합니다.',
      rating: 5
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: '무료',
      description: '소규모 브랜드를 위한 기본 기능',
      features: [
        '월 3개 캠페인',
        '기본 분석 리포트',
        '이메일 지원',
        '표준 매칭 알고리즘'
      ]
    },
    {
      name: 'Professional',
      price: '₩299,000',
      period: '/월',
      description: '성장하는 브랜드를 위한 고급 기능',
      features: [
        '무제한 캠페인',
        '고급 분석 도구',
        '전담 매니저',
        'AI 매칭 알고리즘',
        '우선 지원'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '맞춤형',
      description: '대기업을 위한 맞춤형 솔루션',
      features: [
        '맞춤형 기능 개발',
        '전담 팀 지원',
        'API 연동',
        '화이트 라벨 솔루션',
        '24/7 지원'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              중동 시장 진출의<br />
              <span className="text-yellow-300">새로운 기회</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              AI 기반 매칭으로 최적의 중동 인플루언서와 연결하여<br />
              브랜드의 글로벌 성장을 도와드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/auth/register')}
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors"
              >
                데모 신청하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              브랜드를 위한 특별한 기능
            </h2>
            <p className="text-xl text-gray-600">
              중동 시장 진출에 필요한 모든 도구를 제공합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
              검증된 성과
            </h2>
            <p className="text-xl text-gray-300">
              수많은 브랜드들이 ME-IN과 함께 성장했습니다
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">500+</div>
              <div className="text-gray-300">성공한 브랜드</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">10,000+</div>
              <div className="text-gray-300">완료된 캠페인</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">2,500%</div>
              <div className="text-gray-300">평균 ROI</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">15개</div>
              <div className="text-gray-300">중동 국가</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              고객들의 생생한 후기
            </h2>
            <p className="text-xl text-gray-600">
              실제 사용 중인 브랜드들의 경험을 들어보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">&quot;{testimonial.content}&quot;</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              합리적인 요금제
            </h2>
            <p className="text-xl text-gray-600">
              브랜드 규모에 맞는 최적의 요금제를 선택하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white p-8 rounded-lg shadow-lg ${plan.popular ? 'ring-2 ring-red-500 relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      인기
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price}
                    {plan.period && <span className="text-lg text-gray-600">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => router.push('/auth/register')}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    시작하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 text-red-100">
            중동 시장 진출의 새로운 기회를 놓치지 마세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/register')}
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              무료 계정 만들기
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors"
            >
              상담 신청하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
