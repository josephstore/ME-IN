'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { CampaignService } from '@/lib/services/campaignService'
import { ChatService } from '@/lib/services/chatService'
import { TestAccountService } from '@/lib/services/testAccountService'
import { networkService } from '@/lib/services/networkService'
import { useSimpleAuth } from '@/lib/SimpleAuthContext'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Database,
  MessageCircle,
  Users,
  Wifi,
  WifiOff,
  Play,
  Pause
} from 'lucide-react'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'warning' | 'pending'
  message: string
  duration?: number
}

export default function TestPage() {
  const { user } = useSimpleAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: true,
    isSupabaseConnected: true
  })

  useEffect(() => {
    // 네트워크 상태 모니터링
    const unsubscribe = networkService.subscribe((status) => {
      setNetworkStatus(status)
    })

    return unsubscribe
  }, [])

  const runTest = async (testName: string, testFunction: () => Promise<any>): Promise<TestResult> => {
    const startTime = Date.now()
    
    try {
      const result = await testFunction()
      const duration = Date.now() - startTime
      
      return {
        name: testName,
        status: 'success',
        message: '테스트 통과',
        duration
      }
    } catch (error) {
      const duration = Date.now() - startTime
      
      return {
        name: testName,
        status: 'error',
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        duration
      }
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const tests = [
      {
        name: '네트워크 연결 테스트',
        test: async () => {
          const isConnected = await networkService.checkSupabaseConnection()
          if (!isConnected) throw new Error('Supabase 연결 실패')
        }
      },
      {
        name: '캠페인 데이터 로드 테스트',
        test: async () => {
          const response = await CampaignService.getActiveCampaigns()
          if (!response.success || !response.data) {
            throw new Error('캠페인 데이터 로드 실패')
          }
          if (response.data.length === 0) {
            throw new Error('캠페인 데이터가 비어있음')
          }
        }
      },
      {
        name: '채팅방 목록 테스트',
        test: async () => {
          if (!user) throw new Error('사용자 인증 필요')
          const response = await ChatService.getChatRooms()
          // 채팅방이 없어도 성공으로 처리 (정상적인 상태)
        }
      },
      {
        name: '테스트 계정 생성 테스트',
        test: async () => {
          const accounts = await TestAccountService.getTestAccounts()
          if (!accounts || accounts.length === 0) {
            throw new Error('테스트 계정 데이터 없음')
          }
        }
      },
      {
        name: '오프라인 모드 테스트',
        test: async () => {
          // 네트워크를 시뮬레이션으로 끊어서 테스트
          const originalOnline = navigator.onLine
          Object.defineProperty(navigator, 'onLine', {
            writable: true,
            value: false
          })

          try {
            const response = await CampaignService.getActiveCampaigns()
            if (!response.success) {
              throw new Error('오프라인 모드에서 데이터 로드 실패')
            }
          } finally {
            Object.defineProperty(navigator, 'onLine', {
              writable: true,
              value: originalOnline
            })
          }
        }
      },
      {
        name: '실시간 채팅 구독 테스트',
        test: async () => {
          const testRoomId = 'test-room-123'
          let subscriptionCalled = false

          const subscription = ChatService.subscribeToMessages(testRoomId, () => {
            subscriptionCalled = true
          })

          // 구독이 정상적으로 생성되었는지 확인
          if (!subscription) {
            throw new Error('채팅 구독 생성 실패')
          }

          subscription.unsubscribe()
        }
      }
    ]

    const results: TestResult[] = []

    for (const test of tests) {
      const result = await runTest(test.name, test.test)
      results.push(result)
      setTestResults([...results])
      
      // 테스트 간 간격
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const successCount = testResults.filter(r => r.status === 'success').length
  const errorCount = testResults.filter(r => r.status === 'error').length
  const warningCount = testResults.filter(r => r.status === 'warning').length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">시스템 테스트</h1>
              <p className="text-gray-600 mt-1">
                ME-IN 플랫폼의 모든 기능을 종합적으로 테스트합니다
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* 네트워크 상태 */}
              <div className="flex items-center space-x-2">
                {networkStatus.isOnline && networkStatus.isSupabaseConnected ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm text-gray-600">
                  {networkStatus.isOnline && networkStatus.isSupabaseConnected ? '연결됨' : '연결 끊김'}
                </span>
              </div>

              {/* 사용자 상태 */}
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {user ? user.name : '로그인 필요'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 테스트 실행 버튼 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">테스트 실행</h2>
              <p className="text-gray-600 text-sm">
                모든 시스템 기능을 순차적으로 테스트합니다
              </p>
            </div>
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  테스트 중...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  테스트 시작
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 테스트 결과 요약 */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">테스트 결과 요약</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-green-800">성공</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-red-800">실패</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                <div className="text-sm text-yellow-800">경고</div>
              </div>
            </div>
          </div>
        )}

        {/* 테스트 결과 목록 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">상세 테스트 결과</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {testResults.map((result, index) => (
              <div key={index} className={`p-6 ${getStatusColor(result.status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">{result.name}</h4>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {result.duration ? `${result.duration}ms` : '-'}
                    </div>
                    <div className="text-xs text-gray-500">소요 시간</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {testResults.length === 0 && !isRunning && (
            <div className="p-12 text-center">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">테스트를 실행해주세요</h3>
              <p className="text-gray-600">
                위의 "테스트 시작" 버튼을 클릭하여 시스템 테스트를 시작하세요.
              </p>
            </div>
          )}
        </div>

        {/* 빠른 링크 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">빠른 링크</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/campaigns" className="text-blue-700 hover:text-blue-800 text-sm">
              캠페인 목록
            </a>
            <a href="/messages" className="text-blue-700 hover:text-blue-800 text-sm">
              채팅 목록
            </a>
            <a href="/admin/test-accounts" className="text-blue-700 hover:text-blue-800 text-sm">
              테스트 계정
            </a>
            <a href="/profile" className="text-blue-700 hover:text-blue-800 text-sm">
              프로필
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}


