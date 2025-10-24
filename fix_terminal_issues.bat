@echo off
echo 터미널 문제 해결 스크립트 시작...

echo.
echo 1. Git 설정 확인 및 수정...
git config --global core.pager "cat"
git config --global core.editor "notepad"
git config --global init.defaultBranch main
git config --global pull.rebase false

echo.
echo 2. PowerShell 실행 정책 확인...
powershell -Command "Get-ExecutionPolicy"

echo.
echo 3. Git 상태 확인...
git status --porcelain

echo.
echo 4. 변경된 파일 커밋...
git add .
git commit -m "Fix network connection issues and add offline mode support

- Add networkService for connection monitoring
- Implement offline data caching
- Add retry logic with exponential backoff
- Improve error handling for network issues
- Add network status UI indicators"

echo.
echo 5. 원격 저장소에 푸시...
git push origin main

echo.
echo 터미널 문제 해결 완료!
pause


