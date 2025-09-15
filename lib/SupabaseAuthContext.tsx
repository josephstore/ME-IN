'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, AuthUser } from './supabase'

interface SupabaseAuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: {
    name: string
    user_type: 'brand' | 'influencer'
    language?: string[]
    timezone?: string
  }) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AuthUser['user_metadata']>) => Promise<{ error: AuthError | null }>
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 데모 모드에서는 항상 브랜드 사용자로 설정
    const demoUser = {
      id: 'demo-brand-user',
      email: 'brand@me-in.com',
      user_metadata: {
        user_type: 'brand',
        name: 'Demo Brand User'
      }
    } as User

    const demoSession = {
      user: demoUser,
      access_token: 'demo-token',
      refresh_token: 'demo-refresh-token',
      expires_at: Date.now() + 3600000, // 1시간 후
      expires_in: 3600,
      token_type: 'bearer'
    } as Session

    setSession(demoSession)
    setUser(demoUser)
    setLoading(false)

    // 실제 Supabase 인증이 필요한 경우에만 아래 코드 사용
    /*
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
    */
  }, [])

  const signUp = async (email: string, password: string, userData: {
    name: string
    user_type: 'brand' | 'influencer'
    language?: string[]
    timezone?: string
  }) => {
    // 데모 모드에서는 항상 성공
    const demoUser = {
      id: 'demo-user',
      email,
      user_metadata: userData
    } as User

    const demoSession = {
      user: demoUser,
      access_token: 'demo-token',
      refresh_token: 'demo-refresh-token',
      expires_at: Date.now() + 3600000,
      expires_in: 3600,
      token_type: 'bearer'
    } as Session

    setSession(demoSession)
    setUser(demoUser)

    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    // 데모 모드에서는 항상 성공
    const demoUser = {
      id: 'demo-brand-user',
      email,
      user_metadata: {
        user_type: 'brand',
        name: 'Demo User'
      }
    } as User

    const demoSession = {
      user: demoUser,
      access_token: 'demo-token',
      refresh_token: 'demo-refresh-token',
      expires_at: Date.now() + 3600000,
      expires_in: 3600,
      token_type: 'bearer'
    } as Session

    setSession(demoSession)
    setUser(demoUser)

    return { error: null }
  }

  const signOut = async () => {
    // 데모 모드에서는 세션 초기화
    setSession(null)
    setUser(null)
  }

  const updateProfile = async (updates: Partial<AuthUser['user_metadata']>) => {
    // 데모 모드에서는 항상 성공
    if (user) {
      const updatedUser = {
        ...user,
        user_metadata: { ...user.user_metadata, ...updates }
      }
      setUser(updatedUser)
    }
    return { error: null }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}
