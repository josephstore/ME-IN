-- 간단한 프로필 테이블 생성 (빠른 테스트용)
-- Supabase SQL Editor에서 실행하세요

-- 1. 사용자 프로필 테이블 (간단 버전)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('brand', 'influencer')),
    display_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    location VARCHAR(100),
    bio TEXT,
    website VARCHAR(255),
    profile_image TEXT,
    social_media JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);

-- 3. RLS (Row Level Security) 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 생성
-- 사용자 자신의 프로필 조회
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자 자신의 프로필 업데이트
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- 사용자 자신의 프로필 생성
CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 업데이트 트리거
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. 테스트 데이터 삽입 (선택사항)
INSERT INTO user_profiles (user_id, user_type, display_name, email, phone, location, bio, website, profile_image)
VALUES (
    gen_random_uuid(), -- 실제 사용 시 auth.uid()로 대체
    'brand',
    'Ahmed Al-Mansouri',
    'ahmed@example.com',
    '+971 50 123 4567',
    'Dubai, UAE',
    'Passionate about connecting Korean and Middle Eastern cultures through digital content.',
    'https://ahmed.com',
    '/images/avatar.jpg'
) ON CONFLICT DO NOTHING;

