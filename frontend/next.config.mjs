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
  },
}

export default nextConfig

