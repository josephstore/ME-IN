import { SimpleUser } from '../simpleAuth'

export const sampleUsers: SimpleUser[] = [
  // 브랜드 계정들
  {
    id: 'brand_user_001',
    email: 'brand@glowbeauty.com',
    name: 'Glow Beauty',
    user_type: 'brand',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'brand_user_002',
    email: 'brand@stylehub.com',
    name: 'StyleHub',
    user_type: 'brand',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: 'brand_user_003',
    email: 'brand@hansik.com',
    name: '한식당',
    user_type: 'brand',
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: 'brand_user_004',
    email: 'brand@dubaitourism.com',
    name: 'Dubai Tourism',
    user_type: 'brand',
    created_at: '2024-01-04T00:00:00Z'
  },
  {
    id: 'brand_user_005',
    email: 'brand@techmax.com',
    name: 'TechMax',
    user_type: 'brand',
    created_at: '2024-01-05T00:00:00Z'
  },
  // 인플루언서 계정들
  {
    id: 'influencer_user_001',
    email: 'sarah@influencer.com',
    name: 'Sarah Kim',
    user_type: 'influencer',
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 'influencer_user_002',
    email: 'ahmed@influencer.com',
    name: 'Ahmed Al-Rashid',
    user_type: 'influencer',
    created_at: '2024-01-11T00:00:00Z'
  },
  {
    id: 'influencer_user_003',
    email: 'mina@influencer.com',
    name: 'Mina Park',
    user_type: 'influencer',
    created_at: '2024-01-12T00:00:00Z'
  },
  {
    id: 'influencer_user_004',
    email: 'omar@influencer.com',
    name: 'Omar Hassan',
    user_type: 'influencer',
    created_at: '2024-01-13T00:00:00Z'
  },
  {
    id: 'influencer_user_005',
    email: 'jessica@influencer.com',
    name: 'Jessica Lee',
    user_type: 'influencer',
    created_at: '2024-01-14T00:00:00Z'
  }
]

export const sampleInfluencerProfiles = [
  {
    id: 'inf_profile_001',
    user_id: 'influencer_user_001',
    display_name: 'Sarah Kim',
    bio: '뷰티 & 라이프스타일 인플루언서 | 150K 팔로워',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    total_followers: 150000,
    content_categories: ['뷰티/화장품', '라이프스타일'],
    languages: ['한국어', '영어'],
    location: '서울, 한국',
    social_links: {
      instagram: 'https://instagram.com/sarahkim',
      youtube: 'https://youtube.com/sarahkim',
      tiktok: 'https://tiktok.com/@sarahkim'
    }
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
    location: '두바이, UAE',
    social_links: {
      instagram: 'https://instagram.com/ahmedalrashid',
      youtube: 'https://youtube.com/ahmedalrashid',
      tiktok: 'https://tiktok.com/@ahmedalrashid'
    }
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
    location: '부산, 한국',
    social_links: {
      instagram: 'https://instagram.com/minapark',
      youtube: 'https://youtube.com/minapark',
      tiktok: 'https://tiktok.com/@minapark'
    }
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
    location: '리야드, 사우디아라비아',
    social_links: {
      instagram: 'https://instagram.com/omarhassan',
      youtube: 'https://youtube.com/omarhassan',
      tiktok: 'https://tiktok.com/@omarhassan'
    }
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
    location: '도쿄, 일본',
    social_links: {
      instagram: 'https://instagram.com/jessicalee',
      youtube: 'https://youtube.com/jessicalee',
      tiktok: 'https://tiktok.com/@jessicalee'
    }
  }
]

