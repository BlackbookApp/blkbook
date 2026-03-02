import type { NextConfig } from 'next';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  register: false,
  skipWaiting: true,
  buildExcludes: [/app-build-manifest\.json$/],
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
