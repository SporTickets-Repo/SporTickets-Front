import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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

const withNextIntl = createNextIntlPlugin("./lib/i18n/routing.ts");

export default withNextIntl(nextConfig);
