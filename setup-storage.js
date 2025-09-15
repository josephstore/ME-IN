// Supabase Storage 버킷 설정 스크립트
// 이 스크립트를 실행하기 전에 .env.local 파일에 Supabase 정보가 설정되어 있어야 합니다.

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// .env.local 파일에서 환경 변수 읽기
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    const envVars = {}
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        envVars[key.trim()] = value.trim()
      }
    })
    
    return envVars
  } catch (error) {
    console.error('❌ .env.local 파일을 읽을 수 없습니다:', error.message)
    return {}
  }
}

const envVars = loadEnvFile()
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.')
  console.error('   .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStorageBuckets() {
  console.log('🚀 Supabase Storage 버킷 설정을 시작합니다...')
  
  try {
    // 1. profile-images 버킷 생성
    console.log('📁 profile-images 버킷 생성 중...')
    const { data: profileBucket, error: profileError } = await supabase.storage.createBucket('profile-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    })
    
    if (profileError) {
      if (profileError.message.includes('already exists')) {
        console.log('✅ profile-images 버킷이 이미 존재합니다.')
      } else {
        console.error('❌ profile-images 버킷 생성 실패:', profileError.message)
      }
    } else {
      console.log('✅ profile-images 버킷이 성공적으로 생성되었습니다.')
    }

    // 2. campaign-images 버킷 생성
    console.log('📁 campaign-images 버킷 생성 중...')
    const { data: campaignBucket, error: campaignError } = await supabase.storage.createBucket('campaign-images', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
    })
    
    if (campaignError) {
      if (campaignError.message.includes('already exists')) {
        console.log('✅ campaign-images 버킷이 이미 존재합니다.')
      } else {
        console.error('❌ campaign-images 버킷 생성 실패:', campaignError.message)
      }
    } else {
      console.log('✅ campaign-images 버킷이 성공적으로 생성되었습니다.')
    }

    // 3. logo-images 버킷 생성
    console.log('📁 logo-images 버킷 생성 중...')
    const { data: logoBucket, error: logoError } = await supabase.storage.createBucket('logo-images', {
      public: true,
      fileSizeLimit: 2097152, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    })
    
    if (logoError) {
      if (logoError.message.includes('already exists')) {
        console.log('✅ logo-images 버킷이 이미 존재합니다.')
      } else {
        console.error('❌ logo-images 버킷 생성 실패:', logoError.message)
      }
    } else {
      console.log('✅ logo-images 버킷이 성공적으로 생성되었습니다.')
    }

    console.log('🎉 모든 Storage 버킷 설정이 완료되었습니다!')
    console.log('')
    console.log('📋 생성된 버킷:')
    console.log('   - profile-images (프로필 이미지, 5MB 제한)')
    console.log('   - campaign-images (캠페인 이미지, 10MB 제한)')
    console.log('   - logo-images (로고 이미지, 2MB 제한)')
    console.log('')
    console.log('💡 이제 프로필 사진 업로드가 정상적으로 작동할 것입니다!')

  } catch (error) {
    console.error('❌ Storage 설정 중 오류가 발생했습니다:', error.message)
    console.log('')
    console.log('🔧 수동 설정 방법:')
    console.log('   1. Supabase 대시보드 (https://supabase.com/dashboard) 접속')
    console.log('   2. 프로젝트 선택')
    console.log('   3. 왼쪽 메뉴에서 "Storage" 클릭')
    console.log('   4. "New bucket" 버튼 클릭')
    console.log('   5. 버킷 이름: "profile-images"')
    console.log('   6. "Public bucket" 체크')
    console.log('   7. "Create bucket" 클릭')
  }
}

// 스크립트 실행
setupStorageBuckets()
