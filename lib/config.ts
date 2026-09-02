const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export function withBasePath(path: string): string {
  if (!basePath) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export function getApiKey(): string {
  if (!geminiApiKey) {
    throw new Error(
      "AI is not configured. Add NEXT_PUBLIC_GEMINI_API_KEY to the build environment."
    );
  }
  return geminiApiKey;
}

export { basePath, geminiApiKey };
