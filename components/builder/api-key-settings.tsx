"use client";

import { useEffect, useState } from "react";
import { Key, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiKeyStore } from "@/lib/store/api-key-store";
import { useEffectiveApiKey } from "@/components/builder/use-api-key";

type ApiKeySettingsProps = {
  open: boolean;
  onClose: () => void;
};

export function ApiKeySettings({ open, onClose }: ApiKeySettingsProps) {
  const { apiKey, setApiKey } = useApiKeyStore();
  const [value, setValue] = useState(apiKey);

  useEffect(() => {
    if (open) setValue(apiKey);
  }, [open, apiKey]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <h2 className="font-semibold">Gemini API Key</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Your key stays in this browser only (localStorage). Get a free key at{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Google AI Studio
          </a>
          .
        </p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste your Gemini API key"
          className="mb-4 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setApiKey(value.trim());
              onClose();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ApiKeyButton({ onClick }: { onClick: () => void }) {
  const apiKey = useEffectiveApiKey();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 gap-1 text-xs"
      onClick={onClick}
    >
      <Key className="h-3 w-3" />
      {apiKey ? "API Key" : "Add API Key"}
    </Button>
  );
}
