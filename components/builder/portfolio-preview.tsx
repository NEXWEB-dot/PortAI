"use client";

import type { GeneratedPortfolio } from "@/lib/types/portfolio";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { ExternalLink, Eye } from "lucide-react";
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
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <Eye className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
        <p className="text-sm text-muted-foreground">
          Preview appears here after generation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2 sm:px-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Preview
        </span>
        <a
          href={withBasePath(`/portfolio?id=${portfolio.id}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          Open
          <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
        </a>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {mobile ? (
          <PortfolioPage portfolio={portfolio} />
        ) : (
          <div className="origin-top scale-[0.45] transform sm:scale-[0.55] lg:scale-[0.65]">
            <PortfolioPage portfolio={portfolio} />
          </div>
        )}
      </div>
    </div>
  );
}
