'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle, X, Star, ArrowRight, Zap, Shield, 
  Users, BarChart3, Globe, Headphones, Crown
} from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Starter',
      description: '소규모 브랜드와 인플루언서를 위한 기본 기능',
      monthlyPrice: '무료',
      yearlyPrice: '무료',
      features: [
        '월 3개 캠페인',
        '기본 분석 리포트',
        '이메일 지원',
        '표준 매칭 알고리즘',
        '기본 포트폴리오 관리',
        '소셜 미디어 연동'
      ],
      notIncluded: [
        '고급 분석 도구',
        '전담 매니저',
        '우선 지원',
        'API 접근'
      ],
      popular: false,
      icon: Users
    },
    {
      name: 'Professional',
      description: '성장하는 브랜드와 인플루언서를 위한 고급 기능',
      monthlyPrice: '₩299,000',
      yearlyPrice: '₩2,990,000',
      features: [
        '무제한 캠페인',
        '고급 분석 도구',
        '전담 매니저',
        'AI 매칭 알고리즘',
        '우선 지원',
        '고급 포트폴리오 관리',
        '실시간 알림',
        '성과 최적화 도구',
        '브랜드 매칭 우선순위',
        '전용 대시보드'
      ],
      notIncluded: [
        'API 접근',
        '화이트 라벨 솔루션'
      ],
      popular: true,
      icon: Zap
    },
    {
      name: 'Enterprise',
      description: '대기업과 대형 인플루언서를 위한 맞춤형 솔루션',
      monthlyPrice: '맞춤형',
      yearlyPrice: '맞춤형',
      features: [
        '맞춤형 기능 개발',
        '전담 팀 지원',
        'API 연동',
        '화이트 라벨 솔루션',
        '24/7 지원',
        '전용 서버',
        '맞춤형 분석',
        '브랜드 전용 페이지',
        '고급 보안 기능',
        '전용 모바일 앱'
      ],
      notIncluded: [],
      popular: false,
      icon: Crown
    }
  ]

  const features = [
    {
      category: '캠페인 관리',
      items: [
        { name: '캠페인 생성', starter: true, professional: true, enterprise: true },
        { name: 'AI 매칭', starter: false, professional: true, enterprise: true },
        { name: '실시간 추적', starter: false, professional: true, enterprise: true },
        { name: '맞춤형 캠페인', starter: false, professional: false, enterprise: true }
      ]
    },
    {
      category: '분석 및 리포팅',
      items: [
        { name: '기본 분석', starter: true, professional: true, enterprise: true },
        { name: '고급 분석', starter: false, professional: true, enterprise: true },
        { name: '실시간 대시보드', starter: false, professional: true, enterprise: true },
        { name: '맞춤형 리포트', starter: false, professional: false, enterprise: true }
      ]
    },
    {
      category: '지원',
      items: [
        { name: '이메일 지원', starter: true, professional: true, enterprise: true },
        { name: '채팅 지원', starter: false, professional: true, enterprise: true },
        { name: '전담 매니저', starter: false, professional: true, enterprise: true },
        { name: '24/7 지원', starter: false, professional: false, enterprise: true }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              합리적인 요금제
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              브랜드와 인플루언서 모두를 위한 투명한 요금제<br />
              규모에 맞는 최적의 플랜을 선택하세요
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-lg ${billingCycle === 'monthly' ? 'text-white' : 'text-blue-200'}`}>
                월간
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-white' : 'bg-blue-200'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-blue-600 transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg ${billingCycle === 'yearly' ? 'text-white' : 'text-blue-200'}`}>
                연간
                <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                  20% 할인
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-lg shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      인기
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    {plan.monthlyPrice !== '무료' && plan.monthlyPrice !== '맞춤형' && (
                      <span className="text-lg text-gray-600">
                        /{billingCycle === 'monthly' ? '월' : '년'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && plan.monthlyPrice !== '무료' && plan.monthlyPrice !== '맞춤형' && (
                    <p className="text-sm text-green-600 font-medium">연간 결제 시 20% 할인</p>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">포함된 기능:</h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-900 mb-3 mt-6">포함되지 않는 기능:</h4>
                      {plan.notIncluded.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                          <span className="text-gray-500">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <button
                  onClick={() => router.push('/auth/register')}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.monthlyPrice === '맞춤형' ? '상담 신청' : '시작하기'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              기능 비교표
            </h2>
            <p className="text-xl text-gray-600">
              각 플랜별 상세 기능을 비교해보세요
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-6 font-semibold text-gray-900">기능</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Starter</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Professional</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="p-4 font-semibold text-gray-900">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-b">
                        <td className="p-6 text-gray-700">{item.name}</td>
                        <td className="text-center p-6">
                          {item.starter ? (
                            <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-6">
                          {item.professional ? (
                            <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-6">
                          {item.enterprise ? (
                            <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-400 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-xl text-gray-600">
              요금제에 대한 궁금한 점을 확인해보세요
            </p>
          </div>

          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                언제든지 플랜을 변경할 수 있나요?
              </h3>
              <p className="text-gray-600">
                네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 
                변경사항은 다음 결제 주기부터 적용됩니다.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                연간 결제 시 환불이 가능한가요?
              </h3>
              <p className="text-gray-600">
                연간 결제 후 30일 이내에 환불 요청 시 전액 환불해드립니다. 
                30일 이후에는 남은 기간에 대한 비례 환불이 가능합니다.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enterprise 플랜의 맞춤형 기능은 어떻게 개발되나요?
              </h3>
              <p className="text-gray-600">
                Enterprise 고객을 위한 전담 팀이 구성되어 요구사항을 분석하고 
                맞춤형 기능을 개발합니다. 개발 과정에서 지속적인 소통을 통해 
                최적의 솔루션을 제공합니다.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                무료 플랜에서 제한되는 기능은 무엇인가요?
              </h3>
              <p className="text-gray-600">
                무료 플랜에서는 월 3개 캠페인, 기본 분석 리포트, 이메일 지원만 
                제공됩니다. 고급 분석 도구, 전담 매니저, 우선 지원 등은 
                Professional 플랜부터 이용 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            ME-IN과 함께 성장하는 여정을 시작해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/register')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              무료로 시작하기
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              상담 신청하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
