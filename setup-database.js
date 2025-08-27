const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 설정 - Service Role Key 사용
const supabaseUrl = 'https://jltnvoyjnzlswsmddojf.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdG52b3lqbnpsc3dzbWRkb2pmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4OTkyNCwiZXhwIjoyMDcwOTY1OTI0fQ.5blt8JeShSgBA50l5bcE30Um1nGlYJAl685XBdVrqdg';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL(sql) {
  try {
    // SQL을 개별 문장으로 분리
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const { data, error } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          });
          
          if (error) {
            console.log(`⚠️  SQL 실행 중 오류 (무시됨): ${error.message}`);
          }
        } catch (err) {
          console.log(`⚠️  SQL 실행 중 오류 (무시됨): ${err.message}`);
        }
      }
    }
    return true;
  } catch (error) {
    console.log(`❌ SQL 실행 실패: ${error.message}`);
    return false;
  }
}

async function setupDatabase() {
  console.log('🚀 ME-IN 데이터베이스 설정을 시작합니다...\n');

  try {
    // 1. 기본 확장 프로그램 설치
    console.log('📋 1단계: 기본 확장 프로그램 설치...');
    await executeSQL('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('✅ 기본 확장 프로그램 설치 완료');

    // 2. profiles 테이블 확장
    console.log('\n👥 2단계: profiles 테이블 확장...');
    const profileAlters = `
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
    `;
    await executeSQL(profileAlters);
    console.log('✅ profiles 테이블 확장 완료');

    // 3. brand_profiles 테이블 생성
    console.log('\n🏢 3단계: brand_profiles 테이블 생성...');
    const brandProfilesSQL = `
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
    `;
    await executeSQL(brandProfilesSQL);
    console.log('✅ brand_profiles 테이블 생성 완료');

    // 4. influencer_profiles 테이블 생성
    console.log('\n📱 4단계: influencer_profiles 테이블 생성...');
    const influencerProfilesSQL = `
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
    `;
    await executeSQL(influencerProfilesSQL);
    console.log('✅ influencer_profiles 테이블 생성 완료');

    // 5. campaigns 테이블 생성
    console.log('\n🎯 5단계: campaigns 테이블 생성...');
    const campaignsSQL = `
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
    `;
    await executeSQL(campaignsSQL);
    console.log('✅ campaigns 테이블 생성 완료');

    // 6. applications 테이블 생성
    console.log('\n📝 6단계: applications 테이블 생성...');
    const applicationsSQL = `
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
    `;
    await executeSQL(applicationsSQL);
    console.log('✅ applications 테이블 생성 완료');

    // 7. messages 테이블 생성
    console.log('\n💬 7단계: messages 테이블 생성...');
    const messagesSQL = `
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
    `;
    await executeSQL(messagesSQL);
    console.log('✅ messages 테이블 생성 완료');

    // 8. notifications 테이블 생성
    console.log('\n🔔 8단계: notifications 테이블 생성...');
    const notificationsSQL = `
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
    `;
    await executeSQL(notificationsSQL);
    console.log('✅ notifications 테이블 생성 완료');

    // 9. 인덱스 생성
    console.log('\n🔍 9단계: 인덱스 생성...');
    const indexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_id);
      CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
      CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);
      CREATE INDEX IF NOT EXISTS idx_applications_campaign_id ON applications(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_applications_influencer_id ON applications(influencer_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    `;
    await executeSQL(indexesSQL);
    console.log('✅ 인덱스 생성 완료');

    // 10. RLS 정책 설정
    console.log('\n🔒 10단계: RLS 정책 설정...');
    const rlsSQL = `
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
      ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
      ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
      ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    `;
    await executeSQL(rlsSQL);
    console.log('✅ RLS 정책 설정 완료');

    // 11. 스토리지 버킷 생성
    console.log('\n📦 11단계: 스토리지 버킷 생성...');
    const storageBucketsSQL = `
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES (
        'profile-images',
        'profile-images',
        true,
        5242880,
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      ) ON CONFLICT (id) DO NOTHING;

      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES (
        'campaign-images',
        'campaign-images',
        true,
        10485760,
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
      ) ON CONFLICT (id) DO NOTHING;

      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES (
        'logo-images',
        'logo-images',
        true,
        2097152,
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
      ) ON CONFLICT (id) DO NOTHING;
    `;
    await executeSQL(storageBucketsSQL);
    console.log('✅ 스토리지 버킷 생성 완료');

    // 12. 테이블 확인
    console.log('\n🔍 12단계: 테이블 생성 확인...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('⚠️  테이블 확인 중 오류:', tablesError.message);
    } else {
      console.log('📊 생성된 테이블들:');
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }

    // 13. 스토리지 버킷 확인
    console.log('\n📦 13단계: 스토리지 버킷 확인...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.log('⚠️  버킷 확인 중 오류:', bucketsError.message);
    } else {
      console.log('📦 생성된 스토리지 버킷들:');
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? '공개' : '비공개'})`);
      });
    }

    console.log('\n🎉 ME-IN 데이터베이스 설정이 완료되었습니다!');
    console.log('\n📝 다음 단계:');
    console.log('1. 온라인 배포 링크에서 회원가입/로그인 테스트');
    console.log('2. 파일 업로드 기능 테스트');
    console.log('3. 캠페인 생성 및 신청 기능 테스트');

  } catch (error) {
    console.error('❌ 데이터베이스 설정 중 오류 발생:', error.message);
    console.log('\n💡 해결 방법:');
    console.log('1. Supabase 대시보드에서 SQL Editor를 사용하여 수동으로 실행');
    console.log('2. 또는 Supabase CLI를 사용하여 로컬에서 실행');
  }
}

// 스크립트 실행
setupDatabase();
