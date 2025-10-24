import { Campaign } from '../types/database'

export const sampleCampaigns: Campaign[] = [
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
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    brand_profiles: {
      id: 'brand_001',
      company_name: 'Glow Beauty',
      company_name_en: 'Glow Beauty Co.',
      company_name_ar: 'جلوبيوتي',
      logo_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop',
      industry: '뷰티',
      website: 'https://glowbeauty.com',
      description: '자연 성분 기반의 프리미엄 스킨케어 브랜드',
      user_profiles: {
        display_name: 'Glow Beauty',
        avatar_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=150&h=150&fit=crop'
      }
    },
    media_assets: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596760227605-25c4302f89c1?w=600&h=600&fit=crop'
    ]
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
    created_at: '2024-01-16T14:30:00Z',
    updated_at: '2024-01-16T14:30:00Z',
    brand_profiles: {
      id: 'brand_002',
      company_name: 'StyleHub',
      company_name_en: 'StyleHub Fashion',
      company_name_ar: 'ستايل هب',
      logo_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=100&h=100&fit=crop',
      industry: '패션',
      website: 'https://stylehub.com',
      description: '트렌디한 패션을 선도하는 글로벌 브랜드',
      user_profiles: {
        display_name: 'StyleHub',
        avatar_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=150&h=150&fit=crop'
      }
    },
    media_assets: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop'
    ]
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
    created_at: '2024-01-17T09:15:00Z',
    updated_at: '2024-01-17T09:15:00Z',
    brand_profiles: {
      id: 'brand_003',
      company_name: '한식당',
      company_name_en: 'Hansik Restaurant',
      company_name_ar: 'مطعم هانسيك',
      logo_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop',
      industry: '음식',
      website: 'https://hansik.com',
      description: '전통 한식의 맛을 전 세계에 전하는 레스토랑',
      user_profiles: {
        display_name: '한식당',
        avatar_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop'
      }
    },
    media_assets: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop'
    ]
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
    created_at: '2024-01-18T16:45:00Z',
    updated_at: '2024-01-18T16:45:00Z',
    brand_profiles: {
      id: 'brand_004',
      company_name: 'Dubai Tourism',
      company_name_en: 'Dubai Tourism Board',
      company_name_ar: 'هيئة دبي للسياحة',
      logo_url: 'https://images.unsplash.com/photo-1512453333589-d3bb32f07e03?w=100&h=100&fit=crop',
      industry: '여행',
      website: 'https://visitdubai.com',
      description: '두바이의 매력을 전 세계에 알리는 관광청',
      user_profiles: {
        display_name: 'Dubai Tourism',
        avatar_url: 'https://images.unsplash.com/photo-1512453333589-d3bb32f07e03?w=150&h=150&fit=crop'
      }
    },
    media_assets: [
      'https://images.unsplash.com/photo-1512453333589-d3bb32f07e03?w=600&h=600&fit=crop'
    ]
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
    created_at: '2024-01-19T11:20:00Z',
    updated_at: '2024-01-19T11:20:00Z',
    brand_profiles: {
      id: 'brand_005',
      company_name: 'TechMax',
      company_name_en: 'TechMax Electronics',
      company_name_ar: 'تيك ماكس',
      logo_url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=100&h=100&fit=crop',
      industry: '테크',
      website: 'https://techmax.com',
      description: '혁신적인 기술로 미래를 선도하는 전자제품 브랜드',
      user_profiles: {
        display_name: 'TechMax',
        avatar_url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=150&h=150&fit=crop'
      }
    },
    media_assets: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=600&fit=crop'
    ]
  }
]

export const sampleBrands = [
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

