import type { DesignTokens } from "@/lib/types/portfolio";
import { headingStyle } from "@/lib/portfolio/utils";

type HeroContent = {
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaLink?: string;
};

export function HeroSection({
  content,
  design,
}: {
  content: HeroContent;
  design: DesignTokens;
}) {
  const isCentered = design.heroStyle === "centered" || design.heroStyle === "minimal";
  const isTerminal = design.layoutVariant === "terminal";

  return (
    <section
      className={`px-6 py-24 md:px-12 md:py-32 ${
        isCentered ? "text-center" : ""
      }`}
      style={{ color: "var(--portfolio-text)" }}
    >
      <div className={`mx-auto max-w-5xl ${isCentered ? "" : "md:grid md:grid-cols-2 md:gap-12 md:items-center"}`}>
        <div>
          {isTerminal && (
            <p className="mb-4 font-mono text-sm opacity-60">
              $ whoami
            </p>
          )}
          <h1
            className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            style={headingStyle(design)}
          >
            {content.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg opacity-80 md:text-xl">
            {content.subheadline}
          </p>
          {content.ctaText && (
            <a
              href={content.ctaLink || "#contact"}
              className="mt-8 inline-block rounded-lg px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--portfolio-accent)",
                color: design.backgroundColor,
              }}
            >
              {content.ctaText}
            </a>
          )}
        </div>
        {!isCentered && design.heroStyle === "split" && (
          <div
            className="mt-12 hidden aspect-square rounded-2xl md:mt-0 md:block"
            style={{
              background: `linear-gradient(135deg, var(--portfolio-accent)33, var(--portfolio-primary)22)`,
              border: `1px solid var(--portfolio-accent)44`,
            }}
          />
        )}
      </div>
    </section>
  );
}
