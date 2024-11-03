import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dawid-job-board.s3.amazonaws.com',
      },
    ],
  },
  env: {
    WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID,
    WORKOS_API_KEY: process.env.WORKOS_API_KEY,
    WORKOS_REDIRECT_URI: process.env.WORKOS_REDIRECT_URI,
    WORKOS_COOKIE_PASSWORD: process.env.WORKOS_COOKIE_PASSWORD,
    MONGO_URI: process.env.MONGO_URI,
  },
};

export default nextConfig;
