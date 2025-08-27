-- ME-IN 플랫폼 데이터베이스 스키마
-- 프로필 관리 시스템

-- 1. 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('brand', 'influencer')),
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    phone VARCHAR(20),
    website VARCHAR(255),
    languages TEXT[] DEFAULT '{}',
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 브랜드 프로필 테이블
CREATE TABLE IF NOT EXISTS brand_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    company_name_en VARCHAR(200),
    company_name_ar VARCHAR(200),
    business_number VARCHAR(50),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    target_markets TEXT[] DEFAULT '{}',
    budget_min INTEGER,
    budget_max INTEGER,
    currency VARCHAR(10) DEFAULT 'USD',
    logo_url TEXT,
    company_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 인플루언서 프로필 테이블
CREATE TABLE IF NOT EXISTS influencer_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    total_followers INTEGER DEFAULT 0,
    avg_engagement_rate DECIMAL(5,2) DEFAULT 0,
    content_categories TEXT[] DEFAULT '{}',
    collaboration_history INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    hourly_rate INTEGER,
    currency VARCHAR(10) DEFAULT 'USD',
    portfolio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 소셜 미디어 계정 테이블
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    influencer_profile_id UUID REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    followers INTEGER DEFAULT 0,
    avg_views INTEGER DEFAULT 0,
    avg_likes INTEGER DEFAULT 0,
    avg_comments INTEGER DEFAULT 0,
    profile_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(platform, username)
);

-- 5. 캠페인 테이블
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_profile_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    title_en VARCHAR(200),
    title_ar VARCHAR(200),
    description TEXT,
    description_en TEXT,
    description_ar TEXT,
    category VARCHAR(100),
    budget_min INTEGER NOT NULL,
    budget_max INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    target_languages TEXT[] DEFAULT '{}',
    target_regions TEXT[] DEFAULT '{}',
    min_followers INTEGER DEFAULT 0,
    content_requirements TEXT,
    start_date DATE,
    end_date DATE,
    application_deadline DATE,
    max_applications INTEGER,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    media_assets TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 신청 테이블
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_profile_id UUID REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    proposal TEXT,
    proposed_budget INTEGER,
    proposed_timeline TEXT,
    portfolio_links TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected', 'withdrawn')),
    brand_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, influencer_profile_id)
);

-- 7. 메시지 테이블
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
    file_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 알림 테이블
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 캠페인 템플릿 테이블
CREATE TABLE IF NOT EXISTS campaign_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    name_ar VARCHAR(200),
    description TEXT,
    description_en TEXT,
    description_ar TEXT,
    category VARCHAR(100) NOT NULL,
    template_data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 포트폴리오 테이블
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    influencer_profile_id UUID REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    title_en VARCHAR(200),
    title_ar VARCHAR(200),
    description TEXT,
    description_en TEXT,
    description_ar TEXT,
    category VARCHAR(100) NOT NULL,
    media_urls TEXT[],
    external_links JSONB,
    tags TEXT[],
    is_public BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 포트폴리오 미디어 테이블
