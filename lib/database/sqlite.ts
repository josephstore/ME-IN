import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// 데이터베이스 파일 경로
const dbPath = path.join(process.cwd(), 'data', 'me-in.db')

// 데이터 디렉토리가 없으면 생성
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// 데이터베이스 연결
export const db = new Database(dbPath)

// 데이터베이스 초기화
export function initializeDatabase() {
  try {
    // 사용자 테이블
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        user_type TEXT NOT NULL CHECK (user_type IN ('brand', 'influencer')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 브랜드 프로필 테이블
    db.exec(`
      CREATE TABLE IF NOT EXISTS brand_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        company_name TEXT NOT NULL,
        industry TEXT,
        target_markets TEXT,
        logo_url TEXT,
        website_url TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)

    // 인플루언서 프로필 테이블
    db.exec(`
      CREATE TABLE IF NOT EXISTS influencer_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        content_categories TEXT,
        total_followers INTEGER DEFAULT 0,
        avg_engagement_rate REAL DEFAULT 0,
        collaboration_history TEXT,
        rating REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)

    // 캠페인 테이블
    db.exec(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        title TEXT NOT NULL,
        title_en TEXT,
        title_ar TEXT,
        description TEXT NOT NULL,
        description_en TEXT,
        description_ar TEXT,
        category TEXT NOT NULL,
        budget_min INTEGER NOT NULL,
        budget_max INTEGER NOT NULL,
        currency TEXT DEFAULT 'USD',
        target_languages TEXT,
        target_regions TEXT,
        min_followers INTEGER DEFAULT 0,
        content_requirements TEXT,
        start_date DATE,
        end_date DATE,
        application_deadline DATE,
        max_applications INTEGER,
        media_assets TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (brand_id) REFERENCES users (id)
      )
    `)

    // 캠페인 신청 테이블
    db.exec(`
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        influencer_id TEXT NOT NULL,
        proposal TEXT NOT NULL,
        expected_fee INTEGER,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campaign_id) REFERENCES campaigns (id),
        FOREIGN KEY (influencer_id) REFERENCES users (id)
      )
    `)

    // 포트폴리오 테이블
    db.exec(`
      CREATE TABLE IF NOT EXISTS portfolios (
        id TEXT PRIMARY KEY,
        influencer_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        media_urls TEXT,
        category TEXT,
        like_count INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (influencer_id) REFERENCES users (id)
      )
    `)

    console.log('✅ 데이터베이스 초기화 완료')
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error)
  }
}

// 데이터베이스 초기화 실행
initializeDatabase()

// 유틸리티 함수들
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function hashPassword(password: string): string {
  // 간단한 해시 함수 (실제 프로덕션에서는 bcrypt 사용 권장)
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32bit integer로 변환
  }
  return hash.toString()
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}
