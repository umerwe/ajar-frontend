import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.18.64', // your local dev host
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ajar-server.hostdonor.com', // ✅ add this for production
        pathname: '/uploads/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
