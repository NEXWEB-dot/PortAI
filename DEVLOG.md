# Development Log

### Devlog #1 — Building the Foundation
- Built the interactive portfolio builder with Next.js static export.
- Integrated PDF.js for parsing resumes client-side so users don't need to manually type everything.
- Designed high-craft editorial portfolio templates with Tailwind CSS and Framer Motion.

### Devlog #2 — Resilience, Previews & OpenRouter Engine
> *"building so the web is about to be shipped but the preview is not working at the last moment you can build your portfolio for free!! now the anti gravity is fixing the preview and it fixed now lets see what it did"*

- **Engine Switch**: Switched from Gemini to OpenRouter using `z-ai/glm-5.2:free` with a resilient multi-model fallback chain (`z-ai/glm-5.2:free` → `google/gemma-4-26b-a4b-it:free` → `minimax/minimax-m2.7:free`) to eliminate 503 and 429 rate-limit downtime during high-demand spikes.
- **Resume Parser JSON Fix**: Resolved the `Unexpected token 'I'` JSON parse error by introducing a dedicated extractor system prompt and a robust multi-pass parser that cleans conversational preambles, markdown code fences, and trailing commas.
- **Direct HTML Export**: Added a single-click HTML export that embeds all styles, fonts, and responsive layout into a standalone file ready to host anywhere.
- **Zero-Setup Demo**: Deployed to GitHub Pages with GitHub Actions so anyone can generate their portfolio for free without installing anything or providing their own API keys.
