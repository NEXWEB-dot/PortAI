import type { GeneratedPortfolio, PortfolioSection } from "@/lib/types/portfolio";
import { sectionStyle } from "@/lib/portfolio/utils";
import { HeroSection } from "@/components/portfolio/hero-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { SkillsSection } from "@/components/portfolio/skills-section";
import { ContactSection } from "@/components/portfolio/contact-section";

function renderSection(section: PortfolioSection, portfolio: GeneratedPortfolio) {
  const { design } = portfolio;

  switch (section.type) {
    case "hero":
      return (
        <HeroSection
          key={section.id}
          content={section.content as Parameters<typeof HeroSection>[0]["content"]}
          design={design}
        />
      );
    case "projects":
      return (
        <ProjectsSection
          key={section.id}
          content={section.content as Parameters<typeof ProjectsSection>[0]["content"]}
          design={design}
        />
      );
    case "skills":
      return (
        <SkillsSection
          key={section.id}
          content={section.content as Parameters<typeof SkillsSection>[0]["content"]}
          design={design}
        />
      );
    case "contact":
      return (
        <ContactSection
          key={section.id}
          content={section.content as Parameters<typeof ContactSection>[0]["content"]}
          design={design}
        />
      );
    default:
      return null;
  }
}

export function PortfolioPage({ portfolio }: { portfolio: GeneratedPortfolio }) {
  return (
    <div
      className="min-h-dvh"
      style={{
        ...sectionStyle(portfolio.design),
        backgroundColor: portfolio.design.backgroundColor,
        color: portfolio.design.textColor,
      }}
    >
      {portfolio.sections.map((section) => renderSection(section, portfolio))}
      <footer
        className="border-t px-6 py-6 text-center text-xs opacity-50"
        style={{ borderColor: "var(--portfolio-accent)22" }}
      >
        Built with PortAi
      </footer>
    </div>
  );
}
