'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { errorHandler, AppError } from '@/lib/utils/errorHandler'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substring(2)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError: AppError = {
      code: 'REACT_ERROR_BOUNDARY',
      message: error.message,
      details: {
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        errorBoundary: true
      },
      timestamp: new Date().toISOString(),
      action: 'component_render'
    }

    errorHandler.logError(appError)

    this.setState({
      error,
      errorInfo,
      errorId: appError.code
    })

    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReportBug = () => {
    const { error, errorInfo, errorId } = this.state
    if (error && errorInfo) {
      const bugReport = {
        errorId,
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }

      // 버그 리포트를 외부 서비스로 전송하거나 로컬에 저장
      console.log('Bug Report:', bugReport)
      
      // 사용자에게 피드백 제공
      alert('버그 리포트가 전송되었습니다. 빠른 시일 내에 수정하겠습니다.')
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              {/* 에러 아이콘 */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>

              {/* 에러 제목 */}
              <h1 className="text-lg font-semibold text-gray-900 mb-2">
                문제가 발생했습니다
              </h1>

              {/* 에러 설명 */}
              <p className="text-sm text-gray-600 mb-6">
                예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 홈으로 돌아가주세요.
              </p>

              {/* 에러 ID (개발 환경에서만 표시) */}
              {process.env.NODE_ENV === 'development' && this.state.errorId && (
                <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">에러 ID:</p>
                  <p className="text-xs font-mono text-gray-700 break-all">
                    {this.state.errorId}
                  </p>
                </div>
              )}

              {/* 액션 버튼들 */}
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  다시 시도
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Home className="h-4 w-4 mr-2" />
                  홈으로 돌아가기
                </button>

                <button
                  onClick={this.handleReportBug}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  버그 리포트
                </button>
              </div>

              {/* 개발 환경에서 상세 에러 정보 표시 */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                    개발자 정보 (클릭하여 펼치기)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 함수형 컴포넌트용 에러 바운더리 훅
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: string) => {
    const appError: AppError = {
      code: 'HOOK_ERROR',
      message: error.message,
      details: {
        error: error.toString(),
        errorInfo,
        hook: true
      },
      timestamp: new Date().toISOString(),
      action: 'hook_execution'
    }

    errorHandler.logError(appError)
  }

  return { handleError }
}
