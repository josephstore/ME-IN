'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useSimpleAuth } from '@/lib/SimpleAuthContext'
import { Button } from '@/components/ui/Button'
import { 
  Home, 
  Megaphone, 
  Users, 
  User, 
  LogOut,
  Plus,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useSimpleAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { name: '홈', href: '/', icon: Home },
    { name: '캠페인', href: '/campaigns', icon: Megaphone },
    { name: '인플루언서', href: '/influencers', icon: Users },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-navy-600 font-bold text-xl">ME-IN</span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* 사용자 메뉴 */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* 사용자 프로필 */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{user?.name}</div>
                      <div className="text-gray-500 capitalize">{user?.user_type}</div>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => router.push('/auth/login')}
                  variant="outline"
                  size="sm"
                >
                  로그인
                </Button>
                <Button
                  onClick={() => router.push('/auth/register')}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  size="sm"
                >
                  회원가입
                </Button>
              </div>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="outline"
              size="sm"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* 모바일 사용자 메뉴 */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center px-3 py-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user?.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{user?.user_type}</div>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      router.push('/auth/login')
                      setIsMobileMenuOpen(false)
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    로그인
                  </Button>
                  <Button
                    onClick={() => {
                      router.push('/auth/register')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    회원가입
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
