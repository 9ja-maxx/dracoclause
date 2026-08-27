import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["react"] = path.resolve(__dirname, "node_modules/react");
    config.resolve.alias["react-dom"] = path.resolve(__dirname, "node_modules/react-dom");
    return config;
  },
};

export default nextConfig;
