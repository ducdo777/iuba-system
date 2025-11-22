/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for SPA
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  reactStrictMode: true,
  // Optimize build performance
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Note: rewrites don't work with static export, API calls should use absolute URLs
};

module.exports = nextConfig;

