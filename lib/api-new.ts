// ME-IN 플랫폼 API 클라이언트
// Supabase 기반 백엔드와 연동

import { supabase } from './supabase'

// API 응답 타입 정의
interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  pagination?: {
    limit: number
    offset: number
    total: number
  }
}

// 기본 API 요청 래퍼
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `/api${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || `API Error: ${response.status}`)
    }
    
    return result
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

// =============================================
// 1. 캠페인 API
// =============================================

export const campaignApi = {
  // 캠페인 목록 조회
  getCampaigns: async (params?: {
    status?: string
    category?: string
    target_regions?: string[]
    min_budget?: number
    max_budget?: number
    limit?: number
    offset?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append('status', params.status)
    if (params?.category) searchParams.append('category', params.category)
    if (params?.target_regions) searchParams.append('target_regions', params.target_regions.join(','))
    if (params?.min_budget) searchParams.append('min_budget', params.min_budget.toString())
    if (params?.max_budget) searchParams.append('max_budget', params.max_budget.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    
    return apiRequest<any[]>(`/campaigns?${searchParams.toString()}`)
  },

  // 캠페인 상세 조회
  getCampaign: async (id: string) =>
    apiRequest<any>(`/campaigns/${id}`),

  // 캠페인 생성
  createCampaign: async (data: {
    brand_id: string
    title_ko: string
    title_en?: string
    title_ar?: string
    description_ko: string
    description_en?: string
    description_ar?: string
    category: string
    budget_total: number
    budget_per_influencer?: number
    target_regions: string[]
    target_languages: string[]
    min_followers?: number
    required_platforms: string[]
    start_date?: string
    end_date?: string
    application_deadline?: string
    max_applications?: number
    max_influencers?: number
    tags?: string[]
  }) =>
    apiRequest<any>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 캠페인 수정
  updateCampaign: async (id: string, data: any) =>
    apiRequest<any>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // 캠페인 삭제 (상태를 cancelled로 변경)
  deleteCampaign: async (id: string) =>
    apiRequest<any>(`/campaigns/${id}`, {
      method: 'DELETE',
    }),
}

// =============================================
// 2. 인플루언서 API
// =============================================

export const influencerApi = {
  // 인플루언서 목록 조회
  getInfluencers: async (params?: {
    expertise?: string[]
    languages?: string[]
    min_followers?: number
    platforms?: string[]
    limit?: number
    offset?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.expertise) searchParams.append('expertise', params.expertise.join(','))
    if (params?.languages) searchParams.append('languages', params.languages.join(','))
    if (params?.min_followers) searchParams.append('min_followers', params.min_followers.toString())
    if (params?.platforms) searchParams.append('platforms', params.platforms.join(','))
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    
    return apiRequest<any[]>(`/influencers?${searchParams.toString()}`)
  },

  // 인플루언서 상세 조회
  getInfluencer: async (id: string) =>
    apiRequest<any>(`/influencers/${id}`),
}

// =============================================
// 3. 애플리케이션 API
// =============================================

export const applicationApi = {
  // 애플리케이션 생성 (자동 승인)
  createApplication: async (data: {
    campaign_id: string
    influencer_id: string
    application_message?: string
    proposed_fee?: number
    proposed_timeline?: string
    portfolio_samples?: string[]
  }) =>
    apiRequest<any>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 애플리케이션 상태 업데이트
  updateApplicationStatus: async (applicationId: string, status: string) =>
    apiRequest<any>(`/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
}

// =============================================
// 4. 메시징 API
// =============================================

export const messagingApi = {
  // 메시지 전송
  sendMessage: async (data: {
    room_id: string
    sender_id: string
    content: string
    message_type?: 'text' | 'image' | 'file' | 'system'
    file_urls?: string[]
  }) =>
    apiRequest<any>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 채팅방 메시지 조회
  getChatMessages: async (roomId: string, limit = 50) =>
    apiRequest<any[]>(`/messages?room_id=${roomId}&limit=${limit}`),

  // 사용자 채팅방 목록
  getUserChatRooms: async (userId: string) =>
    apiRequest<any[]>(`/chat-rooms?user_id=${userId}`),
}

// =============================================
// 5. 알림 API
// =============================================

