import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pins the workspace root despite a stray ~/yarn.lock.
    root: __dirname,
  },
};

export default nextConfig;
