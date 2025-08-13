# ME-IN Platform
## MiddleEast Influencer Network

ME-IN은 한국 브랜드와 중동 인플루언서를 연결하는 모바일 친화적인 캠페인 플랫폼입니다. 브랜드들이 캠페인을 등록하고 인플루언서들이 참여할 수 있는 직관적인 인터페이스를 제공합니다.

## 🌟 Features

### Core Functionality
- **모바일 최적화**: 모바일 기기에 최적화된 반응형 디자인
- **캠페인 등록**: 브랜드가 쉽게 캠페인을 등록하고 관리
- **실시간 검색**: 카테고리별 필터링과 검색 기능
- **한국어 우선**: 한국어 위주의 다국어 지원 (한국어, 영어, 아랍어)
- **직관적 UI**: 사용하기 쉬운 모바일 친화적 인터페이스

### For Brands (브랜드용)
- **캠페인 등록**: 제품/서비스 캠페인을 쉽게 등록
- **인플루언서 매칭**: 적합한 인플루언서 자동 매칭
- **성과 추적**: 캠페인 성과 실시간 모니터링
- **예산 관리**: 캠페인 예산 설정 및 관리

### For Influencers (인플루언서용)
- **캠페인 발견**: 관심 카테고리별 캠페인 탐색
- **참여 신청**: 원하는 캠페인에 쉽게 참여 신청
- **수익 관리**: 참여한 캠페인 수익 추적
- **포트폴리오**: 활동 내역 및 성과 관리

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Internationalization**: Custom i18n implementation
- **State Management**: React Context API
- **Icons**: Lucide React
- **Mobile UI**: 모바일 최적화 컴포넌트
- **Real-time**: Supabase Realtime

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Supabase Setup

1. **Create Supabase Project**
   - Visit [https://supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Schema**
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Enable Row Level Security
   ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
   
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     name TEXT,
     user_type TEXT CHECK (user_type IN ('brand', 'influencer')),
     language TEXT[],
     timezone TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Create RLS policies
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);
   
   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);
   
   CREATE POLICY "Users can insert own profile" ON profiles
     FOR INSERT WITH CHECK (auth.uid() = id);
   ```

### Installation

1. Clone the repository
```bash
git clone https://github.com/josephstore/ME-IN.git
cd ME-IN
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
ME-IN/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (모바일 캠페인 홈)
├── components/            # React components
│   ├── CampaignHomePage.tsx # 모바일 캠페인 홈페이지
│   ├── layout/            # Layout components
│   ├── sections/          # Page sections
│   └── ui/                # UI components
├── lib/                   # Utility libraries
│   ├── types/             # TypeScript type definitions
│   ├── SupabaseAuthContext.tsx # Supabase 인증 컨텍스트
│   ├── supabase.ts        # Supabase 클라이언트
│   ├── LanguageContext.tsx # Internationalization context
│   ├── i18n.ts            # Translation definitions
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## 🌐 Internationalization

ME-IN은 세 가지 언어를 지원합니다:
- **Korean (ko)**: 한국어 (기본 언어)
- **English (en)**: English  
- **Arabic (ar)**: العربية

플랫폼은 사용자의 선호 언어를 자동으로 감지하고 원활한 언어 전환을 제공합니다.

## 🔐 Authentication System

플랫폼은 Supabase 기반의 포괄적인 인증 시스템을 제공합니다:
- 사용자 등록 및 로그인
- 역할 기반 접근 (브랜드/인플루언서)
- Supabase 세션 관리
- 안전한 비밀번호 처리

## 📱 Mobile Campaign Features

### 모바일 홈화면
- **캠페인 카드**: 제품/서비스 캠페인을 카드 형태로 표시
- **실시간 검색**: 제품명으로 실시간 검색
- **카테고리 필터**: Food, K-pop, Cosmetics, Travel 등 카테고리별 필터링
- **JOIN 버튼**: 인플루언서가 캠페인에 쉽게 참여

### 브랜드 대시보드
- 캠페인 개요 및 관리
- 인플루언서 발견 및 매칭
- 성과 분석
- ROI 추적

### 인플루언서 대시보드
- 수익 및 성과 지표
- 캠페인 기회
- 콘텐츠 포트폴리오 관리
- 브랜드 협업 도구

## 🎨 Design System

ME-IN은 모바일 최적화된 현대적인 디자인 시스템을 사용합니다:
- Tailwind CSS로 스타일링
- Framer Motion으로 애니메이션
- Lucide React로 아이콘
- 중동 시장에 최적화된 커스텀 색상 팔레트
- 모바일 우선 반응형 디자인

## 🔄 Development Status

### Completed Features ✅
- [x] 모바일 캠페인 홈페이지 구현
- [x] Supabase 인증 시스템 구축
- [x] 다국어 지원 시스템 (한국어 우선)
- [x] 브랜드 및 인플루언서 대시보드
- [x] 로그인/회원가입 페이지
- [x] 모바일 최적화 반응형 디자인
- [x] 캠페인 카드 및 필터링 시스템

### In Progress 🔄
- [ ] 프로필 관리 시스템
- [ ] 고급 검색 및 필터링
- [ ] 캠페인 생성 및 관리
- [ ] AI 매칭 알고리즘 구현

### Planned Features 📋
- [ ] 실시간 알림 시스템
- [ ] 결제 시스템 통합
- [ ] 고급 분석 대시보드
- [ ] 네이티브 모바일 앱 개발

## 🤝 Contributing

ME-IN 플랫폼에 기여를 환영합니다! 이슈, 기능 요청 또는 풀 리퀘스트를 자유롭게 제출해 주세요.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Deployment

### Vercel (권장)
1. [https://vercel.com/new](https://vercel.com/new) 방문
2. GitHub에서 `josephstore/ME-IN` 가져오기
3. Deploy 클릭 - Vercel이 Next.js 설정을 자동으로 감지
4. 앱이 다음 주소에서 라이브됩니다: `https://me-in.vercel.app`

**Live Demo**: [https://me-in.vercel.app](https://me-in.vercel.app)

### Manual Deployment
```bash
npm run build
npm start
```

## 📞 Contact

문의사항이나 지원이 필요하시면 다음으로 연락해 주세요:
- Email: developer@me-in.com
- GitHub: [josephstore/ME-IN](https://github.com/josephstore/ME-IN)
- Live Demo: [https://me-in.vercel.app](https://me-in.vercel.app)

---

한국 브랜드와 중동 인플루언서를 연결하기 위해 ❤️로 제작되었습니다
