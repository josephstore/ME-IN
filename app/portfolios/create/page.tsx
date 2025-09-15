'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { PortfolioService } from '@/lib/services/databaseService'
import { ProfileService } from '@/lib/services/databaseService'
import { CreatePortfolioRequest, UserProfile, InfluencerProfile } from '../../../lib/types/database'
import { 
  ArrowLeft, Save, Upload, X, Plus, Camera, Video, FileText, 
  Eye, EyeOff, Star, Tag, Link, Trash2
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const categories = [
  '패션/뷰티',
  '푸드/요리',
  '여행/라이프스타일',
  '테크/가전',
  '게임/엔터테인먼트',
  '교육/지식',
  '건강/피트니스',
  '패러디/유머',
  '뷰티/메이크업',
  '육아/가족',
  '반려동물',
  '기타'
]

interface MediaFile {
  id: string
  file: File
  type: 'image' | 'video' | 'document'
  url?: string
  thumbnail?: string
  title?: string
  description?: string
}

interface ExternalLink {
  id: string
  platform: string
  url: string
  title?: string
}

export default function CreatePortfolioPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [influencerProfile, setInfluencerProfile] = useState<InfluencerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    title_ar: '',
    description: '',
    description_en: '',
    description_ar: '',
    category: '',
    is_public: true,
    featured: false
  })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadUserProfile()
    }
  }, [user])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const loadUserProfile = async () => {
    if (!user) return

    // TODO: 실제 사용자 프로필 로드 기능 구현 필요
    // const response = await ProfileService.getCompleteProfile()
    // if (response.success && response.data) {
    //   setUserProfile(response.data.userProfile)
    //   setInfluencerProfile(response.data.influencerProfile || null)
    // }
    
        // 더미 데이터
        setUserProfile({
          id: 'demo-user',
          user_id: 'demo-user',
          user_type: 'influencer',
          display_name: 'Demo User',
          languages: ['ko', 'en'],
          timezone: 'Asia/Seoul',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
    setInfluencerProfile(null)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const mediaFile: MediaFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        title: file.name,
        description: ''
      }
      setMediaFiles(prev => [...prev, mediaFile])
    })
  }

  const handleRemoveMedia = (mediaId: string) => {
    setMediaFiles(prev => prev.filter(media => media.id !== mediaId))
  }

  const handleUpdateMedia = (mediaId: string, field: string, value: string) => {
    setMediaFiles(prev => prev.map(media => 
      media.id === mediaId ? { ...media, [field]: value } : media
    ))
  }

  const handleAddExternalLink = () => {
    const newLink: ExternalLink = {
      id: Math.random().toString(36).substr(2, 9),
      platform: '',
      url: '',
      title: ''
    }
    setExternalLinks(prev => [...prev, newLink])
  }

  const handleUpdateExternalLink = (linkId: string, field: string, value: string) => {
    setExternalLinks(prev => prev.map(link => 
      link.id === linkId ? { ...link, [field]: value } : link
    ))
  }

  const handleRemoveExternalLink = (linkId: string) => {
    setExternalLinks(prev => prev.filter(link => link.id !== linkId))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요'
    }
    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요'
    }
    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadMediaFiles = async (): Promise<string[]> => {
    const uploadedUrls: string[] = []

    for (const mediaFile of mediaFiles) {
      try {
        const fileExt = mediaFile.file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = `portfolios/${user?.id}/${fileName}`

        const { data, error } = await supabase.storage
          .from('media')
          .upload(filePath, mediaFile.file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      } catch (error) {
        console.error('Error uploading file:', error)
        throw new Error(`파일 업로드 실패: ${mediaFile.file.name}`)
      }
    }

    return uploadedUrls
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    if (!influencerProfile) {
      alert('인플루언서 프로필이 필요합니다.')
      return
    }

    setSaving(true)

    try {
      // 미디어 파일 업로드
      const mediaUrls = await uploadMediaFiles()

      // 외부 링크 데이터 준비
      const externalLinksData = externalLinks.reduce((acc, link) => {
        if (link.platform && link.url) {
          acc[link.platform] = { url: link.url, title: link.title }
        }
        return acc
      }, {} as Record<string, any>)

      // 포트폴리오 생성
      const portfolioData: CreatePortfolioRequest = {
        influencer_profile_id: influencerProfile.id,
        title: formData.title,
        title_en: formData.title_en || undefined,
        title_ar: formData.title_ar || undefined,
        description: formData.description,
        description_en: formData.description_en || undefined,
        description_ar: formData.description_ar || undefined,
        category: formData.category,
        media_urls: mediaUrls,
        external_links: externalLinksData,
        tags: tags,
        is_public: formData.is_public,
        featured: formData.featured
      }

      const response = await PortfolioService.createPortfolio(portfolioData)

      if (response.success) {
        alert('포트폴리오가 성공적으로 생성되었습니다!')
        router.push('/portfolios')
      } else {
        alert(`포트폴리오 생성 실패: ${response.error}`)
      }
    } catch (error) {
      console.error('Error creating portfolio:', error)
      alert(`포트폴리오 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!influencerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">인플루언서 프로필이 필요합니다</h2>
          <p className="text-gray-600 mb-4">포트폴리오를 생성하려면 먼저 인플루언서 프로필을 완성해주세요.</p>
          <button
            onClick={() => router.push('/profile')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            프로필 완성하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">포트폴리오 등록</h1>
                <p className="text-gray-600">당신의 창작물을 보여주세요</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 제목 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="포트폴리오 제목을 입력하세요"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* 영문 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                영문 제목
              </label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => handleInputChange('title_en', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="English title"
              />
            </div>

            {/* 아랍어 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아랍어 제목
              </label>
              <input
                type="text"
                value={formData.title_ar}
                onChange={(e) => handleInputChange('title_ar', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="العنوان بالعربية"
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">카테고리 선택</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* 공개 설정 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공개 설정
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => handleInputChange('is_public', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">공개</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">추천 포트폴리오</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 설명 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">설명</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="포트폴리오에 대한 설명을 입력하세요"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  영문 설명
                </label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => handleInputChange('description_en', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="English description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아랍어 설명
                </label>
                <textarea
                  value={formData.description_ar}
                  onChange={(e) => handleInputChange('description_ar', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="الوصف بالعربية"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 태그 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">태그</h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="태그를 입력하고 Enter를 누르세요"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                추가
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 미디어 파일 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">미디어 파일</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">이미지, 비디오, 문서 파일을 업로드하세요</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                파일 선택
              </label>
            </div>

            {mediaFiles.length > 0 && (
              <div className="space-y-3">
                {mediaFiles.map((media) => (
                  <div key={media.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      {media.type === 'image' && <Camera className="w-6 h-6 text-blue-500" />}
                      {media.type === 'video' && <Video className="w-6 h-6 text-purple-500" />}
                      {media.type === 'document' && <FileText className="w-6 h-6 text-green-500" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {media.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(media.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={media.title || ''}
                        onChange={(e) => handleUpdateMedia(media.id, 'title', e.target.value)}
                        placeholder="제목"
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500"
                      />
                      <button
                        onClick={() => handleRemoveMedia(media.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 외부 링크 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">외부 링크</h2>
            <button
              onClick={handleAddExternalLink}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              링크 추가
            </button>
          </div>
          
          {externalLinks.length > 0 ? (
            <div className="space-y-3">
              {externalLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => handleUpdateExternalLink(link.id, 'platform', e.target.value)}
                    placeholder="플랫폼 (예: YouTube, Instagram)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleUpdateExternalLink(link.id, 'url', e.target.value)}
                    placeholder="URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={link.title || ''}
                    onChange={(e) => handleUpdateExternalLink(link.id, 'title', e.target.value)}
                    placeholder="제목 (선택사항)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleRemoveExternalLink(link.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">외부 링크가 없습니다</p>
          )}
        </div>
      </div>
    </div>
  )
}
