-- Supabase 초기 설정 및 데이터 시딩
-- ME-IN 플랫폼 초기 데이터

-- =============================================
-- 1. 초기 시스템 설정 데이터
-- =============================================

INSERT INTO system_settings (key, value, description, category, is_public) VALUES
('platform_name', 'ME-IN', '플랫폼 이름', 'general', true),
('platform_description', 'MiddleEast Influencer Network', '플랫폼 설명', 'general', true),
('supported_languages', '["ko", "en", "ar"]', '지원 언어 목록', 'localization', true),
('supported_currencies', '["USD", "KRW", "AED", "SAR"]', '지원 통화 목록', 'payment', true),
('target_regions', '["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "Jordan", "Lebanon", "Egypt", "Morocco", "Turkey", "Iran", "Iraq", "Syria", "Yemen", "Palestine", "Libya", "Tunisia", "Algeria", "Sudan", "Afghanistan", "Pakistan", "Bangladesh"]', '타겟 중동 지역', 'geography', true),
('content_categories', '["Beauty", "Fashion", "Food", "Travel", "Technology", "Lifestyle", "Health", "Fitness", "Gaming", "Education", "Business", "Entertainment"]', '콘텐츠 카테고리', 'content', true),
('social_platforms', '["Instagram", "TikTok", "YouTube", "Twitter", "Facebook", "Snapchat", "LinkedIn"]', '지원 소셜 플랫폼', 'social', true),
('min_campaign_budget', '100', '최소 캠페인 예산 (USD)', 'campaign', true),
('max_campaign_budget', '100000', '최대 캠페인 예산 (USD)', 'campaign', true),
('default_application_deadline_days', '7', '기본 신청 마감일 (일)', 'campaign', false),
('auto_approval_enabled', 'true', '자동 승인 활성화', 'campaign', false);

-- =============================================
-- 2. 샘플 브랜드 데이터
-- =============================================

-- 샘플 브랜드 사용자 생성
INSERT INTO users (id, email, user_type, is_verified, language_preference) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'brand@me-in.com', 'brand', true, 'ko'),
('550e8400-e29b-41d4-a716-446655440002', 'kbeauty@me-in.com', 'brand', true, 'ko'),
('550e8400-e29b-41d4-a716-446655440003', 'kfood@me-in.com', 'brand', true, 'ko');

-- 샘플 브랜드 정보
INSERT INTO brands (id, user_id, company_name_ko, company_name_en, company_name_ar, business_number, industry, target_markets, budget_min, budget_max, description_ko, description_en, description_ar) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '미인 플랫폼', 'ME-IN Platform', 'منصة مين', '123-45-67890', 'Technology', ARRAY['UAE', 'Saudi Arabia', 'Qatar'], 1000, 50000, '중동 인플루언서와 한국 브랜드를 연결하는 플랫폼', 'Platform connecting Middle Eastern influencers with Korean brands', 'منصة تربط المؤثرين في الشرق الأوسط بالعلامات التجارية الكورية'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'K-뷰티 코리아', 'K-Beauty Korea', 'كيوتي كوريا', '234-56-78901', 'Beauty', ARRAY['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar'], 500, 20000, '한국 뷰티 제품을 중동에 소개하는 브랜드', 'Korean beauty brand introducing products to Middle East', 'علامة تجارية كورية للجمال تقدم منتجاتها في الشرق الأوسط'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '한식 월드', 'Korean Food World', 'طعام كوريا العالمي', '345-67-89012', 'Food', ARRAY['UAE', 'Saudi Arabia', 'Egypt', 'Morocco'], 300, 15000, '한국 음식을 전 세계에 알리는 브랜드', 'Korean food brand promoting cuisine worldwide', 'علامة تجارية للطعام الكوري تروج للمطبخ عالمياً');

