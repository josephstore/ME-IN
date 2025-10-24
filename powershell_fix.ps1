# PowerShell 설정 수정 스크립트
Write-Host "PowerShell 설정 수정 중..." -ForegroundColor Green

# 실행 정책 확인 및 설정
$currentPolicy = Get-ExecutionPolicy
Write-Host "현재 실행 정책: $currentPolicy" -ForegroundColor Yellow

if ($currentPolicy -eq "Restricted") {
    Write-Host "실행 정책을 RemoteSigned로 변경합니다..." -ForegroundColor Yellow
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
}

# Git 설정 확인
Write-Host "Git 설정 확인 중..." -ForegroundColor Green
git config --global core.pager "cat"
git config --global core.editor "notepad"
git config --global init.defaultBranch main

# 현재 디렉토리 확인
Write-Host "현재 디렉토리: $(Get-Location)" -ForegroundColor Cyan

# Git 상태 확인
Write-Host "Git 상태 확인 중..." -ForegroundColor Green
try {
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "변경된 파일들:" -ForegroundColor Yellow
        $gitStatus | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        
        Write-Host "변경사항을 커밋합니다..." -ForegroundColor Green
        git add .
        git commit -m "Fix network connection issues and add offline mode support

- Add networkService for connection monitoring
- Implement offline data caching  
- Add retry logic with exponential backoff
- Improve error handling for network issues
- Add network status UI indicators"
        
        Write-Host "원격 저장소에 푸시합니다..." -ForegroundColor Green
        git push origin main
        
        Write-Host "완료!" -ForegroundColor Green
    } else {
        Write-Host "커밋할 변경사항이 없습니다." -ForegroundColor Yellow
    }
} catch {
    Write-Host "오류 발생: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "스크립트 완료!" -ForegroundColor Green
Read-Host "Enter 키를 눌러 종료"


