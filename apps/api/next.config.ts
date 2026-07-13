import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@events/db", "@events/types"]
};

export default nextConfig;
