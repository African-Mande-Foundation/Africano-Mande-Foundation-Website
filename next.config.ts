import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["firebasestorage.googleapis.com" , "localhost", "competent-chocolate-739a87dced.strapiapp.com", "competent-chocolate-739a87dced.media.strapiapp.com"],

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
      }, 

      {
        protocol:"https",
        hostname:"competent-chocolate-739a87dced.media.strapiapp.com"
      }
    ],
  },
};

export default nextConfig;
