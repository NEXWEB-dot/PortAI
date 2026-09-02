import type { CSSProperties } from "react";
import type { DesignTokens, PortfolioSection } from "@/lib/types/portfolio";

const FONT_MAP: Record<string, string> = {
  Inter: "var(--font-geist-sans)",
  Geist: "var(--font-geist-sans)",
  "Space Grotesk": "var(--font-space-grotesk, var(--font-geist-sans))",
  "Playfair Display": "var(--font-playfair, Georgia, serif)",
  "JetBrains Mono": "var(--font-geist-mono)",
  "DM Sans": "var(--font-dm-sans, var(--font-geist-sans))",
};

export function getFontFamily(fontName: string): string {
  return FONT_MAP[fontName] || fontName;
}

export function sectionStyle(design: DesignTokens) {
  return {
    "--portfolio-primary": design.primaryColor,
    "--portfolio-accent": design.accentColor,
    "--portfolio-bg": design.backgroundColor,
    "--portfolio-text": design.textColor,
    fontFamily: getFontFamily(design.fontBody),
  } as CSSProperties;
}

export function headingStyle(design: DesignTokens) {
  return { fontFamily: getFontFamily(design.fontHeading) };
}

export function getSection(
  sections: PortfolioSection[],
  type: PortfolioSection["type"]
) {
  return sections.find((s) => s.type === type);
}
