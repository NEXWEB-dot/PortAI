import type { DesignTokens } from "@/lib/types/portfolio";
import { headingStyle } from "@/lib/portfolio/utils";

type ProjectItem = {
  title: string;
  description: string;
  tech: string[];
  url?: string;
};

type ProjectsContent = {
  title: string;
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

  return (
    <section className="px-6 py-20 md:px-12" style={{ color: "var(--portfolio-text)" }}>
      <div className="mx-auto max-w-5xl">
        <h2
          className="mb-12 text-2xl font-bold md:text-3xl"
          style={headingStyle(design)}
        >
          {content.title}
        </h2>
        <div
          className={
            isBento
              ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              : "grid gap-6 md:grid-cols-2"
          }
        >
          {content.items.map((project, i) => (
            <article
              key={i}
              className={`group rounded-xl border p-6 transition-transform hover:-translate-y-1 ${
                isBento && i === 0 ? "md:col-span-2 md:row-span-1" : ""
              }`}
              style={{
                borderColor: "var(--portfolio-accent)33",
                backgroundColor: "var(--portfolio-primary)11",
              }}
            >
              <h3
                className="text-lg font-semibold"
                style={headingStyle(design)}
              >
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "var(--portfolio-accent)" }}
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>
              <p className="mt-2 text-sm opacity-75">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: "var(--portfolio-accent)22",
                      color: "var(--portfolio-accent)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
