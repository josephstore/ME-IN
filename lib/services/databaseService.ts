// ME-IN 플랫폼 데이터베이스 서비스
// Supabase 클라이언트를 활용한 백엔드 API 서비스

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jltnvoyjnzlswsmddojf.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdG52b3lqbnpsc3dzbWRkb2pmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4OTkyNCwiZXhwIjoyMDcwOTY1OTI0fQ.example_service_role_key'

// 서비스 키를 사용한 관리자 클라이언트
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 일반 사용자 클라이언트
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jltnvoyjnzlswsmddojf.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdG52b3lqbnpsc3dzbWRkb2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODk5MjQsImV4cCI6MjA3MDk2NTkyNH0.5blt8JeShSgBA50l5bcE30Um1nGlYJAl685XBdVrqdg'
)

// =============================================
// 1. 사용자 관리 서비스
// =============================================

export class UserService {
  // 사용자 프로필 조회
  static async getUserProfile(userId: string) {
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
    return data
  }

  // 사용자 프로필 업데이트
  static async updateUserProfile(userId: string, updates: any) {
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
    return data
  }

  // 사용자 타입별 프로필 조회
  static async getUserProfileByType(userId: string, userType: 'brand' | 'influencer') {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        ${userType === 'brand' ? 'brands (*)' : 'influencers (*)'}
      `)
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }
}

// =============================================
// 2. 브랜드 관리 서비스
// =============================================

export class BrandService {
  // 브랜드 목록 조회
  static async getBrands(filters?: {
    industry?: string
    target_markets?: string[]
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('brands')
      .select(`
        *,
        users (email, is_verified),
        brand_products (*),
        brand_contacts (*)
      `)
      .eq('is_verified', true)

    if (filters?.industry) {
      query = query.eq('industry', filters.industry)
    }

    if (filters?.target_markets?.length) {
      query = query.overlaps('target_markets', filters.target_markets)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // 브랜드 상세 조회
  static async getBrandById(brandId: string) {
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
    return data
  }

  // 브랜드 조회 (별칭)
  static async getBrand(brandId: string) {
    return this.getBrandById(brandId)
  }

  // 브랜드 생성
  static async createBrand(userId: string, brandData: any) {
    const { data, error } = await supabase
      .from('brands')
      .insert({
        user_id: userId,
        ...brandData
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 브랜드 생성 (오버로드 - userId 없이)
  static async createBrand(brandData: any) {
    const { data, error } = await supabase
      .from('brands')
      .insert(brandData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 브랜드 업데이트
  static async updateBrand(brandId: string, updates: any) {
    const { data, error } = await supabase
      .from('brands')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', brandId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 브랜드 삭제
  static async deleteBrand(brandId: string) {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', brandId)

    if (error) throw error
    return { success: true }
  }

  // 브랜드 제품 관리
  static async getBrandProducts(brandId: string) {
    const { data, error } = await supabase
      .from('brand_products')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async createBrandProduct(brandId: string, productData: any) {
    const { data, error } = await supabase
      .from('brand_products')
      .insert({
        brand_id: brandId,
        ...productData
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// =============================================
// 3. 인플루언서 관리 서비스
// =============================================

export class InfluencerService {
  // 인플루언서 목록 조회
  static async getInfluencers(filters?: {
    expertise_areas?: string[]
    languages?: string[]
    min_followers?: number
    platforms?: string[]
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('influencers')
      .select(`
        *,
        users (email, is_verified),
        influencer_social_accounts (*),
        influencer_content_samples (*)
      `)
      .eq('is_verified', true)

    if (filters?.expertise_areas?.length) {
      query = query.overlaps('expertise_areas', filters.expertise_areas)
    }

    if (filters?.languages?.length) {
      query = query.overlaps('languages', filters.languages)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // 인플루언서 상세 조회
  static async getInfluencerById(influencerId: string) {
    const { data, error } = await supabase
      .from('influencers')
      .select(`
        *,
        users (email, is_verified),
        influencer_social_accounts (*),
        influencer_content_samples (*),
        campaign_applications (*)
      `)
      .eq('id', influencerId)
      .single()

    if (error) throw error
    return data
  }

  // 인플루언서 생성
  static async createInfluencer(userId: string, influencerData: any) {
    const { data, error } = await supabase
      .from('influencers')
      .insert({
        user_id: userId,
        ...influencerData
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 인플루언서 업데이트
  static async updateInfluencer(influencerId: string, updates: any) {
    const { data, error } = await supabase
      .from('influencers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', influencerId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 소셜미디어 계정 관리
  static async getSocialAccounts(influencerId: string) {
    const { data, error } = await supabase
      .from('influencer_social_accounts')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('followers_count', { ascending: false })

    if (error) throw error
    return data
  }

  static async createSocialAccount(influencerId: string, accountData: any) {
    const { data, error } = await supabase
      .from('influencer_social_accounts')
      .insert({
        influencer_id: influencerId,
        ...accountData
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 콘텐츠 샘플 관리
  static async getContentSamples(influencerId: string, limit = 10) {
    const { data, error } = await supabase
      .from('influencer_content_samples')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('posted_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }
}

// =============================================
// 4. 캠페인 관리 서비스
// =============================================

export class CampaignService {
  // 캠페인 목록 조회
  static async getCampaigns(filters?: {
    status?: string
    category?: string
    target_regions?: string[]
    min_budget?: number
    max_budget?: number
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('campaigns')
      .select(`
        *,
        brands (
          company_name_ko,
          company_name_en,
          company_name_ar,
          logo_url,
          industry
        )
      `)
      .eq('status', 'active')

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.target_regions?.length) {
      query = query.overlaps('target_regions', filters.target_regions)
    }

    if (filters?.min_budget) {
      query = query.gte('budget_total', filters.min_budget)
    }

    if (filters?.max_budget) {
      query = query.lte('budget_total', filters.max_budget)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // 캠페인 상세 조회
  static async getCampaignById(campaignId: string) {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        brands (
          *,
          users (email, is_verified)
        ),
        campaign_applications (
          *,
          influencers (
            *,
            users (email, is_verified)
          )
        )
      `)
      .eq('id', campaignId)
      .single()

