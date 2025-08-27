'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileService } from '@/lib/services/profileService'
import { 
  UserProfile, 
  BrandProfile, 
  InfluencerProfile, 
  SocialAccount,
  CreateUserProfileRequest,
  CreateBrandProfileRequest,
  CreateInfluencerProfileRequest,
  CreateSocialAccountRequest
} from '@/lib/types/database'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { 
  User, 
  Building2, 
  Instagram, 
  Youtube, 
  Twitter, 
  Globe, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // 프로필 데이터
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null)
  const [influencerProfile, setInfluencerProfile] = useState<InfluencerProfile | null>(null)
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([])

  // 폼 데이터
  const [formData, setFormData] = useState({
    user: {
      display_name: '',
      bio: '',
      phone: '',
      website: '',
      location: '',
      languages: [] as string[]
    },
    brand: {
      company_name: '',
      company_name_en: '',
      company_name_ar: '',
      business_number: '',
      industry: '',
      company_size: '',
      target_markets: [] as string[],
      budget_min: 0,
      budget_max: 0,
      currency: 'USD',
      company_description: ''
    },
    influencer: {
      total_followers: 0,
      avg_engagement_rate: 0,
      content_categories: [] as string[],
              collaboration_history: '',
      rating: 0,
      hourly_rate: 0,
      currency: 'USD',
      portfolio_url: ''
    }
  })

  // 소셜 계정 추가
  const [newSocialAccount, setNewSocialAccount] = useState({
    platform: '',
    username: '',
    followers: 0,
    avg_views: 0,
    avg_likes: 0,
    avg_comments: 0,
    profile_url: ''
  })

  useEffect(() => {
    checkUser()
    loadProfile()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
  }

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await ProfileService.getCompleteProfile()
      
      if (response.success && response.data) {
        const { userProfile, brandProfile, influencerProfile, socialAccounts } = response.data
        
        setUserProfile(userProfile)
        setBrandProfile(brandProfile || null)
        setInfluencerProfile(influencerProfile || null)
        setSocialAccounts(socialAccounts || [])

        // 폼 데이터 설정
        setFormData({
          user: {
            display_name: userProfile.display_name || '',
            bio: userProfile.bio || '',
            phone: userProfile.phone || '',
            website: userProfile.website || '',
            location: userProfile.location || '',
            languages: userProfile.languages || []
          },
          brand: {
            company_name: brandProfile?.company_name || '',
            company_name_en: brandProfile?.company_name_en || '',
            company_name_ar: brandProfile?.company_name_ar || '',
            business_number: brandProfile?.business_number || '',
            industry: brandProfile?.industry || '',
            company_size: brandProfile?.company_size || '',
            target_markets: brandProfile?.target_markets || [],
            budget_min: brandProfile?.budget_min || 0,
            budget_max: brandProfile?.budget_max || 0,
            currency: brandProfile?.currency || 'USD',
            company_description: brandProfile?.company_description || ''
          },
          influencer: {
            total_followers: influencerProfile?.total_followers || 0,
            avg_engagement_rate: influencerProfile?.avg_engagement_rate || 0,
            content_categories: influencerProfile?.content_categories || [],
            collaboration_history: influencerProfile?.collaboration_history || '',
            rating: influencerProfile?.rating || 0,
            hourly_rate: influencerProfile?.hourly_rate || 0,
            currency: influencerProfile?.currency || 'USD',
            portfolio_url: influencerProfile?.portfolio_url || ''
          }
        })
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleArrayInputChange = (section: string, field: string, value: string) => {
    const newArray = value.split(',').map(item => item.trim()).filter(item => item)
    handleInputChange(section, field, newArray)
  }

  const saveProfile = async () => {
    try {
      setSaving(true)

      // 사용자 프로필 저장
      if (userProfile) {
        await ProfileService.updateUserProfile(formData.user)
      } else {
                const response = await ProfileService.createUserProfile({       
          user_id: user.id,
          user_type: 'brand', // 기본값, 나중에 선택할 수 있도록 수정   
          ...formData.user
        })
        if (response.success) {
          setUserProfile(response.data)
        }
      }

      // 브랜드 프로필 저장
      if (userProfile?.user_type === 'brand') {
        if (brandProfile) {
          await ProfileService.updateBrandProfile(formData.brand)
        } else {
          const response = await ProfileService.createBrandProfile(formData.brand)
          if (response.success) {
            setBrandProfile(response.data)
          }
        }
      }

      // 인플루언서 프로필 저장
      if (userProfile?.user_type === 'influencer') {
        if (influencerProfile) {
          await ProfileService.updateInfluencerProfile(formData.influencer)
        } else {
          const response = await ProfileService.createInfluencerProfile({
            user_profile_id: userProfile.id,
            ...formData.influencer
          })
          if (response.success) {
            setInfluencerProfile(response.data)
          }
        }
      }

      setEditing(false)
      await loadProfile() // 프로필 다시 로드
    } catch (error) {
      console.error('프로필 저장 오류:', error)
    } finally {
      setSaving(false)
    }
  }

  const addSocialAccount = async () => {
    if (!userProfile) {
      alert('사용자 프로필을 찾을 수 없습니다.')
      return
    }
    
    try {
      const response = await ProfileService.addSocialAccount({
        user_profile_id: userProfile.id,
        ...newSocialAccount
      })
      if (response.success) {
        setSocialAccounts(prev => [...prev, response.data!])
        setNewSocialAccount({
          platform: '',
          username: '',
          followers: 0,
          avg_views: 0,
          avg_likes: 0,
          avg_comments: 0,
          profile_url: ''
        })
      }
    } catch (error) {
      console.error('소셜 계정 추가 오류:', error)
    }
  }

  const deleteSocialAccount = async (accountId: string) => {
    try {
      const response = await ProfileService.deleteSocialAccount(accountId)
      if (response.success) {
        setSocialAccounts(prev => prev.filter(account => account.id !== accountId))
      }
    } catch (error) {
      console.error('소셜 계정 삭제 오류:', error)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      case 'youtube':
        return <Youtube className="w-5 h-5" />
      case 'twitter':
        return <Twitter className="w-5 h-5" />
      default:
        return <Globe className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">프로필을 불러오는 중...</p>
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">프로필 관리</h1>
                <p className="text-gray-600">
                  {userProfile?.user_type === 'brand' ? '브랜드' : '인플루언서'} 프로필
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              {editing ? (
                <>
                  <Button
                    onClick={saveProfile}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {saving ? '저장 중...' : '저장'}
                  </Button>
                  <Button
                    onClick={() => setEditing(false)}
                    variant="outline"
                  >
                    취소
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  편집
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 기본 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 사용자 기본 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                기본 정보
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    표시 이름
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.user.display_name}
                      onChange={(e) => handleInputChange('user', 'display_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile?.display_name || '미설정'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    전화번호
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.user.phone}
                      onChange={(e) => handleInputChange('user', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile?.phone || '미설정'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    웹사이트
                  </label>
                  {editing ? (
                    <input
                      type="url"
                      value={formData.user.website}
                      onChange={(e) => handleInputChange('user', 'website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile?.website || '미설정'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    위치
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.user.location}
                      onChange={(e) => handleInputChange('user', 'location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile?.location || '미설정'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    자기소개
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.user.bio}
                      onChange={(e) => handleInputChange('user', 'bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile?.bio || '미설정'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    언어 (쉼표로 구분)
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.user.languages.join(', ')}
                      onChange={(e) => handleArrayInputChange('user', 'languages', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="한국어, 영어, 아랍어"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {userProfile?.languages?.length ? userProfile.languages.join(', ') : '미설정'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 브랜드/인플루언서 전용 정보 */}
            {userProfile?.user_type === 'brand' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  브랜드 정보
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      회사명
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.brand.company_name}
                        onChange={(e) => handleInputChange('brand', 'company_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{brandProfile?.company_name || '미설정'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      사업자등록번호
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.brand.business_number}
                        onChange={(e) => handleInputChange('brand', 'business_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{brandProfile?.business_number || '미설정'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      업종
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.brand.industry}
                        onChange={(e) => handleInputChange('brand', 'industry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{brandProfile?.industry || '미설정'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      회사 규모
                    </label>
                    {editing ? (
                      <select
                        value={formData.brand.company_size}
                        onChange={(e) => handleInputChange('brand', 'company_size', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">선택하세요</option>
                        <option value="startup">스타트업</option>
                        <option value="small">소규모 (1-50명)</option>
                        <option value="medium">중규모 (51-200명)</option>
                        <option value="large">대규모 (200명+)</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{brandProfile?.company_size || '미설정'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      타겟 시장 (쉼표로 구분)
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.brand.target_markets.join(', ')}
                        onChange={(e) => handleArrayInputChange('brand', 'target_markets', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="한국, 미국, 중동"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {brandProfile?.target_markets?.length ? brandProfile.target_markets.join(', ') : '미설정'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      최소 예산
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        value={formData.brand.budget_min}
                        onChange={(e) => handleInputChange('brand', 'budget_min', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {brandProfile?.budget_min ? `$${brandProfile.budget_min.toLocaleString()}` : '미설정'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      최대 예산
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        value={formData.brand.budget_max}
                        onChange={(e) => handleInputChange('brand', 'budget_max', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {brandProfile?.budget_max ? `$${brandProfile.budget_max.toLocaleString()}` : '미설정'}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      회사 설명
                    </label>
                    {editing ? (
                      <textarea
                        value={formData.brand.company_description}
                        onChange={(e) => handleInputChange('brand', 'company_description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{brandProfile?.company_description || '미설정'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {userProfile?.user_type === 'influencer' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  인플루언서 정보
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      총 팔로워 수
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        value={formData.influencer.total_followers}
                        onChange={(e) => handleInputChange('influencer', 'total_followers', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {influencerProfile?.total_followers ? influencerProfile.total_followers.toLocaleString() : '미설정'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      평균 참여율 (%)
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={formData.influencer.avg_engagement_rate}
                        onChange={(e) => handleInputChange('influencer', 'avg_engagement_rate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {influencerProfile?.avg_engagement_rate ? `${influencerProfile.avg_engagement_rate}%` : '미설정'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      협업 이력
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        value={formData.influencer.collaboration_history}
                        onChange={(e) => handleInputChange('influencer', 'collaboration_history', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {influencerProfile?.collaboration_history || '0'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      평점
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.influencer.rating}
                        onChange={(e) => handleInputChange('influencer', 'rating', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {influencerProfile?.rating ? `${influencerProfile.rating}/5` : '미설정'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      시간당 요금
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        value={formData.influencer.hourly_rate}
                        onChange={(e) => handleInputChange('influencer', 'hourly_rate', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {influencerProfile?.hourly_rate ? `$${influencerProfile.hourly_rate}/시간` : '미설정'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      포트폴리오 URL
                    </label>
                    {editing ? (
                      <input
                        type="url"
                        value={formData.influencer.portfolio_url}
                        onChange={(e) => handleInputChange('influencer', 'portfolio_url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{influencerProfile?.portfolio_url || '미설정'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      콘텐츠 카테고리 (쉼표로 구분)
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.influencer.content_categories.join(', ')}
                        onChange={(e) => handleArrayInputChange('influencer', 'content_categories', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="뷰티, 패션, 라이프스타일"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {influencerProfile?.content_categories?.length ? influencerProfile.content_categories.join(', ') : '미설정'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 소셜 미디어 계정 (인플루언서만) */}
            {userProfile?.user_type === 'influencer' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Instagram className="w-5 h-5 mr-2" />
                  소셜 미디어 계정
                </h2>
                
                {/* 기존 계정 목록 */}
                <div className="space-y-3 mb-6">
                  {socialAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getPlatformIcon(account.platform)}
                        <div>
                          <p className="font-medium">{account.platform}</p>
                          <p className="text-sm text-gray-600">@{account.username}</p>
                          <p className="text-xs text-gray-500">
                            팔로워: {account.followers.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteSocialAccount(account.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* 새 계정 추가 */}
                <div className="border-t pt-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">새 계정 추가</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="플랫폼 (예: Instagram)"
                      value={newSocialAccount.platform}
                      onChange={(e) => setNewSocialAccount(prev => ({ ...prev, platform: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="사용자명"
                      value={newSocialAccount.username}
                      onChange={(e) => setNewSocialAccount(prev => ({ ...prev, username: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="팔로워 수"
                      value={newSocialAccount.followers}
                      onChange={(e) => setNewSocialAccount(prev => ({ ...prev, followers: parseInt(e.target.value) }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      placeholder="프로필 URL"
                      value={newSocialAccount.profile_url}
                      onChange={(e) => setNewSocialAccount(prev => ({ ...prev, profile_url: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    onClick={addSocialAccount}
                    className="mt-3 bg-green-600 hover:bg-green-700"
                    disabled={!newSocialAccount.platform || !newSocialAccount.username}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    계정 추가
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 프로필 완성도 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">프로필 완성도</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">기본 정보</span>
                  <span className="text-sm font-medium text-green-600">80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                
                {userProfile?.user_type === 'brand' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">브랜드 정보</span>
                      <span className="text-sm font-medium text-blue-600">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </>
                )}
                
                {userProfile?.user_type === 'influencer' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">인플루언서 정보</span>
                      <span className="text-sm font-medium text-purple-600">70%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 계정 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 정보</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-500">이메일</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '알 수 없음'}
                    </p>
                    <p className="text-xs text-gray-500">가입일</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userProfile?.timezone || 'Asia/Seoul'}
                    </p>
                    <p className="text-xs text-gray-500">시간대</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
