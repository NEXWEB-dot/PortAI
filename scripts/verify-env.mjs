const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ?? "";

if (!key || key === "your_gemini_api_key_here") {
  console.error(
    "\n[build] NEXT_PUBLIC_GEMINI_API_KEY is missing or empty.\n" +
      "  Vercel: Project → Settings → Environment Variables → add NEXT_PUBLIC_GEMINI_API_KEY\n" +
      "  GitHub Pages: repo Settings → Secrets → Actions → add GEMINI_API_KEY\n" +
      "  Then redeploy (Vercel: Deployments → Redeploy, uncheck build cache).\n"
  );
  process.exit(1);
}

console.log(`[build] NEXT_PUBLIC_GEMINI_API_KEY is set (${key.length} chars)`);
