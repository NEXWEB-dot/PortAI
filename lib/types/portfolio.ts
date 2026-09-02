export type Project = {
  title: string;
  description: string;
  tech: string[];
  url?: string;
};

export type Contact = {
  email?: string;
  github?: string;
  linkedin?: string;
  website?: string;
};

export type PortfolioData = {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Project[];
  contact: Contact;
};

export type DesignTokens = {
  palette: "developer" | "designer" | "creative" | "minimal" | "editorial";
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontHeading: string;
  fontBody: string;
  layoutVariant: "bento" | "editorial" | "terminal" | "classic";
  heroStyle: "split" | "centered" | "minimal";
};

export type PortfolioSection = {
  id: string;
  type: "hero" | "projects" | "skills" | "contact";
  content: Record<string, unknown>;
};

export type GeneratedPortfolio = {
  id: string;
  data: PortfolioData;
  design: DesignTokens;
  sections: PortfolioSection[];
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export const emptyPortfolioData = (): PortfolioData => ({
  name: "",
  title: "",
  bio: "",
  skills: [],
  projects: [],
  contact: {},
});
