// 시스템 테스트 자동화 스크립트
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

class SystemTest {
  constructor() {
    this.results = []
    this.startTime = Date.now()
  }

  async runTest(name, testFunction) {
    const testStart = Date.now()
    console.log(`🧪 ${name} 테스트 시작...`)
    
    try {
      await testFunction()
      const duration = Date.now() - testStart
      this.results.push({ name, status: 'PASS', duration })
      console.log(`✅ ${name} 테스트 통과 (${duration}ms)`)
    } catch (error) {
      const duration = Date.now() - testStart
      this.results.push({ name, status: 'FAIL', duration, error: error.message })
      console.log(`❌ ${name} 테스트 실패 (${duration}ms): ${error.message}`)
    }
  }

  async runAllTests() {
    console.log('🚀 시스템 테스트 시작...\n')

    // 1. Supabase 연결 테스트
    await this.runTest('Supabase 연결', async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('count', { count: 'exact', head: true })
      
      if (error) throw new Error(`Supabase 연결 실패: ${error.message}`)
    })

    // 2. 캠페인 데이터 테스트
    await this.runTest('캠페인 데이터 조회', async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .limit(5)
      
      if (error) throw new Error(`캠페인 조회 실패: ${error.message}`)
      if (!data) throw new Error('캠페인 데이터가 null입니다')
    })

    // 3. 브랜드 프로필 테스트
    await this.runTest('브랜드 프로필 조회', async () => {
      const { data, error } = await supabase
        .from('brand_profiles')
        .select('*')
        .limit(5)
      
      if (error) throw new Error(`브랜드 프로필 조회 실패: ${error.message}`)
    })

    // 4. 인플루언서 프로필 테스트
    await this.runTest('인플루언서 프로필 조회', async () => {
      const { data, error } = await supabase
        .from('influencer_profiles')
        .select('*')
        .limit(5)
      
      if (error) throw new Error(`인플루언서 프로필 조회 실패: ${error.message}`)
    })

    // 5. 채팅방 테스트
    await this.runTest('채팅방 조회', async () => {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .limit(5)
      
      if (error) throw new Error(`채팅방 조회 실패: ${error.message}`)
    })

    // 6. 실시간 구독 테스트
    await this.runTest('실시간 구독 연결', async () => {
      return new Promise((resolve, reject) => {
        const channel = supabase.channel('test-channel')
        
        channel
          .on('broadcast', { event: 'test' }, (payload) => {
            console.log('📡 실시간 구독 테스트 성공')
            channel.unsubscribe()
            resolve()
          })
          .subscribe()

        // 5초 후 타임아웃
        setTimeout(() => {
          channel.unsubscribe()
          reject(new Error('실시간 구독 연결 타임아웃'))
        }, 5000)

        // 테스트 이벤트 전송
        setTimeout(() => {
          channel.send({
            type: 'broadcast',
            event: 'test',
            payload: { message: 'test' }
          })
        }, 1000)
      })
    })

    this.printResults()
  }

  printResults() {
    const totalTime = Date.now() - this.startTime
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length

    console.log('\n' + '='.repeat(60))
    console.log('📊 테스트 결과 요약')
    console.log('='.repeat(60))
    console.log(`✅ 성공: ${passed}개`)
    console.log(`❌ 실패: ${failed}개`)
    console.log(`⏱️  총 소요 시간: ${totalTime}ms`)
    console.log('='.repeat(60))

    console.log('\n📋 상세 결과:')
    this.results.forEach((result, index) => {
      const status = result.status === 'PASS' ? '✅' : '❌'
      console.log(`${index + 1}. ${status} ${result.name} (${result.duration}ms)`)
      if (result.error) {
        console.log(`   오류: ${result.error}`)
      }
    })

    if (failed > 0) {
      console.log('\n⚠️  일부 테스트가 실패했습니다. 시스템을 점검해주세요.')
      process.exit(1)
    } else {
      console.log('\n🎉 모든 테스트가 성공적으로 완료되었습니다!')
      process.exit(0)
    }
  }
}

// 테스트 실행
if (require.main === module) {
  const tester = new SystemTest()
  tester.runAllTests().catch(error => {
    console.error('❌ 테스트 실행 중 오류:', error)
    process.exit(1)
  })
}

module.exports = SystemTest


