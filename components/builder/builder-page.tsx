"use client";

import { useCallback, useRef, useState } from "react";
import { ChatLayout } from "@/components/builder/chat-layout";
import { ChatInput } from "@/components/builder/chat-input";
import { EmptyState } from "@/components/builder/empty-state";
import { MessageList } from "@/components/builder/message-list";
import { ResumeDropzone } from "@/components/builder/resume-dropzone";
import { ProfileEditor } from "@/components/builder/profile-editor";
import { PortfolioPreview } from "@/components/builder/portfolio-preview";
import {
  ApiKeyButton,
  ApiKeySettings,
} from "@/components/builder/api-key-settings";
import { ApiKeyBootstrap, useEffectiveApiKey } from "@/components/builder/use-api-key";
import { Button } from "@/components/ui/button";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import {
  detectRegenerateSection,
  extractPortfolioDataFromMessage,
  mergePortfolioData,
  shouldGeneratePortfolio,
  stripPortfolioDataBlock,
} from "@/lib/ai/parse-response";
import {
  generatePortfolio,
  parseResumeText,
  streamGeminiChat,
} from "@/lib/ai/portfolio-service";
import { BUILDER_SYSTEM_PROMPT } from "@/lib/ai/prompts/builder-system";
import { withBasePath } from "@/lib/config";
import { extractPdfText } from "@/lib/pdf/extract-text";
import { Download, Pencil } from "lucide-react";

