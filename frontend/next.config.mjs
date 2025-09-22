/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Expose a single source of truth for API base URL.
  // Reading API_BASE_URL from `.env` and mapping it to the public/internal vars
  // used across the app so that setting only API_BASE_URL works everywhere.
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL,
    INTERNAL_API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_INACTIVITY_SECONDS: process.env.INACTIVITY_EXPIRE_SECONDS,
  },
  async rewrites() {
    const target = (process.env.INTERNAL_API_BASE_URL || process.env.API_BASE_URL || 'http://backend:8000').replace(/\/+$/, '')
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ]
  },
}

export default nextConfig