    if (error) throw error
    return data
  }

  // 캠페인 생성
  static async createCampaign(brandId: string, campaignData: any) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        brand_id: brandId,
        ...campaignData
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 캠페인 업데이트
  static async updateCampaign(campaignId: string, updates: any) {
    const { data, error } = await supabase
      .from('campaigns')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 브랜드의 캠페인 목록 조회
  static async getBrandCampaigns(brandId: string, status?: string) {
    let query = supabase
      .from('campaigns')
      .select(`
        *,
        campaign_applications (
          *,
          influencers (
            name,
            profile_image_url
          )
        )
      `)
      .eq('brand_id', brandId)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// =============================================
// 5. 애플리케이션 관리 서비스
// =============================================

export class ApplicationService {
  // 애플리케이션 생성
  static async createApplication(campaignId: string, influencerId: string, applicationData: any) {
    const { data, error } = await supabase
      .from('campaign_applications')
      .insert({
        campaign_id: campaignId,
        influencer_id: influencerId,
        status: 'approved', // 자동 승인
        ...applicationData
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 애플리케이션 상태 업데이트
  static async updateApplicationStatus(applicationId: string, status: string) {
    const { data, error } = await supabase
      .from('campaign_applications')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 인플루언서의 애플리케이션 목록
  static async getInfluencerApplications(influencerId: string) {
    const { data, error } = await supabase
      .from('campaign_applications')
      .select(`
        *,
        campaigns (
          *,
          brands (
            company_name_ko,
            company_name_en,
            company_name_ar,
            logo_url
          )
        )
      `)
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // 캠페인의 애플리케이션 목록
  static async getCampaignApplications(campaignId: string) {
    const { data, error } = await supabase
      .from('campaign_applications')
      .select(`
        *,
        influencers (
          *,
          users (email, is_verified),
          influencer_social_accounts (*)
        )
      `)
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// =============================================
// 6. 메시징 서비스
// =============================================

export class MessagingService {
  // 채팅방 생성
  static async createChatRoom(campaignId: string, name?: string) {
    const { data, error } = await supabase
      .from('chat_rooms')
      .insert({
        campaign_id: campaignId,
        name: name || 'Campaign Chat',
        type: 'campaign'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 채팅방 참여자 추가
  static async addChatParticipant(roomId: string, userId: string, role = 'member') {
    const { data, error } = await supabase
      .from('chat_room_participants')
      .insert({
        room_id: roomId,
        user_id: userId,
        role
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 메시지 전송
  static async sendMessage(roomId: string, senderId: string, content: string, messageType = 'text') {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        sender_id: senderId,
        content,
        message_type: messageType
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 채팅방 메시지 조회
  static async getChatMessages(roomId: string, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        users (email, user_type)
      `)
      .eq('room_id', roomId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data.reverse()
  }

  // 사용자의 채팅방 목록
  static async getUserChatRooms(userId: string) {
    const { data, error } = await supabase
      .from('chat_room_participants')
      .select(`
        *,
        chat_rooms (
          *,
          campaigns (
            title_ko,
            title_en,
            title_ar
          )
        )
      `)
      .eq('user_id', userId)
      .order('joined_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// =============================================
// 7. 알림 서비스
// =============================================

export class NotificationService {
  // 알림 생성
  static async createNotification(userId: string, type: string, title: string, content?: string, data?: any) {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        content,
        data
      })
      .select()
      .single()

    if (error) throw error
    return notification
  }

  // 사용자 알림 조회
  static async getUserNotifications(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  // 알림 읽음 처리
  static async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 모든 알림 읽음 처리
  static async markAllNotificationsAsRead(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false)
      .select()

    if (error) throw error
    return data
  }
}

// =============================================
// 8. 분석 서비스
// =============================================

export class AnalyticsService {
  // 캠페인 성과 분석
  static async getCampaignAnalytics(campaignId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', campaignId)

    if (startDate) {
      query = query.gte('date', startDate)
    }

    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query.order('date', { ascending: true })

    if (error) throw error
    return data
  }

  // 인플루언서 성과 분석
  static async getInfluencerAnalytics(influencerId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('influencer_analytics')
      .select('*')
      .eq('influencer_id', influencerId)

    if (startDate) {
      query = query.gte('date', startDate)
    }

    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query.order('date', { ascending: true })

    if (error) throw error
    return data
  }

  // 대시보드 통계
  static async getDashboardStats(userId: string, userType: 'brand' | 'influencer') {
    if (userType === 'brand') {
      // 브랜드 대시보드 통계
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!brand) return null

      const [campaigns, applications, collaborations] = await Promise.all([
        supabase.from('campaigns').select('id, status').eq('brand_id', brand.id),
        supabase.from('campaign_applications').select('id, status').eq('campaign_id', supabase.from('campaigns').select('id').eq('brand_id', brand.id)),
        supabase.from('campaign_collaborations').select('id, status').eq('campaign_id', supabase.from('campaigns').select('id').eq('brand_id', brand.id))
      ])

      return {
        active_campaigns: campaigns.data?.filter(c => c.status === 'active').length || 0,
        total_applications: applications.data?.length || 0,
        active_collaborations: collaborations.data?.filter(c => c.status === 'active').length || 0
      }
    } else {
      // 인플루언서 대시보드 통계
      const { data: influencer } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!influencer) return null

      const [applications, collaborations, socialAccounts] = await Promise.all([
        supabase.from('campaign_applications').select('id, status').eq('influencer_id', influencer.id),
        supabase.from('campaign_collaborations').select('id, status').eq('influencer_id', influencer.id),
        supabase.from('influencer_social_accounts').select('followers_count').eq('influencer_id', influencer.id)
      ])

      const totalFollowers = socialAccounts.data?.reduce((sum, account) => sum + account.followers_count, 0) || 0

      return {
        pending_applications: applications.data?.filter(a => a.status === 'pending').length || 0,
        active_collaborations: collaborations.data?.filter(c => c.status === 'active').length || 0,
        total_followers: totalFollowers
      }
    }
  }
}

// =============================================
// 9. 시스템 설정 서비스
// =============================================

export class SystemService {
  // 시스템 설정 조회
  static async getSystemSettings(category?: string) {
    let query = supabase
      .from('system_settings')
      .select('*')
      .eq('is_public', true)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  // 활동 로그 기록
  static async logActivity(userId: string, action: string, resourceType?: string, resourceId?: string, details?: any) {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export default {
  UserService,
  BrandService,
  InfluencerService,
  CampaignService,
  ApplicationService,
  MessagingService,
  NotificationService,
  AnalyticsService,
  SystemService
}
