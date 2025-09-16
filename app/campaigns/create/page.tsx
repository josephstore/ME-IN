'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CampaignService } from '@/lib/services/databaseService'
import { StorageService } from '@/lib/services/storageService'
import { CreateCampaignRequest } from '@/lib/types/database'
import { useSimpleAuth } from '@/lib/SimpleAuthContext'
import { simpleAuth } from '@/lib/simpleAuth'
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
    media_files: [] as File[],
    media_assets: [] as string[]
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const uploadedUrls: string[] = []
    
    for (const file of files) {
      try {
        const uploadedUrl = await StorageService.uploadCampaignImage(file)
        if (uploadedUrl) {
          uploadedUrls.push(uploadedUrl)
        } else {
          console.error('File upload failed:', file.name)
        }
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }
    
    setTempData(prev => ({
      ...prev,
      media_files: [...prev.media_files, ...files],
      media_assets: [...prev.media_assets, ...uploadedUrls]
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

      // Supabase Storage를 사용한 파일 업로드 처리
      const uploadedUrls: string[] = []
      if (tempData.media_files.length > 0) {
        for (const file of tempData.media_files) {
          try {
            const uploadedUrl = await StorageService.uploadCampaignImage(file)
            if (uploadedUrl) {
              uploadedUrls.push(uploadedUrl)
              console.log('파일 업로드 성공:', file.name, '->', uploadedUrl)
            } else {
              console.error('파일 업로드 실패:', file.name)
            }
          } catch (error) {
            console.error('파일 업로드 중 오류:', error)
            // 파일 업로드 실패해도 캠페인 생성은 계속 진행
          }
        }
      }

      const campaignData = {
        ...formData,
        media_assets: uploadedUrls
      }

      // Supabase에 캠페인 생성 (실제 사용자 ID 사용)
      const currentUser = simpleAuth.getCurrentUser()
      const userId = currentUser?.id || 'demo-user'
      const response = await CampaignService.createCampaign(userId, campaignData)
      
      if (response && response.success && response.data) {
        alert('캠페인이 성공적으로 생성되었습니다!')
        // 홈화면으로 이동하여 생성된 캠페인 확인 가능
        router.push('/?campaign_created=true')
      } else {
        const errorMessage = response?.error || '알 수 없는 오류가 발생했습니다.'
        alert(`캠페인 생성 실패: ${errorMessage}`)
      }
      
    } catch (error) {
      console.error('캠페인 생성 오류:', error)
      alert('캠페인 생성 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.')
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
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">뒤로</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  새 캠페인 생성 / إنشاء حملة جديدة
                </h1>
                <p className="text-sm sm:text-base text-gray-600 break-words">
                  브랜드와 인플루언서를 연결하는 캠페인을 만들어보세요 / أنشئ حملة تربط بين العلامات التجارية والمؤثرين
                </p>
              </div>
            </div>
            <Button
              onClick={saveCampaign}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 w-full sm:w-auto"
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
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="break-words">기본 정보 / المعلومات الأساسية</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    캠페인 제목 (한국어) * / عنوان الحملة (الكورية) *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="예: 우리 브랜드의 새로운 제품을 소개해주세요"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                      캠페인 제목 (영어) / Campaign Title (English)
                    </label>
                    <input
                      type="text"
                      value={formData.title_en}
                      onChange={(e) => handleInputChange('title_en', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Campaign title in English"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                      캠페인 제목 (아랍어) / عنوان الحملة (العربية)
                    </label>
                    <input
                      type="text"
                      value={formData.title_ar}
                      onChange={(e) => handleInputChange('title_ar', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="عنوان الحملة بالعربية"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    카테고리 * / الفئة *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="">카테고리를 선택하세요 / اختر الفئة</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    캠페인 설명 (한국어) * / وصف الحملة (الكورية) *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-y"
                    placeholder="캠페인의 목적, 요구사항, 기대효과 등을 자세히 설명해주세요"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                      캠페인 설명 (영어) / Campaign Description (English)
                    </label>
                    <textarea
                      value={formData.description_en}
                      onChange={(e) => handleInputChange('description_en', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-y"
                      placeholder="Campaign description in English"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                      캠페인 설명 (아랍어) / وصف الحملة (العربية)
                    </label>
                    <textarea
                      value={formData.description_ar}
                      onChange={(e) => handleInputChange('description_ar', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-y"
                      placeholder="وصف الحملة بالعربية"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 예산 및 기간 */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="break-words">예산 및 기간 / الميزانية والفترة</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    최소 예산 * / الحد الأدنى للميزانية *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="absolute left-3 top-2 text-gray-500 bg-transparent border-none focus:outline-none text-sm sm:text-base"
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
                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    최대 예산 * / الحد الأقصى للميزانية *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="absolute left-3 top-2 text-gray-500 bg-transparent border-none focus:outline-none text-sm sm:text-base"
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
                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    시작일 / تاريخ البداية
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    종료일 / تاريخ النهاية
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    신청 마감일 / موعد انتهاء التقديم
                  </label>
                  <input
                    type="date"
                    value={formData.application_deadline}
                    onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    최대 신청자 수 / الحد الأقصى للمتقدمين
                  </label>
                  <input
                    type="number"
                    value={formData.max_applications}
                    onChange={(e) => handleInputChange('max_applications', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="0 (제한 없음 / لا يوجد حد)"
                  />
                </div>
              </div>
            </div>

            {/* 타겟 설정 */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="break-words">타겟 설정 / إعدادات الهدف</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    최소 팔로워 수 / الحد الأدنى للمتابعين
                  </label>
                  <input
                    type="number"
                    value={formData.min_followers}
                    onChange={(e) => handleInputChange('min_followers', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    타겟 언어 (쉼표로 구분) / اللغات المستهدفة (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={tempData.target_languages_text}
                    onChange={(e) => {
                      setTempData(prev => ({ ...prev, target_languages_text: e.target.value }))
                      handleArrayInputChange('target_languages', e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="한국어, 영어, 아랍어 / الكورية، الإنجليزية، العربية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    타겟 지역 (쉼표로 구분) / المناطق المستهدفة (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={tempData.target_regions_text}
                    onChange={(e) => {
                      setTempData(prev => ({ ...prev, target_regions_text: e.target.value }))
                      handleArrayInputChange('target_regions', e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="한국, 미국, 중동 / كوريا، أمريكا، الشرق الأوسط"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    콘텐츠 요구사항 / متطلبات المحتوى
                  </label>
                  <textarea
                    value={formData.content_requirements}
                    onChange={(e) => handleInputChange('content_requirements', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-y"
                    placeholder="인플루언서가 준수해야 할 콘텐츠 가이드라인을 작성해주세요 / اكتب الإرشادات التي يجب على المؤثر اتباعها"
                  />
                </div>
              </div>
            </div>

            {/* 미디어 자산 */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="break-words">미디어 자산 / الأصول الإعلامية</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                    이미지/비디오 업로드 / رفع الصور/الفيديو
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                      클릭하여 파일을 선택하거나 여기로 드래그하세요 / انقر لاختيار الملفات أو اسحبها هنا
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
                      className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer text-sm sm:text-base"
                    >
                      파일 선택 / اختيار الملفات
                    </label>
                  </div>
                </div>

                {tempData.media_files.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 break-words">업로드된 파일 / الملفات المرفوعة</h3>
                    <div className="space-y-2">
                      {tempData.media_files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-xs sm:text-sm text-gray-600 truncate flex-1 mr-2">{file.name}</span>
                          <Button
                            onClick={() => removeFile(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 flex-shrink-0"
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
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 break-words">캠페인 미리보기 / معاينة الحملة</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 break-words">제목 / العنوان</p>
                  <p className="text-sm text-gray-900 break-words">{formData.title || '제목을 입력하세요 / أدخل العنوان'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 break-words">카테고리 / الفئة</p>
                  <p className="text-sm text-gray-900 break-words">{formData.category || '카테고리를 선택하세요 / اختر الفئة'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 break-words">예산 / الميزانية</p>
                  <p className="text-sm text-gray-900 break-words">
                    {formData.budget_min && formData.budget_max 
                      ? `${formData.currency} ${formData.budget_min.toLocaleString()} - ${formData.budget_max.toLocaleString()}`
                      : '예산을 입력하세요 / أدخل الميزانية'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 break-words">최소 팔로워 / الحد الأدنى للمتابعين</p>
                  <p className="text-sm text-gray-900 break-words">
                    {formData.min_followers ? `${formData.min_followers.toLocaleString()}명` : '제한 없음 / لا يوجد حد'}
                  </p>
                </div>
              </div>
            </div>

            {/* 도움말 */}
            <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 break-words">캠페인 작성 팁 / نصائح لكتابة الحملة</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <p className="font-medium break-words">• 명확한 목표 설정 / تحديد أهداف واضحة</p>
                  <p className="break-words">캠페인의 목적과 기대효과를 구체적으로 명시하세요. / حدد بوضوح الغرض والنتائج المتوقعة للحملة.</p>
                </div>
                <div>
                  <p className="font-medium break-words">• 적절한 예산 책정 / وضع ميزانية مناسبة</p>
                  <p className="break-words">인플루언서의 영향력과 작업량을 고려하여 현실적인 예산을 설정하세요. / ضع ميزانية واقعية مع مراعاة تأثير المؤثر وحجم العمل.</p>
                </div>
                <div>
                  <p className="font-medium break-words">• 상세한 가이드라인 / إرشادات مفصلة</p>
                  <p className="break-words">브랜드 톤앤매너와 콘텐츠 요구사항을 명확히 전달하세요. / اشرح بوضوح نبرة العلامة التجارية ومتطلبات المحتوى.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
