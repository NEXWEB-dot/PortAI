import type { DesignTokens } from "@/lib/types/portfolio";
import { headingStyle } from "@/lib/portfolio/utils";
import { Cpu, Terminal } from "lucide-react";

type SkillCategory = {
  name: string;
  skills: string[];
};

type SkillsContent = {
  title: string;
  subtitle?: string;
  categories?: SkillCategory[];
  items?: string[];
};

export function SkillsSection({
  content,
  design,
}: {
  content: SkillsContent;
  design: DesignTokens;
}) {
  const isTerminal = design.layoutVariant === "terminal";
  const hasCategories = content.categories && content.categories.length > 0;
  const items = content.items ?? [];

  return (
    <section
      id="skills"
      className="px-6 py-24 md:px-12"
      style={{ color: "var(--portfolio-text)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-60 mb-3">
            {isTerminal ? <Terminal className="h-3.5 w-3.5" /> : <Cpu className="h-3.5 w-3.5" />}
            <span>Stack &amp; Capabilities</span>
          </div>

          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            style={headingStyle(design)}
          >
            {content.title || "Technical Capabilities"}
          </h2>

          {content.subtitle && (
            <p className="mt-4 text-base md:text-lg opacity-75 leading-relaxed">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Categorized Layout */}
        {hasCategories ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.categories!.map((cat, i) => (
              <div
                key={i}
                className="rounded-xl border p-6 flex flex-col justify-between"
                style={{
                  borderColor: "var(--portfolio-accent)22",
                  backgroundColor: "var(--portfolio-primary)",
                }}
              >
                <div>
                  <h3
                    className="font-mono text-xs font-semibold uppercase tracking-wider mb-4 pb-2 border-b flex items-center justify-between"
                    style={{
                      borderColor: "var(--portfolio-accent)18",
                      color: "var(--portfolio-accent)",
                    }}
                  >
                    <span>{cat.name}</span>
                    <span className="opacity-50">[{cat.skills.length}]</span>
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border px-3 py-1.5 text-xs font-mono font-medium transition-colors hover:border-accent"
                        style={{
                          borderColor: "var(--portfolio-accent)26",
                          backgroundColor: "var(--portfolio-accent)11",
                        }}
                      >
                        {isTerminal ? `> ${skill}` : skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Flat items layout */
          <div className="flex flex-wrap gap-3">
            {items.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border px-4 py-2.5 text-sm font-mono font-medium transition-all hover:-translate-y-0.5"
                style={{
                  borderColor: "var(--portfolio-accent)33",
                  backgroundColor: "var(--portfolio-primary)",
                }}
              >
                {isTerminal ? `> ${skill}` : skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
