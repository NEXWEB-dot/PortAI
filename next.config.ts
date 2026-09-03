import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const openRouterApiKey =
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY?.trim() ||
  process.env.OPENROUTER_API_KEY?.trim() ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ||
  process.env.GEMINI_API_KEY?.trim() ||
  "";

const openRouterModel =
  process.env.NEXT_PUBLIC_OPENROUTER_MODEL?.trim() ||
  process.env.OPENROUTER_MODEL?.trim() ||
  "z-ai/glm-5.2:free";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_OPENROUTER_API_KEY: openRouterApiKey,
    NEXT_PUBLIC_OPENROUTER_MODEL: openRouterModel,
    NEXT_PUBLIC_GEMINI_API_KEY: openRouterApiKey,
  },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
