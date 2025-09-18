import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
images: {
  domains: ["firebasestorage.googleapis.com",],

  remotePatterns: [
     {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
  ]
}
  
};

export default nextConfig;
