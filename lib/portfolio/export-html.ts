import type {
  DesignTokens,
  GeneratedPortfolio,
  PortfolioSection,
} from "@/lib/types/portfolio";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fontStack(name: string): string {
  const stacks: Record<string, string> = {
    Geist: "'Geist', system-ui, sans-serif",
    Inter: "system-ui, sans-serif",
    "Space Grotesk": "'Space Grotesk', system-ui, sans-serif",
    "Playfair Display": "'Playfair Display', Georgia, serif",
    "JetBrains Mono": "'JetBrains Mono', ui-monospace, monospace",
    "DM Sans": "'DM Sans', system-ui, sans-serif",
  };
  return stacks[name] ?? `'${name}', system-ui, sans-serif`;
}

function googleFontsLink(design: DesignTokens): string {
  const families = new Set([design.fontHeading, design.fontBody]);
  const params = [...families]
    .map((f) => `family=${encodeURIComponent(f.replace(/ /g, "+"))}:wght@400;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

function renderHero(
  content: Record<string, unknown>,
  design: DesignTokens
): string {
  const headline = escapeHtml(String(content.headline ?? ""));
  const subheadline = escapeHtml(String(content.subheadline ?? ""));
  const ctaText = content.ctaText ? escapeHtml(String(content.ctaText)) : "";
  const ctaLink = escapeHtml(String(content.ctaLink ?? "#contact"));
  const centered =
    design.heroStyle === "centered" || design.heroStyle === "minimal";
  const terminal = design.layoutVariant === "terminal";

  return `
    <section class="hero${centered ? " hero--centered" : ""}">
      ${terminal ? '<p class="hero__terminal">$ whoami</p>' : ""}
      <h1>${headline}</h1>
      <p class="hero__sub">${subheadline}</p>
      ${
        ctaText
          ? `<a class="hero__cta" href="${ctaLink}">${ctaText}</a>`
          : ""
      }
    </section>`;
}

function renderProjects(
  content: Record<string, unknown>,
  design: DesignTokens
): string {
  const title = escapeHtml(String(content.title ?? "Projects"));
  const items = (content.items as Array<Record<string, unknown>>) ?? [];
  const bento = design.layoutVariant === "bento";

  const cards = items
    .map((project, i) => {
      const projectTitle = escapeHtml(String(project.title ?? ""));
      const description = escapeHtml(String(project.description ?? ""));
      const url = project.url ? escapeHtml(String(project.url)) : "";
      const tech = (project.tech as string[]) ?? [];
      const techTags = tech
        .map(
          (t) =>
            `<span class="tag">${escapeHtml(t)}</span>`
        )
        .join("");

      return `
        <article class="project${bento && i === 0 ? " project--featured" : ""}">
          <h3>${
            url
              ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${projectTitle}</a>`
              : projectTitle
          }</h3>
          <p>${description}</p>
          <div class="tags">${techTags}</div>
        </article>`;
    })
    .join("");

  return `
    <section class="section">
      <h2>${title}</h2>
      <div class="projects${bento ? " projects--bento" : ""}">${cards}</div>
    </section>`;
}

function renderSkills(
  content: Record<string, unknown>,
  design: DesignTokens
): string {
  const title = escapeHtml(String(content.title ?? "Skills"));
  const items = (content.items as string[]) ?? [];
  const terminal = design.layoutVariant === "terminal";

  const tags = items
    .map((skill) => {
      const label = terminal ? `> ${skill}` : skill;
      return `<span class="skill${terminal ? " skill--terminal" : ""}">${escapeHtml(label)}</span>`;
    })
    .join("");

  return `
    <section class="section">
      <h2>${title}</h2>
      <div class="skills">${tags}</div>
    </section>`;
}

