/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.oki.gg',
        port: '', // Leave empty unless a specific port is used
        pathname: '/**', // Allow all paths for this hostname
      },
    ],
  },
};

module.exports = nextConfig;