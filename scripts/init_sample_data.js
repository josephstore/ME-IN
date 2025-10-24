// 샘플 데이터 초기화 스크립트
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 샘플 캠페인 데이터
const sampleCampaigns = [
  {
    id: 'camp_001',
    title: '뷰티 브랜드 신제품 런칭 캠페인',
    description: '새로운 스킨케어 라인을 소개하는 캠페인입니다. 자연 성분을 활용한 제품의 장점을 어필해주세요.',
    category: '뷰티/화장품',
    status: 'active',
    budget_min: 500,
    budget_max: 2000,
    currency: 'USD',
    min_followers: 10000,
    target_languages: ['한국어', '영어'],
    target_regions: ['한국', '미국'],
    application_deadline: '2024-02-15',
    content_requirements: '제품 사용 후기, 언박싱 영상, 일상 루틴에 제품 활용 모습',
    deliverables: ['인스타그램 포스트 3개', '스토리 5개', '유튜브 쇼츠 1개'],
    brand_profile_id: 'brand_001',
    media_assets: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1596760227605-25c4302f89c1?w=600&h=600&fit=crop']
  },
  {
    id: 'camp_002',
    title: '패션 브랜드 봄 컬렉션 캠페인',
    description: '2024 봄/여름 컬렉션을 소개하는 패션 캠페인입니다. 트렌디하고 세련된 스타일링을 보여주세요.',
    category: '패션/의류',
    status: 'active',
    budget_min: 800,
    budget_max: 3000,
    currency: 'USD',
    min_followers: 25000,
    target_languages: ['한국어', '영어', '아랍어'],
    target_regions: ['한국', 'UAE', '사우디아라비아'],
    application_deadline: '2024-02-20',
    content_requirements: '패션 스타일링, OOTD 포스트, 브랜드 가치 전달',
    deliverables: ['인스타그램 피드 5개', '릴스 3개', '스토리 10개'],
    brand_profile_id: 'brand_002',
    media_assets: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop']
  },
  {
    id: 'camp_003',
    title: '한식 레스토랑 홍보 캠페인',
    description: '전통 한식의 맛과 문화를 전 세계에 알리는 캠페인입니다. 맛있는 음식과 함께 한국 문화를 소개해주세요.',
    category: '음식/레스토랑',
    status: 'active',
    budget_min: 300,
    budget_max: 1500,
    currency: 'USD',
    min_followers: 5000,
    target_languages: ['한국어', '영어', '아랍어'],
    target_regions: ['한국', 'UAE', '쿠웨이트'],
    application_deadline: '2024-02-25',
    content_requirements: '음식 리뷰, 조리 과정, 문화적 맥락 설명',
    deliverables: ['유튜브 영상 1개', '인스타그램 포스트 4개', '틱톡 영상 2개'],
    brand_profile_id: 'brand_003',
    media_assets: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop']
  },
  {
    id: 'camp_004',
    title: '여행 브랜드 두바이 관광 캠페인',
    description: '두바이의 아름다운 관광지와 문화를 소개하는 여행 캠페인입니다. 매력적인 여행 경험을 공유해주세요.',
    category: '여행/호텔',
    status: 'active',
    budget_min: 1000,
    budget_max: 5000,
    currency: 'USD',
    min_followers: 50000,
    target_languages: ['영어', '아랍어', '한국어'],
    target_regions: ['UAE', '한국', '사우디아라비아'],
    application_deadline: '2024-03-01',
    content_requirements: '여행 브이로그, 관광지 소개, 현지 문화 체험',
    deliverables: ['유튜브 브이로그 1개', '인스타그램 피드 8개', '릴스 5개'],
    brand_profile_id: 'brand_004',
    media_assets: ['https://images.unsplash.com/photo-1512453333589-d3bb32f07e03?w=600&h=600&fit=crop']
  },
  {
    id: 'camp_005',
    title: '테크 브랜드 스마트폰 런칭',
    description: '최신 스마트폰의 혁신적인 기능을 소개하는 테크 캠페인입니다. 기술적 우수성을 강조해주세요.',
    category: '테크/전자제품',
    status: 'active',
    budget_min: 2000,
    budget_max: 8000,
    currency: 'USD',
    min_followers: 100000,
    target_languages: ['영어', '한국어', '아랍어'],
    target_regions: ['전 세계'],
    application_deadline: '2024-03-10',
    content_requirements: '제품 리뷰, 기능 데모, 사용자 경험 공유',
    deliverables: ['유튜브 리뷰 영상 1개', '인스타그램 포스트 6개', '틱톡 영상 3개'],
    brand_profile_id: 'brand_005',
    media_assets: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=600&fit=crop']
  }
]

