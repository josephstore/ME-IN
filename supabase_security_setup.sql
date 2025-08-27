-- ME-IN Platform Supabase Security Setup
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- =============================================
-- ADDITIONAL SECURITY POLICIES
-- =============================================

-- 프로필 공개 조회 정책 (브랜드/인플루언서 매칭용)
CREATE POLICY "Public profiles can be viewed for matching" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type IN ('brand', 'influencer')
    )
  );

-- 브랜드 프로필 공개 조회 정책
CREATE POLICY "Brand profiles can be viewed by influencers" ON brand_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'influencer'
    )
  );

-- 인플루언서 프로필 공개 조회 정책
CREATE POLICY "Influencer profiles can be viewed by brands" ON influencer_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'brand'
    )
  );

-- =============================================
-- FUNCTION SECURITY
-- =============================================

-- 사용자 타입 확인 함수
CREATE OR REPLACE FUNCTION get_user_type(user_id uuid)
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT user_type 
    FROM profiles 
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 브랜드 권한 확인 함수
CREATE OR REPLACE FUNCTION is_brand(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN get_user_type(user_id) = 'brand';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 인플루언서 권한 확인 함수
CREATE OR REPLACE FUNCTION is_influencer(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN get_user_type(user_id) = 'influencer';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ENHANCED STORAGE POLICIES
-- =============================================

-- 파일 크기 제한 확인 함수
CREATE OR REPLACE FUNCTION check_file_size(file_size bigint, bucket_id text)
RETURNS boolean AS $$
DECLARE
  max_size bigint;
BEGIN
  SELECT file_size_limit INTO max_size
  FROM storage.buckets
  WHERE id = bucket_id;
  
  RETURN file_size <= max_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 파일 타입 확인 함수
CREATE OR REPLACE FUNCTION check_file_type(mime_type text, bucket_id text)
RETURNS boolean AS $$
DECLARE
  allowed_types text[];
BEGIN
  SELECT allowed_mime_types INTO allowed_types
  FROM storage.buckets
  WHERE id = bucket_id;
  
  RETURN mime_type = ANY(allowed_types);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- AUDIT LOGGING
-- =============================================

-- 감사 로그 테이블
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 감사 로그 정책
CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- 감사 로그 함수
CREATE OR REPLACE FUNCTION log_audit_event(
  action_name text,
  table_name text DEFAULT NULL,
  record_id uuid DEFAULT NULL,
  old_data jsonb DEFAULT NULL,
  new_data jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    action_name,
    table_name,
    record_id,
    old_data,
    new_data,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- RATE LIMITING
-- =============================================

-- 요청 제한 테이블
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 요청 제한 확인 함수
CREATE OR REPLACE FUNCTION check_rate_limit(
  action_type text,
  max_requests integer DEFAULT 100,
  window_minutes integer DEFAULT 1
)
RETURNS boolean AS $$
DECLARE
  current_count integer;
BEGIN
  -- 오래된 기록 삭제
  DELETE FROM rate_limits 
  WHERE window_start < NOW() - INTERVAL '1 minute' * window_minutes;
  
  -- 현재 요청 수 확인
  SELECT COALESCE(SUM(request_count), 0) INTO current_count
  FROM rate_limits
  WHERE user_id = auth.uid()
    AND action_type = check_rate_limit.action_type
    AND window_start > NOW() - INTERVAL '1 minute' * window_minutes;
  
  -- 제한 초과 확인
  IF current_count >= max_requests THEN
    RETURN false;
  END IF;
  
  -- 요청 기록 업데이트
  INSERT INTO rate_limits (user_id, action_type, request_count)
  VALUES (auth.uid(), action_type, 1)
  ON CONFLICT (user_id, action_type, window_start)
  DO UPDATE SET request_count = rate_limits.request_count + 1;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- 감사 로그 인덱스
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- 요청 제한 인덱스
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- =============================================
-- CLEANUP FUNCTIONS
-- =============================================

-- 오래된 감사 로그 정리 함수
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(days_to_keep integer DEFAULT 90)
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 오래된 요청 제한 정리 함수
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits(hours_to_keep integer DEFAULT 24)
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM rate_limits 
  WHERE created_at < NOW() - INTERVAL '1 hour' * hours_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
