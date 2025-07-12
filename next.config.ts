import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Try to disable static optimization to avoid entryCSSFiles error
  output: 'standalone',
};

export default nextConfig;
