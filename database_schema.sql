-- ME-IN Platform Database Schema
-- Supabase PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (기존 확장)
-- =============================================

-- Update profiles table with additional fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';

-- =============================================
-- BRAND PROFILES TABLE
-- =============================================

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

-- =============================================
-- INFLUENCER PROFILES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS influencer_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT NOT NULL,
  content_categories TEXT[],
  platforms JSONB DEFAULT '{}', -- {instagram: {handle: "@user", followers: 10000}, tiktok: {...}}
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

-- =============================================
-- CAMPAIGNS TABLE
-- =============================================

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

-- =============================================
-- APPLICATIONS TABLE
-- =============================================

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

-- =============================================
-- MESSAGES TABLE
-- =============================================

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

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================

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

-- =============================================
-- INDEXES
-- =============================================

-- Campaigns indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_budget_range ON campaigns(budget_min, budget_max);

-- Applications indexes
CREATE INDEX IF NOT EXISTS idx_applications_campaign_id ON applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_applications_influencer_id ON applications(influencer_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_campaign_id ON messages(campaign_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
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

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
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

-- Function to increment application count
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
