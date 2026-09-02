import { Github, Linkedin, Mail, Globe, ArrowUpRight, MessageSquare } from "lucide-react";
import type { DesignTokens } from "@/lib/types/portfolio";
import { headingStyle } from "@/lib/portfolio/utils";

type ContactContent = {
  title: string;
  message: string;
  status?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  website?: string;
};

export function ContactSection({
  content,
  design,
}: {
  content: ContactContent;
  design: DesignTokens;
}) {
  return (
    <section
      id="contact"
      className="px-6 py-24 md:px-12"
      style={{ color: "var(--portfolio-text)" }}
    >
      <div className="mx-auto max-w-4xl">
        <div
          className="rounded-2xl border p-8 md:p-12 text-center relative overflow-hidden"
          style={{
            borderColor: "var(--portfolio-accent)33",
            backgroundColor: "var(--portfolio-primary)",
          }}
        >
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-60 mb-4">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Initiate Contact</span>
          </div>

          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            style={headingStyle(design)}
          >
            {content.title || "Let's Build Something Exceptional"}
          </h2>

          <p className="mt-4 max-w-xl mx-auto text-base md:text-lg opacity-80 leading-relaxed">
            {content.message}
          </p>

          {content.status && (
            <p className="mt-3 text-xs font-mono opacity-60">
              {content.status}
            </p>
          )}

          {/* Primary Email CTA */}
          {content.email && (
            <div className="mt-8">
              <a
                href={`mailto:${content.email}`}
                className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold transition-all hover:opacity-90 active:scale-[0.98] shadow-lg"
                style={{
                  backgroundColor: "var(--portfolio-accent)",
                  color: design.backgroundColor,
                }}
              >
                <Mail className="h-4 w-4" />
                <span>{content.email}</span>
                <ArrowUpRight className="h-4 w-4 opacity-70" />
              </a>
            </div>
          )}

          {/* Secondary Links */}
          <div className="mt-8 pt-8 border-t flex flex-wrap justify-center gap-4" style={{ borderColor: "var(--portfolio-accent)18" }}>
            {content.github && (
              <a
                href={content.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-mono transition-all hover:bg-white/5"
                style={{ borderColor: "var(--portfolio-accent)26" }}
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}

            {content.linkedin && (
              <a
                href={content.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-mono transition-all hover:bg-white/5"
                style={{ borderColor: "var(--portfolio-accent)26" }}
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            )}

            {content.website && (
              <a
                href={content.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-mono transition-all hover:bg-white/5"
                style={{ borderColor: "var(--portfolio-accent)26" }}
              >
                <Globe className="h-3.5 w-3.5" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
