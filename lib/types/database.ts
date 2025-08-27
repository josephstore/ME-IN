// ME-IN 플랫폼 데이터베이스 타입 정의

export interface UserProfile {
  id: string
  user_id: string
  user_type: 'brand' | 'influencer'
  display_name?: string
  bio?: string
  avatar_url?: string
  phone?: string
  website?: string
  languages: string[]
  timezone: string
  location?: string
  created_at: string
  updated_at: string
}

export interface BrandProfile {
  id: string
  user_profile_id: string
  company_name: string
  company_name_en?: string
  company_name_ar?: string
  business_number?: string
  industry?: string
  company_size?: string
  target_markets: string[]
  budget_min?: number
  budget_max?: number
  currency: string
  logo_url?: string
  company_description?: string
  created_at: string
  updated_at: string
}

export interface InfluencerProfile {
  id: string
  user_profile_id: string
  total_followers: number
  avg_engagement_rate: number
  content_categories: string[]
  collaboration_history: string
  rating: number
  hourly_rate?: number
  currency: string
  portfolio_url?: string
  created_at: string
  updated_at: string
}

export interface SocialAccount {
  id: string
  influencer_profile_id: string
  platform: string
  username: string
  followers: number
  avg_views: number
  avg_likes: number
  avg_comments: number
  profile_url?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  brand_profile_id: string
  title: string
  title_en?: string
  title_ar?: string
  description?: string
  description_en?: string
  description_ar?: string
  category?: string
  budget_min: number
  budget_max: number
  currency: string
  target_languages: string[]
  target_regions: string[]
  min_followers: number
  content_requirements?: string
  start_date?: string
  end_date?: string
  application_deadline?: string
  max_applications?: number
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  media_assets: string[]
  created_at: string
  updated_at: string
  brand_profiles?: BrandProfile & {
    user_profiles?: UserProfile
  }
}

