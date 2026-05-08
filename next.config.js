/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Optimize images for better performance
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  // Configure for static export
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
};

module.exports = nextConfig;

