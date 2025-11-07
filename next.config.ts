import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["firebasestorage.googleapis.com" , "localhost"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost:1337",
        port:"1337"
      },
      {
        protocol:"https",
        hostname:"competent-chocolate-739a87dced.strapiapp.com"
      }
    ],
  },
};

export default nextConfig;
