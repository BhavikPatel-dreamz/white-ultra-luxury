import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.eyce.com",
        pathname: "/cdn/shop/**",
        protocol: "https",
      },
      {
        hostname: "cdn.shopify.com",
        protocol: "https",
      },
      {
        hostname: "**",
        protocol: "https",
      },
      {
        hostname: "localhost",
        protocol: "http",
      },
      {
        hostname: "127.0.0.1",
        protocol: "http",
      },
    ],
  },
};

export default nextConfig;
