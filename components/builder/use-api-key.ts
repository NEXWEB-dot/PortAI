"use client";

import { useEffect } from "react";
import { defaultApiKey } from "@/lib/config";
import { useApiKeyStore } from "@/lib/store/api-key-store";

/** Loads API key from .env.local into the store on first visit. */
export function ApiKeyBootstrap() {
  const { apiKey, setApiKey } = useApiKeyStore();

  useEffect(() => {
    if (!apiKey && defaultApiKey) {
      setApiKey(defaultApiKey);
    }
  }, [apiKey, setApiKey]);

  return null;
}

export function useEffectiveApiKey(): string {
  const stored = useApiKeyStore((s) => s.apiKey);
  return stored || defaultApiKey;
}
