import { v4 as uuidv4 } from "uuid";
import {
  generateOpenRouterJSON,
  parseJsonResponse,
  streamOpenRouterChat,
} from "@/lib/ai/openrouter";
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

const RESUME_EXTRACTION_SYSTEM_PROMPT = `You are a specialized, precision resume data extractor.
Your sole job is to extract profile details from resumes and text, returning ONLY a valid JSON object.
Rules:
- Return ONLY valid JSON starting with '{' and ending with '}'.
- NEVER include conversational preambles (never say 'I have processed', 'Here is the extracted', 'Sure', etc.).
- NEVER include conversational postambles.
- No markdown code block fences if possible, just the raw JSON object.`;

const EXTRACT_PROMPT = `Extract portfolio information from this text or conversation. Return ONLY valid JSON matching this structure:
{
  "name": "string",
  "title": "string",
  "bio": "string (2-3 concise, high-agency sentences)",
  "skills": ["skill1", "skill2"],
  "projects": [{"title": "string", "description": "string", "tech": ["string"], "url": "optional"}],
  "contact": {"email": "optional", "github": "optional", "linkedin": "optional", "website": "optional"}
}

If a field is not explicitly specified, infer a realistic, sophisticated profile for this professional domain without using generic filler words or clichés.`;

export async function parseResumeText(
  apiKey: string,
  resumeText: string
): Promise<PortfolioData> {
  const response = await generateOpenRouterJSON(
    apiKey,
    RESUME_EXTRACTION_SYSTEM_PROMPT,
    `${EXTRACT_PROMPT}\n\nResume text:\n${resumeText.slice(0, 15000)}`
  );
  const parsed = parseJsonResponse(response) as Partial<PortfolioData>;
  return {
    name: parsed.name || "Portfolio Owner",
    title: parsed.title || "Professional",
    bio: parsed.bio || "",
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    contact: parsed.contact || {},
  };
}

export async function extractProfileFromPrompt(
  apiKey: string,
  userPrompt: string,
  existingData?: PortfolioData
): Promise<PortfolioData> {
  const context = existingData?.name ? `Existing data:\n${JSON.stringify(existingData, null, 2)}\n\n` : "";
  const response = await generateOpenRouterJSON(
    apiKey,
    RESUME_EXTRACTION_SYSTEM_PROMPT,
    `${EXTRACT_PROMPT}\n\n${context}User request:\n${userPrompt}`
  );
  const parsed = parseJsonResponse(response) as Partial<PortfolioData>;
  return {
    name: parsed.name || existingData?.name || "Portfolio Owner",
    title: parsed.title || existingData?.title || "Professional",
    bio: parsed.bio || existingData?.bio || "",
    skills: Array.isArray(parsed.skills) ? parsed.skills : existingData?.skills || [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : existingData?.projects || [],
    contact: { ...existingData?.contact, ...parsed.contact },
  };
}

export async function generatePortfolio(
  apiKey: string,
  portfolioData: PortfolioData,
  existingPortfolio?: GeneratedPortfolio,
  section?: PortfolioSectionType,
  userInstruction?: string
): Promise<GeneratedPortfolio> {
  const designGuidelines = loadDesignSkillFiles();
  const systemPrompt = `${PORTFOLIO_GENERATION_PROMPT}\n\n## Design Skill Files\n${designGuidelines}`;

  if (section && existingPortfolio) {
    const { system, user } = buildSectionRegenPrompt(
      section,
      existingPortfolio,
      portfolioData
    );
    const response = await generateOpenRouterJSON(apiKey, system, user);
    const generated = parseJsonResponse(response) as { section: PortfolioSection };

    return {
      ...existingPortfolio,
      data: portfolioData,
      sections: existingPortfolio.sections.map((s) =>
        s.type === section ? generated.section : s
      ),
    };
  }

  const promptDetails = [
    `Profile data:\n${JSON.stringify(portfolioData, null, 2)}`,
    userInstruction ? `Specific user instruction:\n"${userInstruction}"` : null,
    !portfolioData.name && !userInstruction
      ? "Note: The user asked to build a portfolio. Generate a world-class, distinctive portfolio for a Senior Staff Software Engineer and Distributed Systems Architect, with 3 real technical projects, specific tech stacks, and quantifiable metrics."
      : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const userPrompt = `Generate a world-class portfolio landing page adhering to the design skills:\n\n${promptDetails}`;
  const response = await generateOpenRouterJSON(apiKey, systemPrompt, userPrompt);
  const generated = parseJsonResponse(response) as {
    design: GeneratedPortfolio["design"];
    sections: PortfolioSection[];
  };

  // Extract resolved name/title if missing in portfolioData
  const heroSection = generated.sections.find((s) => s.type === "hero");
  const heroContent = (heroSection?.content ?? {}) as Record<string, unknown>;
  const resolvedName =
    portfolioData.name ||
    (typeof heroContent.name === "string" ? heroContent.name : "") ||
    "Portfolio";
  const resolvedTitle =
    portfolioData.title ||
    (typeof heroContent.badge === "string" ? heroContent.badge : "") ||
    "Software Engineer";

  const resolvedData: PortfolioData = {
    ...portfolioData,
    name: resolvedName,
    title: resolvedTitle,
  };

  return {
    id: existingPortfolio?.id ?? uuidv4(),
    data: resolvedData,
    design: generated.design,
    sections: generated.sections,
    createdAt: existingPortfolio?.createdAt ?? new Date().toISOString(),
  };
}

export { streamOpenRouterChat, streamOpenRouterChat as streamGeminiChat };
