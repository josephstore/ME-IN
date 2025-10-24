'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { TestAccountService, TestAccount } from '@/lib/services/testAccountService'
import { useSimpleAuth } from '@/lib/SimpleAuthContext'
import { 
  Users, 
  UserPlus, 
  LogIn, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'

export default function TestAccountsPage() {
  const { user } = useSimpleAuth()
  const [testAccounts, setTestAccounts] = useState<TestAccount[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    loadTestAccounts()
  }, [])

  const loadTestAccounts = async () => {
    setIsLoading(true)
    try {
      const accounts = await TestAccountService.getTestAccounts()
      setTestAccounts(accounts)
    } catch (error) {
      showMessage('테스트 계정 목록을 불러오는데 실패했습니다.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const initializeTestData = async () => {
    setIsLoading(true)
    try {
      const result = await TestAccountService.initializeTestData()
      showMessage(result.message, result.success ? 'success' : 'error')
      if (result.success) {
        loadTestAccounts()
      }
    } catch (error) {
      showMessage('테스트 데이터 초기화에 실패했습니다.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const loginAsTestAccount = async (account: TestAccount) => {
    try {
      const result = await TestAccountService.loginTestAccount(account.email, account.password)
      if (result.success) {
        showMessage(`${account.name}으로 로그인되었습니다.`, 'success')
        // 페이지 새로고침으로 인증 상태 업데이트
        window.location.reload()
      } else {
        showMessage(`로그인 실패: ${result.error}`, 'error')
      }
    } catch (error) {
      showMessage('로그인 중 오류가 발생했습니다.', 'error')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showMessage('클립보드에 복사되었습니다.', 'success')
  }

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }))
  }

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600">테스트 계정 관리 페이지에 접근하려면 로그인해주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="w-8 h-8 mr-3 text-blue-600" />
                테스트 계정 관리
              </h1>
              <p className="text-gray-600 mt-1">
                개발 및 테스트를 위한 계정들을 관리합니다
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={initializeTestData}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                테스트 데이터 초기화
              </Button>
              <Button
                onClick={loadTestAccounts}
                disabled={isLoading}
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
            </div>
          </div>
        </div>

        {/* 메시지 */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' ? 'bg-green-50 border border-green-200' :
            messageType === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center">
              {messageType === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mr-2" />}
              {messageType === 'error' && <AlertCircle className="w-5 h-5 text-red-600 mr-2" />}
              <p className={`text-sm ${
                messageType === 'success' ? 'text-green-800' :
                messageType === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {message}
              </p>
            </div>
          </div>
        )}

        {/* 테스트 계정 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testAccounts.map((account) => (
            <div key={account.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    account.user_type === 'brand' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    <Users className={`w-5 h-5 ${
                      account.user_type === 'brand' ? 'text-blue-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{account.user_type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  account.user_type === 'brand' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {account.user_type === 'brand' ? '브랜드' : '인플루언서'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">이메일</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={account.email}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(account.email)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">비밀번호</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type={showPasswords[account.id] ? 'text' : 'password'}
                      value={account.password}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => togglePasswordVisibility(account.id)}
                    >
                      {showPasswords[account.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(account.password)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => loginAsTestAccount(account)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  이 계정으로 로그인
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* 사용 안내 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">사용 안내</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• <strong>테스트 데이터 초기화:</strong> Supabase에 실제 계정과 프로필을 생성합니다</li>
            <li>• <strong>이 계정으로 로그인:</strong> 선택한 테스트 계정으로 자동 로그인합니다</li>
            <li>• <strong>브랜드 계정:</strong> 캠페인 생성 및 관리 기능을 테스트할 수 있습니다</li>
            <li>• <strong>인플루언서 계정:</strong> 캠페인 신청 및 채팅 기능을 테스트할 수 있습니다</li>
            <li>• 모든 테스트 계정의 비밀번호는 <code className="bg-blue-100 px-1 rounded">password123</code>입니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


