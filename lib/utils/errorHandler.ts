/**
 * ME-IN 플랫폼 에러 핸들링 유틸리티
 * 통합된 에러 처리 및 로깅 시스템
 */

export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
  userId?: string
  action?: string
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorLog: AppError[] = []

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * 에러 로깅
   */
  logError(error: AppError): void {
    this.errorLog.push(error)
    
    // 콘솔에 에러 출력
    console.error('ME-IN Error:', {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
      userId: error.userId,
      action: error.action
    })

    // 프로덕션 환경에서는 외부 로깅 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalLogger(error)
    }
  }

  /**
   * Supabase 에러 처리
   */
  handleSupabaseError(error: any, action: string, userId?: string): AppError {
    const appError: AppError = {
      code: error.code || 'SUPABASE_ERROR',
      message: this.getSupabaseErrorMessage(error),
      details: error,
      timestamp: new Date().toISOString(),
      userId,
      action
    }

    this.logError(appError)
    return appError
  }

  /**
   * 네트워크 에러 처리
   */
  handleNetworkError(error: any, action: string, userId?: string): AppError {
    const appError: AppError = {
      code: 'NETWORK_ERROR',
      message: this.getNetworkErrorMessage(error),
      details: error,
      timestamp: new Date().toISOString(),
      userId,
      action
    }

    this.logError(appError)
    return appError
  }

  /**
   * 인증 에러 처리
   */
  handleAuthError(error: any, action: string, userId?: string): AppError {
    const appError: AppError = {
      code: 'AUTH_ERROR',
      message: this.getAuthErrorMessage(error),
      details: error,
      timestamp: new Date().toISOString(),
      userId,
      action
    }

    this.logError(appError)
    return appError
  }

  /**
   * 파일 업로드 에러 처리
   */
  handleFileUploadError(error: any, action: string, userId?: string): AppError {
    const appError: AppError = {
      code: 'FILE_UPLOAD_ERROR',
      message: this.getFileUploadErrorMessage(error),
      details: error,
      timestamp: new Date().toISOString(),
      userId,
      action
    }

    this.logError(appError)
    return appError
  }

  /**
   * 번역 에러 처리
   */
  handleTranslationError(error: any, action: string, userId?: string): AppError {
    const appError: AppError = {
      code: 'TRANSLATION_ERROR',
      message: this.getTranslationErrorMessage(error),
      details: error,
      timestamp: new Date().toISOString(),
      userId,
      action
    }

    this.logError(appError)
    return appError
  }

  /**
   * 사용자 친화적 에러 메시지 생성
   */
  getUserFriendlyMessage(error: AppError): string {
    const errorMessages: Record<string, string> = {
      'SUPABASE_ERROR': '데이터베이스 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      'NETWORK_ERROR': '네트워크 연결을 확인해주세요.',
      'AUTH_ERROR': '인증에 문제가 발생했습니다. 다시 로그인해주세요.',
      'FILE_UPLOAD_ERROR': '파일 업로드에 실패했습니다. 파일 크기와 형식을 확인해주세요.',
      'TRANSLATION_ERROR': '번역 서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      'VALIDATION_ERROR': '입력한 정보를 다시 확인해주세요.',
      'PERMISSION_ERROR': '이 작업을 수행할 권한이 없습니다.',
      'NOT_FOUND_ERROR': '요청한 정보를 찾을 수 없습니다.',
      'RATE_LIMIT_ERROR': '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
    }

    return errorMessages[error.code] || '알 수 없는 오류가 발생했습니다.'
  }

  /**
   * 에러 복구 제안
   */
  getRecoverySuggestion(error: AppError): string[] {
    const suggestions: Record<string, string[]> = {
      'SUPABASE_ERROR': [
        '페이지를 새로고침해보세요',
        '인터넷 연결을 확인해주세요',
        '잠시 후 다시 시도해주세요'
      ],
      'NETWORK_ERROR': [
        '인터넷 연결을 확인해주세요',
        'Wi-Fi 연결을 다시 시도해주세요',
        '모바일 데이터로 전환해보세요'
      ],
      'AUTH_ERROR': [
        '다시 로그인해주세요',
        '브라우저 캐시를 삭제해보세요',
        '계정 상태를 확인해주세요'
      ],
      'FILE_UPLOAD_ERROR': [
        '파일 크기를 확인해주세요 (최대 10MB)',
        '지원되는 파일 형식인지 확인해주세요',
        '다른 파일로 시도해보세요'
      ],
      'TRANSLATION_ERROR': [
        '잠시 후 다시 시도해주세요',
        '다른 언어로 번역해보세요',
        '텍스트 길이를 줄여보세요'
      ]
    }

    return suggestions[error.code] || ['잠시 후 다시 시도해주세요']
  }

  /**
   * 에러 로그 조회
   */
  getErrorLog(limit: number = 100): AppError[] {
    return this.errorLog.slice(-limit)
  }

  /**
   * 에러 로그 초기화
   */
  clearErrorLog(): void {
    this.errorLog = []
  }

  /**
   * Supabase 에러 메시지 변환
   */
  private getSupabaseErrorMessage(error: any): string {
    if (error.message) {
      return error.message
    }
    
    switch (error.code) {
      case 'PGRST116':
        return '요청한 데이터를 찾을 수 없습니다'
      case '23505':
        return '이미 존재하는 데이터입니다'
      case '23503':
        return '관련된 데이터가 없습니다'
      case '42501':
        return '권한이 없습니다'
      default:
        return '데이터베이스 오류가 발생했습니다'
    }
  }

  /**
   * 네트워크 에러 메시지 변환
   */
  private getNetworkErrorMessage(error: any): string {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return '네트워크 연결에 실패했습니다'
    }
    
    if (error.status) {
      switch (error.status) {
        case 404:
          return '요청한 리소스를 찾을 수 없습니다'
        case 500:
          return '서버 오류가 발생했습니다'
        case 503:
          return '서비스가 일시적으로 사용할 수 없습니다'
        default:
          return `네트워크 오류 (${error.status})`
      }
    }
    
    return '네트워크 연결에 문제가 발생했습니다'
  }

  /**
   * 인증 에러 메시지 변환
   */
  private getAuthErrorMessage(error: any): string {
    if (error.message) {
      if (error.message.includes('Invalid login credentials')) {
        return '이메일 또는 비밀번호가 올바르지 않습니다'
      }
      if (error.message.includes('Email not confirmed')) {
        return '이메일 인증을 완료해주세요'
      }
      if (error.message.includes('User already registered')) {
        return '이미 등록된 이메일입니다'
      }
    }
    
    return '인증에 문제가 발생했습니다'
  }

  /**
   * 파일 업로드 에러 메시지 변환
   */
  private getFileUploadErrorMessage(error: any): string {
    if (error.message) {
      if (error.message.includes('File too large')) {
        return '파일 크기가 너무 큽니다'
      }
      if (error.message.includes('Invalid file type')) {
        return '지원되지 않는 파일 형식입니다'
      }
    }
    
    return '파일 업로드에 실패했습니다'
  }

  /**
   * 번역 에러 메시지 변환
   */
  private getTranslationErrorMessage(error: any): string {
    if (error.message) {
      if (error.message.includes('API key')) {
        return '번역 서비스 설정에 문제가 있습니다'
      }
      if (error.message.includes('quota')) {
        return '번역 서비스 사용량을 초과했습니다'
      }
    }
    
    return '번역 서비스에 문제가 발생했습니다'
  }

  /**
   * 외부 로깅 서비스로 전송
   */
  private async sendToExternalLogger(error: AppError): Promise<void> {
    try {
      // 여기에 외부 로깅 서비스 (예: Sentry, LogRocket 등) 연동
      // await externalLogger.captureException(error)
    } catch (loggerError) {
      console.error('Failed to send error to external logger:', loggerError)
    }
  }
}

// 전역 에러 핸들러 인스턴스
export const errorHandler = ErrorHandler.getInstance()

// 편의 함수들
export const handleError = (error: any, action: string, userId?: string) => {
  return errorHandler.handleSupabaseError(error, action, userId)
}

export const handleNetworkError = (error: any, action: string, userId?: string) => {
  return errorHandler.handleNetworkError(error, action, userId)
}

export const handleAuthError = (error: any, action: string, userId?: string) => {
  return errorHandler.handleAuthError(error, action, userId)
}

export const getUserFriendlyMessage = (error: AppError) => {
  return errorHandler.getUserFriendlyMessage(error)
}

export const getRecoverySuggestion = (error: AppError) => {
  return errorHandler.getRecoverySuggestion(error)
}
