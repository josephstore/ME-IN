/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'api.me-in.com'],
    unoptimized: true
  },
  trailingSlash: true,
  experimental: {
    // appDir is now stable in Next.js 14
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index'
      }
    ]
  }
}

module.exports = nextConfig
