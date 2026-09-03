const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string): string {
  if (!basePath) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export function getApiKey(): string {
  // Read inline so Next.js replaces this at build time for static export.
  const key = (
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  ).trim();

  if (!key) {
    throw new Error(
      "AI is not configured. Please set NEXT_PUBLIC_OPENROUTER_API_KEY in environment variables."
    );
  }
  return key;
}

export function isApiKeyConfigured(): boolean {
  return Boolean(
    (
      process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      ""
    ).trim()
  );
}

export function getModelName(): string {
  return (
    process.env.NEXT_PUBLIC_OPENROUTER_MODEL ||
    process.env.NEXT_PUBLIC_GEMINI_MODEL ||
    "z-ai/glm-5.2:free"
  ).trim();
}

export { basePath };
