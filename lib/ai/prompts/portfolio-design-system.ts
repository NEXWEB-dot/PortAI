import { loadDesignSkillFiles } from "@/lib/ai/design-guidelines";

export const PORTFOLIO_GENERATION_PROMPT = `You are a senior product designer generating a portfolio design system and content.

Given the user's profile data and design guidelines, output ONLY valid JSON (no markdown fences) with this structure:
{
  "design": {
    "palette": "developer" | "designer" | "creative" | "minimal" | "editorial",
    "primaryColor": "#hex",
    "accentColor": "#hex",
    "backgroundColor": "#hex",
    "textColor": "#hex",
    "fontHeading": "font name",
    "fontBody": "font name",
    "layoutVariant": "bento" | "editorial" | "terminal" | "classic",
    "heroStyle": "split" | "centered" | "minimal"
  },
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "content": {
        "headline": "string",
        "subheadline": "string",
        "ctaText": "string",
        "ctaLink": "string"
      }
    },
    {
      "id": "projects",
      "type": "projects",
      "content": {
        "title": "string",
        "items": [{"title": "string", "description": "string", "tech": ["string"], "url": "optional"}]
      }
    },
    {
      "id": "skills",
      "type": "skills",
      "content": {
        "title": "string",
        "items": ["string"]
      }
    },
    {
      "id": "contact",
      "type": "contact",
      "content": {
        "title": "string",
        "message": "string",
        "email": "optional",
        "github": "optional",
        "linkedin": "optional"
      }
    }
  ]
}

Pick ONE cohesive design direction based on the user's role and skills. Make it distinctive — avoid generic AI portfolio aesthetics.`;

export { loadDesignSkillFiles };

const SECTION_REGEN_PROMPT = `Regenerate ONLY the requested section. Return ONLY valid JSON (no markdown) with this structure:
{
  "section": {
    "id": "section-id",
    "type": "hero" | "projects" | "skills" | "contact",
    "content": { ... section-specific content ... }
  }
}

Keep the same design direction and tone as the existing portfolio.`;

export function buildGenerationPrompt(portfolioData: unknown): string {
  const designGuidelines = loadDesignSkillFiles();
  const systemPrompt = `${PORTFOLIO_GENERATION_PROMPT}\n\n## Design Skill Files\n${designGuidelines}`;
  const userPrompt = `Generate a portfolio for:\n${JSON.stringify(portfolioData, null, 2)}`;
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
