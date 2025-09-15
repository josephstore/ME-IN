-- ME-IN 플랫폼 완전한 데이터베이스 스키마
-- Supabase PostgreSQL 기반

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- 1. 사용자 관리 (Users & Authentication)
-- =============================================

-- 사용자 기본 정보 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('brand', 'influencer', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    language_preference VARCHAR(10) DEFAULT 'ko',
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul'
);

-- 소셜 로그인 연동 테이블
CREATE TABLE user_social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google', 'facebook', 'twitter', 'naver', 'kakao'
    provider_id VARCHAR(255) NOT NULL,
    provider_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_id)
);

-- =============================================
-- 2. 브랜드 관리
-- =============================================

-- 브랜드 정보 테이블
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name_ko VARCHAR(255),
    company_name_en VARCHAR(255),
    company_name_ar VARCHAR(255),
    business_number VARCHAR(50),
    logo_url TEXT,
    website_url TEXT,
    description_ko TEXT,
    description_en TEXT,
    description_ar TEXT,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    founded_year INTEGER,
    headquarters_country VARCHAR(100),
    headquarters_city VARCHAR(100),
    target_markets TEXT[], -- 중동 국가들
    budget_min INTEGER,
    budget_max INTEGER,
    currency VARCHAR(10) DEFAULT 'USD',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 브랜드 담당자 정보
CREATE TABLE brand_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 브랜드 제품/서비스 카탈로그
CREATE TABLE brand_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name_ko VARCHAR(255),
    name_en VARCHAR(255),
    name_ar VARCHAR(255),
    description_ko TEXT,
    description_en TEXT,
    description_ar TEXT,
    category VARCHAR(100),
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    image_urls TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. 인플루언서 관리
-- =============================================

-- 인플루언서 기본 정보
CREATE TABLE influencers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    bio_ko TEXT,
    bio_en TEXT,
    bio_ar TEXT,
    profile_image_url TEXT,
    cover_image_url TEXT,
    birth_date DATE,
    gender VARCHAR(20),
    nationality VARCHAR(100),
    current_location VARCHAR(100),
    languages TEXT[], -- 지원 언어
    expertise_areas TEXT[], -- 전문 분야
    content_categories TEXT[], -- 콘텐츠 카테고리
    is_verified BOOLEAN DEFAULT FALSE,
    verification_level INTEGER DEFAULT 0, -- 0: 미인증, 1: 기본인증, 2: 고급인증
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인플루언서 소셜미디어 계정
CREATE TABLE influencer_social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'instagram', 'tiktok', 'youtube', 'twitter', 'facebook'
    username VARCHAR(255) NOT NULL,
    platform_user_id VARCHAR(255),
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    avg_views INTEGER DEFAULT 0,
    avg_likes INTEGER DEFAULT 0,
    avg_comments INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(influencer_id, platform)
);

-- 인플루언서 콘텐츠 샘플
CREATE TABLE influencer_content_samples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    content_url TEXT NOT NULL,
    content_type VARCHAR(50), -- 'image', 'video', 'carousel'
    caption TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    posted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. 캠페인 관리
-- =============================================

-- 캠페인 기본 정보
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    title_ko VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_ar VARCHAR(255),
    description_ko TEXT,
    description_en TEXT,
    description_ar TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    budget_total DECIMAL(12,2) NOT NULL,
    budget_per_influencer DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- 캠페인 요구사항
    target_regions TEXT[], -- 타겟 지역
    target_languages TEXT[], -- 타겟 언어
    min_followers INTEGER,
    max_followers INTEGER,
    required_platforms TEXT[], -- 필수 플랫폼
    content_requirements TEXT, -- 콘텐츠 요구사항
    deliverables TEXT[], -- 납품물 목록
    
    -- 일정 관리
    start_date DATE,
    end_date DATE,
    application_deadline DATE,
    content_deadline DATE,
    
    -- 제한사항
    max_applications INTEGER,
    max_influencers INTEGER,
    
    -- 메타데이터
    tags TEXT[],
    image_urls TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 캠페인 애플리케이션
CREATE TABLE campaign_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
    application_message TEXT,
    proposed_fee DECIMAL(10,2),
    proposed_timeline TEXT,
    portfolio_samples TEXT[], -- 포트폴리오 샘플 URL들
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, influencer_id)
);

