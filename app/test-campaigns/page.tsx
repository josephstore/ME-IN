'use client'

import React, { useState, useEffect } from 'react'
import { CampaignService } from '@/lib/services/campaignService'
import { Campaign } from '@/lib/types/database'
import { Button } from '@/components/ui/Button'
import { CheckCircle, XCircle, Loader2, Tag, DollarSign, Users, Clock, Globe } from 'lucide-react'

export default function TestCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<{
    totalCampaigns: number
    hasSampleData: boolean
    hasBrandProfiles: boolean
    networkStatus: string
  }>({
    totalCampaigns: 0,
    hasSampleData: false,
    hasBrandProfiles: false,
    networkStatus: 'unknown'
  })

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('캠페인 로드 시작...')
      const response = await CampaignService.getActiveCampaigns()
      
      console.log('캠페인 응답:', response)
      
      if (response?.success && response.data) {
        setCampaigns(response.data)
        setTestResults({
          totalCampaigns: response.data.length,
          hasSampleData: response.data.length > 0,
          hasBrandProfiles: response.data.some(c => c.brand_profiles),
          networkStatus: response.error ? 'offline' : 'online'
        })
        console.log('캠페인 로드 성공:', response.data.length, '개')
      } else {
        setError(response?.error || '캠페인을 불러올 수 없습니다.')
        console.error('캠페인 로드 실패:', response?.error)
      }
    } catch (err) {
      setError('캠페인 로드 중 오류가 발생했습니다.')
      console.error('캠페인 로드 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '미정'
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 캠페인 리스트 테스트</h1>
          
          {/* 테스트 결과 */}
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">테스트 결과</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{testResults.totalCampaigns}</div>
                <div className="text-sm text-blue-800">총 캠페인</div>
              </div>
              <div className="text-center">
                {testResults.hasSampleData ? (
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500 mx-auto" />
                )}
                <div className="text-sm text-blue-800">샘플 데이터</div>
              </div>
              <div className="text-center">
                {testResults.hasBrandProfiles ? (
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500 mx-auto" />
                )}
                <div className="text-sm text-blue-800">브랜드 프로필</div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-medium ${
                  testResults.networkStatus === 'online' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {testResults.networkStatus === 'online' ? '온라인' : '오프라인'}
                </div>
                <div className="text-sm text-blue-800">네트워크</div>
              </div>
            </div>
          </div>

          {/* 새로고침 버튼 */}
          <div className="mb-6">
            <Button
              onClick={loadCampaigns}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              캠페인 새로고침
            </Button>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">캠페인을 불러오는 중...</p>
            </div>
          )}

          {/* 오류 상태 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* 캠페인 목록 */}
          {!loading && !error && campaigns.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                캠페인 목록 ({campaigns.length}개)
              </h2>
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {campaign.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {campaign.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {campaign.category}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {campaign.status === 'active' ? '진행중' : campaign.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>
                        {formatCurrency(campaign.budget_min, campaign.currency)} - {formatCurrency(campaign.budget_max, campaign.currency)}
                      </span>
                    </div>

                    {campaign.min_followers && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>최소 {campaign.min_followers.toLocaleString()}명</span>
                      </div>
                    )}

                    {campaign.application_deadline && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>마감: {formatDate(campaign.application_deadline)}</span>
                      </div>
                    )}

                    {campaign.target_languages && campaign.target_languages.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        <span>{campaign.target_languages.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {campaign.brand_profiles && (
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag className="w-4 h-4 mr-2" />
                        <span>브랜드: {campaign.brand_profiles.company_name}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 빈 상태 */}
          {!loading && !error && campaigns.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">캠페인이 없습니다</h3>
              <p className="text-gray-600">샘플 데이터를 확인하거나 새 캠페인을 생성해보세요.</p>
            </div>
          )}

          {/* 디버그 정보 */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">디버그 정보</h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify({
                totalCampaigns: campaigns.length,
                hasSampleData: campaigns.length > 0,
                hasBrandProfiles: campaigns.some(c => c.brand_profiles),
                networkStatus: testResults.networkStatus,
                error: error
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}


