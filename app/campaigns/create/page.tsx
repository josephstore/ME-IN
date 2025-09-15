'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CampaignService, ProfileService, supabase } from '@/lib/services/databaseService'
import { CreateCampaignRequest } from '@/lib/types/database'
import { useSimpleAuth } from '@/lib/SimpleAuthContext'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Calendar, 
  DollarSign, 
  Users, 
  Globe, 
  Tag,
  FileText,
  Image as ImageIcon
} from 'lucide-react'

export default function CreateCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { user, isAuthenticated } = useSimpleAuth()
  const [hasBrandProfile, setHasBrandProfile] = useState(false)

  // 폼 데이터
  const [formData, setFormData] = useState<CreateCampaignRequest>({
    title: '',
    title_en: '',
    title_ar: '',
    description: '',
    description_en: '',
    description_ar: '',
    category: '',
    budget_min: 0,
    budget_max: 0,
    currency: 'USD',
    target_languages: [],
    target_regions: [],
    min_followers: 0,
    content_requirements: '',
    start_date: '',
    end_date: '',
    application_deadline: '',
    max_applications: 0,
    media_assets: []
  })

  // 임시 데이터
  const [tempData, setTempData] = useState({
    target_languages_text: '',
    target_regions_text: '',
    media_files: [] as File[]
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/campaigns/create')
      return
    }
    
    if (user?.user_type !== 'brand') {
      router.push('/?message=브랜드 계정으로 로그인해주세요.')
      return
    }
    
    setHasBrandProfile(true) // 간단한 인증에서는 항상 브랜드 프로필이 있다고 가정
  }

  const handleInputChange = (field: keyof CreateCampaignRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayInputChange = (field: 'target_languages' | 'target_regions', textValue: string) => {
    const array = textValue.split(',').map(item => item.trim()).filter(item => item)
    handleInputChange(field, array)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setTempData(prev => ({
      ...prev,
      media_files: [...prev.media_files, ...files]
    }))
  }

  const removeFile = (index: number) => {
    setTempData(prev => ({
      ...prev,
      media_files: prev.media_files.filter((_, i) => i !== index)
    }))
  }

  const saveCampaign = async () => {
    try {
      setSaving(true)

      // 필수 필드 검증
      if (!formData.title || !formData.description || !formData.category) {
        alert('필수 필드를 모두 입력해주세요.')
        return
      }

      if (formData.budget_min <= 0 || formData.budget_max <= 0) {
        alert('예산을 올바르게 입력해주세요.')
        return
      }

      if (formData.budget_min > formData.budget_max) {
        alert('최소 예산은 최대 예산보다 클 수 없습니다.')
        return
      }

      // 파일 업로드 처리
      const uploadedUrls: string[] = []
      for (const file of tempData.media_files) {
        try {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `campaigns/${fileName}`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('campaign-images')
            .upload(filePath, file)

          if (uploadError) {
            console.error('파일 업로드 오류:', uploadError)
            continue
          }

          const { data: { publicUrl } } = supabase.storage
            .from('campaign-images')
            .getPublicUrl(filePath)

          uploadedUrls.push(publicUrl)
        } catch (error) {
          console.error('파일 업로드 중 오류:', error)
        }
      }

      const campaignData = {
        ...formData,
        media_assets: uploadedUrls
      }

      const response = await CampaignService.createCampaign('demo-user', campaignData)
      
      if (response.success && response.data) {
        alert('캠페인이 성공적으로 생성되었습니다!')
        router.push(`/campaigns/${response.data.id}`)
      } else {
        alert(`캠페인 생성 실패: ${response.error}`)
      }
      
    } catch (error) {
      console.error('캠페인 생성 오류:', error)
      alert('캠페인 생성 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const categories = [
    '뷰티/화장품',
    '패션/의류',
    '음식/레스토랑',
    '여행/호텔',
    '테크/전자제품',
    '건강/운동',
    '교육/온라인강의',
    '게임/엔터테인먼트',
    '라이프스타일',
    '기타'
  ]

  const currencies = [
    { code: 'USD', symbol: '$', name: '미국 달러' },
    { code: 'KRW', symbol: '₩', name: '한국 원' },
    { code: 'EUR', symbol: '€', name: '유로' },
    { code: 'JPY', symbol: '¥', name: '일본 엔' },
    { code: 'CNY', symbol: '¥', name: '중국 위안' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!hasBrandProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">브랜드 프로필을 먼저 생성해주세요.</p>
          <Button
            onClick={() => router.push('/profile')}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            프로필로 이동
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-2xl font-bold text-gray-900">새 캠페인 생성</h1>
                <p className="text-gray-600">브랜드와 인플루언서를 연결하는 캠페인을 만들어보세요</p>
              </div>
            </div>
            <Button
              onClick={saveCampaign}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? '저장 중...' : '캠페인 생성'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 폼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                기본 정보
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    캠페인 제목 (한국어) *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 우리 브랜드의 새로운 제품을 소개해주세요"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      캠페인 제목 (영어)
                    </label>
                    <input
                      type="text"
                      value={formData.title_en}
                      onChange={(e) => handleInputChange('title_en', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Campaign title in English"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      캠페인 제목 (아랍어)
                    </label>
                    <input
                      type="text"
                      value={formData.title_ar}
                      onChange={(e) => handleInputChange('title_ar', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="عنوان الحملة بالعربية"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리 *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">카테고리를 선택하세요</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    캠페인 설명 (한국어) *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="캠페인의 목적, 요구사항, 기대효과 등을 자세히 설명해주세요"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      캠페인 설명 (영어)
                    </label>
                    <textarea
                      value={formData.description_en}
                      onChange={(e) => handleInputChange('description_en', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Campaign description in English"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      캠페인 설명 (아랍어)
                    </label>
                    <textarea
                      value={formData.description_ar}
                      onChange={(e) => handleInputChange('description_ar', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="وصف الحملة بالعربية"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 예산 및 기간 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                예산 및 기간
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    최소 예산 *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="absolute left-3 top-2 text-gray-500 bg-transparent border-none focus:outline-none"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={formData.budget_min}
                      onChange={(e) => handleInputChange('budget_min', parseInt(e.target.value))}
                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    최대 예산 *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="absolute left-3 top-2 text-gray-500 bg-transparent border-none focus:outline-none"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={formData.budget_max}
                      onChange={(e) => handleInputChange('budget_max', parseInt(e.target.value))}
                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    시작일
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    종료일
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    신청 마감일
                  </label>
                  <input
                    type="date"
                    value={formData.application_deadline}
                    onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    최대 신청자 수
                  </label>
                  <input
                    type="number"
                    value={formData.max_applications}
                    onChange={(e) => handleInputChange('max_applications', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0 (제한 없음)"
                  />
                </div>
              </div>
            </div>

            {/* 타겟 설정 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                타겟 설정
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    최소 팔로워 수
                  </label>
                  <input
                    type="number"
                    value={formData.min_followers}
                    onChange={(e) => handleInputChange('min_followers', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    타겟 언어 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={tempData.target_languages_text}
                    onChange={(e) => {
                      setTempData(prev => ({ ...prev, target_languages_text: e.target.value }))
                      handleArrayInputChange('target_languages', e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="한국어, 영어, 아랍어"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    타겟 지역 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={tempData.target_regions_text}
                    onChange={(e) => {
                      setTempData(prev => ({ ...prev, target_regions_text: e.target.value }))
                      handleArrayInputChange('target_regions', e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="한국, 미국, 중동"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    콘텐츠 요구사항
                  </label>
                  <textarea
                    value={formData.content_requirements}
                    onChange={(e) => handleInputChange('content_requirements', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="인플루언서가 준수해야 할 콘텐츠 가이드라인을 작성해주세요"
                  />
                </div>
              </div>
            </div>

            {/* 미디어 자산 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                미디어 자산
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이미지/비디오 업로드
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      클릭하여 파일을 선택하거나 여기로 드래그하세요
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="media-upload"
                    />
                    <label
                      htmlFor="media-upload"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                      파일 선택
                    </label>
                  </div>
                </div>

                {tempData.media_files.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">업로드된 파일</h3>
                    <div className="space-y-2">
                      {tempData.media_files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <Button
                            onClick={() => removeFile(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            삭제
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 미리보기 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">캠페인 미리보기</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">제목</p>
                  <p className="text-sm text-gray-900">{formData.title || '제목을 입력하세요'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">카테고리</p>
                  <p className="text-sm text-gray-900">{formData.category || '카테고리를 선택하세요'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">예산</p>
                  <p className="text-sm text-gray-900">
                    {formData.budget_min && formData.budget_max 
                      ? `${formData.currency} ${formData.budget_min.toLocaleString()} - ${formData.budget_max.toLocaleString()}`
                      : '예산을 입력하세요'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">최소 팔로워</p>
                  <p className="text-sm text-gray-900">
                    {formData.min_followers ? `${formData.min_followers.toLocaleString()}명` : '제한 없음'}
                  </p>
                </div>
              </div>
            </div>

            {/* 도움말 */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">캠페인 작성 팁</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <p className="font-medium">• 명확한 목표 설정</p>
                  <p>캠페인의 목적과 기대효과를 구체적으로 명시하세요.</p>
                </div>
                <div>
                  <p className="font-medium">• 적절한 예산 책정</p>
                  <p>인플루언서의 영향력과 작업량을 고려하여 현실적인 예산을 설정하세요.</p>
                </div>
                <div>
                  <p className="font-medium">• 상세한 가이드라인</p>
                  <p>브랜드 톤앤매너와 콘텐츠 요구사항을 명확히 전달하세요.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
