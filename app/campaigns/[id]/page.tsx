'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CampaignService } from '@/lib/services/campaignService'
import { ApplicationService } from '@/lib/services/applicationService'
import { ProfileService } from '@/lib/services/profileService'
import { Campaign, Application, CreateApplicationRequest } from '@/lib/types/database'
import { useSimpleAuth } from '@/lib/SimpleAuthContext'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Users, 
  DollarSign, 
  Calendar, 
  Globe, 
  Tag,
  Send,
  Check,
  X,
  Star,
  Eye,
  Clock,
  MapPin,
  MessageCircle
} from 'lucide-react'

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const { user, isAuthenticated } = useSimpleAuth()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [matchScore, setMatchScore] = useState<number>(0)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  // 신청 폼 데이터
  const [applicationData, setApplicationData] = useState<CreateApplicationRequest>({
    campaign_id: campaignId,
    proposal: '',
    proposed_budget: 0,
    proposed_timeline: '',
    portfolio_links: []
  })

  useEffect(() => {
    if (campaignId) {
      loadCampaign()
      checkUser()
    }
  }, [campaignId])

  const checkUser = async () => {
    if (!isAuthenticated) {
      return
    }
    
    // 간단한 프로필 설정
    const profile = {
      userProfile: {
        user_type: user?.user_type,
        display_name: user?.name
      },
      brandProfile: user?.user_type === 'brand' ? {
        id: user?.id,
        company_name: `${user?.name} Company`
      } : null,
      influencerProfile: user?.user_type === 'influencer' ? {
        id: user?.id,
        display_name: user?.name
      } : null
    }
    
    setUserProfile(profile)
    setMatchScore(85) // 데모 매칭 점수
  }

  const loadCampaign = async () => {
    try {
      setLoading(true)
      const response = await CampaignService.getCampaign(campaignId)
      
      if (response.success && response.data) {
        setCampaign(response.data)
        
        // 브랜드인 경우 신청 목록 로드
        if (userProfile?.userProfile?.user_type === 'brand') {
          const applicationsResponse = await ApplicationService.getCampaignApplications(campaignId)
          if (applicationsResponse.success) {
            setApplications(applicationsResponse.data || [])
          }
        }
        
        // 인플루언서인 경우 이미 신청했는지 확인
        if (userProfile?.userProfile?.user_type === 'influencer') {
          const myApplicationsResponse = await ApplicationService.getMyApplications()
          if (myApplicationsResponse.success) {
            const hasAppliedToThis = myApplicationsResponse.data?.some(
              app => app.campaign_id === campaignId
            )
            setHasApplied(hasAppliedToThis || false)
          }
        }
      }
    } catch (error) {
      console.error('캠페인 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationSubmit = async () => {
    try {
      setSubmitting(true)
      
      if (!applicationData.proposal?.trim()) {
        alert('제안서를 작성해주세요.')
        return
      }

      const response = await ApplicationService.createApplication(applicationData)
      
      if (response.success) {
        alert('신청이 성공적으로 제출되었습니다!')
        setShowApplicationForm(false)
        setHasApplied(true)
        setApplicationData({
          campaign_id: campaignId,
          proposal: '',
          proposed_budget: 0,
          proposed_timeline: '',
          portfolio_links: []
        })
      } else {
        alert(`신청 실패: ${response.error}`)
      }
    } catch (error) {
      console.error('신청 제출 오류:', error)
      alert('신청 제출 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickApply = async () => {
    try {
      setSubmitting(true)
      const response = await ApplicationService.createRecommendedApplication(campaignId)
      
      if (response.success) {
        alert('신청이 성공적으로 제출되었습니다!')
        setHasApplied(true)
      } else {
        alert(`신청 실패: ${response.error}`)
      }
    } catch (error) {
      console.error('빠른 신청 오류:', error)
      alert('신청 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleApplicationStatusUpdate = async (applicationId: string, status: string, feedback?: string) => {
    try {
      const response = await ApplicationService.updateApplicationStatus(applicationId, status as any, feedback)
      
      if (response.success) {
        alert('신청 상태가 업데이트되었습니다.')
        loadCampaign() // 페이지 새로고침
      } else {
        alert(`상태 업데이트 실패: ${response.error}`)
      }
    } catch (error) {
      console.error('상태 업데이트 오류:', error)
      alert('상태 업데이트 중 오류가 발생했습니다.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'withdrawn': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '검토 대기'
      case 'reviewed': return '검토 완료'
      case 'approved': return '승인됨'
      case 'rejected': return '거절됨'
      case 'withdrawn': return '철회됨'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">캠페인을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">캠페인을 찾을 수 없습니다.</p>
          <Button
            onClick={() => router.back()}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            뒤로 가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                뒤로
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
                <p className="text-gray-600">
                  {campaign.brand_profiles?.user_profiles?.display_name || '브랜드'} • {campaign.category}
                </p>
              </div>
            </div>
            
            {/* 매칭 점수 표시 (인플루언서인 경우) */}
            {userProfile?.userProfile?.user_type === 'influencer' && matchScore > 0 && (
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  매칭 점수: {matchScore}점
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 캠페인 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">캠페인 정보</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">설명</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{campaign.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">예산</p>
                      <p className="text-gray-900">
                        {campaign.currency} {campaign.budget_min.toLocaleString()} - {campaign.budget_max.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">최소 팔로워</p>
                      <p className="text-gray-900">{campaign.min_followers.toLocaleString()}명</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">기간</p>
                      <p className="text-gray-900">
                        {campaign.start_date && campaign.end_date 
                          ? `${campaign.start_date} ~ ${campaign.end_date}`
                          : '미정'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">타겟 언어</p>
                      <p className="text-gray-900">
                        {campaign.target_languages?.length 
                          ? campaign.target_languages.join(', ')
                          : '제한 없음'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {campaign.content_requirements && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">콘텐츠 요구사항</h3>
                    <p className="text-gray-900 whitespace-pre-wrap">{campaign.content_requirements}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 신청 섹션 (인플루언서용) */}
            {userProfile?.userProfile?.user_type === 'influencer' && !hasApplied && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">캠페인 신청</h2>
                
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleQuickApply}
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {submitting ? '신청 중...' : '빠른 신청'}
                    </Button>
                    
                    <Button
                      onClick={() => setShowApplicationForm(true)}
                      variant="outline"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      상세 신청
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    빠른 신청을 사용하면 자동으로 제안서가 생성됩니다.
                  </p>
                </div>
              </div>
            )}

            {/* 신청 폼 */}
            {showApplicationForm && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">상세 신청</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      제안서 *
                    </label>
                    <textarea
                      value={applicationData.proposal}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, proposal: e.target.value }))}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="캠페인에 대한 제안과 계획을 자세히 작성해주세요..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        제안 예산
                      </label>
                      <input
                        type="number"
                        value={applicationData.proposed_budget}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, proposed_budget: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        예상 소요 기간
                      </label>
                      <input
                        type="text"
                        value={applicationData.proposed_timeline}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, proposed_timeline: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 2-3주"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={handleApplicationSubmit}
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {submitting ? '제출 중...' : '신청 제출'}
                    </Button>
                    
                    <Button
                      onClick={() => setShowApplicationForm(false)}
                      variant="outline"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 신청 완료 메시지 */}
            {hasApplied && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-medium">신청이 완료되었습니다!</p>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  브랜드의 검토 결과를 기다려주세요. 결과는 알림으로 받으실 수 있습니다.
                </p>
              </div>
            )}

            {/* 신청 목록 (브랜드용) */}
            {userProfile?.userProfile?.user_type === 'brand' && applications.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  신청 목록 ({applications.length}건)
                </h2>
                
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {application.influencer_profiles?.user_profiles?.display_name || '인플루언서'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {application.influencer_profiles?.total_followers?.toLocaleString()}명 팔로워
                            </p>
                          </div>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>

                      {application.proposal && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                            {application.proposal}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {application.proposed_budget && (
                            <span>예산: {application.proposed_budget.toLocaleString()}</span>
                          )}
                          {application.proposed_timeline && (
                            <span>기간: {application.proposed_timeline}</span>
                          )}
                        </div>

                        {application.status === 'approved' && (
                          <div className="flex items-center space-x-1 text-sm text-green-600">
                            <Check className="w-4 h-4" />
                            <span>자동 승인됨</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 브랜드 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">브랜드 정보</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {campaign.brand_profiles?.user_profiles?.display_name || '브랜드'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {campaign.brand_profiles?.company_name}
                    </p>
                  </div>
                </div>
                
                {campaign.brand_profiles?.industry && (
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{campaign.brand_profiles.industry}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 캠페인 통계 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">캠페인 통계</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">신청자 수</span>
                  <span className="font-medium text-gray-900">{applications.length}명</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">상태</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {getStatusText(campaign.status)}
                  </span>
                </div>
                {campaign.application_deadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">신청 마감</span>
                    <span className="font-medium text-gray-900">{campaign.application_deadline}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 매칭 정보 (인플루언서용) */}
            {userProfile?.userProfile?.user_type === 'influencer' && matchScore > 0 && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">매칭 정보</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">매칭 점수</span>
                    <span className="font-bold text-blue-900 text-lg">{matchScore}점</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${matchScore}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-600">
                    {matchScore >= 80 ? '매우 높은 매칭도' :
                     matchScore >= 60 ? '높은 매칭도' :
                     matchScore >= 40 ? '보통 매칭도' : '낮은 매칭도'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
