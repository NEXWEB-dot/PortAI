import { v4 as uuidv4 } from "uuid";
import { generateGeminiJSON, parseJsonResponse } from "@/lib/ai/gemini";
import { BUILDER_SYSTEM_PROMPT } from "@/lib/ai/prompts/builder-system";
import {
  PORTFOLIO_GENERATION_PROMPT,
  buildSectionRegenPrompt,
  loadDesignSkillFiles,
} from "@/lib/ai/prompts/portfolio-design-system";
import type { PortfolioSectionType } from "@/lib/ai/parse-response";
import type {
  GeneratedPortfolio,
  PortfolioData,
  PortfolioSection,
} from "@/lib/types/portfolio";

const EXTRACT_PROMPT = `Extract portfolio information from this resume text. Return ONLY valid JSON (no markdown) matching this structure:
{
  "name": "string",
  "title": "string",
  "bio": "string (2-3 sentences)",
  "skills": ["skill1", "skill2"],
  "projects": [{"title": "string", "description": "string", "tech": ["string"], "url": "optional"}],
  "contact": {"email": "optional", "github": "optional", "linkedin": "optional", "website": "optional"}
}

If a field is not found, use empty string or empty array. Infer projects from work experience if not explicitly listed.`;

export async function parseResumeText(
  apiKey: string,
  resumeText: string
): Promise<PortfolioData> {
  const response = await generateGeminiJSON(
    apiKey,
    BUILDER_SYSTEM_PROMPT,
    `${EXTRACT_PROMPT}\n\nResume text:\n${resumeText.slice(0, 15000)}`
  );
  return parseJsonResponse(response) as PortfolioData;
}

export async function generatePortfolio(
  apiKey: string,
  portfolioData: PortfolioData,
  existingPortfolio?: GeneratedPortfolio,
  section?: PortfolioSectionType
): Promise<GeneratedPortfolio> {
  const designGuidelines = loadDesignSkillFiles();
  const systemPrompt = `${PORTFOLIO_GENERATION_PROMPT}\n\n## Design Skill Files\n${designGuidelines}`;

  if (section && existingPortfolio) {
    const { system, user } = buildSectionRegenPrompt(
      section,
      existingPortfolio,
      portfolioData
    );
    const response = await generateGeminiJSON(apiKey, system, user);
    const generated = parseJsonResponse(response) as { section: PortfolioSection };

    return {
      ...existingPortfolio,
      data: portfolioData,
      sections: existingPortfolio.sections.map((s) =>
        s.type === section ? generated.section : s
      ),
    };
  }

  const userPrompt = `Generate a portfolio for:\n${JSON.stringify(portfolioData, null, 2)}`;
  const response = await generateGeminiJSON(apiKey, systemPrompt, userPrompt);
  const generated = parseJsonResponse(response) as {
    design: GeneratedPortfolio["design"];
    sections: PortfolioSection[];
  };

  return {
    id: existingPortfolio?.id ?? uuidv4(),
    data: portfolioData,
    design: generated.design,
    sections: generated.sections,
    createdAt: existingPortfolio?.createdAt ?? new Date().toISOString(),
  };
}

export { streamGeminiChat } from "@/lib/ai/gemini";
