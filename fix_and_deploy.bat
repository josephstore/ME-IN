@echo off
echo 🔧 CampaignHomePage 문법 오류 수정 및 배포...

echo.
echo 1. Git 상태 확인...
git status

echo.
echo 2. 변경사항 스테이징...
git add .

echo.
echo 3. 커밋 생성...
git commit -m "Fix CampaignHomePage syntax error - remove extra closing div tag"

echo.
echo 4. 원격 저장소에 푸시...
git push origin main

echo.
echo 5. Vercel 자동 배포 시작...
echo ⏳ Vercel이 자동으로 배포를 시작합니다...
echo 📊 진행 상황: https://vercel.com/dashboard

echo.
echo 🎉 수정 및 배포 완료!
echo.
echo 🌐 라이브 URL: https://me-in-6ti5.vercel.app
echo 📱 캠페인 리스트: https://me-in-6ti5.vercel.app/campaigns
echo 🧪 테스트 페이지: https://me-in-6ti5.vercel.app/test-campaigns

echo.
echo ✅ 수정된 내용:
echo - CampaignHomePage.tsx 문법 오류 수정
echo - 불필요한 닫는 div 태그 제거
echo - 빌드 오류 해결

echo.
pause


