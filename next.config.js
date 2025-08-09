/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'api.me-in.com'],
  },
  experimental: {
    // appDir is now stable in Next.js 14
  },
}

module.exports = nextConfig