export const notificationApi = {
  // 알림 조회
  getNotifications: async (userId: string, limit = 20) =>
    apiRequest<any[]>(`/notifications?user_id=${userId}&limit=${limit}`),

  // 알림 읽음 처리
  markAsRead: async (notificationId: string) =>
    apiRequest<any>('/notifications', {
      method: 'PUT',
      body: JSON.stringify({
        notification_id: notificationId
      }),
    }),

  // 모든 알림 읽음 처리
  markAllAsRead: async (userId: string) =>
    apiRequest<any[]>('/notifications', {
      method: 'PUT',
      body: JSON.stringify({
        user_id: userId,
        mark_all: true
      }),
    }),
}

// =============================================
// 6. 분석 API
// =============================================

export const analyticsApi = {
  // 대시보드 통계
  getDashboardStats: async (userId: string, userType: 'brand' | 'influencer') =>
    apiRequest<any>(`/analytics/dashboard?user_id=${userId}&user_type=${userType}`),

  // 캠페인 성과 분석
  getCampaignAnalytics: async (campaignId: string, startDate?: string, endDate?: string) =>
    apiRequest<any[]>(`/analytics/campaigns/${campaignId}?start_date=${startDate}&end_date=${endDate}`),

  // 인플루언서 성과 분석
  getInfluencerAnalytics: async (influencerId: string, startDate?: string, endDate?: string) =>
    apiRequest<any[]>(`/analytics/influencers/${influencerId}?start_date=${startDate}&end_date=${endDate}`),
}

// =============================================
// 7. 사용자 API
// =============================================

export const userApi = {
  // 사용자 프로필 조회
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        brands (*),
        influencers (*)
      `)
      .eq('id', userId)
      .single()

    if (error) throw error
    return { success: true, data }
  },

  // 사용자 프로필 업데이트
  updateUserProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  },
}

// =============================================
// 8. 브랜드 API
// =============================================

export const brandApi = {
  // 브랜드 목록 조회
  getBrands: async (params?: {
    industry?: string
    target_markets?: string[]
    limit?: number
    offset?: number
  }) => {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        users (email, is_verified),
        brand_products (*),
        brand_contacts (*)
      `)
      .eq('is_verified', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  },

  // 브랜드 상세 조회
  getBrand: async (brandId: string) => {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        users (email, is_verified),
        brand_products (*),
        brand_contacts (*),
        campaigns (*)
      `)
      .eq('id', brandId)
      .single()

    if (error) throw error
    return { success: true, data }
  },

  // 브랜드 생성
  createBrand: async (userId: string, brandData: any) => {
    const { data, error } = await supabase
      .from('brands')
      .insert({
        user_id: userId,
        ...brandData
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  },
}

// =============================================
// 9. 시스템 API
// =============================================

export const systemApi = {
  // 시스템 설정 조회
  getSystemSettings: async (category?: string) => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('is_public', true)
      .eq(category ? 'category' : 'id', category || 'id')

    if (error) throw error
    return { success: true, data }
  },

  // 지원 언어 목록
  getSupportedLanguages: async () => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'supported_languages')
      .single()

    if (error) throw error
    return { success: true, data: JSON.parse(data.value) }
  },

  // 지원 통화 목록
  getSupportedCurrencies: async () => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'supported_currencies')
      .single()

    if (error) throw error
    return { success: true, data: JSON.parse(data.value) }
  },

  // 타겟 지역 목록
  getTargetRegions: async () => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'target_regions')
      .single()

    if (error) throw error
    return { success: true, data: JSON.parse(data.value) }
  },

  // 콘텐츠 카테고리 목록
  getContentCategories: async () => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'content_categories')
      .single()

    if (error) throw error
    return { success: true, data: JSON.parse(data.value) }
  },

  // 소셜 플랫폼 목록
  getSocialPlatforms: async () => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'social_platforms')
      .single()

    if (error) throw error
    return { success: true, data: JSON.parse(data.value) }
  },
}

// =============================================
// 통합 API 객체
// =============================================

export const api = {
  campaigns: campaignApi,
  influencers: influencerApi,
  applications: applicationApi,
  messaging: messagingApi,
  notifications: notificationApi,
  analytics: analyticsApi,
  users: userApi,
  brands: brandApi,
  system: systemApi,
}

export default api
