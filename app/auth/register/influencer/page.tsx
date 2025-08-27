'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ProfileService } from '../../../../lib/services/profileService'
import { 
  User, 
  Mail, 
  Lock, 
  Instagram, 
  Youtube, 
  Twitter, 
  Facebook,
  Plus,
  X,
  Save,
  Camera
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const categories = [
  '뷰티', '패션', '푸드', '여행', '테크', '게임', '라이프스타일', '교육', '비즈니스', '엔터테인먼트'
]

const languages = ['한국어', '영어', '일본어', '중국어', '아랍어', '스페인어', '프랑스어', '독일어']

const regions = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']

export default function InfluencerRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // 기본 정보
    email: '',
    password: '',
    confirmPassword: '',
    
    // 사용자 프로필
    displayName: '',
    bio: '',
    phone: '',
    website: '',
    languages: [] as string[],
    timezone: 'Asia/Seoul',
    location: '',
    
    // 인플루언서 프로필
    contentCategories: [] as string[],
    targetAudience: '',
    collaborationHistory: '',
    preferredBrands: [] as string[],
    availability: '',
    rateCard: {
      instagram: { price: '', followers: '' },
      youtube: { price: '', subscribers: '' },
      tiktok: { price: '', followers: '' },
      blog: { price: '', monthlyViews: '' }
    },
    
    // 소셜 미디어 계정
    socialAccounts: [] as Array<{
      platform: string
      username: string
      followers: number
      engagement_rate: number
      avg_views?: number
      url: string
    }>
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleArrayInputChange = (field: string, value: string, action: 'add' | 'remove') => {
    setFormData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }))
  }

  const handleSocialAccountChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      socialAccounts: prev.socialAccounts.map((account, i) => 
        i === index ? { ...account, [field]: value } : account
      )
    }))
  }

  const addSocialAccount = () => {
    setFormData(prev => ({
      ...prev,
      socialAccounts: [...prev.socialAccounts, {
        platform: '',
        username: '',
        followers: 0,
        engagement_rate: 0,
        avg_views: 0,
        url: ''
      }]
    }))
  }

  const removeSocialAccount = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialAccounts: prev.socialAccounts.filter((_, i) => i !== index)
    }))
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.email) newErrors.email = '이메일을 입력해주세요'
      if (!formData.password) newErrors.password = '비밀번호를 입력해주세요'
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
      }
      if (formData.password.length < 6) {
        newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다'
      }
    }

    if (currentStep === 2) {
      if (!formData.displayName) newErrors.displayName = '닉네임을 입력해주세요'
      if (!formData.bio) newErrors.bio = '자기소개를 입력해주세요'
      if (formData.languages.length === 0) newErrors.languages = '언어를 선택해주세요'
    }

    if (currentStep === 3) {
      if (formData.contentCategories.length === 0) {
        newErrors.contentCategories = '콘텐츠 카테고리를 선택해주세요'
      }
      if (!formData.targetAudience) newErrors.targetAudience = '타겟 오디언스를 입력해주세요'
    }

    if (currentStep === 4) {
      if (formData.socialAccounts.length === 0) {
        newErrors.socialAccounts = '최소 하나의 소셜 미디어 계정을 추가해주세요'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return

    setLoading(true)
    try {
      // 1. 사용자 계정 생성
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_type: 'influencer',
            display_name: formData.displayName
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. 사용자 프로필 생성
        const userProfileResponse = await ProfileService.createUserProfile({
          user_id: authData.user.id,
          user_type: 'influencer',
          display_name: formData.displayName,
          bio: formData.bio,
          phone: formData.phone,
          website: formData.website,
          languages: formData.languages,
          timezone: formData.timezone,
          location: formData.location
        })

        if (!userProfileResponse.data) {
          throw new Error('사용자 프로필 생성에 실패했습니다.')
        }

        // 3. 인플루언서 프로필 생성
        const influencerProfile = await ProfileService.createInfluencerProfile({
          user_profile_id: userProfileResponse.data.id,
          content_categories: formData.contentCategories,
          target_audience: formData.targetAudience,
          collaboration_history: formData.collaborationHistory,
          preferred_brands: formData.preferredBrands,
          availability: formData.availability,
          rate_card: formData.rateCard
        })

        // 4. 소셜 미디어 계정 추가
        for (const account of formData.socialAccounts) {
          await ProfileService.addSocialAccount({
            user_profile_id: userProfileResponse.data.id,
            platform: account.platform,
            username: account.username,
            followers: account.followers,
            engagement_rate: account.engagement_rate,
            avg_views: account.avg_views,
            url: account.url
          })
        }

        alert('인플루언서 등록이 완료되었습니다!')
        router.push('/dashboard/influencers')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>계정 정보</span>
            <span>기본 프로필</span>
            <span>인플루언서 정보</span>
            <span>소셜 미디어</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">인플루언서 등록</h1>
            <p className="text-gray-600">ME-IN 플랫폼에서 브랜드와 협업하세요</p>
          </div>

          {/* Step 1: 계정 정보 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">계정 정보</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="최소 6자 이상"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="비밀번호 재입력"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          {/* Step 2: 기본 프로필 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">기본 프로필</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임 *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="닉네임을 입력하세요"
                  />
                </div>
                {errors.displayName && <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  자기소개 *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="자신을 소개해주세요..."
                />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연락처
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="010-1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    웹사이트
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사용 언어 *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {languages.map((language) => (
                    <label key={language} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(language)}
                        onChange={(e) => handleArrayInputChange('languages', language, e.target.checked ? 'add' : 'remove')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{language}</span>
                    </label>
                  ))}
                </div>
                {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  활동 지역
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">지역을 선택하세요</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: 인플루언서 정보 */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">인플루언서 정보</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  콘텐츠 카테고리 *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.contentCategories.includes(category)}
                        onChange={(e) => handleArrayInputChange('contentCategories', category, e.target.checked ? 'add' : 'remove')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
                {errors.contentCategories && <p className="text-red-500 text-sm mt-1">{errors.contentCategories}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  타겟 오디언스 *
                </label>
                <textarea
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="주요 팔로워층을 설명해주세요 (예: 20-30대 여성, 뷰티에 관심 있는 직장인)"
                />
                {errors.targetAudience && <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  협업 이력
                </label>
                <textarea
                  value={formData.collaborationHistory}
                  onChange={(e) => handleInputChange('collaborationHistory', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="이전 브랜드 협업 경험을 간단히 설명해주세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  선호 브랜드
                </label>
                <input
                  type="text"
                  value={formData.preferredBrands.join(', ')}
                  onChange={(e) => handleInputChange('preferredBrands', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="협업하고 싶은 브랜드명을 쉼표로 구분하여 입력"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  협업 가능 시간
                </label>
                <textarea
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="협업 가능한 시간대나 요일을 알려주세요"
                />
              </div>
            </div>
          )}

          {/* Step 4: 소셜 미디어 계정 */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">소셜 미디어 계정</h2>
                <button
                  type="button"
                  onClick={addSocialAccount}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>계정 추가</span>
                </button>
              </div>

              {formData.socialAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <Instagram className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">소셜 미디어 계정을 추가해주세요</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.socialAccounts.map((account, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">계정 {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeSocialAccount(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            플랫폼
                          </label>
                          <select
                            value={account.platform}
                            onChange={(e) => handleSocialAccountChange(index, 'platform', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="">플랫폼 선택</option>
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                            <option value="blog">Blog</option>
                            <option value="twitter">Twitter</option>
                            <option value="facebook">Facebook</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            사용자명
                          </label>
                          <input
                            type="text"
                            value={account.username}
                            onChange={(e) => handleSocialAccountChange(index, 'username', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="@username"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            팔로워 수
                          </label>
                          <input
                            type="number"
                            value={account.followers}
                            onChange={(e) => handleSocialAccountChange(index, 'followers', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="10000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            평균 조회수
                          </label>
                          <input
                            type="number"
                            value={account.avg_views || 0}
                            onChange={(e) => handleSocialAccountChange(index, 'avg_views', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="5000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            평균 참여율 (%)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={account.engagement_rate}
                            onChange={(e) => handleSocialAccountChange(index, 'engagement_rate', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="3.5"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            계정 URL
                          </label>
                          <input
                            type="url"
                            value={account.url}
                            onChange={(e) => handleSocialAccountChange(index, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="https://instagram.com/username"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.socialAccounts && <p className="text-red-500 text-sm">{errors.socialAccounts}</p>}
            </div>
          )}

          {/* 네비게이션 버튼 */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>

            <div className="flex space-x-4">
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  다음
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>처리 중...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>등록 완료</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