export interface Application {
  id: string
  campaign_id: string
  influencer_profile_id: string
  proposal?: string
  proposed_budget?: number
  proposed_timeline?: string
  portfolio_links: string[]
  status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'withdrawn'
  brand_feedback?: string
  created_at: string
  updated_at: string
  campaigns?: Campaign
  influencer_profiles?: InfluencerProfile & {
    user_profiles?: UserProfile
  }
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  application_id?: string
  content: string
  message_type: 'text' | 'file' | 'image'
  file_url?: string
  is_read: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  reference_id?: string
  reference_type?: string
  is_read: boolean
  created_at: string
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

// 프로필 생성/수정 타입
export interface CreateUserProfileRequest {
  user_id: string
  user_type: 'brand' | 'influencer'
  display_name?: string
  bio?: string
  avatar_url?: string
  phone?: string
  website?: string
  languages?: string[]
  timezone?: string
  location?: string
}

export interface CreateBrandProfileRequest {
  company_name: string
  company_name_en?: string
  company_name_ar?: string
  business_number?: string
  industry?: string
  company_size?: string
  target_markets?: string[]
  budget_min?: number
  budget_max?: number
  currency?: string
  logo_url?: string
  company_description?: string
}

export interface CreateInfluencerProfileRequest {
  user_profile_id: string
  content_categories?: string[]
  target_audience?: string
  collaboration_history?: string
  preferred_brands?: string[]
  availability?: string
  rate_card?: Record<string, any>
  total_followers?: number
  avg_engagement_rate?: number
  rating?: number
  hourly_rate?: number
  currency?: string
  portfolio_url?: string
}

// 소셜 계정 타입
export interface CreateSocialAccountRequest {
  user_profile_id: string
  platform: string
  username: string
  followers?: number
  engagement_rate?: number
  avg_views?: number
  avg_likes?: number
  avg_comments?: number
  url?: string
  is_verified?: boolean
}

// 캠페인 타입
export interface CreateCampaignRequest {
  title: string
  title_en?: string
  title_ar?: string
  description?: string
  description_en?: string
  description_ar?: string
  category?: string
  budget_min: number
  budget_max: number
  currency?: string
  target_languages?: string[]
  target_regions?: string[]
  min_followers?: number
  content_requirements?: string
  start_date?: string
  end_date?: string
  application_deadline?: string
  max_applications?: number
  media_assets?: string[]
}

// 신청 타입
export interface CreateApplicationRequest {
  campaign_id: string
  proposal?: string
  proposed_budget?: number
  proposed_timeline?: string
  portfolio_links?: string[]
}

// 메시지 타입
export interface CreateMessageRequest {
  receiver_id: string
  application_id?: string
  content: string
  message_type?: 'text' | 'file' | 'image'
  file_url?: string
}

// 알림 타입
export interface CreateNotificationRequest {
  user_id: string
  title: string
  message: string
  type: string
  reference_id?: string
  reference_type?: string
}

export interface CampaignTemplate {
  id: string
  name: string
  name_en?: string
  name_ar?: string
  description?: string
  description_en?: string
  description_ar?: string
  category: string
  template_data: {
    title_template: string
    title_template_en?: string
    title_template_ar?: string
    description_template: string
    description_template_en?: string
    description_template_ar?: string
    budget_min: number
    budget_max: number
    target_languages: string[]
    target_regions: string[]
    min_followers: number
    content_requirements_template: string
    content_requirements_template_en?: string
    content_requirements_template_ar?: string
    media_requirements: string[]
    duration_days: number
  }
  is_public: boolean
  created_by: string
  usage_count: number
  created_at: string
  updated_at: string
}

export interface CreateCampaignTemplateRequest {
  name: string
  name_en?: string
  name_ar?: string
  description?: string
  description_en?: string
  description_ar?: string
  category: string
  template_data: {
    title_template: string
    title_template_en?: string
    title_template_ar?: string
    description_template: string
    description_template_en?: string
    description_template_ar?: string
    budget_min: number
    budget_max: number
    target_languages: string[]
    target_regions: string[]
    min_followers: number
    content_requirements_template: string
    content_requirements_template_en?: string
    content_requirements_template_ar?: string
    media_requirements: string[]
    duration_days: number
  }
  is_public?: boolean
}

export interface UpdateCampaignTemplateRequest {
  name?: string
  name_en?: string
  name_ar?: string
  description?: string
  description_en?: string
  description_ar?: string
  category?: string
  template_data?: Partial<CampaignTemplate['template_data']>
  is_public?: boolean
}

export interface Portfolio {
  id: string
  influencer_profile_id: string
  title: string
  title_en?: string
  title_ar?: string
  description?: string
  description_en?: string
  description_ar?: string
  category: string
  media_urls?: string[]
  external_links?: Record<string, any>
  tags?: string[]
  is_public: boolean
  featured: boolean
  view_count: number
  like_count: number
  created_at: string
  updated_at: string
  influencer_profiles?: InfluencerProfile & { user_profiles?: UserProfile }
  portfolio_media?: PortfolioMedia[]
  portfolio_comments?: PortfolioComment[]
  portfolio_likes?: PortfolioLike[]
}

export interface PortfolioMedia {
  id: string
  portfolio_id: string
  media_type: 'image' | 'video' | 'document'
  media_url: string
  thumbnail_url?: string
  title?: string
  description?: string
  file_size?: number
  duration?: number
  order_index: number
  created_at: string
}

export interface PortfolioComment {
  id: string
  portfolio_id: string
  user_id: string
  content: string
  parent_id?: string
  is_public: boolean
  created_at: string
  updated_at: string
  user_profiles?: UserProfile
  replies?: PortfolioComment[]
}

export interface PortfolioLike {
  id: string
  portfolio_id: string
  user_id: string
  created_at: string
  user_profiles?: UserProfile
}

export interface CreatePortfolioRequest {
  influencer_profile_id: string
  title: string
  title_en?: string
  title_ar?: string
  description?: string
  description_en?: string
  description_ar?: string
  category: string
  media_urls?: string[]
  external_links?: Record<string, any>
  tags?: string[]
  is_public?: boolean
  featured?: boolean
}

export interface UpdatePortfolioRequest {
  title?: string
  title_en?: string
  title_ar?: string
  description?: string
  description_en?: string
  description_ar?: string
  category?: string
  media_urls?: string[]
  external_links?: Record<string, any>
  tags?: string[]
  is_public?: boolean
  featured?: boolean
}

export interface CreatePortfolioMediaRequest {
  portfolio_id: string
  media_type: 'image' | 'video' | 'document'
  media_url: string
  thumbnail_url?: string
  title?: string
  description?: string
  file_size?: number
  duration?: number
  order_index?: number
}

export interface CreatePortfolioCommentRequest {
  portfolio_id: string
  content: string
  parent_id?: string
  is_public?: boolean
}

export interface UpdatePortfolioCommentRequest {
  content: string
  is_public?: boolean
}
