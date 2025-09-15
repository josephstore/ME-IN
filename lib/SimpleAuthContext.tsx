'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { simpleAuth, SimpleUser } from './simpleAuth'

interface SimpleAuthContextType {
  user: SimpleUser | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string, user_type: 'brand' | 'influencer') => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined)

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 초기 로드 시 저장된 사용자 정보 확인
    const currentUser = simpleAuth.getCurrentUser()
    setUser(currentUser)
    setIsAuthenticated(!!currentUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await simpleAuth.login(email, password)
      if (result.success) {
        setUser(simpleAuth.user)
        setIsAuthenticated(true)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, user_type: 'brand' | 'influencer') => {
    setLoading(true)
    try {
      const result = await simpleAuth.register(email, password, name, user_type)
      if (result.success) {
        setUser(simpleAuth.user)
        setIsAuthenticated(true)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    simpleAuth.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  }

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  )
}

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext)
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider')
  }
  return context
}
