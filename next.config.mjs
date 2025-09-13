/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
      },
      {
        protocol: 'https',
        hostname: 'prrefovnrttqvzfhlkah.supabase.co', // 👈 your Supabase project ref
      },
    ],
  },
};

export default nextConfig;
