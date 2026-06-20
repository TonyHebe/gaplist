import type { NextConfig } from "next";
import path from "path";

const projectRoot = __dirname;

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  serverExternalPackages: ["fast-xml-parser"],
  webpack: (config) => {
    // Prevent parent-folder lockfiles from pulling the wrong node_modules.
    config.resolve.modules = [path.join(projectRoot, "node_modules"), "node_modules"];
    return config;
  },
};

export default nextConfig;
