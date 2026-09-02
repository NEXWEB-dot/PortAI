export const DESIGN_GUIDELINES = `## SKILL.md
# Portfolio Design Skill

When generating portfolios, follow these principles to create distinctive, professional landing pages.

## Core Principles
1. One cohesive direction — Pick a single design language and commit to it
2. Role-aware — Match visual style to the user's profession
3. Content-first — Typography and layout serve the work
4. Restraint — Less is more; avoid visual noise

---

## typography.md
# Typography Guidelines

Font pairings: Developer (Space Grotesk + DM Sans), Designer (Playfair + DM Sans), Creative (Syne + Work Sans), Minimal (Geist), Editorial (Playfair + Source Serif).

Type scale: Hero 3-5rem, section titles 1.5-2rem, body 1rem. Max 2 font families.

---

## color-palettes.md
# Color Palettes by Role

Developer: bg #0a0a0f, accent #22c55e or #06b6d4
Designer: warm neutrals, accent #e11d48 or #f59e0b
Creative: dark bg, accent #ff6b35 or #7c3aed sparingly
Minimal: monochrome + one accent
Editorial: cream bg #fffef9, accent #92400e

---

## layout-patterns.md
# Layout Patterns

Hero: split, centered, or minimal. Grids: bento (asymmetric), classic (2-col), editorial (full-width rows), terminal (monospace labels).

---

## anti-patterns.md
# Anti-Patterns — NEVER Use

- Purple-to-blue gradients on white
- "Passionate developer" / generic AI copy
- Inter-only with no character
- Identical card grids with no hierarchy
- Excessive glassmorphism and parallax`;

export function loadDesignSkillFiles(): string {
  return DESIGN_GUIDELINES;
}
