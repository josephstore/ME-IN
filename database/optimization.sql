-- ME-IN 플랫폼 데이터베이스 최적화 스크립트
-- Supabase에서 실행할 수 있는 인덱스 및 최적화 쿼리

-- =============================================
-- 1. 사용자 관련 테이블 최적화
-- =============================================

-- users 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users(is_verified);

-- user_profiles 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name ON user_profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles(location);

-- =============================================
-- 2. 브랜드 관련 테이블 최적화
-- =============================================

-- brands 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands(user_id);
CREATE INDEX IF NOT EXISTS idx_brands_company_name_ko ON brands(company_name_ko);
CREATE INDEX IF NOT EXISTS idx_brands_company_name_en ON brands(company_name_en);
CREATE INDEX IF NOT EXISTS idx_brands_industry ON brands(industry);
CREATE INDEX IF NOT EXISTS idx_brands_company_size ON brands(company_size);
CREATE INDEX IF NOT EXISTS idx_brands_is_verified ON brands(is_verified);

-- =============================================
-- 3. 인플루언서 관련 테이블 최적화
-- =============================================

-- influencers 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_influencers_user_id ON influencers(user_id);
CREATE INDEX IF NOT EXISTS idx_influencers_content_categories ON influencers USING GIN(content_categories);
CREATE INDEX IF NOT EXISTS idx_influencers_target_audience ON influencers USING GIN(target_audience);
CREATE INDEX IF NOT EXISTS idx_influencers_rating ON influencers(rating);
CREATE INDEX IF NOT EXISTS idx_influencers_total_followers ON influencers(total_followers);
CREATE INDEX IF NOT EXISTS idx_influencers_avg_engagement_rate ON influencers(avg_engagement_rate);

