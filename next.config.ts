import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t96kpt9nk5xvwlvg.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
