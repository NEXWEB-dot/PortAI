"use client";

import { useMemo } from "react";
import type { GeneratedPortfolio } from "@/lib/types/portfolio";
import { exportPortfolioHtml, downloadPortfolioHtml } from "@/lib/portfolio/export-html";
import { withBasePath } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Eye } from "lucide-react";

export function PortfolioPreview({
  portfolio,
  mobile,
}: {
  portfolio: GeneratedPortfolio | null;
  mobile?: boolean;
}) {
  const html = useMemo(
    () => (portfolio ? exportPortfolioHtml(portfolio) : ""),
    [portfolio]
  );

  if (!portfolio) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <Eye className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
        <p className="text-sm text-muted-foreground">
          Preview appears here after you say &quot;generate my portfolio&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2 sm:px-4">
        <div className="min-w-0">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Preview
          </span>
          <p className="truncate text-sm font-medium">
            {portfolio.data.name || "Portfolio"} · {portfolio.design.layoutVariant}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 text-xs"
            onClick={() => downloadPortfolioHtml(portfolio)}
          >
            <Download className="h-3 w-3" />
            <span className={mobile ? "sr-only" : ""}>HTML</span>
          </Button>
          <a
            href={withBasePath(`/portfolio?id=${portfolio.id}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Open
            <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
          </a>
        </div>
      </div>
      <div className="relative min-h-0 flex-1 bg-muted/20">
        <iframe
          title={`Preview: ${portfolio.data.name || "Portfolio"}`}
          srcDoc={html}
          className="absolute inset-0 h-full w-full border-0 bg-white"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
