// 간단한 로컬 인증 시스템
export interface SimpleUser {
  id: string
  email: string
  name: string
  user_type: 'brand' | 'influencer'
  created_at: string
}

export interface SimpleAuth {
  user: SimpleUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string, user_type: 'brand' | 'influencer') => Promise<{ success: boolean; error?: string }>
  logout: () => void
  getCurrentUser: () => SimpleUser | null
}

// 로컬 스토리지 키
const AUTH_KEY = 'me-in-auth'
const USERS_KEY = 'me-in-users'
const AUTH_EXPIRY_KEY = 'me-in-auth-expiry'

// 세션 만료 시간 (7일)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7일을 밀리초로

// 사용자 데이터 타입
interface StoredUser {
  id: string
  email: string
  password: string
  name: string
  user_type: 'brand' | 'influencer'
  created_at: string
}

// 간단한 해시 함수 (실제 프로덕션에서는 더 안전한 방법 사용)
const simpleHash = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32bit integer로 변환
  }
  return hash.toString()
}

// 로컬 스토리지에서 사용자 목록 가져오기
const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// 로컬 스토리지에 사용자 목록 저장
const saveStoredUsers = (users: StoredUser[]): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch (error) {
    console.error('Failed to save users:', error)
  }
}

// 현재 인증된 사용자 가져오기
const getCurrentAuth = (): SimpleUser | null => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(AUTH_KEY)
    const expiry = localStorage.getItem(AUTH_EXPIRY_KEY)
    
    if (!stored || !expiry) return null
    
    // 세션 만료 확인
    const now = Date.now()
    const expiryTime = parseInt(expiry)
    
    if (now > expiryTime) {
      // 세션이 만료된 경우 정리
      localStorage.removeItem(AUTH_KEY)
      localStorage.removeItem(AUTH_EXPIRY_KEY)
      return null
    }
    
    return JSON.parse(stored)
  } catch {
    return null
  }
}

// 현재 인증된 사용자 저장
const saveCurrentAuth = (user: SimpleUser | null): void => {
  if (typeof window === 'undefined') return
  try {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
      // 세션 만료 시간 설정 (현재 시간 + 7일)
      const expiryTime = Date.now() + SESSION_DURATION
      localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString())
    } else {
      localStorage.removeItem(AUTH_KEY)
      localStorage.removeItem(AUTH_EXPIRY_KEY)
    }
  } catch (error) {
    console.error('Failed to save auth:', error)
  }
}

// 간단한 인증 시스템 구현
export const simpleAuth: SimpleAuth = {
  user: null,
  isAuthenticated: false,

  // 로그인
  login: async (email: string, password: string) => {
    try {
      const users = getStoredUsers()
      const user = users.find(u => u.email === email && u.password === simpleHash(password))
      
      if (!user) {
        return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
      }

      const authUser: SimpleUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        user_type: user.user_type,
        created_at: user.created_at
      }

      saveCurrentAuth(authUser)
      simpleAuth.user = authUser
      simpleAuth.isAuthenticated = true

      return { success: true }
    } catch (error) {
      return { success: false, error: '로그인 중 오류가 발생했습니다.' }
    }
  },

  // 회원가입
  register: async (email: string, password: string, name: string, user_type: 'brand' | 'influencer') => {
    try {
      const users = getStoredUsers()
      
      // 이메일 중복 확인
      if (users.find(u => u.email === email)) {
        return { success: false, error: '이미 사용 중인 이메일입니다.' }
      }

      // 새 사용자 생성
      const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        password: simpleHash(password),
        name,
        user_type,
        created_at: new Date().toISOString()
      }

      // 사용자 저장
      users.push(newUser)
      saveStoredUsers(users)

      // 자동 로그인
      const authUser: SimpleUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        user_type: newUser.user_type,
        created_at: newUser.created_at
      }

      saveCurrentAuth(authUser)
      simpleAuth.user = authUser
      simpleAuth.isAuthenticated = true

      return { success: true }
    } catch (error) {
      return { success: false, error: '회원가입 중 오류가 발생했습니다.' }
    }
  },

  // 로그아웃
  logout: () => {
    saveCurrentAuth(null)
    simpleAuth.user = null
    simpleAuth.isAuthenticated = false
  },

  // 현재 사용자 가져오기
  getCurrentUser: () => {
    if (simpleAuth.user) {
      return simpleAuth.user
    }
    
    const stored = getCurrentAuth()
    if (stored) {
      simpleAuth.user = stored
      simpleAuth.isAuthenticated = true
      return stored
    }
    
    return null
  }
}

// 초기화 시 저장된 사용자 정보 로드
const initializeAuth = () => {
  if (typeof window !== 'undefined') {
    try {
      const storedUser = getCurrentAuth()
      if (storedUser) {
        simpleAuth.user = storedUser
        simpleAuth.isAuthenticated = true
        console.log('Auth initialized with stored user:', storedUser)
      } else {
        console.log('No stored user found')
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      simpleAuth.user = null
      simpleAuth.isAuthenticated = false
    }
  }
}

// DOM이 로드된 후 초기화
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth)
  } else {
    initializeAuth()
  }
}
