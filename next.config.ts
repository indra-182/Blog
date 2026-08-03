import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  async redirects() {
    return [
      {
        source: '/posts/frontend-digest-25-jul-2026',
        destination: '/',
        permanent: true,
      },
      {
        source: '/posts/frontend-digest-2026-07-26',
        destination: '/',
        permanent: true,
      },
      {
        source: '/posts/frontend-digest-2026-07-28',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
