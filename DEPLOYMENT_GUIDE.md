# 🚀 배포 에러 해결 가이드

## 문제 원인
최근 배포 에러들은 다음과 같은 원인으로 발생했습니다:

1. **환경 변수 누락**: Supabase 설정이 배포 환경에서 제대로 설정되지 않음
2. **API 리라이트 설정**: 개발 환경용 설정이 프로덕션에서 문제 발생
3. **네트워크 연결**: Supabase 연결 타임아웃 및 재시도 로직 문제

## ✅ 해결된 사항

### 1. Next.js 설정 수정 (`next.config.js`)
- 프로덕션 환경에서 API 리라이트 비활성화
- 개발 환경에서만 로컬 API 서버 연결

### 2. Supabase 설정 개선 (`lib/supabase.ts`)
- 환경 변수 검증 로직 추가
- 명확한 에러 메시지 제공
- 클라이언트 생성 시 안전성 강화

### 3. 네트워크 연결 개선 (`lib/simpleAuth.ts`)
- 네트워크 오류 감지 및 자동 재시도
- 더 나은 에러 핸들링

## 🔧 Vercel 배포 설정

Vercel 대시보드에서 다음 환경 변수를 설정해주세요:

```
NEXT_PUBLIC_SUPABASE_URL=https://jltnvoyjnzlswsmddojf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdG52b3lqbnpsc3dzbWRkb2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODk5MjQsImV4cCI6MjA3MDk2NTkyNH0.5blt8JeShSgBA50l5bcE30Um1nGlYJAl685XBdVrqdg
NODE_ENV=production
```

## 📋 배포 전 체크리스트

- [ ] Vercel 환경 변수 설정 완료
- [ ] Supabase 연결 테스트
- [ ] 빌드 테스트 (`npm run build`)
- [ ] 타입 체크 (`npm run type-check`)

## 🚨 주의사항

1. **환경 변수**: 반드시 Vercel 대시보드에서 설정해야 함
2. **API 리라이트**: 프로덕션에서는 비활성화됨
3. **Supabase**: 연결 실패 시 자동 재시도 로직 적용

## 🔍 디버깅

배포 실패 시 다음을 확인하세요:

1. Vercel 로그에서 환경 변수 설정 확인
2. Supabase 연결 상태 확인
3. 빌드 로그에서 타입 에러 확인

---

**다음 배포 시 이 가이드를 따라 설정하면 에러가 해결될 것입니다! 🎯**


