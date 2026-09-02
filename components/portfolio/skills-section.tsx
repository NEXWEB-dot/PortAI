import type { DesignTokens } from "@/lib/types/portfolio";
import { headingStyle } from "@/lib/portfolio/utils";

type SkillsContent = {
  title: string;
  items: string[];
};

export function SkillsSection({
  content,
  design,
}: {
  content: SkillsContent;
  design: DesignTokens;
}) {
  const isTerminal = design.layoutVariant === "terminal";

  return (
    <section className="px-6 py-20 md:px-12" style={{ color: "var(--portfolio-text)" }}>
      <div className="mx-auto max-w-5xl">
        <h2
          className="mb-8 text-2xl font-bold md:text-3xl"
          style={headingStyle(design)}
        >
          {content.title}
        </h2>
        <div className="flex flex-wrap gap-3">
          {content.items.map((skill) => (
            <span
              key={skill}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                isTerminal ? "font-mono" : ""
              }`}
              style={{
                border: `1px solid var(--portfolio-accent)44`,
                backgroundColor: "var(--portfolio-primary)11",
              }}
            >
              {isTerminal ? `> ${skill}` : skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
