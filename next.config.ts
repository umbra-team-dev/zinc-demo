import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// The widget dist references its ZK-proof worker by a root-absolute URL
// ("/assets/zk-proof-worker-<hash>.js"). Bundlers try to resolve that request
// statically and fail, so we point it back at the real file in the package.
const zkAssetsDir = join(
  __dirname,
  "node_modules/@umbra-privacy/widget/dist/assets",
);

const nextConfig: NextConfig = {
  // Pins the workspace root despite a stray ~/yarn.lock.
  turbopack: {
    root: __dirname,
  },
  webpack: (config, { webpack, isServer }) => {
    // Node globals for the Umbra SDK/crypto graph (README "Bundler setup").
    // Browser bundles only — the server has the real Node globals.
    if (!isServer) {
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        }),
      );
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: "buffer",
        process: "process/browser",
        // Node-only code paths in @umbra-privacy/sdk (zk asset loading from
        // disk) — dead in the browser, stub them out.
        fs: false,
        path: false,
        os: false,
      };
    }
    // Bundle the ZK worker as a regular webpack worker chunk.
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^\/assets\/zk-proof-worker-[\w-]+\.js$/,
        (resource: { request: string }) => {
          const worker = readdirSync(zkAssetsDir).find((f) =>
            f.startsWith("zk-proof-worker-"),
          );
          if (worker) resource.request = join(zkAssetsDir, worker);
        },
      ),
    );
    return config;
  },
};

export default nextConfig;
