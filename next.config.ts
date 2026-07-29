import type { NextConfig } from "next";

function getHostname(value?: string) {
  if (!value) return undefined;

  try {
    return new URL(value.includes("://") ? value : `https://${value}`).hostname;
  } catch {
    return undefined;
  }
}

const configuredImageHosts = [
  getHostname(process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL),
  getHostname(process.env.MEDUSA_CLOUD_S3_HOSTNAME),
  getHostname(process.env.SHOPIFY_STORE_DOMAIN),
].filter((hostname): hostname is string => Boolean(hostname));

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
        hostname: "localhost",
        protocol: "http",
      },
      {
        hostname: "127.0.0.1",
        protocol: "http",
      },
      ...configuredImageHosts.map((hostname) => ({
        hostname,
        pathname: "/**",
        protocol: "https" as const,
      })),
    ],
  },
};

export default nextConfig;
