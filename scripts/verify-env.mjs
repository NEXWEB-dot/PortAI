import pkg from "@next/env";

const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

if (process.env.SKIP_ENV_CHECK === "1" || process.env.SKIP_ENV_CHECK === "true") {
  console.log("[build] Skipping Gemini API key verification (SKIP_ENV_CHECK is set)");
  process.exit(0);
}

const key =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ||
  process.env.GEMINI_API_KEY?.trim() ||
  "";

if (key && !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  process.env.NEXT_PUBLIC_GEMINI_API_KEY = key;
}

if (process.env.VERCEL) {
  console.log("[build] Vercel detected");
  console.log(
    `[build] NEXT_PUBLIC_GEMINI_API_KEY present: ${Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY)}`
  );
  console.log(`[build] GEMINI_API_KEY present: ${Boolean(process.env.GEMINI_API_KEY)}`);
}

if (!key || key === "your_gemini_api_key_here") {
  console.error(
    "\n[build] Gemini API key is missing or empty.\n" +
      "\nVercel fix:\n" +
      "  1. Project → Settings → Environment Variables\n" +
      "  2. Add NEXT_PUBLIC_GEMINI_API_KEY = your key from https://aistudio.google.com/apikey\n" +
      "  3. Enable for Production, Preview, AND Development\n" +
      "  4. Under each variable, ensure it applies to the Build step\n" +
      "  5. Deployments → Redeploy → uncheck 'Use existing Build Cache'\n" +
      "\nGitHub Pages: repo Settings → Secrets → Actions → GEMINI_API_KEY\n"
  );
  process.exit(1);
}

console.log(`[build] Gemini API key is set (${key.length} chars)`);
