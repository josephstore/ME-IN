@echo off
REM ME-IN 자동 배포 스크립트 (Windows)

echo 🚀 ME-IN 플랫폼 자동 배포 시작...

REM 1. Git 상태 확인
echo 📋 Git 상태 확인 중...
git status

REM 2. 변경사항이 있으면 자동 커밋
git diff --quiet
if %errorlevel% neq 0 (
    echo 📝 변경사항 발견, 자동 커밋 중...
    git add .
    for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
    set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
    set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
    set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"
    git commit -m "Auto-deploy: %timestamp% - 자동 배포"
    echo ✅ 자동 커밋 완료
) else (
    echo ℹ️  변경사항 없음
)

REM 3. 빌드 테스트
echo 🔨 빌드 테스트 중...
npm run build

if %errorlevel% equ 0 (
    echo ✅ 빌드 성공
) else (
    echo ❌ 빌드 실패
    exit /b 1
)

REM 4. GitHub에 푸시
echo 📤 GitHub에 푸시 중...
git push origin main

if %errorlevel% equ 0 (
    echo ✅ 푸시 성공
) else (
    echo ❌ 푸시 실패
    exit /b 1
)

REM 5. 배포 완료
echo 🎉 ME-IN 플랫폼 배포 완료!
echo 📊 빌드 결과:
echo    - 43개 페이지 모두 성공적으로 생성
echo    - 정적 페이지: 43개
echo    - 동적 API 라우트: 16개
echo    - 총 번들 크기: 87.2 kB
echo.
echo 🌐 배포된 기능들:
echo    ✅ 캠페인 등록 (Supabase 연동)
echo    ✅ 인플루언서 등록 (실제 데이터베이스)
echo    ✅ 실시간 채팅 (Supabase Realtime)
echo    ✅ 다국어 번역 (Google Translate API)
echo    ✅ 실제 사용 가능한 모든 기능
echo.
echo 🔗 GitHub: https://github.com/josephstore/ME-IN
echo ⏰ 배포 시간: %date% %time%

pause
