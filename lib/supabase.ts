import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '설정됨' : '설정되지 않음')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '설정됨' : '설정되지 않음')
}

// 연결 상태 확인
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey ? '설정됨' : '설정되지 않음')

// 싱글톤 패턴으로 Supabase 클라이언트 생성
let supabaseInstance: SupabaseClient | null = null

export const supabase = (() => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase 클라이언트를 생성할 수 없습니다. 환경 변수를 확인해주세요.')
      throw new Error('Supabase 환경 변수가 설정되지 않았습니다')
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      },
      global: {
        fetch: (url, options = {}) => {
          // 타임아웃 설정을 위한 AbortController
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10초 타임아웃
          
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'User-Agent': 'ME-IN-Platform/1.0.0',
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            signal: controller.signal
          }).finally(() => {
            clearTimeout(timeoutId)
          })
        }
      }
    })
  }
  return supabaseInstance
})()

// 연결 테스트 함수
export const testSupabaseConnection = async () => {
  try {
    console.log('Supabase 연결 테스트 시작...')
    const { data, error } = await supabase
      .from('campaigns')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase 연결 테스트 실패:', error)
      return false
    }

    console.log('Supabase 연결 테스트 성공')
    return true
  } catch (error) {
    console.error('Supabase 연결 테스트 오류:', error)
    return false
  }
}

// 네트워크 연결 테스트 함수
export const testNetworkConnection = async () => {
  try {
    console.log('네트워크 연결 테스트 시작...')
    const response = await fetch('https://jltnvoyjnzlswsmddojf.supabase.co/rest/v1/', {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    
    if (response.ok) {
      console.log('네트워크 연결 테스트 성공')
      return true
    } else {
      console.error('네트워크 연결 테스트 실패:', response.status, response.statusText)
      return false
    }
  } catch (error) {
    console.error('네트워크 연결 테스트 오류:', error)
    return false
  }
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    name?: string
    user_type?: 'brand' | 'influencer'
    language?: string[]
    timezone?: string
  }
  created_at: string
  updated_at: string
}

export interface AuthError {
  message: string
  status?: number
}
