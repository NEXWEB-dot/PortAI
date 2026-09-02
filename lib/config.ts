const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const defaultApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export function withBasePath(path: string): string {
  if (!basePath) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export { basePath, defaultApiKey };
