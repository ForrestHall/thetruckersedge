import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/blog/top-10-cdl-practice-test-tips',
        destination: '/blog/top-10-cdl-practice-test-tips-every-aspiring-trucker-needs',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)