-- influencer_social_accounts 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_influencer_social_accounts_influencer_id ON influencer_social_accounts(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_social_accounts_platform ON influencer_social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_influencer_social_accounts_followers_count ON influencer_social_accounts(followers_count);

-- =============================================
-- 4. 캠페인 관련 테이블 최적화
-- =============================================

-- campaigns 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_start_date ON campaigns(start_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_end_date ON campaigns(end_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_budget_min ON campaigns(budget_min);
CREATE INDEX IF NOT EXISTS idx_campaigns_budget_max ON campaigns(budget_max);
CREATE INDEX IF NOT EXISTS idx_campaigns_target_regions ON campaigns USING GIN(target_regions);
CREATE INDEX IF NOT EXISTS idx_campaigns_target_languages ON campaigns USING GIN(target_languages);

-- 복합 인덱스 (자주 함께 사용되는 쿼리용)
CREATE INDEX IF NOT EXISTS idx_campaigns_status_created_at ON campaigns(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_status ON campaigns(brand_id, status);
CREATE INDEX IF NOT EXISTS idx_campaigns_category_status ON campaigns(category, status);

-- =============================================
-- 5. 신청 관련 테이블 최적화
-- =============================================

-- campaign_applications 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_campaign_applications_campaign_id ON campaign_applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_influencer_id ON campaign_applications(influencer_id);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_status ON campaign_applications(status);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_created_at ON campaign_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_updated_at ON campaign_applications(updated_at);

-- 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_campaign_applications_campaign_status ON campaign_applications(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_influencer_status ON campaign_applications(influencer_id, status);

-- =============================================
-- 6. 채팅 관련 테이블 최적화
-- =============================================

-- chat_rooms 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_chat_rooms_campaign_id ON chat_rooms(campaign_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_brand_id ON chat_rooms(brand_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_influencer_id ON chat_rooms(influencer_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_updated_at ON chat_rooms(updated_at);

-- chat_messages 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver_id ON chat_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_read_at ON chat_messages(read_at);

-- 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_created ON chat_messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver_read ON chat_messages(receiver_id, read_at);

-- =============================================
-- 7. 포트폴리오 관련 테이블 최적화
-- =============================================

-- portfolios 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_portfolios_influencer_id ON portfolios(influencer_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON portfolios(category);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_public ON portfolios(is_public);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON portfolios(created_at);

-- portfolio_items 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_portfolio_items_portfolio_id ON portfolio_items(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_type ON portfolio_items(type);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_created_at ON portfolio_items(created_at);

-- =============================================
-- 8. 알림 관련 테이블 최적화
-- =============================================

-- notifications 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);

-- =============================================
-- 9. 성능 최적화를 위한 뷰 생성
-- =============================================

-- 활성 캠페인 뷰
CREATE OR REPLACE VIEW active_campaigns AS
SELECT 
    c.*,
    b.company_name_ko,
    b.company_name_en,
    b.logo_url,
    b.industry
FROM campaigns c
JOIN brands b ON c.brand_id = b.user_id
WHERE c.status = 'active'
ORDER BY c.created_at DESC;

-- 인플루언서 통계 뷰
CREATE OR REPLACE VIEW influencer_stats AS
SELECT 
    i.*,
    u.display_name,
    u.avatar_url,
    COUNT(DISTINCT ca.id) as total_applications,
    COUNT(DISTINCT CASE WHEN ca.status = 'accepted' THEN ca.id END) as accepted_applications,
    AVG(CASE WHEN ca.status = 'accepted' THEN ca.rating END) as avg_rating
FROM influencers i
JOIN users u ON i.user_id = u.id
LEFT JOIN campaign_applications ca ON i.user_id = ca.influencer_id
GROUP BY i.id, u.id;

-- 브랜드 통계 뷰
CREATE OR REPLACE VIEW brand_stats AS
SELECT 
    b.*,
    u.display_name,
    u.avatar_url,
    COUNT(DISTINCT c.id) as total_campaigns,
    COUNT(DISTINCT ca.id) as total_applications,
    COUNT(DISTINCT CASE WHEN ca.status = 'accepted' THEN ca.id END) as accepted_applications
FROM brands b
JOIN users u ON b.user_id = u.id
LEFT JOIN campaigns c ON b.user_id = c.brand_id
LEFT JOIN campaign_applications ca ON c.id = ca.campaign_id
GROUP BY b.id, u.id;

-- =============================================
-- 10. 통계 함수 생성
-- =============================================

-- 캠페인 통계 함수
CREATE OR REPLACE FUNCTION get_campaign_stats(campaign_id UUID)
RETURNS TABLE (
    total_applications BIGINT,
    accepted_applications BIGINT,
    pending_applications BIGINT,
    rejected_applications BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE status = 'accepted') as accepted_applications,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_applications,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected_applications
    FROM campaign_applications
    WHERE campaign_id = $1;
END;
$$ LANGUAGE plpgsql;

-- 인플루언서 매칭 점수 함수
CREATE OR REPLACE FUNCTION calculate_matching_score(
    influencer_id UUID,
    campaign_id UUID
) RETURNS FLOAT AS $$
DECLARE
    score FLOAT := 0;
    influencer_categories TEXT[];
    campaign_categories TEXT;
    influencer_regions TEXT[];
    campaign_regions TEXT[];
BEGIN
    -- 카테고리 매칭 점수 (40점)
    SELECT content_categories INTO influencer_categories
    FROM influencers WHERE user_id = influencer_id;
    
    SELECT category INTO campaign_categories
    FROM campaigns WHERE id = campaign_id;
    
    IF campaign_categories = ANY(influencer_categories) THEN
        score := score + 40;
    END IF;
    
    -- 지역 매칭 점수 (30점)
    SELECT target_audience INTO influencer_regions
    FROM influencers WHERE user_id = influencer_id;
    
    SELECT target_regions INTO campaign_regions
    FROM campaigns WHERE id = campaign_id;
    
    IF campaign_regions && influencer_regions THEN
        score := score + 30;
    END IF;
    
    -- 팔로워 수 점수 (20점)
    IF (SELECT total_followers FROM influencers WHERE user_id = influencer_id) > 10000 THEN
        score := score + 20;
    ELSIF (SELECT total_followers FROM influencers WHERE user_id = influencer_id) > 1000 THEN
        score := score + 10;
    END IF;
    
    -- 평점 점수 (10점)
    IF (SELECT rating FROM influencers WHERE user_id = influencer_id) > 4.0 THEN
        score := score + 10;
    ELSIF (SELECT rating FROM influencers WHERE user_id = influencer_id) > 3.0 THEN
        score := score + 5;
    END IF;
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 11. 데이터 정리 및 최적화
-- =============================================

-- 오래된 읽지 않은 알림 정리 (30일 이상)
DELETE FROM notifications 
WHERE is_read = false 
AND created_at < NOW() - INTERVAL '30 days';

-- 오래된 채팅 메시지 정리 (1년 이상)
DELETE FROM chat_messages 
WHERE created_at < NOW() - INTERVAL '1 year';

-- 통계 업데이트
ANALYZE;

-- =============================================
-- 12. 권한 설정
-- =============================================

-- 인증된 사용자에게 필요한 권한 부여
GRANT SELECT ON active_campaigns TO authenticated;
GRANT SELECT ON influencer_stats TO authenticated;
GRANT SELECT ON brand_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_campaign_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_matching_score(UUID, UUID) TO authenticated;
