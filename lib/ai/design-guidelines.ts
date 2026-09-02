import { BUNDLED_SKILL_CONTENT } from "@/lib/ai/bundled-skills";

const PORTFOLIO_CONTEXT = `
## PortAi Portfolio Generation Context

Reading this as: portfolio landing page for hiring managers and clients, with a minimalist editorial language, leaning toward asymmetric layouts and monochrome palettes with one restrained accent.

Design dials: DESIGN_VARIANCE 7, MOTION_INTENSITY 4, VISUAL_DENSITY 3.

Mandatory for generated portfolios:
- Monochrome-first palettes (black, white, greys) with at most ONE subtle accent
- No purple-blue AI gradients, no gold luxury clichés, no beige+brass premium-consumer defaults
- No em-dashes anywhere in copy
- No generic copy: "passionate developer", "elevate", "seamless", "unleash"
- Hero fits viewport: headline max 2 lines, subtext max 20 words
- Use real project names and specific descriptions from user data
- Pick ONE layout variant and commit: bento, editorial, terminal, or classic
- Typography: Geist or similar sans-serif; avoid Inter-only generic stacks
`;

export function loadDesignSkillFiles(): string {
  return `${PORTFOLIO_CONTEXT}\n\n## Full Design Skill Library\n\n${BUNDLED_SKILL_CONTENT}`;
}