// 샘플 브랜드 데이터
const sampleBrands = [
  {
    id: 'brand_001',
    company_name: 'Glow Beauty',
    company_name_en: 'Glow Beauty Co.',
    company_name_ar: 'جلوبيوتي',
    logo_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop',
    industry: '뷰티',
    website: 'https://glowbeauty.com',
    description: '자연 성분 기반의 프리미엄 스킨케어 브랜드'
  },
  {
    id: 'brand_002',
    company_name: 'StyleHub',
    company_name_en: 'StyleHub Fashion',
    company_name_ar: 'ستايل هب',
    logo_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=100&h=100&fit=crop',
    industry: '패션',
    website: 'https://stylehub.com',
    description: '트렌디한 패션을 선도하는 글로벌 브랜드'
  },
  {
    id: 'brand_003',
    company_name: '한식당',
    company_name_en: 'Hansik Restaurant',
    company_name_ar: 'مطعم هانسيك',
    logo_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop',
    industry: '음식',
    website: 'https://hansik.com',
    description: '전통 한식의 맛을 전 세계에 전하는 레스토랑'
  },
  {
    id: 'brand_004',
    company_name: 'Dubai Tourism',
    company_name_en: 'Dubai Tourism Board',
    company_name_ar: 'هيئة دبي للسياحة',
    logo_url: 'https://images.unsplash.com/photo-1512453333589-d3bb32f07e03?w=100&h=100&fit=crop',
    industry: '여행',
    website: 'https://visitdubai.com',
    description: '두바이의 매력을 전 세계에 알리는 관광청'
  },
  {
    id: 'brand_005',
    company_name: 'TechMax',
    company_name_en: 'TechMax Electronics',
    company_name_ar: 'تيك ماكس',
    logo_url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=100&h=100&fit=crop',
    industry: '테크',
    website: 'https://techmax.com',
    description: '혁신적인 기술로 미래를 선도하는 전자제품 브랜드'
  }
]

// 샘플 인플루언서 데이터
const sampleInfluencers = [
  {
    id: 'inf_profile_001',
    user_id: 'influencer_user_001',
    display_name: 'Sarah Kim',
    bio: '뷰티 & 라이프스타일 인플루언서 | 150K 팔로워',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    total_followers: 150000,
    content_categories: ['뷰티/화장품', '라이프스타일'],
    languages: ['한국어', '영어'],
    location: '서울, 한국'
  },
  {
    id: 'inf_profile_002',
    user_id: 'influencer_user_002',
    display_name: 'Ahmed Al-Rashid',
    bio: '패션 & 여행 인플루언서 | 200K 팔로워',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    total_followers: 200000,
    content_categories: ['패션/의류', '여행/호텔'],
    languages: ['아랍어', '영어'],
    location: '두바이, UAE'
  },
  {
    id: 'inf_profile_003',
    user_id: 'influencer_user_003',
    display_name: 'Mina Park',
    bio: '푸드 & 라이프스타일 인플루언서 | 80K 팔로워',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    total_followers: 80000,
    content_categories: ['음식/레스토랑', '라이프스타일'],
    languages: ['한국어', '영어'],
    location: '부산, 한국'
  },
  {
    id: 'inf_profile_004',
    user_id: 'influencer_user_004',
    display_name: 'Omar Hassan',
    bio: '테크 & 게임 인플루언서 | 300K 팔로워',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    total_followers: 300000,
    content_categories: ['테크/전자제품', '게임/엔터테인먼트'],
    languages: ['아랍어', '영어'],
    location: '리야드, 사우디아라비아'
  },
  {
    id: 'inf_profile_005',
    user_id: 'influencer_user_005',
    display_name: 'Jessica Lee',
    bio: '여행 & 라이프스타일 인플루언서 | 120K 팔로워',
    avatar_url: 'https://images.unsplash.com/photo-1507927360203-afbeac42c556?w=150&h=150&fit=crop',
    total_followers: 120000,
    content_categories: ['여행/호텔', '라이프스타일'],
    languages: ['한국어', '영어', '일본어'],
    location: '도쿄, 일본'
  }
]