function renderContact(content: Record<string, unknown>): string {
  const title = escapeHtml(String(content.title ?? "Contact"));
  const message = escapeHtml(String(content.message ?? ""));
  const email = content.email ? escapeHtml(String(content.email)) : "";
  const github = content.github ? escapeHtml(String(content.github)) : "";
  const linkedin = content.linkedin ? escapeHtml(String(content.linkedin)) : "";

  const links = [
    email
      ? `<a href="mailto:${email}" class="contact__link">Email</a>`
      : "",
    github
      ? `<a href="${github}" class="contact__link" target="_blank" rel="noopener noreferrer">GitHub</a>`
      : "",
    linkedin
      ? `<a href="${linkedin}" class="contact__link" target="_blank" rel="noopener noreferrer">LinkedIn</a>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <section class="section section--contact" id="contact">
      <h2>${title}</h2>
      <p class="contact__message">${message}</p>
      <div class="contact__links">${links}</div>
    </section>`;
}

function renderSection(section: PortfolioSection, design: DesignTokens): string {
  switch (section.type) {
    case "hero":
      return renderHero(section.content, design);
    case "projects":
      return renderProjects(section.content, design);
    case "skills":
      return renderSkills(section.content, design);
    case "contact":
      return renderContact(section.content);
    default:
      return "";
  }
}

function portfolioStyles(design: DesignTokens): string {
  const heading = fontStack(design.fontHeading);
  const body = fontStack(design.fontBody);

  return `
    :root {
      --primary: ${design.primaryColor};
      --accent: ${design.accentColor};
      --bg: ${design.backgroundColor};
      --text: ${design.textColor};
      --heading: ${heading};
      --body: ${body};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--body);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3 { font-family: var(--heading); line-height: 1.15; }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .page { min-height: 100dvh; }
    .hero {
      padding: 5rem 1.5rem;
      max-width: 64rem;
      margin: 0 auto;
    }
    .hero--centered { text-align: center; }
    .hero__terminal {
      font-family: ui-monospace, monospace;
      font-size: 0.875rem;
      opacity: 0.6;
      margin-bottom: 1rem;
    }
    .hero h1 {
      font-size: clamp(2.25rem, 6vw, 4.5rem);
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .hero__sub {
      margin-top: 1.5rem;
      font-size: clamp(1rem, 2.5vw, 1.25rem);
      opacity: 0.8;
      max-width: 42rem;
    }
    .hero--centered .hero__sub { margin-left: auto; margin-right: auto; }
    .hero__cta {
      display: inline-block;
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background: var(--accent);
      color: var(--bg);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
    }
    .hero__cta:hover { opacity: 0.9; text-decoration: none; }
    .section {
      padding: 4rem 1.5rem;
      max-width: 64rem;
      margin: 0 auto;
    }
    .section h2 {
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      margin-bottom: 2rem;
    }
    .projects {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: 1fr;
    }
    @media (min-width: 768px) {
      .projects { grid-template-columns: repeat(2, 1fr); }
      .projects--bento { grid-template-columns: repeat(3, 1fr); }
      .project--featured { grid-column: span 2; }
    }
    .project {
      border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
      background: color-mix(in srgb, var(--primary) 7%, transparent);
      border-radius: 0.75rem;
      padding: 1.5rem;
    }
    .project h3 { font-size: 1.125rem; font-weight: 600; }
    .project p { margin-top: 0.5rem; font-size: 0.875rem; opacity: 0.75; }
    .tags, .skills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
    .tag, .skill {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      background: color-mix(in srgb, var(--accent) 13%, transparent);
      color: var(--accent);
    }
    .skill {
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid color-mix(in srgb, var(--accent) 27%, transparent);
      background: color-mix(in srgb, var(--primary) 7%, transparent);
      color: var(--text);
    }
    .skill--terminal { font-family: ui-monospace, monospace; }
    .section--contact { text-align: center; max-width: 48rem; }
    .contact__message { margin-top: 1rem; font-size: 1.125rem; opacity: 0.8; }
    .contact__links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }
    .contact__link {
      border: 1px solid color-mix(in srgb, var(--accent) 27%, transparent);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      color: var(--text);
      font-size: 0.875rem;
      text-decoration: none;
    }
    .contact__link:hover { opacity: 0.8; text-decoration: none; }
    .footer {
      border-top: 1px solid color-mix(in srgb, var(--accent) 13%, transparent);
      padding: 1.5rem;
      text-align: center;
      font-size: 0.75rem;
      opacity: 0.5;
    }
    @media (max-width: 640px) {
      .hero { padding: 3rem 1rem; }
      .section { padding: 3rem 1rem; }
    }
  `;
}

export function exportPortfolioHtml(portfolio: GeneratedPortfolio): string {
  const { design, sections, data } = portfolio;
  const pageTitle = escapeHtml(data.name || "Portfolio");
  const sectionsHtml = sections
    .map((section) => renderSection(section, design))
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${googleFontsLink(design)}" rel="stylesheet" />
  <style>${portfolioStyles(design)}</style>
</head>
<body>
  <div class="page">
    ${sectionsHtml}
    <footer class="footer">Built with PortAi</footer>
  </div>
</body>
</html>`;
}

export function downloadPortfolioHtml(portfolio: GeneratedPortfolio): void {
  const html = exportPortfolioHtml(portfolio);
  const slug = (portfolio.data.name || "portfolio")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug || "portfolio"}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
