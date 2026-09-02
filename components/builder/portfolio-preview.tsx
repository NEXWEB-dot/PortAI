"use client";

import type { GeneratedPortfolio } from "@/lib/types/portfolio";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { ExternalLink } from "lucide-react";
import { withBasePath } from "@/lib/config";

export function PortfolioPreview({
  portfolio,
  mobile,
}: {
  portfolio: GeneratedPortfolio | null;
  mobile?: boolean;
}) {
  if (!portfolio) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-sm text-muted-foreground">
        <p>
          Your portfolio preview will appear here after generation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          Live preview
        </span>
        <a
          href={withBasePath(`/portfolio?id=${portfolio.id}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Open full page
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {mobile ? (
          <PortfolioPage portfolio={portfolio} />
        ) : (
          <div className="origin-top scale-[0.55] transform md:scale-[0.65] lg:scale-75">
            <PortfolioPage portfolio={portfolio} />
          </div>
        )}
      </div>
    </div>
  );
}
