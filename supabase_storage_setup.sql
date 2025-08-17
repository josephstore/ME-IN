-- ME-IN Platform Supabase Storage Setup
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- =============================================
-- STORAGE BUCKETS CREATION
-- =============================================

-- 프로필 이미지 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 캠페인 이미지 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'campaign-images',
  'campaign-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
) ON CONFLICT (id) DO NOTHING;

-- 로고 이미지 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logo-images',
  'logo-images',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- 프로필 이미지 버킷 정책
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

-- 캠페인 이미지 버킷 정책
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

-- 로고 이미지 버킷 정책
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

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- 이미지 URL 생성 함수
CREATE OR REPLACE FUNCTION get_image_url(bucket_name text, file_path text)
RETURNS text AS $$
BEGIN
  RETURN 'https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 프로필 이미지 URL 생성 함수
CREATE OR REPLACE FUNCTION get_profile_image_url(user_id uuid)
RETURNS text AS $$
DECLARE
  image_path text;
BEGIN
  SELECT name INTO image_path
  FROM storage.objects
  WHERE bucket_id = 'profile-images'
    AND name LIKE user_id::text || '/%'
    AND name LIKE '%.jpg' OR name LIKE '%.png' OR name LIKE '%.webp'
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF image_path IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN get_image_url('profile-images', image_path);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
