import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.18.64',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ajar-server.hostdonor.com', // ✅ add this for production
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'sj61d7kn-5000.inc1.devtunnels.ms', // ✅ added devtunnel domain
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'sj61d7kn-5000.inc1.devtunnels.ms', // ✅ added devtunnel domain
        pathname: '/chat/**',
      },
        {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile images
        pathname: '/**',
      }
    ],
  },
};

export default withNextIntl(nextConfig);
