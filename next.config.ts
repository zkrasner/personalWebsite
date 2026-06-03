import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Allow LAN access during local dev (e.g. testing from a phone on the same Wi-Fi).
  allowedDevOrigins: ["192.168.1.7"],
};

export default nextConfig;
