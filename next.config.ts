import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Lets a phone on the same Wi-Fi use the app while testing with
  // "npm run dev". Only affects development, not the real app.
  allowedDevOrigins: ["172.17.*.*", "192.168.*.*", "10.*.*.*"],

  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
