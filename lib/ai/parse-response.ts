import type { PortfolioData } from "@/lib/types/portfolio";

export function extractPortfolioDataFromMessage(
  content: string
): PortfolioData | null {
  const match = content.match(/```portfolio-data\s*([\s\S]*?)```/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[1].trim());
    return parsed as PortfolioData;
  } catch {
    return null;
  }
}

export function stripPortfolioDataBlock(content: string): string {
  return content.replace(/```portfolio-data[\s\S]*?```/g, "").trim();
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
  const lower = message.toLowerCase();
  return (
    lower.includes("generate") &&
    (lower.includes("portfolio") ||
      lower.includes("landing page") ||
      lower.includes("website"))
  );
}

export function detectRegenerateSection(
  message: string
): PortfolioSectionType | null {
  const lower = message.toLowerCase();
  if (!lower.includes("regenerate") && !lower.includes("redo")) return null;

  if (lower.includes("hero")) return "hero";
  if (lower.includes("project")) return "projects";
  if (lower.includes("skill")) return "skills";
  if (lower.includes("contact")) return "contact";
  return null;
}