-- 샘플 브랜드 제품
INSERT INTO brand_products (brand_id, name_ko, name_en, name_ar, description_ko, description_en, description_ar, category, price_min, price_max) VALUES
('650e8400-e29b-41d4-a716-446655440002', '캐어리 쿨링 토너', 'Carery Cooling Toner', 'تونر كاري المبرد', '시원하고 촉촉한 토너', 'Cool and moisturizing toner', 'تونر مبرد ومرطب', 'Skincare', 15.00, 25.00),
('650e8400-e29b-41d4-a716-446655440002', 'K-뷰티 세럼', 'K-Beauty Serum', 'سيروم كيوتي', '고농축 영양 세럼', 'High-concentration nourishing serum', 'سيروم مغذي عالي التركيز', 'Skincare', 30.00, 50.00),
('650e8400-e29b-41d4-a716-446655440003', '김치 스타터', 'Kimchi Starter', 'مخمر الكيمتشي', '집에서 만드는 김치', 'Homemade kimchi starter', 'مخمر الكيمتشي المنزلي', 'Food', 10.00, 20.00),
('650e8400-e29b-41d4-a716-446655440003', '한국 고추장', 'Korean Gochujang', 'معجون الفلفل الكوري', '전통 한국 고추장', 'Traditional Korean chili paste', 'معجون الفلفل الكوري التقليدي', 'Food', 8.00, 15.00);

-- =============================================
-- 3. 샘플 인플루언서 데이터
-- =============================================

-- 샘플 인플루언서 사용자 생성
INSERT INTO users (id, email, user_type, is_verified, language_preference) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'influencer@me-in.com', 'influencer', true, 'ar'),
('750e8400-e29b-41d4-a716-446655440002', 'aisha@me-in.com', 'influencer', true, 'ar'),
('750e8400-e29b-41d4-a716-446655440003', 'mohammed@me-in.com', 'influencer', true, 'en'),
('750e8400-e29b-41d4-a716-446655440004', 'layla@me-in.com', 'influencer', true, 'ar');

-- 샘플 인플루언서 정보
INSERT INTO influencers (id, user_id, name, bio_ko, bio_en, bio_ar, nationality, current_location, languages, expertise_areas, content_categories, is_verified, verification_level) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Demo Influencer', '데모 인플루언서입니다', 'Demo influencer for testing', 'مؤثر تجريبي للاختبار', 'UAE', 'Dubai', ARRAY['ar', 'en'], ARRAY['Beauty', 'Lifestyle'], ARRAY['Beauty', 'Fashion', 'Lifestyle'], true, 2),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 'Aisha Al-Rashid', '뷰티와 라이프스타일 인플루언서', 'Beauty and lifestyle influencer', 'مؤثرة في الجمال ونمط الحياة', 'Saudi Arabia', 'Riyadh', ARRAY['ar', 'en'], ARRAY['Beauty', 'Lifestyle'], ARRAY['Beauty', 'Fashion', 'Lifestyle'], true, 2),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 'Mohammed Hassan', '패션과 라이프스타일 인플루언서', 'Fashion and lifestyle influencer', 'مؤثر في الموضة ونمط الحياة', 'UAE', 'Abu Dhabi', ARRAY['en', 'ar'], ARRAY['Fashion', 'Lifestyle'], ARRAY['Fashion', 'Travel', 'Lifestyle'], true, 1),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', 'Layla Ahmed', '푸드와 트래블 인플루언서', 'Food and travel influencer', 'مؤثرة في الطعام والسفر', 'Qatar', 'Doha', ARRAY['ar', 'en'], ARRAY['Food', 'Travel'], ARRAY['Food', 'Travel', 'Lifestyle'], true, 2);

-- 샘플 인플루언서 소셜미디어 계정
INSERT INTO influencer_social_accounts (influencer_id, platform, username, followers_count, avg_views, engagement_rate, is_verified) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Instagram', 'demo_influencer', 50000, 5000, 4.2, true),
('850e8400-e29b-41d4-a716-446655440001', 'TikTok', 'demo_influencer', 30000, 15000, 6.8, false),
('850e8400-e29b-41d4-a716-446655440002', 'Instagram', 'aisha_beauty', 150000, 12000, 4.5, true),
('850e8400-e29b-41d4-a716-446655440002', 'YouTube', 'Aisha Beauty', 89000, 25000, 3.8, true),
('850e8400-e29b-41d4-a716-446655440003', 'Instagram', 'mohammed_style', 89000, 8000, 3.8, false),
('850e8400-e29b-41d4-a716-446655440003', 'TikTok', 'mohammed_style', 45000, 20000, 5.2, false),
('850e8400-e29b-41d4-a716-446655440004', 'Instagram', 'layla_foodie', 210000, 18000, 5.1, true),
('850e8400-e29b-41d4-a716-446655440004', 'YouTube', 'Layla Travels', 120000, 35000, 4.8, true);

