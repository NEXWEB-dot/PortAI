import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-3.6-flash";

export function getGeminiClient(apiKey: string) {
  if (!apiKey) {
    throw new Error("AI service is temporarily unavailable.");
  }
  return new GoogleGenerativeAI(apiKey);
}

export function getGeminiModel(apiKey: string, systemInstruction?: string) {
  const genAI = getGeminiClient(apiKey);
  return genAI.getGenerativeModel({
    model: MODEL,
    ...(systemInstruction ? { systemInstruction } : {}),
  });
}

export async function* streamGeminiChat(
  apiKey: string,
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
) {
  const model = getGeminiModel(apiKey, systemPrompt);

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];
  const chat = model.startChat({ history });

  const result = await chat.sendMessageStream(lastMessage.content);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

export async function generateGeminiJSON(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const model = getGeminiModel(apiKey, systemPrompt);
  const result = await model.generateContent(userPrompt);
  return result.response.text();
}

export function parseJsonResponse(response: string): unknown {
  const cleaned = response.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}
