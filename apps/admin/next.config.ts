import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@events/types"]
};

export default nextConfig;
