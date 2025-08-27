'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, Target, Globe, Award, CheckCircle, ArrowRight,
  Heart, Lightbulb, Shield, TrendingUp, Star, MapPin
} from 'lucide-react'

export default function AboutPage() {
  const router = useRouter()

  const stats = [
    { number: '500+', label: '성공한 브랜드' },
    { number: '15,000+', label: '등록된 인플루언서' },
    { number: '10,000+', label: '완료된 캠페인' },
    { number: '15개', label: '중동 국가' }
  ]

  const values = [
    {
      icon: Heart,
      title: '신뢰',
      description: '브랜드와 인플루언서 간의 신뢰를 최우선으로 합니다'
    },
    {
      icon: Lightbulb,
      title: '혁신',
      description: '최신 기술을 활용하여 지속적으로 혁신합니다'
    },
    {
      icon: Globe,
      title: '글로벌',
      description: '문화의 경계를 넘어 글로벌 연결을 만들어갑니다'
    },
    {
      icon: Shield,
      title: '보안',
      description: '개인정보와 데이터 보안을 최우선으로 합니다'
    }
  ]

  const team = [
    {
      name: '김민수',
      position: 'CEO & Founder',
      description: '10년간의 마케팅 경험을 바탕으로 ME-IN을 설립했습니다',
      avatar: '/api/placeholder/120/120'
    },
    {
      name: '사라 알리',
      position: 'CTO',
      description: 'AI 및 빅데이터 전문가로 기술 혁신을 이끌고 있습니다',
      avatar: '/api/placeholder/120/120'
    },
    {
      name: '박지영',
      position: 'Head of Marketing',
      description: '중동 시장 전문가로 글로벌 마케팅 전략을 수립합니다',
      avatar: '/api/placeholder/120/120'
    },
    {
      name: '아흐메드 칸',
      position: 'Head of Partnerships',
      description: '중동 지역 파트너십 및 비즈니스 개발을 담당합니다',
      avatar: '/api/placeholder/120/120'
    }
  ]

  const timeline = [
    {
      year: '2023',
      title: 'ME-IN 설립',
      description: '한국과 중동을 연결하는 인플루언서 마케팅 플랫폼 설립'
    },
    {
      year: '2024',
      title: '베타 서비스 출시',
      description: 'AI 매칭 알고리즘을 탑재한 베타 서비스 출시'
    },
    {
      year: '2024',
      title: '100개 브랜드 달성',
      description: '첫 100개 브랜드와 1,000명 인플루언서 등록 달성'
    },
    {
      year: '2025',
      title: '시리즈 A 투자',
      description: '50억원 규모의 시리즈 A 투자 유치 성공'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ME-IN 소개
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-100">
              한국과 중동을 연결하는<br />
              <span className="text-yellow-300">인플루언서 마케팅 플랫폼</span>
            </p>
            <p className="text-lg text-emerald-200 max-w-3xl mx-auto">
              ME-IN은 AI 기술을 활용하여 한국 브랜드와 중동 인플루언서를 
              연결하는 혁신적인 플랫폼입니다. 문화의 경계를 넘어 
              진정한 글로벌 협업을 만들어갑니다.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                우리의 미션
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                문화와 언어의 장벽을 허물고, 한국 브랜드와 중동 인플루언서가 
                함께 성장할 수 있는 플랫폼을 만들어갑니다.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  글로벌 시장 진출 기회 제공
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  문화 간 이해와 존중 촉진
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  지속 가능한 비즈니스 성장 지원
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                우리의 비전
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                아시아와 중동을 연결하는 최고의 인플루언서 마케팅 플랫폼이 되어, 
                글로벌 비즈니스의 새로운 표준을 만들어갑니다.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  AI 기술을 활용한 최적 매칭
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  다국어 및 다문화 지원
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  투명하고 안전한 거래 환경
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ME-IN의 성과
            </h2>
            <p className="text-xl text-gray-300">
              짧은 시간 동안 이룬 놀라운 성과를 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              우리의 가치
            </h2>
            <p className="text-xl text-gray-600">
              ME-IN이 추구하는 핵심 가치들
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              우리 팀
            </h2>
            <p className="text-xl text-gray-600">
              ME-IN을 이끌어가는 전문가들을 소개합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-2">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              성장 과정
            </h2>
            <p className="text-xl text-gray-600">
              ME-IN의 성장 여정을 함께 보세요
            </p>
          </div>
          
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {item.year}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Office Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              오시는 길
            </h2>
            <p className="text-xl text-gray-600">
              ME-IN 본사에 방문해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-6">
                  <MapPin className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">본사</h3>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>서울특별시 강남구 테헤란로 123</p>
                  <p>ME-IN 빌딩 15층</p>
                  <p>전화: +82-2-1234-5678</p>
                  <p>이메일: contact@me-in.com</p>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-6">
                  <MapPin className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">중동 지사</h3>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>Dubai Internet City</p>
                  <p>Dubai, United Arab Emirates</p>
                  <p>전화: +971-4-123-4567</p>
                  <p>이메일: dubai@me-in.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ME-IN과 함께하세요
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            글로벌 인플루언서 마케팅의 새로운 시대를 함께 만들어갑니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/register')}
              className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              무료로 시작하기
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-emerald-600 transition-colors"
            >
              문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