export function BuilderPage() {
  const apiKey = useEffectiveApiKey();
  const {
    portfolioData,
    messages,
    isStreaming,
    isParsing,
    showPreview,
    activePortfolioId,
    generatedPortfolios,
    addMessage,
    updateLastAssistantMessage,
    setPortfolioData,
    setIsStreaming,
    setIsParsing,
    setShowPreview,
    saveGeneratedPortfolio,
  } = usePortfolioStore();

  const [showEditor, setShowEditor] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const activePortfolio =
    generatedPortfolios.find((p) => p.id === activePortfolioId) ?? null;

  const requireApiKey = useCallback(() => {
    if (!apiKey) {
      setShowApiKey(true);
      return false;
    }
    return true;
  }, [apiKey]);

  const handleResumeUpload = useCallback(
    async (file: File) => {
      if (!requireApiKey()) return;

      setIsParsing(true);

      try {
        const resumeText = await extractPdfText(file);
        const data = await parseResumeText(apiKey, resumeText);

        setPortfolioData(data);
        addMessage({
          role: "user",
          content: `I uploaded my resume (${file.name}). Please review the extracted information.`,
        });
        addMessage({
          role: "assistant",
          content: `I've extracted your profile from the resume:\n\n**${data.name}** — ${data.title}\n\n${data.skills.length} skills and ${data.projects.length} projects found.\n\nWould you like to edit anything, or should I generate your portfolio?`,
        });
        setShowPreview(false);
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Upload failed";
        addMessage({
          role: "assistant",
          content: `Sorry, I couldn't parse your resume: ${msg}. You can try again or type your details manually.`,
        });
      } finally {
        setIsParsing(false);
      }
    },
    [
      addMessage,
      apiKey,
      requireApiKey,
      setIsParsing,
      setPortfolioData,
      setShowPreview,
    ]
  );

  const runGeneratePortfolio = useCallback(
    async (section?: string) => {
      if (!requireApiKey()) return;

      setIsStreaming(true);
      addMessage({
        role: "assistant",
        content: section
          ? `Regenerating the ${section} section...`
          : "Generating your portfolio... This may take a moment.",
      });

      try {
        const portfolio = await generatePortfolio(
          apiKey,
          portfolioData,
          activePortfolio ?? undefined,
          section as Parameters<typeof generatePortfolio>[3]
        );

        saveGeneratedPortfolio(portfolio);
        setShowPreview(true);

        const portfolioUrl = withBasePath(`/portfolio?id=${portfolio.id}`);

        updateLastAssistantMessage(
          section
            ? `The ${section} section has been regenerated. Check the preview panel.`
            : `Your portfolio is ready! I've created a ${portfolio.design.palette} design with a ${portfolio.design.layoutVariant} layout.\n\nOpen: ${portfolioUrl}`
        );
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Generation failed";
        updateLastAssistantMessage(
          `Sorry, I couldn't generate your portfolio: ${msg}`
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [
      activePortfolio,
      addMessage,
      apiKey,
      portfolioData,
      requireApiKey,
      saveGeneratedPortfolio,
      setIsStreaming,
      setShowPreview,
      updateLastAssistantMessage,
    ]
  );

  const handleSend = useCallback(
    async (content: string) => {
      if (!requireApiKey()) return;

      const regenSection = detectRegenerateSection(content);
      if (regenSection && activePortfolio) {
        addMessage({ role: "user", content });
        await runGeneratePortfolio(regenSection);
        return;
      }

      if (shouldGeneratePortfolio(content)) {
        addMessage({ role: "user", content });
        await runGeneratePortfolio();
        return;
      }

      addMessage({ role: "user", content });
      addMessage({ role: "assistant", content: "" });
      setIsStreaming(true);

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const chatMessages = [
        ...messages,
        { role: "user" as const, content },
      ].map((m) => ({ role: m.role, content: m.content }));

      const systemPrompt = portfolioData.name
        ? `${BUILDER_SYSTEM_PROMPT}\n\nCurrent portfolio data:\n${JSON.stringify(portfolioData, null, 2)}`
        : BUILDER_SYSTEM_PROMPT;

      try {
        let fullContent = "";

        for await (const chunk of streamGeminiChat(
          apiKey,
          systemPrompt,
          chatMessages
        )) {
          if (abortRef.current?.signal.aborted) break;
          fullContent += chunk;
          updateLastAssistantMessage(fullContent);
        }

        const extracted = extractPortfolioDataFromMessage(fullContent);
        if (extracted) {
          setPortfolioData(mergePortfolioData(portfolioData, extracted));
        }

        const displayContent = stripPortfolioDataBlock(fullContent);
        if (displayContent !== fullContent) {
          updateLastAssistantMessage(displayContent);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          const msg = error instanceof Error ? error.message : "Chat failed";
          updateLastAssistantMessage(`Sorry, something went wrong: ${msg}`);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [
      activePortfolio,
      addMessage,
      apiKey,
      messages,
      portfolioData,
      requireApiKey,
      runGeneratePortfolio,
      setIsStreaming,
      setPortfolioData,
      updateLastAssistantMessage,
    ]
  );

  const handleExport = useCallback(() => {
    if (!activePortfolio) return;
    const blob = new Blob([JSON.stringify(activePortfolio, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-${activePortfolio.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activePortfolio]);

  const hasProfile = Boolean(portfolioData.name);

  return (
    <>
      <ApiKeyBootstrap />
      <ApiKeySettings open={showApiKey} onClose={() => setShowApiKey(false)} />

      <div className="flex h-dvh">
        <div
          className={`flex min-h-0 flex-col transition-all ${
            showPreview ? "w-full lg:w-1/2" : "w-full"
          }`}
        >
          <ChatLayout
            showPreview={showPreview}
            onTogglePreview={() => setShowPreview(!showPreview)}
            headerExtra={
              <div className="ml-2 flex items-center gap-1">
                <ApiKeyButton onClick={() => setShowApiKey(true)} />
                {hasProfile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setShowEditor(!showEditor)}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                )}
                {activePortfolio && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleExport}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Export
                  </Button>
                )}
              </div>
            }
            input={
              <ChatInput
                onSend={handleSend}
                disabled={isStreaming || isParsing}
                placeholder={
                  !apiKey
                    ? "Add your Gemini API key first (top right)..."
                    : hasProfile
                      ? "Ask me to refine your portfolio or type 'generate my portfolio'..."
                      : "Describe yourself or upload a resume..."
                }
              />
            }
          >
            <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
              {!apiKey && (
                <div className="mx-4 mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
                  Add your free Gemini API key to use AI features.{" "}
                  <button
                    className="font-medium underline"
                    onClick={() => setShowApiKey(true)}
                  >
                    Open settings
                  </button>
                </div>
              )}
              {messages.length === 0 ? (
                <div className="flex flex-1 flex-col">
                  <EmptyState />
                  <div className="px-4 pb-4">
                    <ResumeDropzone
                      onFileSelect={handleResumeUpload}
                      isLoading={isParsing}
                    />
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      or start typing below
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {showEditor && (
                    <div className="px-4 pt-4">
                      <ProfileEditor
                        data={portfolioData}
                        onChange={setPortfolioData}
                        onClose={() => setShowEditor(false)}
                      />
                    </div>
                  )}
                  <MessageList messages={messages} isStreaming={isStreaming} />
                </>
              )}
            </div>
          </ChatLayout>
        </div>

        {showPreview && (
          <>
            <div className="fixed inset-0 z-40 bg-background lg:hidden">
              <div className="flex h-14 items-center justify-between border-b px-4">
                <span className="text-sm font-medium">Preview</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </Button>
              </div>
              <div className="h-[calc(100dvh-3.5rem)] overflow-y-auto">
                <PortfolioPreview portfolio={activePortfolio} mobile />
              </div>
            </div>
            <div className="hidden min-h-0 w-1/2 border-l lg:block">
              <PortfolioPreview portfolio={activePortfolio} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
