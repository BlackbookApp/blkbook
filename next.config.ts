import type { NextConfig } from 'next';

/* eslint-disable @typescript-eslint/no-require-imports */
const defaultCache = require('next-pwa/cache');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: false,
  skipWaiting: true,
  buildExcludes: [/app-build-manifest\.json$/],
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    // Pass all Supabase requests directly to the network — never intercept.
    // iOS Safari fails cross-origin POSTs (RPC calls) when the service worker
    // doesn't have an explicit handler for them.
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: 'NetworkOnly',
    },
    ...defaultCache,
  ],
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local Supabase Storage
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      // Production Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default withPWA(nextConfig);
