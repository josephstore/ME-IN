// Supabase 데이터베이스 설정 스크립트
// Node.js 환경에서 실행하여 데이터베이스 스키마 생성 및 초기 데이터 시딩

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase 설정
const supabaseUrl = 'https://jltnvoyjnzlswsmddojf.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  try {
    console.log('🚀 ME-IN 데이터베이스 설정을 시작합니다...')

    // 1. 데이터베이스 스키마 생성
    console.log('📋 데이터베이스 스키마를 생성합니다...')
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'database_schema_complete.sql'), 'utf8')
    
    // SQL을 세미콜론으로 분리하여 실행
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          if (error && !error.message.includes('already exists')) {
            console.warn('⚠️ SQL 실행 경고:', error.message)
          }
        } catch (err) {
          console.warn('⚠️ SQL 실행 중 오류:', err.message)
        }
      }
    }

    // 2. 초기 데이터 시딩
    console.log('🌱 초기 데이터를 시딩합니다...')
    const seedSQL = fs.readFileSync(path.join(__dirname, 'supabase_setup.sql'), 'utf8')
    
    const seedStatements = seedSQL.split(';').filter(stmt => stmt.trim())
    
    for (const statement of seedStatements) {
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          if (error && !error.message.includes('already exists')) {
            console.warn('⚠️ 시딩 SQL 실행 경고:', error.message)
          }
        } catch (err) {
          console.warn('⚠️ 시딩 SQL 실행 중 오류:', err.message)
        }
      }
    }

    // 3. 데이터 확인
    console.log('✅ 데이터베이스 설정이 완료되었습니다!')
    
    // 시스템 설정 확인
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('key, value')
      .limit(5)

    if (settingsError) {
      console.log('📊 시스템 설정:', '데이터베이스 연결 확인 필요')
    } else {
      console.log('📊 시스템 설정:', settings?.length || 0, '개 항목')
    }

    // 브랜드 데이터 확인
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('id, company_name_ko')
      .limit(5)

    if (brandsError) {
      console.log('🏢 브랜드 데이터:', '데이터베이스 연결 확인 필요')
    } else {
      console.log('🏢 브랜드 데이터:', brands?.length || 0, '개 브랜드')
    }

    // 인플루언서 데이터 확인
    const { data: influencers, error: influencersError } = await supabase
      .from('influencers')
      .select('id, name')
      .limit(5)

    if (influencersError) {
      console.log('👥 인플루언서 데이터:', '데이터베이스 연결 확인 필요')
    } else {
      console.log('👥 인플루언서 데이터:', influencers?.length || 0, '명')
    }

    // 캠페인 데이터 확인
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, title_ko')
      .limit(5)

    if (campaignsError) {
      console.log('📢 캠페인 데이터:', '데이터베이스 연결 확인 필요')
    } else {
      console.log('📢 캠페인 데이터:', campaigns?.length || 0, '개 캠페인')
    }

    console.log('\n🎉 ME-IN 플랫폼 데이터베이스 설정이 완료되었습니다!')
    console.log('📝 다음 단계:')
    console.log('   1. .env.local 파일에 SUPABASE_SERVICE_ROLE_KEY 설정')
    console.log('   2. API 라우트에서 더미 데이터를 실제 데이터로 교체')
    console.log('   3. 프론트엔드에서 실제 API 연동 테스트')

  } catch (error) {
    console.error('❌ 데이터베이스 설정 중 오류 발생:', error)
    console.log('\n🔧 문제 해결 방법:')
    console.log('   1. Supabase 프로젝트가 활성화되어 있는지 확인')
    console.log('   2. SUPABASE_SERVICE_ROLE_KEY가 올바른지 확인')
    console.log('   3. Supabase Dashboard에서 SQL Editor로 직접 스키마 실행')
  }
}

// 스크립트 실행
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }
