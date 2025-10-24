// 네트워크 연결 및 오프라인 모드 관리
export interface NetworkStatus {
  isOnline: boolean
  isSupabaseConnected: boolean
  lastChecked: Date
}

export class NetworkService {
  private static instance: NetworkService
  private networkStatus: NetworkStatus = {
    isOnline: navigator.onLine,
    isSupabaseConnected: false,
    lastChecked: new Date()
  }

  private listeners: Array<(status: NetworkStatus) => void> = []

  static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService()
    }
    return NetworkService.instance
  }

  constructor() {
    if (typeof window !== 'undefined') {
      // 온라인/오프라인 이벤트 리스너
      window.addEventListener('online', () => {
        this.networkStatus.isOnline = true
        this.notifyListeners()
        this.checkSupabaseConnection()
      })

      window.addEventListener('offline', () => {
        this.networkStatus.isOnline = false
        this.networkStatus.isSupabaseConnected = false
        this.notifyListeners()
      })

      // 초기 연결 상태 확인
      this.checkSupabaseConnection()
    }
  }

  // Supabase 연결 상태 확인
  async checkSupabaseConnection(): Promise<boolean> {
    try {
      const { supabase } = await import('../supabase')
      
      // 간단한 연결 테스트 (타임아웃 5초)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      this.networkStatus.isSupabaseConnected = response.ok
      this.networkStatus.lastChecked = new Date()
      this.notifyListeners()
      
      return response.ok
    } catch (error) {
      console.error('Supabase 연결 확인 실패:', error)
      this.networkStatus.isSupabaseConnected = false
      this.networkStatus.lastChecked = new Date()
      this.notifyListeners()
      return false
    }
  }

  // 네트워크 상태 구독
  subscribe(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.push(listener)
    
    // 즉시 현재 상태 전달
    listener(this.networkStatus)
    
    // 구독 해제 함수 반환
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // 리스너들에게 상태 변경 알림
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.networkStatus))
  }

  // 현재 네트워크 상태 반환
  getNetworkStatus(): NetworkStatus {
    return { ...this.networkStatus }
  }

  // 네트워크 오류인지 확인
  isNetworkError(error: any): boolean {
    if (!error) return false
    
    const errorMessage = error.message || error.toString()
    return (
      errorMessage.includes('Failed to fetch') ||
      errorMessage.includes('NetworkError') ||
      errorMessage.includes('ERR_NAME_NOT_RESOLVED') ||
      errorMessage.includes('ERR_INTERNET_DISCONNECTED') ||
      errorMessage.includes('ERR_NETWORK_CHANGED')
    )
  }

  // 오프라인 데이터 가져오기
  getOfflineData<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue
    
    try {
      const stored = localStorage.getItem(`offline_${key}`)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  }

  // 오프라인 데이터 저장
  setOfflineData<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify(data))
    } catch (error) {
      console.error('오프라인 데이터 저장 실패:', error)
    }
  }

  // 재시도 로직
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        if (!this.isNetworkError(error) || attempt === maxRetries - 1) {
          throw error
        }
        
        // 지수 백오프: 1초, 2초, 4초...
        const delay = baseDelay * Math.pow(2, attempt)
        console.log(`네트워크 오류로 인한 재시도 ${attempt + 1}/${maxRetries}, ${delay}ms 후 재시도...`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError
  }
}

// 싱글톤 인스턴스 내보내기
export const networkService = NetworkService.getInstance()


