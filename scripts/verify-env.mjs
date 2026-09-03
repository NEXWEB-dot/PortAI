import pkg from "@next/env";

const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

const skipEnv = (process.env.SKIP_ENV_CHECK || "").trim();
if (skipEnv === "1" || skipEnv === "true") {
  console.log("[build] Skipping API key verification (SKIP_ENV_CHECK is set)");
  process.exit(0);
}

const openRouterKey =
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY?.trim() ||
  process.env.OPENROUTER_API_KEY?.trim() ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ||
  process.env.GEMINI_API_KEY?.trim() ||
  "";

if (openRouterKey && !process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY = openRouterKey;
}

if (process.env.VERCEL) {
  console.log("[build] Vercel detected");
  console.log(
    `[build] NEXT_PUBLIC_OPENROUTER_API_KEY present: ${Boolean(process.env.NEXT_PUBLIC_OPENROUTER_API_KEY)}`
  );
}

if (
  !openRouterKey ||
  openRouterKey === "your_openrouter_api_key_here" ||
  openRouterKey === "your_gemini_api_key_here"
) {
  console.error(
    "\n[build] OpenRouter API key is missing or empty.\n" +
      "\nVercel / Host fix:\n" +
      "  1. Project Settings → Environment Variables\n" +
      "  2. Add NEXT_PUBLIC_OPENROUTER_API_KEY = your key from https://openrouter.ai/keys\n" +
      "  3. Enable for Production, Preview, AND Development\n" +
      "\nGitHub Pages fix:\n" +
      "  Repo Settings → Secrets and variables → Actions → Add secret OPENROUTER_API_KEY\n"
  );
  process.exit(1);
}

console.log(`[build] OpenRouter API key is configured (${openRouterKey.length} chars)`);
