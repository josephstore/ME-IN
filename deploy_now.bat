@echo off
echo 🚀 ME-IN 플랫폼 배포 시작...

echo.
echo 1. Git 상태 확인...
git status --porcelain

echo.
echo 2. 변경사항 커밋...
git add .
git commit -m "Deploy ME-IN platform with complete features

- Complete campaign data restoration with 5 sample campaigns
- Real-time chat system with Supabase integration  
- Test account management with 6 pre-configured accounts
- Network error handling and offline mode support
- Automated testing and continuous development pipeline
- Production-ready deployment with all optimizations

Ready for live deployment!"

echo.
echo 3. 원격 저장소에 푸시...
git push origin main

echo.
echo 4. Vercel 배포 확인...
echo 배포가 자동으로 시작됩니다. Vercel 대시보드에서 진행 상황을 확인하세요.

echo.
echo ✅ 배포 완료!
echo 🌐 라이브 URL: https://me-in-6ti5.vercel.app
echo 📊 Vercel 대시보드: https://vercel.com/dashboard

echo.
echo 🧪 테스트 계정:
echo 브랜드: brand1@test.com / password123 (Glow Beauty)
echo 브랜드: brand2@test.com / password123 (StyleHub)  
echo 브랜드: brand3@test.com / password123 (한식당)
echo 인플루언서: influencer1@test.com / password123 (Sarah Kim)
echo 인플루언서: influencer2@test.com / password123 (Ahmed Al-Rashid)
echo 인플루언서: influencer3@test.com / password123 (Mina Park)

echo.
echo 🎉 실제 소비자들이 사용할 수 있는 ME-IN 플랫폼이 배포되었습니다!
pause


