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
    .map((f) => `family=${encodeURIComponent(f.replace(/ /g, "+"))}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

function renderHero(
  content: Record<string, unknown>,
  design: DesignTokens
): string {
  const headline = escapeHtml(String(content.headline ?? ""));
  const subheadline = escapeHtml(String(content.subheadline ?? ""));
  const badge = content.badge ? escapeHtml(String(content.badge)) : "";
  const statusDot = content.statusDot ? escapeHtml(String(content.statusDot)) : "";
  const ctaText = content.ctaText ? escapeHtml(String(content.ctaText)) : "";
  const ctaLink = escapeHtml(String(content.ctaLink ?? "#projects"));
  const secondaryCtaText = content.secondaryCtaText
    ? escapeHtml(String(content.secondaryCtaText))
    : "";
  const secondaryCtaLink = escapeHtml(String(content.secondaryCtaLink ?? "#contact"));
  const centered =
    design.heroStyle === "centered" || design.heroStyle === "minimal";
  const terminal = design.layoutVariant === "terminal";

  const metrics = (content.metrics as Array<{ label: string; value: string }>) ?? [];
  const metricsHtml =
    metrics.length > 0
      ? `<div class="hero__metrics">
          ${metrics
            .map(
              (m) => `
            <div class="metric">
              <span class="metric__value">${escapeHtml(m.value)}</span>
              <span class="metric__label">${escapeHtml(m.label)}</span>
            </div>`
            )
            .join("")}
        </div>`
      : "";

  return `
    <section class="hero${centered ? " hero--centered" : ""}">
      ${
        statusDot
          ? `<div class="hero__status"><span class="status-dot"></span><span>${statusDot}</span></div>`
          : ""
      }
      ${badge ? `<p class="hero__badge">${badge}</p>` : ""}
      ${terminal && !badge ? '<p class="hero__terminal">$ whoami --status=active</p>' : ""}
      <h1>${headline}</h1>
      <p class="hero__sub">${subheadline}</p>
      <div class="hero__actions">
        ${
          ctaText
            ? `<a class="hero__cta" href="${ctaLink}">${ctaText} &nearr;</a>`
            : ""
        }
        ${
          secondaryCtaText
            ? `<a class="hero__secondary" href="${secondaryCtaLink}">${secondaryCtaText}</a>`
            : ""
        }
      </div>
      ${metricsHtml}
    </section>`;
}

function renderProjects(
  content: Record<string, unknown>,
  design: DesignTokens
): string {
  const title = escapeHtml(String(content.title ?? "Selected Engineering & Systems"));
  const subtitle = content.subtitle ? escapeHtml(String(content.subtitle)) : "";
  const items = (content.items as Array<Record<string, unknown>>) ?? [];
  const bento = design.layoutVariant === "bento";
  const editorial = design.layoutVariant === "editorial";
  const terminal = design.layoutVariant === "terminal";

  const cards = items
    .map((project, i) => {
      const projectTitle = escapeHtml(String(project.title ?? ""));
      const description = escapeHtml(String(project.description ?? ""));
      const tagline = project.tagline ? escapeHtml(String(project.tagline)) : "";
      const url = project.url ? escapeHtml(String(project.url)) : "";
      const metrics = project.metrics ? escapeHtml(String(project.metrics)) : "";
      const category = project.category ? escapeHtml(String(project.category)) : "";
      const isFeatured = project.featured ?? (bento && i === 0);
      const tech = (project.tech as string[]) ?? [];
      const techTags = tech
        .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
        .join("");

      return `
        <article class="project${isFeatured ? " project--featured" : ""}">
          <div class="project__header">
            <div class="project__meta">
              ${isFeatured ? '<span class="badge badge--featured">Featured System</span>' : ""}
              ${category ? `<span class="badge badge--category">${category}</span>` : ""}
            </div>
            ${metrics ? `<span class="badge badge--metric">${metrics}</span>` : ""}
          </div>
          <h3>${
            url
              ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${terminal ? "&gt; " : ""}${projectTitle} &nearr;</a>`
              : `${terminal ? "&gt; " : ""}${projectTitle}`
          }</h3>
          ${tagline ? `<p class="project__tagline">${tagline}</p>` : ""}
          <p class="project__desc">${description}</p>
          <div class="tags">${techTags}</div>
        </article>`;
    })
    .join("");

  return `
    <section class="section" id="projects">
      <div class="section__header">
        <p class="section__eyebrow">[01 / SELECTED WORK]</p>
        <h2>${title}</h2>
        ${subtitle ? `<p class="section__sub">${subtitle}</p>` : ""}
      </div>
      <div class="projects${editorial ? " projects--editorial" : bento ? " projects--bento" : ""}">${cards}</div>
    </section>`;
}