CREATE TABLE IF NOT EXISTS portfolio_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    media_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'document'
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title VARCHAR(200),
    description TEXT,
    file_size INTEGER,
    duration INTEGER, -- for videos
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. 포트폴리오 댓글 테이블
CREATE TABLE IF NOT EXISTS portfolio_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES portfolio_comments(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. 포트폴리오 좋아요 테이블
CREATE TABLE IF NOT EXISTS portfolio_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(portfolio_id, user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_profile_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_applications_campaign_id ON applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_applications_influencer_id ON applications(influencer_profile_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- 캠페인 템플릿 인덱스
CREATE INDEX IF NOT EXISTS idx_campaign_templates_category ON campaign_templates(category);
CREATE INDEX IF NOT EXISTS idx_campaign_templates_created_by ON campaign_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_templates_public ON campaign_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_campaign_templates_usage_count ON campaign_templates(usage_count DESC);

-- 포트폴리오 인덱스
CREATE INDEX IF NOT EXISTS idx_portfolios_influencer_profile_id ON portfolios(influencer_profile_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON portfolios(category);
CREATE INDEX IF NOT EXISTS idx_portfolios_public ON portfolios(is_public);
CREATE INDEX IF NOT EXISTS idx_portfolios_featured ON portfolios(featured);
CREATE INDEX IF NOT EXISTS idx_portfolios_view_count ON portfolios(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_like_count ON portfolios(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON portfolios(created_at DESC);

-- 포트폴리오 미디어 인덱스
CREATE INDEX IF NOT EXISTS idx_portfolio_media_portfolio_id ON portfolio_media(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_media_type ON portfolio_media(media_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_media_order ON portfolio_media(order_index);

-- 포트폴리오 댓글 인덱스
CREATE INDEX IF NOT EXISTS idx_portfolio_comments_portfolio_id ON portfolio_comments(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_comments_user_id ON portfolio_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_comments_parent_id ON portfolio_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_comments_created_at ON portfolio_comments(created_at DESC);

-- 포트폴리오 좋아요 인덱스
CREATE INDEX IF NOT EXISTS idx_portfolio_likes_portfolio_id ON portfolio_likes(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_likes_user_id ON portfolio_likes(user_id);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 캠페인 템플릿 RLS 정책
ALTER TABLE campaign_templates ENABLE ROW LEVEL SECURITY;
-- 공개 템플릿 조회 정책
CREATE POLICY "Public templates are viewable by everyone" ON campaign_templates
    FOR SELECT USING (is_public = true);
-- 사용자 자신의 템플릿 관리 정책
CREATE POLICY "Users can manage their own templates" ON campaign_templates
    FOR ALL USING (auth.uid() = created_by);
-- 관리자 정책 (필요시)
CREATE POLICY "Admins can manage all templates" ON campaign_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- 포트폴리오 RLS 정책
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
-- 공개 포트폴리오 조회 정책
CREATE POLICY "Public portfolios are viewable by everyone" ON portfolios
    FOR SELECT USING (is_public = true);
-- 인플루언서 자신의 포트폴리오 관리 정책
CREATE POLICY "Influencers can manage their own portfolios" ON portfolios
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM influencer_profiles ip
            JOIN user_profiles up ON ip.user_profile_id = up.id
            WHERE ip.id = portfolios.influencer_profile_id
            AND up.user_id = auth.uid()
        )
    );

-- 포트폴리오 미디어 RLS 정책
ALTER TABLE portfolio_media ENABLE ROW LEVEL SECURITY;
-- 포트폴리오 소유자만 미디어 관리 가능
CREATE POLICY "Portfolio owners can manage their media" ON portfolio_media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM portfolios p
            JOIN influencer_profiles ip ON p.influencer_profile_id = ip.id
            JOIN user_profiles up ON ip.user_profile_id = up.id
            WHERE p.id = portfolio_media.portfolio_id
            AND up.user_id = auth.uid()
        )
    );

-- 포트폴리오 댓글 RLS 정책
ALTER TABLE portfolio_comments ENABLE ROW LEVEL SECURITY;
-- 공개 댓글 조회 정책
CREATE POLICY "Public comments are viewable by everyone" ON portfolio_comments
    FOR SELECT USING (is_public = true);
-- 사용자 자신의 댓글 관리 정책
CREATE POLICY "Users can manage their own comments" ON portfolio_comments
    FOR ALL USING (auth.uid() = user_id);

-- 포트폴리오 좋아요 RLS 정책
ALTER TABLE portfolio_likes ENABLE ROW LEVEL SECURITY;
-- 좋아요 조회 정책
CREATE POLICY "Likes are viewable by everyone" ON portfolio_likes
    FOR SELECT USING (true);
-- 사용자 자신의 좋아요 관리 정책
CREATE POLICY "Users can manage their own likes" ON portfolio_likes
    FOR ALL USING (auth.uid() = user_id);

-- 사용자 프로필 RLS 정책
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 브랜드 프로필 RLS 정책
CREATE POLICY "Brands can manage their own profile" ON brand_profiles
    FOR ALL USING (
        user_profile_id IN (
            SELECT id FROM user_profiles WHERE user_id = auth.uid()
        )
    );

-- 인플루언서 프로필 RLS 정책
CREATE POLICY "Influencers can manage their own profile" ON influencer_profiles
    FOR ALL USING (
        user_profile_id IN (
            SELECT id FROM user_profiles WHERE user_id = auth.uid()
        )
    );

-- 캠페인 RLS 정책
CREATE POLICY "Brands can manage their own campaigns" ON campaigns
    FOR ALL USING (
        brand_profile_id IN (
            SELECT bp.id FROM brand_profiles bp
            JOIN user_profiles up ON bp.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

CREATE POLICY "Influencers can view active campaigns" ON campaigns
    FOR SELECT USING (status = 'active');

-- 신청 RLS 정책
CREATE POLICY "Influencers can manage their applications" ON applications
    FOR ALL USING (
        influencer_profile_id IN (
            SELECT ip.id FROM influencer_profiles ip
            JOIN user_profiles up ON ip.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

CREATE POLICY "Brands can view applications for their campaigns" ON applications
    FOR SELECT USING (
        campaign_id IN (
            SELECT c.id FROM campaigns c
            JOIN brand_profiles bp ON c.brand_profile_id = bp.id
            JOIN user_profiles up ON bp.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

-- 메시지 RLS 정책
CREATE POLICY "Users can view messages they sent or received" ON messages
    FOR SELECT USING (
        sender_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) OR
        receiver_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (
        sender_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid())
    );

-- 알림 RLS 정책
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON brand_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencer_profiles_updated_at BEFORE UPDATE ON influencer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
