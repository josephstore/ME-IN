'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Brain, BarChart3, Globe, Shield, Users, Zap, 
  Target, TrendingUp, MessageSquare, FileText, 
  Smartphone, Award, CheckCircle, ArrowRight
} from 'lucide-react'

export default function FeaturesPage() {
  const router = useRouter()

  const mainFeatures = [
    {
      icon: Brain,
      title: 'AI 스마트 매칭',
      description: '빅데이터 기반 AI 알고리즘으로 최적의 브랜드와 인플루언서를 매칭합니다',
      details: [
        '실시간 데이터 분석',
        '개인화된 추천 시스템',
        '성과 예측 알고리즘',
        '지속적인 학습 및 개선'
      ],
      color: 'from-purple-500 to-purple-700'
    },
    {
      icon: BarChart3,
      title: '실시간 분석',
      description: '캠페인 성과를 실시간으로 추적하고 상세한 분석 리포트를 제공합니다',
      details: [
        '실시간 성과 대시보드',
        '상세한 분석 리포트',
        'ROI 계산 및 최적화',
        '경쟁사 벤치마킹'
      ],
      color: 'from-blue-500 to-blue-700'
    },
    {
      icon: Globe,
      title: '다국어 지원',
      description: '한국어, 영어, 아랍어 완전 지원으로 글로벌 커뮤니케이션을 원활하게 합니다',
      details: [
        '3개 언어 완전 지원',
        '실시간 번역 기능',
        '문화별 맞춤 콘텐츠',
        '지역별 최적화'
      ],
      color: 'from-green-500 to-green-700'
    },
    {
      icon: Shield,
      title: '보안 강화',
      description: '개인정보보호 및 데이터 보안을 최우선으로 하는 안전한 플랫폼입니다',
      details: [
        '엔드투엔드 암호화',
        'GDPR 준수',
        '정기 보안 감사',
        '데이터 백업 및 복구'
      ],
      color: 'from-red-500 to-red-700'
    }
  ]

  const platformFeatures = [
    {
      category: '브랜드를 위한 기능',
      features: [
        {
          icon: Target,
          title: '정확한 타겟팅',
          description: 'AI 기반 매칭으로 최적의 인플루언서를 찾아드립니다'
        },
        {
          icon: TrendingUp,
          title: '성과 최적화',
          description: '데이터 기반 전략으로 캠페인 성과를 극대화합니다'
        },
        {
          icon: MessageSquare,
          title: '직접 소통',
          description: '인플루언서와 직접 소통하여 협업을 원활하게 합니다'
        },
        {
          icon: FileText,
          title: '상세한 리포팅',
          description: '캠페인 성과에 대한 상세한 분석 리포트를 제공합니다'
        }
      ]
    },
    {
      category: '인플루언서를 위한 기능',
      features: [
        {
          icon: Users,
          title: '브랜드 연결',
          description: '다양한 한국 브랜드와 연결하여 새로운 기회를 만듭니다'
        },
        {
          icon: Zap,
          title: '빠른 매칭',
          description: 'AI가 최적의 브랜드를 찾아 빠르게 매칭해드립니다'
        },
        {
          icon: Smartphone,
          title: '모바일 최적화',
          description: '언제 어디서나 모바일로 편리하게 이용할 수 있습니다'
        },
        {
          icon: Award,
          title: '성과 인정',
          description: '우수한 성과를 보인 인플루언서에게 특별한 혜택을 제공합니다'
        }
      ]
    }
  ]

  const integrations = [
    { name: 'Instagram', icon: '/api/placeholder/40/40', description: '인스타그램 계정 연동 및 분석' },
    { name: 'YouTube', icon: '/api/placeholder/40/40', description: '유튜브 채널 연동 및 성과 추적' },
    { name: 'TikTok', icon: '/api/placeholder/40/40', description: '틱톡 계정 연동 및 콘텐츠 분석' },
    { name: 'Twitter', icon: '/api/placeholder/40/40', description: '트위터 계정 연동 및 인게이지먼트 분석' },
    { name: 'Facebook', icon: '/api/placeholder/40/40', description: '페이스북 페이지 연동 및 커뮤니티 관리' },
    { name: 'LinkedIn', icon: '/api/placeholder/40/40', description: '링크드인 프로필 연동 및 B2B 마케팅' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ME-IN의 핵심 기능
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              AI 기반 매칭부터 실시간 분석까지<br />
              인플루언서 마케팅에 필요한 모든 기능을 제공합니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/auth/register')}
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors"
              >
                데모 신청하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              핵심 기능
            </h2>
            <p className="text-xl text-gray-600">
              ME-IN을 차별화하는 4가지 핵심 기능을 소개합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="flex gap-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              사용자별 특화 기능
            </h2>
            <p className="text-xl text-gray-600">
              브랜드와 인플루언서 각각을 위한 맞춤형 기능을 제공합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {platformFeatures.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center lg:text-left">
                  {category.category}
                </h3>
                <div className="space-y-6">
                  {category.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              소셜 미디어 연동
            </h2>
            <p className="text-xl text-gray-600">
              주요 소셜 미디어 플랫폼과 완벽하게 연동됩니다
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <div className="w-10 h-10 bg-gray-200 rounded"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{integration.name}</h3>
                <p className="text-sm text-gray-600">{integration.description}</p>
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
              ME-IN의 기능들이 만들어낸 놀라운 성과를 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">99.9%</div>
              <div className="text-gray-300">매칭 정확도</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">3배</div>
              <div className="text-gray-300">평균 ROI 향상</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">50%</div>
              <div className="text-gray-300">작업 시간 단축</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">24/7</div>
              <div className="text-gray-300">실시간 모니터링</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              작동 방식
            </h2>
            <p className="text-xl text-gray-600">
              ME-IN이 어떻게 최적의 매칭을 만들어내는지 알아보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">데이터 수집</h3>
              <p className="text-gray-600">
                브랜드와 인플루언서의 프로필, 성과 데이터, 
                선호도 등을 종합적으로 분석합니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI 분석</h3>
              <p className="text-gray-600">
                머신러닝 알고리즘이 수집된 데이터를 분석하여 
                최적의 매칭을 찾아냅니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">성과 최적화</h3>
              <p className="text-gray-600">
                실시간 성과 데이터를 바탕으로 지속적으로 
                매칭 알고리즘을 개선합니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 체험해보세요
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            ME-IN의 강력한 기능들을 직접 경험해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/register')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              무료로 시작하기
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors"
            >
              상담 신청하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
