import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/config", "@repo/content", "@repo/lib", "@repo/ui"],
};

export default nextConfig;
