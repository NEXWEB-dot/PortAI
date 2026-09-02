import type { DesignTokens } from "@/lib/types/portfolio";
import { headingStyle } from "@/lib/portfolio/utils";
import { ArrowUpRight, Terminal, Sparkles, CheckCircle2 } from "lucide-react";

type MetricItem = {
  label: string;
  value: string;
};

type HeroContent = {
  badge?: string;
  statusDot?: string;
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  metrics?: MetricItem[];
  terminalCommand?: string;
};

export function HeroSection({
  content,
  design,
}: {
  content: HeroContent;
  design: DesignTokens;
}) {
  const isCentered = design.heroStyle === "centered";
  const isMinimal = design.heroStyle === "minimal";
  const isTerminal = design.layoutVariant === "terminal";

  return (
    <section
      className={`relative px-6 py-20 md:px-12 md:py-28 lg:py-32 ${
        isCentered ? "text-center" : ""
      }`}
      style={{ color: "var(--portfolio-text)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Availability / Status indicator */}
        {content.statusDot && (
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono tracking-wide ${
              isCentered ? "mx-auto" : ""
            }`}
            style={{
              backgroundColor: "var(--portfolio-primary)",
              border: "1px solid var(--portfolio-accent)33",
            }}
          >
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--portfolio-accent)" }}
            />
            <span className="opacity-90">{content.statusDot}</span>
          </div>
        )}

        <div
          className={
            isCentered || isMinimal
              ? "max-w-4xl mx-auto"
              : "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
          }
        >
          {/* Main Hero Column */}
          <div className={isCentered || isMinimal ? "" : "lg:col-span-7"}>
            {/* Monospace Badge or Terminal prompt */}
            {content.badge && (
              <p
                className="mb-4 text-xs font-mono tracking-widest uppercase opacity-70"
                style={{ color: "var(--portfolio-accent)" }}
              >
                {isTerminal ? `> ${content.badge}` : content.badge}
              </p>
            )}

            {isTerminal && !content.badge && (
              <div className="mb-4 flex items-center gap-2 font-mono text-xs opacity-60">
                <Terminal className="h-3.5 w-3.5" />
                <span>{content.terminalCommand || "$ whoami --status=active"}</span>
              </div>
            )}

            <h1
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08]"
              style={headingStyle(design)}
            >
              {content.headline}
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed opacity-85">
              {content.subheadline}
            </p>

            {/* CTAs */}
            <div
              className={`mt-8 flex flex-wrap items-center gap-4 ${
                isCentered ? "justify-center" : ""
              }`}
            >
              {content.ctaText && (
                <a
                  href={content.ctaLink || "#projects"}
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    backgroundColor: "var(--portfolio-accent)",
                    color: design.backgroundColor,
                  }}
                >
                  {content.ctaText}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}

              {content.secondaryCtaText && (
                <a
                  href={content.secondaryCtaLink || "#contact"}
                  className="inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition-all hover:bg-white/5 active:scale-[0.98]"
                  style={{
                    borderColor: "var(--portfolio-accent)44",
                    color: "var(--portfolio-text)",
                  }}
                >
                  {content.secondaryCtaText}
                </a>
              )}
            </div>

            {/* Quantifiable Metrics Bar */}
            {content.metrics && content.metrics.length > 0 && (
              <div
                className={`mt-12 pt-8 border-t grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-xl ${
                  isCentered ? "mx-auto text-left" : ""
                }`}
                style={{ borderColor: "var(--portfolio-accent)22" }}
              >
                {content.metrics.map((m, i) => (
                  <div key={i}>
                    <p
                      className="text-2xl sm:text-3xl font-bold font-mono tracking-tight"
                      style={{ color: "var(--portfolio-accent)" }}
                    >
                      {m.value}
                    </p>
                    <p className="mt-1 text-xs font-mono uppercase tracking-wider opacity-60">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column (Architecture / Inspector Card) */}
          {!isCentered && !isMinimal && (
            <div className="lg:col-span-5">
              <div
                className="relative rounded-2xl border p-6 shadow-2xl backdrop-blur-md overflow-hidden"
                style={{
                  borderColor: "var(--portfolio-accent)33",
                  backgroundColor: "var(--portfolio-primary)",
                }}
              >
                {/* Faux-OS window header */}
                <div
                  className="flex items-center justify-between pb-4 mb-4 border-b"
                  style={{ borderColor: "var(--portfolio-accent)22" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-widest opacity-50">
                    system_runtime.ts
                  </span>
                </div>

                {/* Inspector Content */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400">const</span>
                    <span className="opacity-90">architect</span>
                    <span className="opacity-50">=</span>
                    <span className="opacity-80">{"{"}</span>
                  </div>

                  <div className="pl-4 space-y-1.5 opacity-80">
                    <div>
                      <span className="opacity-60">status:</span>{" "}
                      <span style={{ color: "var(--portfolio-accent)" }}>
                        &quot;ACTIVE_READY&quot;
                      </span>
                      ,
                    </div>
                    <div>
                      <span className="opacity-60">architecture:</span>{" "}
                      <span>[&quot;Distributed&quot;, &quot;High-Velocity UI&quot;]</span>,
                    </div>
                    <div>
                      <span className="opacity-60">craft:</span>{" "}
                      <span>&quot;Anti-slop, high-agency engineering&quot;</span>,
                    </div>
                    <div>
                      <span className="opacity-60">verified:</span>{" "}
                      <span className="text-emerald-400">true</span>
                    </div>
                  </div>

                  <div className="opacity-80">{"};"}</div>

                  {/* Visual proof banner */}
                  <div
                    className="mt-4 pt-3 border-t flex items-center justify-between text-[11px]"
                    style={{ borderColor: "var(--portfolio-accent)22" }}
                  >
                    <span className="inline-flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Production-Grade Specs
                    </span>
                    <span className="opacity-50 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      PortAi Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
