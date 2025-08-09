import React from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          ME-IN Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          MiddleEast Influencer Network
        </p>
        <div className="space-y-4">
          <p className="text-lg text-green-600 font-semibold">✅ 배포 성공!</p>
          <p className="text-md text-gray-500">한국 브랜드와 중동 인플루언서를 연결하는 플랫폼</p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">🌐 다국어 지원</h3>
            <p className="text-sm text-gray-600">한국어, 영어, 아랍어</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">🤖 AI 매칭</h3>
            <p className="text-sm text-gray-600">스마트 알고리즘 매칭</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">📊 실시간 분석</h3>
            <p className="text-sm text-gray-600">성과 추적 및 분석</p>
          </div>
        </div>
        
        <div className="mt-8">
          <a 
            href="/auth/login" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인 테스트
          </a>
        </div>
      </div>
    </div>
  )
}
