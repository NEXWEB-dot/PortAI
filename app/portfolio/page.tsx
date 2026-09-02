"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { withBasePath } from "@/lib/config";
import type { GeneratedPortfolio } from "@/lib/types/portfolio";

function PortfolioContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const getPortfolioById = usePortfolioStore((s) => s.getPortfolioById);
  const [portfolio, setPortfolio] = useState<GeneratedPortfolio | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const found = id ? getPortfolioById(id) : null;
    setPortfolio(found ?? null);
    setLoaded(true);
  }, [id, getPortfolioById]);

  if (!loaded) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Portfolio not found</h1>
        <p className="text-muted-foreground">
          Open a portfolio from the builder in this browser, or generate a new
          one.
        </p>
        <Link href={withBasePath("/")} className="text-sm underline">
          Go to builder
        </Link>
      </div>
    );
  }

  return <PortfolioPage portfolio={portfolio} />;
}

export default function PublicPortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <PortfolioContent />
    </Suspense>
  );
}
