// Supabase 클라이언트 비활성화 - 로컬 SQLite 데이터베이스만 사용
// import { createClient, SupabaseClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jltnvoyjnzlswsmddojf.supabase.co'
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdG52b3lqbnpsc3dzbWRkb2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODk5MjQsImV4cCI6MjA3MDk2NTkyNH0.5blt8JeShSgBA50l5bcE30Um1nGlYJAl685XBdVrqdg'

// 싱글톤 패턴으로 Supabase 클라이언트 생성
// let supabaseInstance: SupabaseClient | null = null

// export const supabase = (() => {
//   if (!supabaseInstance) {
//     supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
//       auth: {
//         persistSession: true,
//         autoRefreshToken: true,
//         detectSessionInUrl: false
//       }
//     })
//   }
//   return supabaseInstance
// })()

// 더미 Supabase 클라이언트 - 실제로는 사용하지 않음
export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Supabase 비활성화됨' } })
      })
    }),
    insert: () => ({
      select: () => Promise.resolve({ data: null, error: { message: 'Supabase 비활성화됨' } })
    }),
    update: () => ({
      eq: () => ({
        select: () => Promise.resolve({ data: null, error: { message: 'Supabase 비활성화됨' } })
      })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: { message: 'Supabase 비활성화됨' } })
    })
  }),
  auth: {
    signIn: () => Promise.resolve({ data: null, error: { message: 'Supabase 비활성화됨' } }),
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase 비활성화됨' } }),
    signOut: () => Promise.resolve({ data: null, error: { message: 'Supabase 비활성화됨' } }),
    getUser: () => Promise.resolve({ data: null, error: { message: 'Supabase 비활성화됨' } })
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
