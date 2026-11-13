import type { NextConfig } from "next";
import { REDIRECT_SOURCE } from "./lib/fallback";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [{ source: REDIRECT_SOURCE, destination: "/", permanent: false }];
  },
};

export default nextConfig;
