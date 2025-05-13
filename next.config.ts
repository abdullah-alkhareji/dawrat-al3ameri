import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Polyfill Node.js core modules in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      process: false,
      util: false,
    };

    return config;
  },
  serverExternalPackages: ["bcrypt", "node-gyp-build"],
};

export default nextConfig;
