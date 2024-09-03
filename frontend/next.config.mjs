/** @type {import('next').NextConfig} */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

console.log("CWD: " + process.cwd());
const __dirname = new URL(".", import.meta.url).pathname;
const envPath = path.resolve(__dirname, "config/.env");

console.log("Env File Path: " + envPath);
// config({ path: envPath });

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}
console.log("Environment Variable:", process.env.NEXT_PUBLIC_BACKEND_API);

const nextConfig = {
  env: {
    ...Object.fromEntries(
      Object.entries(process.env).filter(([key]) =>
        key.startsWith("NEXT_PUBLIC_")
      )
    ),
  },
  output: "standalone",
  async headers() {
    return [
      {
        // Matching all API routes
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://dev.tokenisation.gcp-hub.com.au",
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
