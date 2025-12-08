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
        protocol: 'http',
        hostname: '104.128.190.131',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '104.128.190.131',
        port: '5000',
        pathname: '/chat/**',
      },
      {
        protocol: 'https',
        hostname: 'ajar-server.hostdonor.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'sj61d7kn-5000.inc1.devtunnels.ms',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'sj61d7kn-5000.inc1.devtunnels.ms',
        pathname: '/chat/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
