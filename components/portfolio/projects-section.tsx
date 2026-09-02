import type { DesignTokens } from "@/lib/types/portfolio";
import { headingStyle } from "@/lib/portfolio/utils";
import { ArrowUpRight, Terminal, Layers, Star } from "lucide-react";

type ProjectItem = {
  title: string;
  tagline?: string;
  description: string;
  tech: string[];
  metrics?: string;
  category?: string;
  featured?: boolean;
  url?: string;
};

type ProjectsContent = {
  title: string;
  subtitle?: string;
  items: ProjectItem[];
};

export function ProjectsSection({
  content,
  design,
}: {
  content: ProjectsContent;
  design: DesignTokens;
}) {
  const isBento = design.layoutVariant === "bento";
  const isTerminal = design.layoutVariant === "terminal";
  const isEditorial = design.layoutVariant === "editorial";

  return (
    <section
      id="projects"
      className="px-6 py-24 md:px-12"
      style={{ color: "var(--portfolio-text)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-14 max-w-2xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-60 mb-3">
            {isTerminal ? <Terminal className="h-3.5 w-3.5" /> : <Layers className="h-3.5 w-3.5" />}
            <span>Selected Architecture &amp; Projects</span>
          </div>

          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            style={headingStyle(design)}
          >
            {content.title || "Featured Engineering"}
          </h2>

          {content.subtitle && (
            <p className="mt-4 text-base md:text-lg opacity-75 leading-relaxed">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Project Grid */}
        <div
          className={
            isEditorial
              ? "flex flex-col divide-y border-y"
              : isBento
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              : "grid grid-cols-1 md:grid-cols-2 gap-6"
          }
          style={isEditorial ? { borderColor: "var(--portfolio-accent)22" } : {}}
        >
          {content.items.map((project, i) => {
            const isFeatured = project.featured ?? (isBento && i === 0);

            if (isEditorial) {
              return (
                <article
                  key={i}
                  className="group py-8 transition-colors hover:bg-white/[0.02] flex flex-col md:flex-row md:items-start md:justify-between gap-6"
                >
                  <div className="md:max-w-xl space-y-2">
                    <div className="flex items-center gap-3">
                      {project.category && (
                        <span className="font-mono text-xs uppercase tracking-wider opacity-60">
                          {project.category}
                        </span>
                      )}
                      {project.metrics && (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium"
                          style={{
                            backgroundColor: "var(--portfolio-accent)18",
                            color: "var(--portfolio-accent)",
                          }}
                        >
                          {project.metrics}
                        </span>
                      )}
                    </div>
                    <h3
                      className="text-xl md:text-2xl font-semibold group-hover:underline"
                      style={headingStyle(design)}
                    >
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5"
                        >
                          {project.title}
                          <ArrowUpRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      ) : (
                        project.title
                      )}
                    </h3>
                    <p className="text-sm md:text-base opacity-80 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:max-w-xs md:justify-end">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border px-2.5 py-1 text-xs font-mono opacity-70"
                        style={{ borderColor: "var(--portfolio-accent)22" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              );
            }

            return (
              <article
                key={i}
                className={`group relative rounded-xl border p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
                  isBento && isFeatured ? "md:col-span-2 md:row-span-1" : ""
                }`}
                style={{
                  borderColor: "var(--portfolio-accent)26",
                  backgroundColor: "var(--portfolio-primary)",
                }}
              >
                <div>
                  {/* Card Header Meta */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      {isFeatured && (
                        <span
                          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: "var(--portfolio-accent)22",
                            color: "var(--portfolio-accent)",
                          }}
                        >
                          <Star className="h-3 w-3 fill-current" />
                          Featured System
                        </span>
                      )}
                      {project.category && (
                        <span className="font-mono text-xs uppercase tracking-wider opacity-60">
                          {project.category}
                        </span>
                      )}
                    </div>

                    {project.metrics && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-mono font-medium"
                        style={{
                          backgroundColor: "var(--portfolio-accent)18",
                          color: "var(--portfolio-accent)",
                        }}
                      >
                        {project.metrics}
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3
                    className={`${
                      isFeatured ? "text-2xl md:text-3xl" : "text-xl"
                    } font-bold tracking-tight mb-2`}
                    style={headingStyle(design)}
                  >
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:underline"
                        style={{ color: "var(--portfolio-text)" }}
                      >
                        {isTerminal && <span className="text-xs font-mono opacity-50">&gt;</span>}
                        {project.title}
                        <ArrowUpRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </a>
                    ) : (
                      <span>
                        {isTerminal && <span className="text-xs font-mono opacity-50">&gt; </span>}
                        {project.title}
                      </span>
                    )}
                  </h3>

                  {project.tagline && (
                    <p className="text-xs font-mono opacity-70 mb-3 uppercase tracking-wide">
                      {project.tagline}
                    </p>
                  )}

                  <p className="text-sm md:text-base opacity-80 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Pills Footer */}
                <div className="mt-6 pt-4 border-t flex flex-wrap gap-2" style={{ borderColor: "var(--portfolio-accent)18" }}>
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-colors"
                      style={{
                        backgroundColor: "var(--portfolio-accent)14",
                        color: "var(--portfolio-accent)",
                        border: "1px solid var(--portfolio-accent)26",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
