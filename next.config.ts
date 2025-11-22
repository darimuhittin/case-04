import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://case.nodelabs.dev/api/:path*",
      },
    ];
  },
};

export default nextConfig;
