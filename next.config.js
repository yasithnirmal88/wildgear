/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nhtgnzgedurcqatmhiwx.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