async function initSampleData() {
  console.log('🚀 샘플 데이터 초기화 시작...')

  try {
    // 1. 브랜드 프로필 삽입
    console.log('📊 브랜드 프로필 데이터 삽입 중...')
    const { error: brandError } = await supabase
      .from('brand_profiles')
      .upsert(sampleBrands, { onConflict: 'id' })

    if (brandError) {
      console.error('❌ 브랜드 프로필 삽입 실패:', brandError)
    } else {
      console.log('✅ 브랜드 프로필 데이터 삽입 완료')
    }

    // 2. 인플루언서 프로필 삽입
    console.log('👥 인플루언서 프로필 데이터 삽입 중...')
    const { error: influencerError } = await supabase
      .from('influencer_profiles')
      .upsert(sampleInfluencers, { onConflict: 'id' })

    if (influencerError) {
      console.error('❌ 인플루언서 프로필 삽입 실패:', influencerError)
    } else {
      console.log('✅ 인플루언서 프로필 데이터 삽입 완료')
    }

    // 3. 캠페인 데이터 삽입
    console.log('🎯 캠페인 데이터 삽입 중...')
    const { error: campaignError } = await supabase
      .from('campaigns')
      .upsert(sampleCampaigns, { onConflict: 'id' })

    if (campaignError) {
      console.error('❌ 캠페인 데이터 삽입 실패:', campaignError)
    } else {
      console.log('✅ 캠페인 데이터 삽입 완료')
    }

    // 4. 채팅방 생성
    console.log('💬 채팅방 생성 중...')
    const chatRooms = [
      {
        campaign_id: 'camp_001',
        brand_id: 'brand_user_001',
        influencer_id: 'influencer_user_001'
      },
      {
        campaign_id: 'camp_002',
        brand_id: 'brand_user_002',
        influencer_id: 'influencer_user_002'
      },
      {
        campaign_id: 'camp_003',
        brand_id: 'brand_user_003',
        influencer_id: 'influencer_user_003'
      }
    ]

    const { error: chatRoomError } = await supabase
      .from('chat_rooms')
      .upsert(chatRooms, { onConflict: 'campaign_id,influencer_id' })

    if (chatRoomError) {
      console.error('❌ 채팅방 생성 실패:', chatRoomError)
    } else {
      console.log('✅ 채팅방 생성 완료')
    }

    // 5. 샘플 메시지 삽입
    console.log('💬 샘플 메시지 삽입 중...')
    const sampleMessages = [
      {
        room_id: (await supabase.from('chat_rooms').select('id').eq('campaign_id', 'camp_001').single()).data?.id,
        sender_id: 'brand_user_001',
        sender_name: 'Glow Beauty',
        sender_type: 'brand',
        content: '안녕하세요! 캠페인에 관심을 가져주셔서 감사합니다.',
        message_type: 'text'
      },
      {
        room_id: (await supabase.from('chat_rooms').select('id').eq('campaign_id', 'camp_001').single()).data?.id,
        sender_id: 'influencer_user_001',
        sender_name: 'Sarah Kim',
        sender_type: 'influencer',
        content: '안녕하세요! 제품에 대해 더 자세히 알고 싶습니다.',
        message_type: 'text'
      }
    ]

    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert(sampleMessages)

    if (messageError) {
      console.error('❌ 샘플 메시지 삽입 실패:', messageError)
    } else {
      console.log('✅ 샘플 메시지 삽입 완료')
    }

    console.log('🎉 샘플 데이터 초기화 완료!')
    console.log('📋 생성된 데이터:')
    console.log('   - 브랜드 프로필: 3개')
    console.log('   - 인플루언서 프로필: 3개')
    console.log('   - 캠페인: 3개')
    console.log('   - 채팅방: 3개')
    console.log('   - 샘플 메시지: 2개')

  } catch (error) {
    console.error('❌ 데이터 초기화 중 오류 발생:', error)
  }
}

// 스크립트 실행
if (require.main === module) {
  initSampleData()
}

module.exports = { initSampleData }


