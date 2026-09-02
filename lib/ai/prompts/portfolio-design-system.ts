import { loadDesignSkillFiles } from "@/lib/ai/design-guidelines";

export const PORTFOLIO_GENERATION_PROMPT = `You are a world-class principal product designer and design engineer generating an elite portfolio landing page.

You must follow the design guidelines strictly. Output ONLY valid JSON (no markdown fences) matching this structure:
{
  "design": {
    "palette": "developer" | "designer" | "creative" | "minimal" | "editorial",
    "primaryColor": "#hex (surface color, e.g. #18181b or #f4f4f5)",
    "accentColor": "#hex (singular crisp accent, e.g. #06b6d4, #10b981, #f59e0b, #e11d48, or #ffffff)",
    "backgroundColor": "#hex (canvas color, e.g. #09090b, #0a0a0f, #faf9f6, #000000, #121212)",
    "textColor": "#hex (e.g. #f4f4f5 for dark canvas, #18181b for light canvas)",
    "fontHeading": "Geist" | "Space Grotesk" | "Playfair Display" | "JetBrains Mono" | "DM Sans",
    "fontBody": "Geist" | "Inter" | "JetBrains Mono" | "DM Sans",
    "layoutVariant": "bento" | "editorial" | "terminal" | "classic",
    "heroStyle": "split" | "centered" | "minimal"
  },
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "content": {
        "badge": "Monospace role badge, e.g. 'STAFF DISTRIBUTED SYSTEMS & FRONTEND ARCHITECT'",
        "statusDot": "Live availability note, e.g. 'Available for select advisory & full-time lead roles'",
        "headline": "Punchy, authoritative, high-agency headline (max 2 lines, NOT 'Hi I am John')",
        "subheadline": "Specific 2-sentence positioning statement detailing actual domains, architectures, and philosophies",
        "ctaText": "e.g. 'Explore Selected Systems'",
        "ctaLink": "#projects",
        "secondaryCtaText": "e.g. 'Direct Communication'",
        "secondaryCtaLink": "#contact",
        "metrics": [
          { "label": "Production Experience", "value": "6+ Yrs" },
          { "label": "Scale Handled", "value": "2.4M MAU" },
          { "label": "Performance", "value": "-45% P99" }
        ],
        "terminalCommand": "$ whoami --status=active"
      }
    },
    {
      "id": "projects",
      "type": "projects",
      "content": {
        "title": "Selected Engineering & Systems",
        "subtitle": "Production architectures, specialized tools, and high-performance interfaces.",
        "items": [
          {
            "title": "Distinctive Project Title",
            "tagline": "One-line architectural or product hook",
            "description": "2-3 sentences explaining the concrete technical challenge, architecture decisions, and measurable results.",
            "tech": ["TypeScript", "Next.js", "PostgreSQL", "Redis"],
            "metrics": "Impact badge, e.g. '35ms P99 latency' or '100k+ MAU'",
            "featured": true,
            "category": "Core Infrastructure",
            "url": "https://github.com/..."
          }
        ]
      }
    },
    {
      "id": "skills",
      "type": "skills",
      "content": {
        "title": "Technical Capabilities & Stack",
        "subtitle": "Core competencies, frameworks, and architecture primitives.",
        "categories": [
          {
            "name": "Architecture & Languages",
            "skills": ["TypeScript", "Rust", "Go", "Distributed State"]
          },
          {
            "name": "Frontend & Systems",
            "skills": ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Design Systems"]
          },
          {
            "name": "Cloud & Reliability",
            "skills": ["PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"]
          }
        ],
        "items": ["TypeScript", "Next.js", "React", "PostgreSQL", "Tailwind CSS", "Docker"]
      }
    },
    {
      "id": "contact",
      "type": "contact",
      "content": {
        "title": "Let's Build Something Exceptional",
        "message": "Direct, specific invitation to connect regarding engineering initiatives, advisory, or leadership.",
        "status": "Typically responds within 24 hours. Open to remote and select hybrid locations.",
        "email": "user@example.com",
        "github": "https://github.com/...",
        "linkedin": "https://linkedin.com/in/..."
      }
    }
  ]
}

STRICT ANTI-SLOP & DESIGN RULES:
1. One cohesive palette: Monochrome base (black, charcoal, slate, or warm bone) with AT MOST ONE sharp, high-contrast accent.
2. The Lila Ban: NO generic purple/blue gradients or neon orbs. No gold luxury defaults.
3. No em-dashes anywhere in text. Use periods, commas, or semicolons.
4. Banned copy: "Passionate developer", "results-driven", "elevate", "seamless", "unleash", "next-gen", "delve", "game-changer".
5. Real specificity: Always include real metrics, real technical decisions, and concrete domain value.
6. Featured project: Always designate 1-2 featured projects with "featured": true and rich metrics so the Bento Grid has striking visual hierarchy.
7. If the user data contains specific names, projects, or background, incorporate them fully. If sparse, infer plausible, sophisticated real-world projects matching their title. Never use "Project 1" or "Lorem Ipsum".`;

export { loadDesignSkillFiles };

const SECTION_REGEN_PROMPT = `Regenerate ONLY the requested section with high-agency, distinctive craft. Return ONLY valid JSON (no markdown) with this structure:
{
  "section": {
    "id": "section-id",
    "type": "hero" | "projects" | "skills" | "contact",
    "content": { ... section-specific content adhering to the design rules ... }
  }
}

Maintain the same palette, typography, and authoritative tone as the rest of the portfolio.`;

export function buildGenerationPrompt(portfolioData: unknown): string {
  const designGuidelines = loadDesignSkillFiles();
  const systemPrompt = `${PORTFOLIO_GENERATION_PROMPT}\n\n## Design Skill Files\n${designGuidelines}`;
  const userPrompt = `Generate a world-class portfolio for:\n${JSON.stringify(portfolioData, null, 2)}`;
  return `${systemPrompt}\n\n---\n\n${userPrompt}`;
}

export function buildSectionRegenPrompt(
  section: string,
  existingPortfolio: unknown,
  portfolioData: unknown
): { system: string; user: string } {
  const designGuidelines = loadDesignSkillFiles();
  const system = `${PORTFOLIO_GENERATION_PROMPT}\n\n## Design Skill Files\n${designGuidelines}`;
  const user = `${SECTION_REGEN_PROMPT}\n\nRegenerate section: ${section}\n\nExisting portfolio:\n${JSON.stringify(existingPortfolio, null, 2)}\n\nProfile data:\n${JSON.stringify(portfolioData, null, 2)}`;
  return { system, user };
}