-- 캠페인 협업 (승인된 애플리케이션)
CREATE TABLE campaign_collaborations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES campaign_applications(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    agreed_fee DECIMAL(10,2),
    agreed_timeline TEXT,
    deliverables TEXT[],
    content_urls TEXT[],
    performance_metrics JSONB, -- 성과 지표
    brand_rating INTEGER CHECK (brand_rating >= 1 AND brand_rating <= 5),
    influencer_rating INTEGER CHECK (influencer_rating >= 1 AND influencer_rating <= 5),
    brand_feedback TEXT,
    influencer_feedback TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. 메시징 시스템
-- =============================================

-- 채팅방
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    name VARCHAR(255),
    type VARCHAR(20) DEFAULT 'campaign' CHECK (type IN ('campaign', 'direct', 'group')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 채팅방 참여자
CREATE TABLE chat_room_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(room_id, user_id)
);

-- 메시지
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    file_urls TEXT[],
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. 알림 시스템
-- =============================================

-- 알림
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'campaign_application', 'message', 'campaign_update', etc.
    title VARCHAR(255) NOT NULL,
    content TEXT,
    data JSONB, -- 추가 데이터
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. 분석 및 리포팅
-- =============================================

-- 캠페인 성과 분석
CREATE TABLE campaign_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    collaboration_id UUID REFERENCES campaign_collaborations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    cost_per_click DECIMAL(10,2) DEFAULT 0,
    cost_per_conversion DECIMAL(10,2) DEFAULT 0,
    roi DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, collaboration_id, date)
);

-- 인플루언서 성과 분석
CREATE TABLE influencer_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES influencer_social_accounts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    followers_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    avg_engagement_rate DECIMAL(5,2) DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(influencer_id, social_account_id, date)
);

-- =============================================
-- 8. 시스템 관리
-- =============================================

-- 시스템 설정
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    category VARCHAR(50),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 활동 로그
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 인덱스 생성
-- =============================================

-- 사용자 관련 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 브랜드 관련 인덱스
CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_brands_industry ON brands(industry);
CREATE INDEX idx_brands_target_markets ON brands USING GIN(target_markets);

-- 인플루언서 관련 인덱스
CREATE INDEX idx_influencers_user_id ON influencers(user_id);
CREATE INDEX idx_influencers_expertise ON influencers USING GIN(expertise_areas);
CREATE INDEX idx_influencers_languages ON influencers USING GIN(languages);
CREATE INDEX idx_influencer_social_accounts_platform ON influencer_social_accounts(platform);
CREATE INDEX idx_influencer_social_accounts_followers ON influencer_social_accounts(followers_count);

-- 캠페인 관련 인덱스
CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_category ON campaigns(category);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX idx_campaigns_target_regions ON campaigns USING GIN(target_regions);
CREATE INDEX idx_campaign_applications_campaign_id ON campaign_applications(campaign_id);
CREATE INDEX idx_campaign_applications_influencer_id ON campaign_applications(influencer_id);
CREATE INDEX idx_campaign_applications_status ON campaign_applications(status);

-- 메시징 관련 인덱스
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- 알림 관련 인덱스
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- 분석 관련 인덱스
CREATE INDEX idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);
CREATE INDEX idx_campaign_analytics_date ON campaign_analytics(date);
CREATE INDEX idx_influencer_analytics_influencer_id ON influencer_analytics(influencer_id);
CREATE INDEX idx_influencer_analytics_date ON influencer_analytics(date);

-- =============================================
-- 트리거 함수 (자동 업데이트)
-- =============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_influencers_updated_at BEFORE UPDATE ON influencers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_applications_updated_at BEFORE UPDATE ON campaign_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_collaborations_updated_at BEFORE UPDATE ON campaign_collaborations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RLS (Row Level Security) 정책
-- =============================================

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 접근 가능
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 브랜드는 자신의 브랜드 정보만 접근 가능
CREATE POLICY "Brands can view own data" ON brands FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Brands can update own data" ON brands FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Brands can insert own data" ON brands FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 인플루언서는 자신의 정보만 접근 가능
CREATE POLICY "Influencers can view own data" ON influencers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Influencers can update own data" ON influencers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Influencers can insert own data" ON influencers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 캠페인은 브랜드 소유자만 수정 가능, 모든 사용자가 조회 가능
CREATE POLICY "Campaigns are viewable by everyone" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Brands can manage own campaigns" ON campaigns FOR ALL USING (auth.uid() = (SELECT user_id FROM brands WHERE id = campaigns.brand_id));

-- 애플리케이션은 관련자만 접근 가능
CREATE POLICY "Applications viewable by related users" ON campaign_applications FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM influencers WHERE id = campaign_applications.influencer_id) OR
    auth.uid() = (SELECT b.user_id FROM brands b JOIN campaigns c ON b.id = c.brand_id WHERE c.id = campaign_applications.campaign_id)
);

-- 메시지는 채팅방 참여자만 접근 가능
CREATE POLICY "Messages viewable by room participants" ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM chat_room_participants crp 
        WHERE crp.room_id = messages.room_id AND crp.user_id = auth.uid()
    )
);

-- 알림은 해당 사용자만 접근 가능
CREATE POLICY "Notifications viewable by owner" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Notifications updatable by owner" ON notifications FOR UPDATE USING (auth.uid() = user_id);
