'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, Video, FileText, CheckCircle, ArrowRight,
  Users, Target, TrendingUp, DollarSign, Star, Award
} from 'lucide-react'

export default function GuidePage() {
  const router = useRouter()

  const guideSections = [
    {
      title: '시작하기',
      icon: BookOpen,
      articles: [
        {
          title: 'ME-IN 플랫폼 소개',
          description: 'ME-IN의 주요 기능과 특징을 알아보세요',
          readTime: '5분',
          difficulty: '초급'
        },
        {
          title: '계정 생성 및 설정',
          description: 'ME-IN 계정을 생성하고 기본 설정을 완료하는 방법',
          readTime: '10분',
          difficulty: '초급'
        },
        {
          title: '프로필 완성하기',
          description: '브랜드 또는 인플루언서 프로필을 완성하는 방법',
          readTime: '15분',
          difficulty: '초급'
        }
      ]
    },
    {
      title: '인플루언서 가이드',
      icon: Users,
      articles: [
        {
          title: '인플루언서 등록 가이드',
          description: '인플루언서로 등록하고 프로필을 설정하는 상세 가이드',
          readTime: '20분',
          difficulty: '초급'
        },
        {
          title: '포트폴리오 관리',
          description: '포트폴리오를 생성하고 관리하는 방법',
          readTime: '25분',
          difficulty: '중급'
        },
        {
          title: '캠페인 신청 및 참여',
          description: '캠페인에 신청하고 참여하는 방법',
          readTime: '15분',
          difficulty: '중급'
        },
        {
          title: '수익 최적화 전략',
          description: '인플루언서 수익을 최대화하는 전략',
          readTime: '30분',
          difficulty: '고급'
        }
      ]
    },
    {
      title: '브랜드 가이드',
      icon: Target,
      articles: [
        {
          title: '브랜드 등록 가이드',
          description: '브랜드로 등록하고 프로필을 설정하는 상세 가이드',
          readTime: '20분',
          difficulty: '초급'
        },
        {
          title: '캠페인 생성 및 관리',
          description: '캠페인을 생성하고 관리하는 방법',
          readTime: '30분',
          difficulty: '중급'
        },
        {
          title: '인플루언서 매칭 최적화',
          description: 'AI 매칭을 통해 최적의 인플루언서를 찾는 방법',
          readTime: '25분',
          difficulty: '중급'
        },
        {
          title: '캠페인 성과 분석',
          description: '캠페인 성과를 분석하고 개선하는 방법',
          readTime: '35분',
          difficulty: '고급'
        }
      ]
    }
  ]

  const tips = [
    {
      icon: Star,
      title: '프로필 완성도',
      description: '프로필을 100% 완성하면 매칭 확률이 3배 증가합니다'
    },
    {
      icon: TrendingUp,
      title: '정기적인 업데이트',
      description: '월 1회 이상 프로필을 업데이트하면 더 많은 기회를 얻을 수 있습니다'
    },
    {
      icon: DollarSign,
      title: '가격 설정',
      description: '시장 평균가를 참고하여 합리적인 가격을 설정하세요'
    },
    {
      icon: Award,
      title: '품질 관리',
      description: '높은 품질의 콘텐츠를 제공하면 재협업 확률이 높아집니다'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              인플루언서 가이드
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100">
              ME-IN을 성공적으로 활용하는<br />
              <span className="text-yellow-300">완벽한 가이드</span>
            </p>
            <p className="text-lg text-pink-200 max-w-3xl mx-auto">
              초보자부터 전문가까지, ME-IN 플랫폼을 효과적으로 활용하여 
              성공적인 인플루언서 마케팅을 시작하세요.
            </p>
          </div>
        </div>
      </div>

      {/* Guide Sections */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              단계별 가이드
            </h2>
            <p className="text-xl text-gray-600">
              체계적으로 정리된 가이드를 따라 ME-IN을 마스터하세요
            </p>
          </div>
          
          <div className="space-y-12">
            {guideSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-gray-50 rounded-lg p-8">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mr-6">
                    <section.icon className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.articles.map((article, articleIndex) => (
                    <div key={articleIndex} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{article.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">
                            {article.difficulty}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">읽는 시간: {article.readTime}</span>
                        <ArrowRight className="w-4 h-4 text-pink-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              성공을 위한 팁
            </h2>
            <p className="text-xl text-gray-600">
              ME-IN에서 성공하기 위한 핵심 팁들을 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <tip.icon className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              성공 사례
            </h2>
            <p className="text-xl text-gray-600">
              ME-IN을 통해 성공한 사용자들의 이야기를 들어보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-pink-600 font-semibold">S</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">사라 알리</div>
                  <div className="text-sm text-gray-600">뷰티 인플루언서</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                &quot;ME-IN을 통해 한국 화장품 브랜드와 연결되어 수익이 3배 증가했어요. 
                AI 매칭 시스템이 정말 놀라워요!&quot;
              </p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-pink-600 font-semibold">K</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">김민수</div>
                  <div className="text-sm text-gray-600">패션 브랜드 CEO</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                &quot;중동 시장 진출에 성공했습니다. ME-IN의 AI 매칭 시스템이 
                정말 놀라워요!&quot;
              </p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-pink-600 font-semibold">A</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">아흐메드 칸</div>
                  <div className="text-sm text-gray-600">푸드 인플루언서</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                &quot;한국 음식 브랜드와의 협업이 정말 만족스러워요. 
                수익도 크게 늘었습니다.&quot;
              </p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 text-pink-100">
            가이드를 참고하여 ME-IN에서 성공적인 인플루언서 마케팅을 시작하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/register')}
              className="bg-white text-pink-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              무료로 시작하기
            </button>
            <button
              onClick={() => router.push('/help')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-pink-600 transition-colors"
            >
              도움말 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