-- =============================================
-- 4. 샘플 캠페인 데이터
-- =============================================

INSERT INTO campaigns (id, brand_id, title_ko, title_en, title_ar, description_ko, description_en, description_ar, category, budget_total, budget_per_influencer, status, target_regions, target_languages, min_followers, required_platforms, start_date, end_date, application_deadline, max_applications, max_influencers, tags, is_featured) VALUES
('950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', '캐어리 쿨링 토너 캠페인', 'Carery Cooling Toner Campaign', 'حملة تونر كاري المبرد', '시원하고 촉촉한 토너를 소개하는 캠페인', 'Campaign to introduce cool and moisturizing toner', 'حملة لتقديم التونر المبرد والمرطب', 'Beauty', 5000.00, 500.00, 'active', ARRAY['UAE', 'Saudi Arabia', 'Qatar'], ARRAY['ar', 'en'], 10000, ARRAY['Instagram', 'TikTok'], '2024-02-01', '2024-02-28', '2024-01-25', 20, 10, ARRAY['beauty', 'skincare', 'korean'], true),
('950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', '한국 음식 소개 캠페인', 'Korean Food Introduction Campaign', 'حملة تقديم الطعام الكوري', '한국 음식의 맛과 문화를 소개하는 캠페인', 'Campaign to introduce Korean food taste and culture', 'حملة لتقديم طعم وثقافة الطعام الكوري', 'Food', 8000.00, 800.00, 'active', ARRAY['UAE', 'Saudi Arabia', 'Egypt'], ARRAY['ar', 'en'], 15000, ARRAY['Instagram', 'YouTube'], '2024-02-15', '2024-03-15', '2024-02-10', 15, 8, ARRAY['food', 'korean', 'culture'], true),
('950e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', 'K-뷰티 세럼 캠페인', 'K-Beauty Serum Campaign', 'حملة سيروم كيوتي', '고농축 영양 세럼을 홍보하는 캠페인', 'Campaign to promote high-concentration nourishing serum', 'حملة للترويج للسيروم المغذي عالي التركيز', 'Beauty', 3000.00, 300.00, 'draft', ARRAY['Kuwait', 'Bahrain'], ARRAY['ar'], 5000, ARRAY['Instagram'], '2024-03-01', '2024-03-31', '2024-02-25', 10, 5, ARRAY['beauty', 'serum', 'skincare'], false);

-- =============================================
-- 5. 샘플 애플리케이션 데이터
-- =============================================

INSERT INTO campaign_applications (campaign_id, influencer_id, status, application_message, proposed_fee) VALUES
('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'approved', '캐어리 토너 캠페인에 관심이 많습니다. 뷰티 콘텐츠 전문가로서 좋은 성과를 낼 수 있을 것 같습니다.', 500.00),
('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002', 'approved', '뷰티 인플루언서로서 캐어리 토너의 장점을 잘 어필할 수 있습니다.', 600.00),
('950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440004', 'approved', '푸드 콘텐츠 전문가로서 한국 음식의 맛과 문화를 잘 전달할 수 있습니다.', 800.00),
('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440003', 'pending', '패션 인플루언서이지만 뷰티 제품도 다룰 수 있습니다.', 450.00);

-- =============================================
-- 6. 샘플 협업 데이터
-- =============================================

INSERT INTO campaign_collaborations (application_id, campaign_id, influencer_id, status, agreed_fee, started_at, brand_rating, influencer_rating) VALUES
(1, '950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'completed', 500.00, '2024-02-01', 5, 4),
(2, '950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002', 'active', 600.00, '2024-02-01', NULL, NULL),
(3, '950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440004', 'active', 800.00, '2024-02-15', NULL, NULL);

-- =============================================
-- 7. 샘플 채팅방 및 메시지 데이터
-- =============================================

INSERT INTO chat_rooms (id, campaign_id, name, type) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', '캐어리 토너 캠페인', 'campaign'),
('a50e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', '한국 음식 캠페인', 'campaign');

-- 채팅방 참여자
INSERT INTO chat_room_participants (room_id, user_id, role) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'admin'),
('a50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'member'),
('a50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 'member'),
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'admin'),
('a50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004', 'member');

-- 샘플 메시지
INSERT INTO messages (room_id, sender_id, content, message_type) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '안녕하세요! 캐어리 토너 캠페인에 참여해주셔서 감사합니다.', 'text'),
('a50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '네, 감사합니다! 좋은 캠페인이 될 것 같아요.', 'text'),
('a50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', '저도 참여하게 되어 기뻐요!', 'text'),
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '한국 음식 캠페인에 오신 것을 환영합니다!', 'text'),
('a50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004', '한국 음식에 대해 많이 배우고 싶어요!', 'text');

-- =============================================
-- 8. 샘플 알림 데이터
-- =============================================

INSERT INTO notifications (user_id, type, title, content, data) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'campaign_application', '캠페인 신청 승인', '캐어리 토너 캠페인 신청이 승인되었습니다.', '{"campaign_id": "950e8400-e29b-41d4-a716-446655440001"}'),
('750e8400-e29b-41d4-a716-446655440002', 'campaign_application', '캠페인 신청 승인', '캐어리 토너 캠페인 신청이 승인되었습니다.', '{"campaign_id": "950e8400-e29b-41d4-a716-446655440001"}'),
('750e8400-e29b-41d4-a716-446655440004', 'campaign_application', '캠페인 신청 승인', '한국 음식 캠페인 신청이 승인되었습니다.', '{"campaign_id": "950e8400-e29b-41d4-a716-446655440002"}'),
('550e8400-e29b-41d4-a716-446655440002', 'new_application', '새로운 캠페인 신청', '캐어리 토너 캠페인에 새로운 신청이 있습니다.', '{"campaign_id": "950e8400-e29b-41d4-a716-446655440001", "influencer_id": "850e8400-e29b-41d4-a716-446655440003"}');

