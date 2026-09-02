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
  const { data, design } = portfolio;
  const displayName = data.name || "Portfolio";
  const displayTitle = data.title || "";

  return (
    <div
      className="min-h-[100dvh] selection:bg-white/20"
      style={{
        ...sectionStyle(design),
        backgroundColor: design.backgroundColor,
        color: design.textColor,
      }}
    >
      {/* Floating Minimalist Header */}
      <header
        className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors"
        style={{
          borderColor: "var(--portfolio-accent)18",
          backgroundColor: `${design.backgroundColor}ee`,
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold tracking-tight">
              {displayName}
            </span>
            {displayTitle && (
              <span className="hidden font-mono text-xs opacity-50 sm:inline">
                / {displayTitle}
              </span>
            )}
          </div>

          <nav className="flex items-center gap-6 font-mono text-xs">
            <a
              href="#projects"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              Projects
            </a>
            <a
              href="#skills"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              Stack
            </a>
            <a
              href="#contact"
              className="rounded-md border px-3 py-1.5 transition-all hover:bg-white/5 active:scale-[0.98]"
              style={{ borderColor: "var(--portfolio-accent)33" }}
            >
              Connect
            </a>
          </nav>
        </div>
      </header>

      {/* Main Sections */}
      <main>
        {portfolio.sections.map((section) => renderSection(section, portfolio))}
      </main>

      {/* Minimal Footer */}
      <footer
        className="border-t px-6 py-10 text-center font-mono text-xs opacity-50"
        style={{ borderColor: "var(--portfolio-accent)18" }}
      >
        <p className="flex items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} {displayName}.</span>
          <span>Designed with PortAi.</span>
        </p>
      </footer>
    </div>
  );
}
