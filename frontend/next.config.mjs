/** @type {import('next').NextConfig} */
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), './config/.env') });

const nextConfig = {
  env: {
    ...Object.fromEntries(
      Object.entries(process.env).filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
    ),
  },
  async headers() {
    return [
      {
        // Matching all API routes
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://api.tokenisation.gcp-hub.com.au",
          }, // replace this with your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