function renderSkills(
  content: Record<string, unknown>,
  design: DesignTokens
): string {
  const title = escapeHtml(String(content.title ?? "Technical Capabilities & Stack"));
  const subtitle = content.subtitle ? escapeHtml(String(content.subtitle)) : "";
  const categories = (content.categories as Array<{ name: string; skills: string[] }>) ?? [];
  const items = (content.items as string[]) ?? [];
  const terminal = design.layoutVariant === "terminal";

  let bodyHtml = "";
  if (categories.length > 0) {
    bodyHtml = `
      <div class="skills-grid">
        ${categories
          .map(
            (cat) => `
          <div class="skill-category">
            <h3>${escapeHtml(cat.name)}</h3>
            <div class="skills">
              ${cat.skills
                .map(
                  (s) =>
                    `<span class="skill${terminal ? " skill--terminal" : ""}">${
                      terminal ? `&gt; ${escapeHtml(s)}` : escapeHtml(s)
                    }</span>`
                )
                .join("")}
            </div>
          </div>`
          )
          .join("")}
      </div>`;
  } else {
    bodyHtml = `
      <div class="skills">
        ${items
          .map(
            (skill) =>
              `<span class="skill${terminal ? " skill--terminal" : ""}">${
                terminal ? `&gt; ${escapeHtml(skill)}` : escapeHtml(skill)
              }</span>`
          )
          .join("")}
      </div>`;
  }

  return `
    <section class="section" id="skills">
      <div class="section__header">
        <p class="section__eyebrow">[02 / TOOLING &amp; CAPABILITIES]</p>
        <h2>${title}</h2>
        ${subtitle ? `<p class="section__sub">${subtitle}</p>` : ""}
      </div>
      ${bodyHtml}
    </section>`;
}

