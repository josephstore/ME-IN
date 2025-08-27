'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, MapPin, Clock, DollarSign, CheckCircle, ArrowRight,
  Heart, Lightbulb, Globe, Shield, Briefcase, Award
} from 'lucide-react'

export default function CareersPage() {
  const router = useRouter()

  const benefits = [
    {
      icon: Heart,
      title: '건강 보험',
      description: '전 직원 대상 종합 건강보험 제공'
    },
    {
      icon: Lightbulb,
      title: '학습 지원',
      description: '연간 교육비 및 도서구입비 지원'
    },
    {
      icon: Globe,
      title: '원격 근무',
      description: '유연한 원격 근무 정책'
    },
    {
      icon: Shield,
      title: '생명 보험',
      description: '전 직원 대상 생명보험 가입'
    },
    {
      icon: Briefcase,
      title: '스톡옵션',
      description: '성과에 따른 스톡옵션 제공'
    },
    {
      icon: Award,
      title: '성과 보너스',
      description: '연간 성과에 따른 보너스 지급'
    }
  ]

  const positions = [
    {
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Seoul, Korea',
      type: 'Full-time',
      experience: '3-5 years',
      description: 'React, Next.js를 활용한 프론트엔드 개발을 담당합니다.',
      requirements: [
        'React, TypeScript 3년 이상 경험',
        'Next.js 프레임워크 경험',
        '반응형 웹 개발 경험',
        'Git을 활용한 협업 경험'
      ]
    },
    {
      title: 'AI/ML Engineer',
      department: 'Engineering',
      location: 'Seoul, Korea',
      type: 'Full-time',
      experience: '2-4 years',
      description: '인플루언서 매칭 알고리즘 개발 및 개선을 담당합니다.',
      requirements: [
        'Python, TensorFlow/PyTorch 경험',
        '머신러닝 모델 개발 경험',
        '데이터 분석 및 전처리 경험',
        '클라우드 플랫폼 경험 (AWS/GCP)'
      ]
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Dubai, UAE',
      type: 'Full-time',
      experience: '3-5 years',
      description: '중동 지역 마케팅 전략 수립 및 실행을 담당합니다.',
      requirements: [
        '중동 지역 마케팅 경험',
        '디지털 마케팅 전략 수립 경험',
        '아랍어/영어 능통',
        '인플루언서 마케팅 경험'
      ]
    },
    {
      title: 'Business Development Manager',
      department: 'Sales',
      location: 'Seoul, Korea',
      type: 'Full-time',
      experience: '2-4 years',
      description: '한국 브랜드 파트너십 개발 및 관리를 담당합니다.',
      requirements: [
        'B2B 영업 경험',
        '파트너십 개발 경험',
        '마케팅/광고 업계 경험',
        '프로젝트 관리 능력'
      ]
    }
  ]

  const culture = [
    {
      icon: Users,
      title: '다양성과 포용',
      description: '다양한 문화와 배경을 가진 인재들이 함께 성장합니다'
    },
    {
      icon: Lightbulb,
      title: '혁신 추구',
      description: '새로운 아이디어와 기술을 적극적으로 수용합니다'
    },
    {
      icon: Globe,
      title: '글로벌 마인드',
      description: '세계를 무대로 하는 글로벌 비즈니스를 추구합니다'
    },
    {
      icon: Heart,
      title: '사람 중심',
      description: '직원의 성장과 워라밸을 최우선으로 합니다'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ME-IN과 함께<br />
              <span className="text-yellow-300">미래를 만들어가세요</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-teal-100">
              글로벌 인플루언서 마케팅의 새로운 시대를<br />
              함께 열어가는 인재를 찾습니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/contact')}
                className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                채용 문의하기
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ME-IN의 문화
            </h2>
            <p className="text-xl text-gray-600">
              우리가 추구하는 조직 문화를 소개합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {culture.map((item, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              복리후생
            </h2>
            <p className="text-xl text-gray-600">
              ME-IN에서 제공하는 다양한 혜택을 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              채용 포지션
            </h2>
            <p className="text-xl text-gray-600">
              현재 모집 중인 포지션을 확인해보세요
            </p>
          </div>
          
          <div className="space-y-6">
            {positions.map((position, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {position.department}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {position.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {position.type}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {position.experience}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/contact')}
                    className="mt-4 lg:mt-0 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                  >
                    지원하기
                  </button>
                </div>
                <p className="text-gray-700 mb-4">{position.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">요구사항:</h4>
                  <ul className="space-y-1">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ME-IN과 함께 성장하세요
          </h2>
          <p className="text-xl mb-8 text-teal-100">
            글로벌 인플루언서 마케팅의 미래를 함께 만들어갈 인재를 기다립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/contact')}
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              채용 문의하기
            </button>
            <button
              onClick={() => router.push('/about')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-teal-600 transition-colors"
            >
              회사 소개 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
