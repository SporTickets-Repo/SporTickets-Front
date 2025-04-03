import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sportickets-bucket.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "t96kpt9nk5xvwlvg.public.blob.vercel-storage.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