function renderContact(content: Record<string, unknown>): string {
  const title = escapeHtml(String(content.title ?? "Let's Build Something Exceptional"));
  const message = escapeHtml(String(content.message ?? ""));
  const status = content.status ? escapeHtml(String(content.status)) : "";
  const email = content.email ? escapeHtml(String(content.email)) : "";
  const github = content.github ? escapeHtml(String(content.github)) : "";
  const linkedin = content.linkedin ? escapeHtml(String(content.linkedin)) : "";
  const website = content.website ? escapeHtml(String(content.website)) : "";

  const links = [
    email ? `<a href="mailto:${email}" class="contact__link contact__link--primary">Email: ${email} &nearr;</a>` : "",
    github ? `<a href="${github}" class="contact__link" target="_blank" rel="noopener noreferrer">GitHub</a>` : "",
    linkedin ? `<a href="${linkedin}" class="contact__link" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : "",
    website ? `<a href="${website}" class="contact__link" target="_blank" rel="noopener noreferrer">Website</a>` : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <section class="section section--contact" id="contact">
      <div class="contact-card">
        <p class="section__eyebrow">[03 / DIRECT REACH]</p>
        <h2>${title}</h2>
        <p class="contact__message">${message}</p>
        ${status ? `<p class="contact__status">${status}</p>` : ""}
        <div class="contact__links">${links}</div>
      </div>
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
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--body);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3 { font-family: var(--heading); line-height: 1.15; }
    a { color: inherit; text-decoration: none; }
    .page { min-height: 100dvh; display: flex; flex-direction: column; }
    
    /* Header */
    .header {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid color-mix(in srgb, var(--accent) 15%, transparent);
      background: color-mix(in srgb, var(--bg) 92%, transparent);
      padding: 1rem 1.5rem;
    }
    .header__inner {
      max-width: 72rem;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: ui-monospace, monospace;
      font-size: 0.8125rem;
    }
    .header__nav { display: flex; gap: 1.5rem; align-items: center; }
    .header__nav a:hover { color: var(--accent); }
    .header__cta {
      border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
    }

    /* Hero */
    .hero {
      padding: 6rem 1.5rem 4rem;
      max-width: 72rem;
      margin: 0 auto;
      width: 100%;
    }
    .hero--centered { text-align: center; }
    .hero__status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-family: ui-monospace, monospace;
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: color-mix(in srgb, var(--primary) 80%, transparent);
      border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
      margin-bottom: 1.5rem;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 8px var(--accent);
    }
    .hero__badge {
      font-family: ui-monospace, monospace;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 1rem;
    }
    .hero__terminal {
      font-family: ui-monospace, monospace;
      font-size: 0.8125rem;
      opacity: 0.6;
      margin-bottom: 1rem;
    }
    .hero h1 {
      font-size: clamp(2.5rem, 7vw, 5rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      max-width: 50rem;
    }
    .hero--centered h1 { margin: 0 auto; }
    .hero__sub {
      margin-top: 1.5rem;
      font-size: clamp(1.0625rem, 2.5vw, 1.25rem);
      opacity: 0.85;
      max-width: 44rem;
      line-height: 1.6;
    }
    .hero--centered .hero__sub { margin-left: auto; margin-right: auto; }
    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 2.5rem;
    }
    .hero--centered .hero__actions { justify-content: center; }
    .hero__cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 1.75rem;
      background: var(--accent);
      color: var(--bg);
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    .hero__cta:hover { opacity: 0.9; }
    .hero__secondary {
      display: inline-flex;
      align-items: center;
      padding: 0.85rem 1.5rem;
      border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .hero__metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 2rem;
      margin-top: 4rem;
      padding-top: 2.5rem;
      border-top: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
      max-width: 40rem;
    }
    .metric__value {
      display: block;
      font-family: ui-monospace, monospace;
      font-size: 2rem;
      font-weight: 700;
      color: var(--accent);
    }
    .metric__label {
      font-family: ui-monospace, monospace;
      font-size: 0.6875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.6;
    }

    /* Sections */
    .section {
      padding: 5rem 1.5rem;
      max-width: 72rem;
      margin: 0 auto;
      width: 100%;
    }
    .section__header { margin-bottom: 3.5rem; max-width: 44rem; }
    .section__eyebrow {
      font-family: ui-monospace, monospace;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      opacity: 0.6;
      margin-bottom: 0.75rem;
    }
    .section h2 {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .section__sub { margin-top: 0.75rem; opacity: 0.75; font-size: 1.0625rem; }

    /* Projects */
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
      border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
      background: color-mix(in srgb, var(--primary) 20%, transparent);
      border-radius: 12px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s, border-color 0.2s;
    }
    .project:hover { transform: translateY(-3px); border-color: var(--accent); }
    .project__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .badge {
      font-family: ui-monospace, monospace;
      font-size: 0.6875rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge--featured {
      background: color-mix(in srgb, var(--accent) 25%, transparent);
      color: var(--accent);
      font-weight: 600;
    }
    .badge--category { opacity: 0.6; }
    .badge--metric {
      background: color-mix(in srgb, var(--accent) 15%, transparent);
      color: var(--accent);
      border-radius: 9999px;
    }
    .project h3 { font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem; }
    .project h3 a:hover { text-decoration: underline; }
    .project__tagline {
      font-family: ui-monospace, monospace;
      font-size: 0.75rem;
      opacity: 0.65;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }
    .project__desc { font-size: 0.9375rem; opacity: 0.8; line-height: 1.6; margin-bottom: 1.5rem; }
    .tags, .skills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .tag {
      font-family: ui-monospace, monospace;
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      background: color-mix(in srgb, var(--accent) 12%, transparent);
      color: var(--accent);
      border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
    }

    /* Skills */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .skill-category {
      border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
      background: color-mix(in srgb, var(--primary) 20%, transparent);
      border-radius: 12px;
      padding: 1.75rem;
    }
    .skill-category h3 {
      font-family: ui-monospace, monospace;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      margin-bottom: 1.25rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid color-mix(in srgb, var(--accent) 15%, transparent);
    }
    .skill {
      font-family: ui-monospace, monospace;
      border-radius: 6px;
      padding: 0.45rem 0.85rem;
      border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
      background: color-mix(in srgb, var(--accent) 10%, transparent);
      color: var(--text);
      font-size: 0.8125rem;
      font-weight: 500;
    }

    /* Contact */
    .contact-card {
      border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
      background: color-mix(in srgb, var(--primary) 25%, transparent);
      border-radius: 16px;
      padding: 4rem 2rem;
      text-align: center;
      max-width: 50rem;
      margin: 0 auto;
    }
    .contact__message { margin-top: 1rem; font-size: 1.125rem; opacity: 0.85; max-width: 32rem; margin-left: auto; margin-right: auto; }
    .contact__status {
      font-family: ui-monospace, monospace;
      font-size: 0.75rem;
      opacity: 0.6;
      margin-top: 0.75rem;
    }
    .contact__links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-top: 2.5rem;
    }
    .contact__link {
      border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-family: ui-monospace, monospace;
      font-size: 0.8125rem;
      transition: background 0.2s;
    }
    .contact__link--primary {
      background: var(--accent);
      color: var(--bg);
      font-weight: 600;
      border-color: var(--accent);
    }
    .contact__link:hover { opacity: 0.9; }

    /* Footer */
    .footer {
      border-top: 1px solid color-mix(in srgb, var(--accent) 15%, transparent);
      padding: 2.5rem 1.5rem;
      text-align: center;
      font-family: ui-monospace, monospace;
      font-size: 0.75rem;
      opacity: 0.5;
      margin-top: auto;
    }
  `;
}

export function exportPortfolioHtml(portfolio: GeneratedPortfolio): string {
  const { design, sections, data } = portfolio;
  const pageTitle = escapeHtml(data.name || "Portfolio");
  const displayTitle = escapeHtml(data.title || "");
  const sectionsHtml = sections
    .map((section) => renderSection(section, design))
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle}${displayTitle ? ` - ${displayTitle}` : ""}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${googleFontsLink(design)}" rel="stylesheet" />
  <style>${portfolioStyles(design)}</style>
</head>
<body>
  <div class="page">
    <header class="header">
      <div class="header__inner">
        <div><strong>${pageTitle}</strong>${displayTitle ? ` <span style="opacity:0.5;">/ ${displayTitle}</span>` : ""}</div>
        <nav class="header__nav">
          <a href="#projects">Projects</a>
          <a href="#skills">Stack</a>
          <a href="#contact" class="header__cta">Connect</a>
        </nav>
      </div>
    </header>
    <main>
      ${sectionsHtml}
    </main>
    <footer class="footer">&copy; ${new Date().getFullYear()} ${pageTitle}. Built with PortAi.</footer>
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
