import { Github, Linkedin, Mail } from "lucide-react";
import type { DesignTokens } from "@/lib/types/portfolio";
import { headingStyle } from "@/lib/portfolio/utils";

type ContactContent = {
  title: string;
  message: string;
  email?: string;
  github?: string;
  linkedin?: string;
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
      className="px-6 py-20 md:px-12"
      style={{ color: "var(--portfolio-text)" }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="text-2xl font-bold md:text-3xl"
          style={headingStyle(design)}
        >
          {content.title}
        </h2>
        <p className="mt-4 text-lg opacity-80">{content.message}</p>
        <div className="mt-8 flex justify-center gap-4">
          {content.email && (
            <a
              href={`mailto:${content.email}`}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors hover:opacity-80"
              style={{ borderColor: "var(--portfolio-accent)44" }}
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          )}
          {content.github && (
            <a
              href={content.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors hover:opacity-80"
              style={{ borderColor: "var(--portfolio-accent)44" }}
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
          {content.linkedin && (
            <a
              href={content.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors hover:opacity-80"
              style={{ borderColor: "var(--portfolio-accent)44" }}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