-- =============================================
-- 9. 샘플 분석 데이터
-- =============================================

-- 캠페인 성과 분석 샘플 데이터
INSERT INTO campaign_analytics (campaign_id, collaboration_id, date, impressions, reach, engagement, clicks, conversions, revenue, roi) VALUES
('950e8400-e29b-41d4-a716-446655440001', 1, '2024-02-01', 50000, 45000, 1800, 450, 25, 1250.00, 150.00),
('950e8400-e29b-41d4-a716-446655440001', 1, '2024-02-02', 48000, 43000, 1720, 430, 22, 1100.00, 120.00),
('950e8400-e29b-41d4-a716-446655440001', 2, '2024-02-01', 75000, 68000, 2700, 680, 35, 1750.00, 192.00),
('950e8400-e29b-41d4-a716-446655440002', 3, '2024-02-15', 120000, 110000, 5500, 1100, 60, 3000.00, 275.00);

-- 인플루언서 성과 분석 샘플 데이터
INSERT INTO influencer_analytics (influencer_id, social_account_id, date, followers_count, posts_count, avg_engagement_rate, total_views, total_likes, total_comments) VALUES
('850e8400-e29b-41d4-a716-446655440001', 1, '2024-02-01', 50000, 2, 4.2, 10000, 420, 85),
('850e8400-e29b-41d4-a716-446655440002', 3, '2024-02-01', 150000, 3, 4.5, 36000, 1620, 324),
('850e8400-e29b-41d4-a716-446655440004', 7, '2024-02-15', 210000, 2, 5.1, 42000, 2142, 428);

-- =============================================
-- 10. 활동 로그 샘플 데이터
-- =============================================

INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'campaign_created', 'campaign', '950e8400-e29b-41d4-a716-446655440001', '{"title": "캐어리 쿨링 토너 캠페인"}'),
('750e8400-e29b-41d4-a716-446655440001', 'application_submitted', 'campaign_application', '1', '{"campaign_id": "950e8400-e29b-41d4-a716-446655440001"}'),
('750e8400-e29b-41d4-a716-446655440002', 'application_submitted', 'campaign_application', '2', '{"campaign_id": "950e8400-e29b-41d4-a716-446655440001"}'),
('750e8400-e29b-41d4-a716-446655440004', 'application_submitted', 'campaign_application', '3', '{"campaign_id": "950e8400-e29b-41d4-a716-446655440002"}');

-- =============================================
-- 완료 메시지
-- =============================================

-- 데이터 시딩 완료
SELECT 'ME-IN 플랫폼 초기 데이터 시딩이 완료되었습니다!' as message;
