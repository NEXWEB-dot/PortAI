const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const DEFAULT_MODEL =
  process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "z-ai/glm-5.2:free";

// Resilient fallback models on OpenRouter (free tier) in case primary model hits rate limits or upstream spikes
export const FALLBACK_MODELS = [
  DEFAULT_MODEL,
  "google/gemma-4-26b-a4b-it:free",
  "minimax/minimax-m2.7:free",
].filter((m, i, arr) => arr.indexOf(m) === i);

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function getHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey.trim()}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://nexweb-dot.github.io/PortAI/",
    "X-Title": "PortAI",
  };
}

/**
 * Streams chat responses from OpenRouter with automatic model fallback if the primary model is busy/rate-limited.
 */
export async function* streamOpenRouterChat(
  apiKey: string,
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
): AsyncGenerator<string, void, unknown> {
  if (!apiKey) {
    throw new Error("AI service is temporarily unavailable. API key is missing.");
  }

  const formattedMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  let lastError: Error | null = null;

  for (const model of FALLBACK_MODELS) {
    let hasYieldedAnyContent = false;
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: getHeaders(apiKey),
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          stream: true,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        let errDetail = `Status ${response.status}`;
        try {
          const errJson = await response.json();
          errDetail = errJson.error?.message || errDetail;
        } catch {
          // ignore
        }
        throw new Error(`Model ${model} failed: ${errDetail}`);
      }

      if (!response.body) {
        throw new Error("No response body received from AI provider");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(":")) continue;

          if (trimmed === "data: [DONE]") {
            return;
          }

          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6).trim();
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error.message || "Streaming error");
              }
              const contentChunk = parsed.choices?.[0]?.delta?.content;
              if (contentChunk) {
                hasYieldedAnyContent = true;
                yield contentChunk;
              }
            } catch (err) {
              if (err instanceof Error && err.message.includes("Streaming error")) {
                throw err;
              }
              // Ignore partial JSON parse errors
            }
          }
        }
      }

      // Successfully streamed
      return;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[PortAi AI] ${model} failed, attempting next fallback...`, lastError.message);
      // If we already started yielding content, do not restart from another model mid-stream
      if (hasYieldedAnyContent) {
        throw lastError;
      }
      continue;
    }
  }

  throw lastError || new Error("All AI models are currently busy. Please try again in a few moments.");
}

/**
 * Generates non-streaming completion from OpenRouter with automatic fallback across models.
 */
export async function generateOpenRouterJSON(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("AI service is temporarily unavailable. API key is missing.");
  }

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `${systemPrompt}\n\nIMPORTANT: You must respond ONLY with a valid, raw JSON object. Do not include markdown headers, preambles like 'I have processed...', or conversational commentary. Start immediately with '{' and end with '}'.`,
    },
    { role: "user", content: userPrompt },
  ];

  let lastError: Error | null = null;

  for (const model of FALLBACK_MODELS) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: getHeaders(apiKey),
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.3,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const errorMsg = data.error?.message || `HTTP ${response.status}`;
        throw new Error(`[${model}] ${errorMsg}`);
      }

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error(`[${model}] Received empty response content`);
      }

      return content;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[PortAi AI] ${model} generation failed, trying fallback...`, lastError.message);
      continue;
    }
  }

  throw lastError || new Error("Failed to generate content from AI models. Please try again.");
}

/**
 * Robust JSON parser that handles:
 * - Conversational preambles ("I have processed your resume...")
 * - Markdown blocks (```json, ```portfolio-data, ```)
 * - Trailing commas before brackets/braces
 * - Conversational postambles
 * - Graceful fallback extraction
 */
export function parseJsonResponse(response: string): unknown {
  if (!response || typeof response !== "string") {
    throw new Error("Empty response received from AI model.");
  }

  // 1. Try extracting from markdown code blocks: ```json ... ```, ```portfolio-data ... ```, or ``` ... ```
  const codeBlockRegex = /```(?:json|portfolio-data)?\s*([\s\S]*?)```/gi;
  let match: RegExpExecArray | null;
  while ((match = codeBlockRegex.exec(response)) !== null) {
    const codeBlockContent = match[1].trim();
    const parsed = tryParseJsonString(codeBlockContent);
    if (parsed) return parsed;
  }

  // 2. Try extracting the outermost { ... } JSON object
  const firstBrace = response.indexOf("{");
  const lastBrace = response.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = response.slice(firstBrace, lastBrace + 1).trim();
    const parsed = tryParseJsonString(candidate);
    if (parsed) return parsed;
  }

  // 3. Try extracting the outermost [ ... ] JSON array
  const firstBracket = response.indexOf("[");
  const lastBracket = response.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const candidate = response.slice(firstBracket, lastBracket + 1).trim();
    const parsed = tryParseJsonString(candidate);
    if (parsed) return parsed;
  }

  // 4. Try parsing cleaned raw string directly
  const directClean = response
    .replace(/```(?:json|portfolio-data)?/gi, "")
    .replace(/```/g, "")
    .trim();
  const directParsed = tryParseJsonString(directClean);
  if (directParsed) return directParsed;

  // 5. Fallback extraction: if JSON.parse completely fails (e.g. truncated or badly formatted JSON),
  // extract core portfolio fields with regex so the user NEVER experiences an unhandled crash screen.
  const fallbackObject = extractFallbackPortfolioObject(response);
  if (fallbackObject) {
    return fallbackObject;
  }

  throw new Error("Could not parse response into valid JSON.");
}

function tryParseJsonString(str: string): unknown | null {
  try {
    return JSON.parse(str);
  } catch {
    // Clean trailing commas before closing braces/brackets (common LLM syntax error)
    try {
      const sanitized = str
        .replace(/,\s*([}\]])/g, "$1")
        // Remove trailing comma at the end of objects/arrays
        .replace(/,\s*$/m, "");
      return JSON.parse(sanitized);
    } catch {
      return null;
    }
  }
}

function extractFallbackPortfolioObject(text: string): Record<string, unknown> | null {
  const nameMatch = text.match(/"name"\s*:\s*"([^"]+)"/i) || text.match(/name\s*:\s*([^\n\r]+)/i);
  const titleMatch = text.match(/"title"\s*:\s*"([^"]+)"/i) || text.match(/title\s*:\s*([^\n\r]+)/i);
  const bioMatch = text.match(/"bio"\s*:\s*"([^"]+)"/i) || text.match(/bio\s*:\s*([^\n\r]+)/i);

  if (nameMatch || titleMatch) {
    return {
      name: nameMatch ? nameMatch[1].trim() : "Portfolio",
      title: titleMatch ? titleMatch[1].trim() : "Professional",
      bio: bioMatch ? bioMatch[1].trim() : "",
      skills: [],
      projects: [],
      contact: {},
    };
  }

  return null;
}
