import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co", pathname: "/**" },
      { protocol: "https", hostname: "mosaic.scdn.co", pathname: "/**" },
      {
        protocol: "https",
        hostname: "image-cdn*.spotifycdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
