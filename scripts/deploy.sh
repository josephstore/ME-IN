#!/bin/bash

# ME-IN Platform Deployment Script
set -e

echo "🚀 Starting ME-IN Platform deployment..."

# 환경변수 확인
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create .env file from env.example"
    exit 1
fi

# 의존성 설치
echo "📦 Installing dependencies..."
npm ci

# 린팅 및 타입 체크
echo "🔍 Running linting and type checking..."
npm run lint
npm run type-check

# 빌드
echo "🏗️ Building application..."
npm run build

# Docker 이미지 빌드 (선택사항)
if [ "$1" = "--docker" ]; then
    echo "🐳 Building Docker images..."
    docker-compose build
    
    echo "🐳 Starting services with Docker Compose..."
    docker-compose up -d
    
    echo "✅ Deployment completed with Docker!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5000"
    echo "📊 Health Check: http://localhost:5000/health"
else
    echo "✅ Build completed successfully!"
    echo "🚀 Run 'npm start' to start the production server"
fi






