/**
 * OpenRouter-backed AI client (re-exported with legacy gemini names for backward compatibility).
 */
export {
  streamOpenRouterChat as streamGeminiChat,
  generateOpenRouterJSON as generateGeminiJSON,
  parseJsonResponse,
  streamOpenRouterChat,
  generateOpenRouterJSON,
  DEFAULT_MODEL,
  FALLBACK_MODELS,
} from "@/lib/ai/openrouter";
