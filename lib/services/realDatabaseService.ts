import { db, generateId, hashPassword, verifyPassword } from '@/lib/database/sqlite'

// 사용자 관리 서비스
export class RealUserService {
  // 사용자 생성
  static async createUser(email: string, password: string, name: string, user_type: 'brand' | 'influencer') {
    try {
      const id = generateId()
      const passwordHash = hashPassword(password)
      
      const stmt = db.prepare(`
        INSERT INTO users (id, email, password_hash, name, user_type)
        VALUES (?, ?, ?, ?, ?)
      `)
      
      stmt.run(id, email, passwordHash, name, user_type)
      
      return {
        success: true,
        data: { id, email, name, user_type },
        error: null
      }
    } catch (error) {
      console.error('사용자 생성 오류:', error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '사용자 생성 실패'
      }
    }
  }

  // 사용자 로그인
  static async loginUser(email: string, password: string) {
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
      const user = stmt.get(email) as any
      
      if (!user) {
        return {
          success: false,
          data: null,
          error: '사용자를 찾을 수 없습니다'
        }
      }
      
      if (!verifyPassword(password, user.password_hash)) {
        return {
          success: false,
          data: null,
          error: '비밀번호가 올바르지 않습니다'
        }
      }
      
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type,
          created_at: user.created_at
        },
        error: null
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '로그인 실패'
      }
    }
  }

  // 사용자 조회
  static async getUserById(id: string) {
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
      const user = stmt.get(id) as any
      
      if (!user) {
        return {
          success: false,
          data: null,
          error: '사용자를 찾을 수 없습니다'
        }
      }
      
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type,
          created_at: user.created_at
        },
        error: null
      }
    } catch (error) {
      console.error('사용자 조회 오류:', error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '사용자 조회 실패'
      }
    }
  }
}

// 캠페인 관리 서비스
export class RealCampaignService {
  // 캠페인 생성
  static async createCampaign(brandId: string, campaignData: any) {
    try {
      const id = generateId()
      
      const stmt = db.prepare(`
        INSERT INTO campaigns (
          id, brand_id, title, title_en, title_ar, description, description_en, description_ar,
          category, budget_min, budget_max, currency, target_languages, target_regions,
          min_followers, content_requirements, start_date, end_date, application_deadline,
          max_applications, media_assets, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      stmt.run(
        id,
        brandId,
        campaignData.title,
        campaignData.title_en || null,
        campaignData.title_ar || null,
        campaignData.description,
        campaignData.description_en || null,
        campaignData.description_ar || null,
        campaignData.category,
        campaignData.budget_min,
        campaignData.budget_max,
        campaignData.currency || 'USD',
        JSON.stringify(campaignData.target_languages || []),
        JSON.stringify(campaignData.target_regions || []),
        campaignData.min_followers || 0,
        campaignData.content_requirements || null,
        campaignData.start_date || null,
        campaignData.end_date || null,
        campaignData.application_deadline || null,
        campaignData.max_applications || null,
        JSON.stringify(campaignData.media_assets || []),
        'active' // 새로 생성된 캠페인은 active 상태로 설정
      )
      
      return {
        success: true,
        data: { id, ...campaignData },
        error: null
      }
    } catch (error) {
      console.error('캠페인 생성 오류:', error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '캠페인 생성 실패'
      }
    }
  }

  // 캠페인 목록 조회
  static async getCampaigns() {
    try {
      const stmt = db.prepare(`
        SELECT c.*, u.name as brand_name, u.email as brand_email
        FROM campaigns c
        JOIN users u ON c.brand_id = u.id
        WHERE c.status IN ('active', 'pending', 'draft')
        ORDER BY c.created_at DESC
      `)
      
      const campaigns = stmt.all() as any[]
      
      // JSON 필드 파싱
      const parsedCampaigns = campaigns.map(campaign => ({
        ...campaign,
        target_languages: campaign.target_languages ? JSON.parse(campaign.target_languages) : [],
        target_regions: campaign.target_regions ? JSON.parse(campaign.target_regions) : [],
        media_assets: campaign.media_assets ? JSON.parse(campaign.media_assets) : []
      }))
      
      return {
        success: true,
        data: parsedCampaigns,
        error: null
      }
    } catch (error) {
      console.error('캠페인 목록 조회 오류:', error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '캠페인 목록 조회 실패'
      }
    }
  }

  // 캠페인 상세 조회
  static async getCampaignById(campaignId: string) {
    try {
      const stmt = db.prepare(`
        SELECT c.*, u.name as brand_name, u.email as brand_email
        FROM campaigns c
        JOIN users u ON c.brand_id = u.id
        WHERE c.id = ?
      `)
      
      const campaign = stmt.get(campaignId) as any
      
      if (!campaign) {
        return {
          success: false,
          data: null,
          error: '캠페인을 찾을 수 없습니다'
        }
      }
      
      // JSON 필드 파싱
      const parsedCampaign = {
        ...campaign,
        target_languages: campaign.target_languages ? JSON.parse(campaign.target_languages) : [],
        target_regions: campaign.target_regions ? JSON.parse(campaign.target_regions) : [],
        media_assets: campaign.media_assets ? JSON.parse(campaign.media_assets) : []
      }
      
      return {
        success: true,
        data: parsedCampaign,
        error: null
      }
    } catch (error) {
      console.error('캠페인 조회 오류:', error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '캠페인 조회 실패'
      }
    }
  }
}

// 인플루언서 관리 서비스
export class RealInfluencerService {
  // 인플루언서 목록 조회
  static async getInfluencers() {
    try {
      const stmt = db.prepare(`
        SELECT i.*, u.name, u.email
        FROM influencer_profiles i
        JOIN users u ON i.user_id = u.id
        ORDER BY i.total_followers DESC
      `)
      
      const influencers = stmt.all() as any[]
      
      // JSON 필드 파싱
      const parsedInfluencers = influencers.map(influencer => ({
        ...influencer,
        content_categories: influencer.content_categories ? JSON.parse(influencer.content_categories) : []
      }))
      
      return {
        success: true,
        data: parsedInfluencers,
        error: null
      }
    } catch (error) {
      console.error('인플루언서 목록 조회 오류:', error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '인플루언서 목록 조회 실패'
      }
    }
  }

  // 인플루언서 상세 조회
  static async getInfluencerById(influencerId: string) {
    try {
      const stmt = db.prepare(`
        SELECT i.*, u.name, u.email
        FROM influencer_profiles i
        JOIN users u ON i.user_id = u.id
        WHERE i.id = ?
      `)
      
      const influencer = stmt.get(influencerId) as any
      
      if (!influencer) {
        return {
          success: false,
          data: null,
          error: '인플루언서를 찾을 수 없습니다'
        }
      }
      
      // JSON 필드 파싱
      const parsedInfluencer = {
        ...influencer,
        content_categories: influencer.content_categories ? JSON.parse(influencer.content_categories) : []
      }
      
      return {
        success: true,
        data: parsedInfluencer,
        error: null
      }
    } catch (error) {
      console.error('인플루언서 조회 오류:', error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '인플루언서 조회 실패'
      }
    }
  }
}
