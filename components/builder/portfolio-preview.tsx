"use client";

import { motion } from "framer-motion";
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
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10"
        >
          <Eye className="h-5 w-5 text-gold" />
        </motion.div>
        <p className="text-sm text-muted-foreground">
          Your portfolio preview will appear here after generation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="glass-panel flex items-center justify-between border-b px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <Eye className="h-3.5 w-3.5 text-gold" />
          Live Preview
        </span>
        <motion.a
          whileHover={{ scale: 1.02 }}
          href={withBasePath(`/portfolio?id=${portfolio.id}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-gold/15 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-gold/30 hover:text-gold"
        >
          Open full page
          <ExternalLink className="h-3 w-3" />
        </motion.a>
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
