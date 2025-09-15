# ME-IN 데이터베이스 설정 가이드

## 📋 개요

ME-IN 플랫폼의 데이터베이스는 Supabase PostgreSQL을 기반으로 구축되었습니다. 이 가이드는 데이터베이스 설정부터 초기 데이터 시딩까지의 전체 과정을 안내합니다.

## 🗄️ 데이터베이스 구조

### 주요 테이블
- **users**: 사용자 기본 정보
- **brands**: 브랜드 정보
- **influencers**: 인플루언서 정보
- **campaigns**: 캠페인 정보
- **campaign_applications**: 캠페인 신청
- **campaign_collaborations**: 캠페인 협업
- **messages**: 메시지
- **notifications**: 알림
- **campaign_analytics**: 캠페인 성과 분석
- **influencer_analytics**: 인플루언서 성과 분석

## 🚀 설정 단계

### 1. Supabase 프로젝트 설정

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 설정에서 다음 정보 확인:
   - Project URL
   - API Keys (anon key, service role key)

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# 기타 설정
NODE_ENV=development
```

### 3. 데이터베이스 스키마 생성

Supabase SQL Editor에서 다음 순서로 실행:

1. **완전한 스키마 생성**:
   ```sql
   -- database_schema_complete.sql 파일의 내용을 복사하여 실행
   ```

2. **초기 데이터 시딩**:
   ```sql
   -- supabase_setup.sql 파일의 내용을 복사하여 실행
   ```

### 4. RLS (Row Level Security) 설정 확인

데이터베이스 보안을 위해 RLS가 활성화되어 있습니다:

- 사용자는 자신의 데이터만 접근 가능
- 브랜드는 자신의 캠페인만 관리 가능
- 인플루언서는 자신의 애플리케이션만 조회 가능
- 공개 데이터(캠페인 목록, 인플루언서 목록)는 모든 사용자가 조회 가능

### 5. 인덱스 최적화

성능 최적화를 위해 다음 인덱스가 생성됩니다:

- 사용자 이메일 인덱스
- 캠페인 상태 및 카테고리 인덱스
- 인플루언서 전문 분야 및 언어 인덱스
- 메시지 및 알림 시간 인덱스

## 📊 샘플 데이터

초기 설정 시 다음 샘플 데이터가 생성됩니다:

### 브랜드 데이터
- **ME-IN 플랫폼**: 기술 회사
- **K-뷰티 코리아**: 뷰티 브랜드
- **한식 월드**: 푸드 브랜드

### 인플루언서 데이터
- **Demo Influencer**: 테스트용 인플루언서
- **Aisha Al-Rashid**: 뷰티/라이프스타일
- **Mohammed Hassan**: 패션/라이프스타일
- **Layla Ahmed**: 푸드/트래블

### 캠페인 데이터
- **캐어리 쿨링 토너 캠페인**: 뷰티 카테고리
- **한국 음식 소개 캠페인**: 푸드 카테고리
- **K-뷰티 세럼 캠페인**: 뷰티 카테고리 (초안)

## 🔧 API 엔드포인트

### 캠페인 API
- `GET /api/campaigns` - 캠페인 목록 조회
- `GET /api/campaigns/[id]` - 캠페인 상세 조회
- `POST /api/campaigns` - 새 캠페인 생성
- `PUT /api/campaigns/[id]` - 캠페인 수정

### 인플루언서 API
- `GET /api/influencers` - 인플루언서 목록 조회
- `GET /api/influencers/[id]` - 인플루언서 상세 조회

### 애플리케이션 API
- `POST /api/applications` - 새 애플리케이션 생성

### 메시징 API
- `POST /api/messages` - 메시지 전송

### 알림 API
- `GET /api/notifications` - 알림 조회
- `PUT /api/notifications` - 알림 읽음 처리

### 분석 API
- `GET /api/analytics/dashboard` - 대시보드 통계

## 🛠️ 백엔드 서비스

### 데이터베이스 서비스 (`lib/services/databaseService.ts`)

주요 서비스 클래스:
- **UserService**: 사용자 관리
- **BrandService**: 브랜드 관리
- **InfluencerService**: 인플루언서 관리
- **CampaignService**: 캠페인 관리
- **ApplicationService**: 애플리케이션 관리
- **MessagingService**: 메시징 관리
- **NotificationService**: 알림 관리
- **AnalyticsService**: 분석 관리
- **SystemService**: 시스템 관리

## 🔐 보안 설정

### RLS 정책
- 사용자별 데이터 접근 제어
- 브랜드별 캠페인 관리 권한
- 인플루언서별 애플리케이션 접근 권한
- 채팅방 참여자만 메시지 조회 가능

### API 보안
- JWT 토큰 기반 인증
- 사용자 권한 검증
- 입력 데이터 검증
- SQL 인젝션 방지

## 📈 성능 최적화

### 인덱스 전략
- 자주 조회되는 컬럼에 인덱스 생성
- 복합 인덱스로 쿼리 성능 향상
- JSONB 컬럼에 GIN 인덱스 적용

### 쿼리 최적화
- 필요한 컬럼만 SELECT
- 적절한 JOIN 사용
- 페이지네이션 구현

## 🚨 주의사항

1. **서비스 키 보안**: `SUPABASE_SERVICE_ROLE_KEY`는 서버에서만 사용하고 클라이언트에 노출하지 마세요.

2. **RLS 정책**: 새로운 테이블을 추가할 때는 반드시 RLS 정책을 설정하세요.

3. **데이터 백업**: 정기적으로 데이터베이스 백업을 수행하세요.

4. **모니터링**: Supabase Dashboard에서 쿼리 성능과 사용량을 모니터링하세요.

## 🔄 업데이트 및 마이그레이션

### 스키마 변경 시
1. 새로운 마이그레이션 파일 생성
2. 기존 데이터 보존 확인
3. 단계적 배포
4. 롤백 계획 수립

### 데이터 마이그레이션
1. 백업 생성
2. 마이그레이션 스크립트 실행
3. 데이터 무결성 검증
4. 성능 테스트

## 📞 지원

데이터베이스 관련 문제가 발생하면:
1. Supabase Dashboard 로그 확인
2. API 응답 에러 메시지 확인
3. RLS 정책 설정 검토
4. 인덱스 및 쿼리 최적화 검토

---

이 가이드를 따라하면 ME-IN 플랫폼의 데이터베이스가 완전히 설정되고 운영 준비가 완료됩니다.
