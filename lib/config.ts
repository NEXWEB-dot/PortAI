const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string): string {
  if (!basePath) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export function getApiKey(): string {
  // Read inline so Next.js replaces this at build time (required for Vercel/static export).
  const key = (process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "").trim();
  if (!key) {
    throw new Error(
      "AI is not configured. Add NEXT_PUBLIC_GEMINI_API_KEY in Vercel Environment Variables and redeploy."
    );
  }
  return key;
}

export function isApiKeyConfigured(): boolean {
  return Boolean((process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "").trim());
}

export { basePath };
