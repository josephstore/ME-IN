'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { TemplateService } from '../../lib/services/templateService'
import { CampaignTemplate } from '../../lib/types/database'
import { 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Eye, 
  Edit, 
  Trash2,
  Copy,
  BookOpen,
  TrendingUp,
  Grid,
  List
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const categories = [
  '뷰티', '패션', '푸드', '여행', '테크', '게임', '라이프스타일', '교육', '비즈니스', '엔터테인먼트'
]

export default function TemplatesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [templates, setTemplates] = useState<CampaignTemplate[]>([])
  const [myTemplates, setMyTemplates] = useState<CampaignTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState<'public' | 'my'>('public')

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadTemplates()
    }
  }, [user, activeTab, selectedCategory, searchQuery])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadTemplates = async () => {
    try {
      if (activeTab === 'public') {
        let templatesData: CampaignTemplate[] = []
        
        if (searchQuery) {
          templatesData = await TemplateService.searchTemplates(searchQuery, selectedCategory || undefined)
        } else if (selectedCategory) {
          templatesData = await TemplateService.getTemplatesByCategory(selectedCategory)
        } else {
          templatesData = await TemplateService.getPublicTemplates()
        }
        
        setTemplates(templatesData)
      } else {
        const myTemplatesData = await TemplateService.getMyTemplates(user.id)
        setMyTemplates(myTemplatesData)
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  const handleUseTemplate = (template: CampaignTemplate) => {
    // 템플릿 사용 횟수 증가
    TemplateService.incrementUsageCount(template.id)
    
    // 캠페인 생성 페이지로 이동하면서 템플릿 데이터 전달
    const templateData = TemplateService.generateCampaignFromTemplate(template, {})
    router.push(`/campaigns/create?template=${template.id}`)
  }

  const handleEditTemplate = (templateId: string) => {
    router.push(`/templates/edit/${templateId}`)
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('정말로 이 템플릿을 삭제하시겠습니까?')) {
      try {
        await TemplateService.deleteTemplate(templateId, user.id)
        loadTemplates()
      } catch (error) {
        console.error('Error deleting template:', error)
        alert('템플릿 삭제 중 오류가 발생했습니다.')
      }
    }
  }

  const handleCreateTemplate = () => {
    router.push('/templates/create')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  const currentTemplates = activeTab === 'public' ? templates : myTemplates

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">캠페인 템플릿</h1>
              <p className="text-gray-600 mt-1">미리 만들어진 캠페인 템플릿을 활용하세요</p>
            </div>
            <button
              onClick={handleCreateTemplate}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>템플릿 만들기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('public')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'public'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              공개 템플릿
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Grid className="h-4 w-4 inline mr-2" />
              내 템플릿
            </button>
          </nav>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="템플릿 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">모든 카테고리</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 뷰 모드 토글 */}
            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTemplates.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'public' ? '템플릿이 없습니다' : '내 템플릿이 없습니다'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'public' 
                ? '현재 검색 조건에 맞는 템플릿이 없습니다.' 
                : '첫 번째 템플릿을 만들어보세요!'
              }
            </p>
            {activeTab === 'my' && (
              <button
                onClick={handleCreateTemplate}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                템플릿 만들기
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {currentTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                viewMode={viewMode}
                isMyTemplate={activeTab === 'my'}
                onUse={handleUseTemplate}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 템플릿 카드 컴포넌트
function TemplateCard({ 
  template, 
  viewMode, 
  isMyTemplate, 
  onUse, 
  onEdit, 
  onDelete 
}: {
  template: CampaignTemplate
  viewMode: 'grid' | 'list'
  isMyTemplate: boolean
  onUse: (template: CampaignTemplate) => void
  onEdit: (templateId: string) => void
  onDelete: (templateId: string) => void
}) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {template.category}
              </span>
              {template.is_public && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  공개
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-3">{template.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{template.usage_count}회 사용</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(template.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUse(template)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              사용하기
            </button>
            {isMyTemplate && (
              <>
                <button
                  onClick={() => onEdit(template.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(template.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{template.name}</h3>
          <div className="flex items-center space-x-1">
            {template.is_public && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                공개
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {template.category}
          </span>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Eye className="h-4 w-4" />
            <span>{template.usage_count}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => onUse(template)}
            className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors mr-2"
          >
            사용하기
          </button>
          {isMyTemplate && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onEdit(template.id)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(template.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
