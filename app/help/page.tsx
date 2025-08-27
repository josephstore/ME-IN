'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, ChevronDown, ChevronRight, MessageSquare, 
  BookOpen, Video, FileText, HelpCircle, Mail, Phone
} from 'lucide-react'

export default function HelpPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const categories = [
    {
      id: 'getting-started',
      title: '시작하기',
      icon: BookOpen,
      articles: [
        {
          title: 'ME-IN 플랫폼 소개',
          description: 'ME-IN 플랫폼의 주요 기능과 특징을 알아보세요'
        },
        {
          title: '계정 생성 및 설정',
          description: 'ME-IN 계정을 생성하고 기본 설정을 완료하는 방법'
        },
        {
          title: '프로필 완성하기',
          description: '브랜드 또는 인플루언서 프로필을 완성하는 방법'
        }
      ]
    },
    {
      id: 'campaigns',
      title: '캠페인 관리',
      icon: FileText,
      articles: [
        {
          title: '캠페인 생성하기',
          description: '새로운 캠페인을 생성하고 설정하는 방법'
        },
        {
          title: '인플루언서 매칭',
          description: 'AI 매칭 시스템을 통한 최적의 인플루언서 찾기'
        },
        {
          title: '캠페인 성과 분석',
          description: '캠페인 성과를 추적하고 분석하는 방법'
        }
      ]
    },
    {
      id: 'influencers',
      title: '인플루언서 가이드',
      icon: Video,
      articles: [
        {
          title: '인플루언서 등록',
          description: '인플루언서로 등록하고 프로필을 설정하는 방법'
        },
        {
          title: '포트폴리오 관리',
          description: '포트폴리오를 생성하고 관리하는 방법'
        },
        {
          title: '캠페인 신청 및 참여',
          description: '캠페인에 신청하고 참여하는 방법'
        }
      ]
    },
    {
      id: 'billing',
      title: '결제 및 요금제',
      icon: FileText,
      articles: [
        {
          title: '요금제 안내',
          description: 'ME-IN의 다양한 요금제와 기능 비교'
        },
        {
          title: '결제 방법',
          description: '지원되는 결제 방법과 결제 과정'
        },
        {
          title: '환불 정책',
          description: '환불 조건과 환불 신청 방법'
        }
      ]
    }
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: '이메일 지원',
      description: '24시간 이내 답변',
      contact: 'support@me-in.com'
    },
    {
      icon: Phone,
      title: '전화 지원',
      description: '평일 9AM-6PM',
      contact: '+82-2-1234-5678'
    },
    {
      icon: MessageSquare,
      title: '실시간 채팅',
      description: '즉시 답변',
      contact: '채팅 시작하기'
    }
  ]

  const popularArticles = [
    '캠페인 생성 시 주의사항',
    '인플루언서 매칭 알고리즘 설명',
    '결제 오류 해결 방법',
    '프로필 승인 거부 시 대처법',
    '캠페인 성과 최적화 팁'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              도움말 센터
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              ME-IN 사용에 필요한 모든 정보를 찾아보세요
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="도움말을 검색해보세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Articles */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-xl text-gray-600">
              사용자들이 가장 많이 찾는 도움말입니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">{article}</h3>
                <p className="text-gray-600 text-sm">자세히 보기 →</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              도움말 카테고리
            </h2>
            <p className="text-xl text-gray-600">
              주제별로 정리된 도움말을 확인해보세요
            </p>
          </div>
          
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <category.icon className="w-6 h-6 text-orange-600 mr-4" />
                    <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                  </div>
                  {expandedCategory === category.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {expandedCategory === category.id && (
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      {category.articles.map((article, index) => (
                        <div key={index} className="border-l-4 border-orange-200 pl-4 py-2">
                          <h4 className="font-semibold text-gray-900 mb-1">{article.title}</h4>
                          <p className="text-gray-600 text-sm">{article.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              추가 도움이 필요하신가요?
            </h2>
            <p className="text-xl text-gray-600">
              다양한 방법으로 고객 지원팀에 문의하실 수 있습니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="text-center p-8 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <p className="text-orange-600 font-medium">{method.contact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            더 많은 도움이 필요하신가요?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            고객 지원팀이 언제든지 도움을 드리겠습니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/contact')}
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              문의하기
            </button>
            <button
              onClick={() => router.push('/guide')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              가이드 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
