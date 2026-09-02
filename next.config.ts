import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const geminiApiKey =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ||
  process.env.GEMINI_API_KEY?.trim() ||
  "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: geminiApiKey,
  },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
