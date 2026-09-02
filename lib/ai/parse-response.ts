import type { PortfolioData } from "@/lib/types/portfolio";

export function extractPortfolioDataFromMessage(
  content: string
): PortfolioData | null {
  // Try ```portfolio-data
  const customMatch = content.match(/```portfolio-data\s*([\s\S]*?)```/);
  if (customMatch) {
    try {
      return JSON.parse(customMatch[1].trim()) as PortfolioData;
    } catch {
      // ignore
    }
  }

  // Try ```json blocks that look like portfolio data
  const jsonMatches = content.matchAll(/```(?:json)?\s*([\s\S]*?)```/g);
  for (const match of jsonMatches) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (
        parsed &&
        typeof parsed === "object" &&
        ("name" in parsed || "title" in parsed || "skills" in parsed || "projects" in parsed)
      ) {
        return parsed as PortfolioData;
      }
    } catch {
      // ignore
    }
  }

  // Try raw JSON object at end of string
  const rawMatch = content.match(/\{[\s\S]*"(?:name|title|skills|projects)"[\s\S]*\}/);
  if (rawMatch) {
    try {
      const parsed = JSON.parse(rawMatch[0]);
      if (parsed && typeof parsed === "object") {
        return parsed as PortfolioData;
      }
    } catch {
      // ignore
    }
  }

  return null;
}

export function stripPortfolioDataBlock(content: string): string {
  let cleaned = content
    .replace(/```portfolio-data[\s\S]*?```/gi, "")
    .replace(/```json\s*\{[\s\S]*?"(?:name|title|skills|projects)"[\s\S]*?\}\s*```/gi, "")
    .replace(/```\s*\{[\s\S]*?"(?:name|title|skills|projects)"[\s\S]*?\}\s*```/gi, "")
    .replace(/\{[\r\n\s]*"(?:name|title|bio|skills|projects)"[\s\S]*\}[\s]*$/gi, "")
    .trim();

  // If the cleaning leaves an empty string or just punctuation, give a friendly message
  if (!cleaned) {
    cleaned = "Your portfolio details have been extracted and prepared.";
  }

  return cleaned;
}

export function mergePortfolioData(
  existing: PortfolioData,
  incoming: Partial<PortfolioData>
): PortfolioData {
  return {
    name: incoming.name || existing.name,
    title: incoming.title || existing.title,
    bio: incoming.bio || existing.bio,
    skills: incoming.skills?.length ? incoming.skills : existing.skills,
    projects: incoming.projects?.length ? incoming.projects : existing.projects,
    contact: { ...existing.contact, ...incoming.contact },
  };
}

export type PortfolioSectionType = "hero" | "projects" | "skills" | "contact";

export function shouldGeneratePortfolio(message: string): boolean {
  const lower = message.toLowerCase().trim();

  const actionKeywords = [
    "build",
    "create",
    "generate",
    "make",
    "design",
    "code",
    "construct",
    "develop",
    "setup",
    "craft",
    "produce",
  ];

  const targetKeywords = [
    "portfolio",
    "landing page",
    "landingpage",
    "website",
    "site",
    "web page",
    "webpage",
    "page",
  ];

  const hasAction = actionKeywords.some((act) => lower.includes(act));
  const hasTarget = targetKeywords.some((tgt) => lower.includes(tgt));

  if (hasAction && hasTarget) return true;

  // Direct short commands
  if (
    lower === "build it" ||
    lower === "create it" ||
    lower === "generate it" ||
    lower === "make it" ||
    lower === "build" ||
    lower === "generate" ||
    lower === "start" ||
    lower === "build now" ||
    lower.startsWith("build for ") ||
    lower.startsWith("create for ") ||
    lower.startsWith("portfolio for ")
  ) {
    return true;
  }

  return false;
}

export function detectRegenerateSection(
  message: string
): PortfolioSectionType | null {
  const lower = message.toLowerCase();
  if (
    !lower.includes("regenerate") &&
    !lower.includes("redo") &&
    !lower.includes("rebuild") &&
    !lower.includes("update") &&
    !lower.includes("change")
  ) {
    return null;
  }

  if (lower.includes("hero") || lower.includes("headline") || lower.includes("intro")) return "hero";
  if (lower.includes("project") || lower.includes("work") || lower.includes("case stud")) return "projects";
  if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack")) return "skills";
  if (lower.includes("contact") || lower.includes("email") || lower.includes("reach out")) return "contact";
  return null;
}
