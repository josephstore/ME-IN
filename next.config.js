/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  // Docker 배포를 위한 standalone 출력 설정
  output: 'standalone',
  // 환경변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // API 라우트 설정 (배포 환경에서는 비활성화)
  async rewrites() {
    // 프로덕션 환경에서는 리라이트 비활성화
    if (process.env.NODE_ENV === 'production') {
      return []
    }
    
    // 개발 환경에서만 API 리라이트 사용
    if (process.env.NEXT_PUBLIC_API_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        },
      ]
    }
    
    return []
  },
}

module.exports = nextConfig