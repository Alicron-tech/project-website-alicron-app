import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}]},
  async headers() {
    return [{source: '/:path*', headers: [{key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive'}]}]
  },
}
export default nextConfig
