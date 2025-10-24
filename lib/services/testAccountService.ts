import { supabase } from '../supabase'
import { sampleUsers, sampleInfluencerProfiles } from '../data/sampleUsers'
import { sampleBrands } from '../data/sampleCampaigns'

export interface TestAccount {
  id: string
  email: string
  password: string
  name: string
  user_type: 'brand' | 'influencer'
  profile_data?: any
}

export class TestAccountService {
  // 테스트 계정 생성
  static async createTestAccount(
    email: string, 
    password: string, 
    name: string, 
    userType: 'brand' | 'influencer'
  ): Promise<{ success: boolean; error?: string; account?: TestAccount }> {
    try {
      // Supabase에 계정 생성
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            user_type: userType
          }
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: '계정 생성에 실패했습니다.' }
      }

      // 사용자 프로필 생성
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          display_name: name,
          user_type: userType,
          email: email,
          languages: userType === 'influencer' ? ['한국어', '영어'] : ['한국어'],
          location: userType === 'influencer' ? '서울, 한국' : '서울, 한국'
        })

      if (profileError) {
        console.error('프로필 생성 오류:', profileError)
      }

      // 브랜드/인플루언서 프로필 생성
      if (userType === 'brand') {
        const brandData = sampleBrands.find(b => b.company_name === name) || {
          company_name: name,
          industry: '기타',
          description: `${name} 브랜드입니다.`
        }

        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .single()

        if (userProfile) {
          await supabase
            .from('brand_profiles')
            .insert({
              user_profile_id: userProfile.id,
              ...brandData
            })
        }
      } else if (userType === 'influencer') {
        const influencerData = sampleInfluencerProfiles.find(p => p.display_name === name) || {
          display_name: name,
          bio: `${name} 인플루언서입니다.`,
          total_followers: 10000,
          content_categories: ['라이프스타일'],
          languages: ['한국어', '영어'],
          location: '서울, 한국'
        }

        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .single()

        if (userProfile) {
          await supabase
            .from('influencer_profiles')
            .insert({
              user_profile_id: userProfile.id,
              ...influencerData
            })
        }
      }

      return {
        success: true,
        account: {
          id: data.user.id,
          email,
          password,
          name,
          user_type: userType
        }
      }
    } catch (error) {
      return { success: false, error: '계정 생성 중 오류가 발생했습니다.' }
    }
  }

  // 미리 정의된 테스트 계정들 생성
  static async createPredefinedTestAccounts(): Promise<{ success: boolean; accounts?: TestAccount[]; errors?: string[] }> {
    const testAccounts = [
      { email: 'brand1@test.com', password: 'password123', name: 'Glow Beauty', type: 'brand' as const },
      { email: 'brand2@test.com', password: 'password123', name: 'StyleHub', type: 'brand' as const },
      { email: 'brand3@test.com', password: 'password123', name: '한식당', type: 'brand' as const },
      { email: 'influencer1@test.com', password: 'password123', name: 'Sarah Kim', type: 'influencer' as const },
      { email: 'influencer2@test.com', password: 'password123', name: 'Ahmed Al-Rashid', type: 'influencer' as const },
      { email: 'influencer3@test.com', password: 'password123', name: 'Mina Park', type: 'influencer' as const }
    ]

    const accounts: TestAccount[] = []
    const errors: string[] = []

    for (const account of testAccounts) {
      const result = await this.createTestAccount(
        account.email,
        account.password,
        account.name,
        account.type
      )

      if (result.success && result.account) {
        accounts.push(result.account)
      } else {
        errors.push(`${account.email}: ${result.error}`)
      }
    }

    return { success: accounts.length > 0, accounts, errors }
  }

  // 테스트 계정 로그인
  static async loginTestAccount(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: '로그인 중 오류가 발생했습니다.' }
    }
  }

  // 테스트 계정 목록 조회
  static async getTestAccounts(): Promise<TestAccount[]> {
    return [
      { id: '1', email: 'brand1@test.com', password: 'password123', name: 'Glow Beauty', user_type: 'brand' },
      { id: '2', email: 'brand2@test.com', password: 'password123', name: 'StyleHub', user_type: 'brand' },
      { id: '3', email: 'brand3@test.com', password: 'password123', name: '한식당', user_type: 'brand' },
      { id: '4', email: 'influencer1@test.com', password: 'password123', name: 'Sarah Kim', user_type: 'influencer' },
      { id: '5', email: 'influencer2@test.com', password: 'password123', name: 'Ahmed Al-Rashid', user_type: 'influencer' },
      { id: '6', email: 'influencer3@test.com', password: 'password123', name: 'Mina Park', user_type: 'influencer' }
    ]
  }

  // 테스트 데이터 초기화
  static async initializeTestData(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🧪 테스트 데이터 초기화 시작...')

      // 1. 테스트 계정 생성
      const accountResult = await this.createPredefinedTestAccounts()
      
      // 2. 샘플 캠페인 데이터 확인
      const { data: existingCampaigns } = await supabase
        .from('campaigns')
        .select('id')
        .limit(1)

      if (!existingCampaigns || existingCampaigns.length === 0) {
        console.log('📊 샘플 캠페인 데이터가 없습니다. 데이터베이스 스키마를 확인해주세요.')
      }

      let message = `테스트 데이터 초기화 완료!\n`
      message += `✅ 생성된 계정: ${accountResult.accounts?.length || 0}개\n`
      
      if (accountResult.errors && accountResult.errors.length > 0) {
        message += `⚠️ 오류: ${accountResult.errors.length}개\n`
        console.error('계정 생성 오류:', accountResult.errors)
      }

      return { success: true, message }
    } catch (error) {
      console.error('테스트 데이터 초기화 오류:', error)
      return { success: false, message: '테스트 데이터 초기화 중 오류가 발생했습니다.' }
    }
  }
}


