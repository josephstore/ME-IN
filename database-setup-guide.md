# ME-IN 데이터베이스 설정 가이드

## 🚨 현재 상황
API 키 문제로 자동 설정이 어려워서 수동으로 설정해야 합니다.

## 📋 수동 설정 단계

### 1단계: Supabase 대시보드 접속
1. **브라우저에서 [https://supabase.com/dashboard](https://supabase.com/dashboard) 접속**
2. **프로젝트 `jltnvoyjnzlswsmddojf` 선택**

### 2단계: SQL Editor 접속
1. **왼쪽 메뉴에서 "SQL Editor" 클릭**
2. **"New query" 버튼 클릭**

### 3단계: 데이터베이스 스키마 실행

#### 첫 번째 쿼리: 기본 설정
```sql
-- ME-IN Platform Database Schema
-- Supabase PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update profiles table with additional fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
```

**실행 후 "Run" 버튼 클릭**

#### 두 번째 쿼리: 브랜드 프로필 테이블
```sql
-- BRAND PROFILES TABLE
CREATE TABLE IF NOT EXISTS brand_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large')),
  target_regions TEXT[],
  target_languages TEXT[],
  budget_range TEXT CHECK (budget_range IN ('low', 'medium', 'high', 'premium')),
  website TEXT,
  founded_year INTEGER,
  description TEXT,
  logo_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**실행 후 "Run" 버튼 클릭**

#### 세 번째 쿼리: 인플루언서 프로필 테이블
```sql
-- INFLUENCER PROFILES TABLE
CREATE TABLE IF NOT EXISTS influencer_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT NOT NULL,
  content_categories TEXT[],
  platforms JSONB DEFAULT '{}',
  total_followers INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  languages TEXT[],
  content_languages TEXT[],
  collaboration_history JSONB DEFAULT '[]',
  portfolio_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**실행 후 "Run" 버튼 클릭**

#### 네 번째 쿼리: 캠페인 테이블
```sql
-- CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brand_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  title_kr TEXT,
  description TEXT NOT NULL,
  description_kr TEXT,
  category TEXT NOT NULL,
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  target_regions TEXT[],
  target_languages TEXT[],
  requirements JSONB DEFAULT '{}',
  media_assets JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  application_deadline DATE,
  max_applications INTEGER,
  current_applications INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**실행 후 "Run" 버튼 클릭**

#### 다섯 번째 쿼리: 신청서 테이블
```sql
-- APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  influencer_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  proposal TEXT,
  portfolio_links JSONB DEFAULT '[]',
  proposed_budget INTEGER,
  timeline_days INTEGER,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, influencer_id)
);
```

**실행 후 "Run" 버튼 클릭**

#### 여섯 번째 쿼리: 메시지 및 알림 테이블
```sql
-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id),
  receiver_id UUID REFERENCES auth.users(id),
  campaign_id UUID REFERENCES campaigns(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  file_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN ('campaign', 'application', 'message', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**실행 후 "Run" 버튼 클릭**

#### 일곱 번째 쿼리: 인덱스 생성
```sql
-- INDEXES
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_budget_range ON campaigns(budget_min, budget_max);

CREATE INDEX IF NOT EXISTS idx_applications_campaign_id ON applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_applications_influencer_id ON applications(influencer_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_campaign_id ON messages(campaign_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
```

**실행 후 "Run" 버튼 클릭**

#### 여덟 번째 쿼리: RLS 정책 설정
```sql
-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Brand profiles policies
CREATE POLICY "Users can view own brand profile" ON brand_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own brand profile" ON brand_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own brand profile" ON brand_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Influencer profiles policies
CREATE POLICY "Users can view own influencer profile" ON influencer_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own influencer profile" ON influencer_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own influencer profile" ON influencer_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Campaigns policies
CREATE POLICY "Brands can manage own campaigns" ON campaigns
  FOR ALL USING (auth.uid() = brand_id);

CREATE POLICY "Influencers can view active campaigns" ON campaigns
  FOR SELECT USING (status = 'active');

-- Applications policies
CREATE POLICY "Influencers can manage own applications" ON applications
  FOR ALL USING (auth.uid() = influencer_id);

CREATE POLICY "Brands can view applications for own campaigns" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = applications.campaign_id 
      AND campaigns.brand_id = auth.uid()
    )
  );

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
```

**실행 후 "Run" 버튼 클릭**

#### 아홉 번째 쿼리: 함수 및 트리거
```sql
-- FUNCTIONS AND TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON brand_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencer_profiles_updated_at BEFORE UPDATE ON influencer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION increment_application_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE campaigns 
  SET current_applications = current_applications + 1
  WHERE id = NEW.campaign_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_campaign_applications AFTER INSERT ON applications
  FOR EACH ROW EXECUTE FUNCTION increment_application_count();
```

**실행 후 "Run" 버튼 클릭**

### 4단계: 스토리지 설정

#### 열 번째 쿼리: 스토리지 버킷 생성
```sql
-- STORAGE BUCKETS CREATION
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'campaign-images',
  'campaign-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logo-images',
  'logo-images',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;
```

**실행 후 "Run" 버튼 클릭**

#### 열한 번째 쿼리: 스토리지 정책
```sql
-- STORAGE POLICIES
CREATE POLICY "Users can upload own profile images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own profile images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own profile images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Brands can upload campaign images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'campaign-images' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'brand'
    )
  );

CREATE POLICY "Brands can update own campaign images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'campaign-images' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'brand'
    )
  );

CREATE POLICY "Brands can delete own campaign images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'campaign-images' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'brand'
    )
  );

CREATE POLICY "Anyone can view campaign images" ON storage.objects
  FOR SELECT USING (bucket_id = 'campaign-images');

CREATE POLICY "Brands can upload logo images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'logo-images' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'brand'
    )
  );

CREATE POLICY "Brands can update own logo images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'logo-images' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'brand'
    )
  );

CREATE POLICY "Brands can delete own logo images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'logo-images' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'brand'
    )
  );

CREATE POLICY "Anyone can view logo images" ON storage.objects
  FOR SELECT USING (bucket_id = 'logo-images');
```

**실행 후 "Run" 버튼 클릭**

## ✅ 완료 확인

모든 쿼리를 실행한 후:

1. **Database** → **Tables** 에서 다음 테이블들이 생성되었는지 확인:
   - `profiles`
   - `brand_profiles` 
   - `influencer_profiles`
   - `campaigns`
   - `applications`
   - `messages`
   - `notifications`

2. **Storage** → **Buckets** 에서 다음 버킷들이 생성되었는지 확인:
   - `profile-images`
   - `campaign-images`
   - `logo-images`

## 🎉 완료!

이제 ME-IN 플랫폼의 데이터베이스가 완전히 설정되었습니다!

**온라인 배포 링크**: https://me-ahq0og76c-josephstores-projects.vercel.app

이 링크에서 회원가입, 로그인, 파일 업로드, 캠페인 생성 등의 기능을 테스트해보세요.
