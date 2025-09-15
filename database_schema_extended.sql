-- ME-IN 플랫폼 확장 데이터베이스 스키마
-- 기존 테이블에 추가로 필요한 테이블들

-- 1. 브랜드 프로필 테이블
CREATE TABLE IF NOT EXISTS brand_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    company_name_en TEXT,
    company_name_ar TEXT,
    business_number TEXT,
    industry TEXT,
    description TEXT,
    description_en TEXT,
    description_ar TEXT,
    logo_url TEXT,
    website TEXT,
    location TEXT,
    target_markets TEXT[] DEFAULT '{}',
    budget_min INTEGER DEFAULT 0,
    budget_max INTEGER DEFAULT 0,
    preferred_influencer_types TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 인플루언서 프로필 테이블
CREATE TABLE IF NOT EXISTS influencer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT,
    bio_en TEXT,
    bio_ar TEXT,
    avatar_url TEXT,
    location TEXT,
    languages TEXT[] DEFAULT '{}',
    expertise TEXT[] DEFAULT '{}',
    social_accounts JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 소셜 미디어 계정 테이블
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL, -- 'instagram', 'tiktok', 'youtube'
    username TEXT NOT NULL,
    followers INTEGER DEFAULT 0,
    avg_views INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 캠페인 테이블 (기존 테이블 확장)
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_en TEXT,
    title_ar TEXT,
    description TEXT,
    description_en TEXT,
    description_ar TEXT,
    category TEXT NOT NULL,
    budget_min INTEGER NOT NULL,
    budget_max INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    target_languages TEXT[] DEFAULT '{}',
    target_regions TEXT[] DEFAULT '{}',
    min_followers INTEGER DEFAULT 0,
    content_requirements TEXT,
    start_date DATE,
    end_date DATE,
    application_deadline DATE,
    max_applications INTEGER DEFAULT 0,
    media_assets TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 캠페인 신청 테이블
CREATE TABLE IF NOT EXISTS campaign_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    proposal TEXT,
    proposed_budget INTEGER,
    proposed_timeline TEXT,
    portfolio_items TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'withdrawn'
    brand_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, influencer_id)
);

-- 6. 메시지 테이블
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text', -- 'text', 'image', 'file', 'system'
    attachments TEXT[] DEFAULT '{}',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 알림 테이블
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'campaign_application', 'message', 'campaign_update', 'payment'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 포트폴리오 테이블
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    platform TEXT NOT NULL, -- 'instagram', 'tiktok', 'youtube'
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 결제 테이블
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- 센트 단위
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    payment_method TEXT, -- 'stripe', 'paypal'
    transaction_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 성과 분석 테이블
CREATE TABLE IF NOT EXISTS campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    metrics JSONB NOT NULL, -- 도달률, 참여율, 클릭률 등
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_brand_profiles_user_id ON brand_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_influencer_profiles_user_id ON influencer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_influencer_id ON social_accounts(influencer_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_campaign_id ON campaign_applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_influencer_id ON campaign_applications(influencer_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_campaign_id ON messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_portfolios_influencer_id ON portfolios(influencer_id);
CREATE INDEX IF NOT EXISTS idx_payments_campaign_id ON payments(campaign_id);
CREATE INDEX IF NOT EXISTS idx_payments_influencer_id ON payments(influencer_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_date ON campaign_analytics(date);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;

-- 브랜드 프로필 RLS 정책
CREATE POLICY "Users can view all brand profiles" ON brand_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own brand profile" ON brand_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own brand profile" ON brand_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own brand profile" ON brand_profiles FOR DELETE USING (auth.uid() = user_id);

-- 인플루언서 프로필 RLS 정책
CREATE POLICY "Users can view all influencer profiles" ON influencer_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own influencer profile" ON influencer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own influencer profile" ON influencer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own influencer profile" ON influencer_profiles FOR DELETE USING (auth.uid() = user_id);

-- 소셜 계정 RLS 정책
CREATE POLICY "Users can view all social accounts" ON social_accounts FOR SELECT USING (true);
CREATE POLICY "Users can manage their own social accounts" ON social_accounts FOR ALL USING (
    EXISTS (
        SELECT 1 FROM influencer_profiles 
        WHERE influencer_profiles.id = social_accounts.influencer_id 
        AND influencer_profiles.user_id = auth.uid()
    )
);

-- 캠페인 RLS 정책
CREATE POLICY "Users can view all campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Brands can manage their own campaigns" ON campaigns FOR ALL USING (
    EXISTS (
        SELECT 1 FROM brand_profiles 
        WHERE brand_profiles.id = campaigns.brand_id 
        AND brand_profiles.user_id = auth.uid()
    )
);

-- 캠페인 신청 RLS 정책
CREATE POLICY "Users can view applications for their campaigns" ON campaign_applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM campaigns 
        JOIN brand_profiles ON campaigns.brand_id = brand_profiles.id 
        WHERE campaigns.id = campaign_applications.campaign_id 
        AND brand_profiles.user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM influencer_profiles 
        WHERE influencer_profiles.id = campaign_applications.influencer_id 
        AND influencer_profiles.user_id = auth.uid()
    )
);

CREATE POLICY "Influencers can apply to campaigns" ON campaign_applications FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM influencer_profiles 
        WHERE influencer_profiles.id = campaign_applications.influencer_id 
        AND influencer_profiles.user_id = auth.uid()
    )
);

CREATE POLICY "Brands can update applications for their campaigns" ON campaign_applications FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM campaigns 
        JOIN brand_profiles ON campaigns.brand_id = brand_profiles.id 
        WHERE campaigns.id = campaign_applications.campaign_id 
        AND brand_profiles.user_id = auth.uid()
    )
);

-- 메시지 RLS 정책
CREATE POLICY "Users can view their own messages" ON messages FOR SELECT USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
);

CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- 알림 RLS 정책
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- 포트폴리오 RLS 정책
CREATE POLICY "Users can view all portfolios" ON portfolios FOR SELECT USING (true);
CREATE POLICY "Influencers can manage their own portfolios" ON portfolios FOR ALL USING (
    EXISTS (
        SELECT 1 FROM influencer_profiles 
        WHERE influencer_profiles.id = portfolios.influencer_id 
        AND influencer_profiles.user_id = auth.uid()
    )
);

-- 결제 RLS 정책
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM influencer_profiles 
        WHERE influencer_profiles.id = payments.influencer_id 
        AND influencer_profiles.user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM campaigns 
        JOIN brand_profiles ON campaigns.brand_id = brand_profiles.id 
        WHERE campaigns.id = payments.campaign_id 
        AND brand_profiles.user_id = auth.uid()
    )
);

-- 성과 분석 RLS 정책
CREATE POLICY "Users can view analytics for their campaigns" ON campaign_analytics FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM campaigns 
        JOIN brand_profiles ON campaigns.brand_id = brand_profiles.id 
        WHERE campaigns.id = campaign_analytics.campaign_id 
        AND brand_profiles.user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM influencer_profiles 
        WHERE influencer_profiles.id = campaign_analytics.influencer_id 
        AND influencer_profiles.user_id = auth.uid()
    )
);

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON brand_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_influencer_profiles_updated_at BEFORE UPDATE ON influencer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_applications_updated_at BEFORE UPDATE ON campaign_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
