"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatLayout } from "@/components/builder/chat-layout";
import { ChatInput } from "@/components/builder/chat-input";
import { EmptyState } from "@/components/builder/empty-state";
import { MessageList } from "@/components/builder/message-list";
import { ResumeDropzone } from "@/components/builder/resume-dropzone";
import { ProfileEditor } from "@/components/builder/profile-editor";
import { PortfolioPreview } from "@/components/builder/portfolio-preview";
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
import { getApiKey } from "@/lib/config";
import { downloadPortfolioHtml } from "@/lib/portfolio/export-html";
import { extractPdfText } from "@/lib/pdf/extract-text";
import { Download, Pencil, X } from "lucide-react";

export function BuilderPage() {
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
  const abortRef = useRef<AbortController | null>(null);

  const activePortfolio =
    generatedPortfolios.find((p) => p.id === activePortfolioId) ?? null;

  const lastOpenedPortfolioId = useRef<string | null>(null);

  useEffect(() => {
    if (activePortfolioId && activePortfolioId !== lastOpenedPortfolioId.current) {
      setShowPreview(true);
      lastOpenedPortfolioId.current = activePortfolioId;
    }
  }, [activePortfolioId, setShowPreview]);

  const handleResumeUpload = useCallback(
    async (file: File) => {
      setIsParsing(true);
      try {
        const apiKey = getApiKey();
        const resumeText = await extractPdfText(file);
        const data = await parseResumeText(apiKey, resumeText);
        setPortfolioData(data);
        addMessage({
          role: "user",
          content: `I uploaded my resume (${file.name}). Please review the extracted information.`,
        });
        addMessage({
          role: "assistant",
          content: `Extracted your profile:\n\n${data.name} - ${data.title}\n\n${data.skills.length} skills, ${data.projects.length} projects.\n\nEdit anything or say "generate my portfolio".`,
        });
        setShowPreview(false);
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Upload failed";
        addMessage({
          role: "assistant",
          content: `Could not parse resume: ${msg}. Try again or type your details.`,
        });
      } finally {
        setIsParsing(false);
      }
    },
    [addMessage, setIsParsing, setPortfolioData, setShowPreview]
  );

  const runGeneratePortfolio = useCallback(
    async (section?: string, userInstruction?: string) => {
      setIsStreaming(true);
      addMessage({
        role: "assistant",
        content: section
          ? `Regenerating ${section}...`
          : "Designing and building your portfolio landing page...",
      });

      try {
        const apiKey = getApiKey();
        const portfolio = await generatePortfolio(
          apiKey,
          portfolioData,
          activePortfolio ?? undefined,
          section as Parameters<typeof generatePortfolio>[3],
          userInstruction
        );
        saveGeneratedPortfolio(portfolio);
        setPortfolioData(portfolio.data);
        setShowPreview(true);
        updateLastAssistantMessage(
          section
            ? `${section.toUpperCase()} updated. Check the live preview.`
            : `Portfolio landing page ready (${portfolio.design.layoutVariant} layout, ${portfolio.design.palette} aesthetic).\n\nExplore it live in the preview on the right, ask me to refine any section, or download the clean standalone HTML.`
        );
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Generation failed";
        updateLastAssistantMessage(`Generation failed: ${msg}`);
      } finally {
        setIsStreaming(false);
      }
    },
    [
      activePortfolio,
      addMessage,
      portfolioData,
      saveGeneratedPortfolio,
      setIsStreaming,
      setPortfolioData,
      setShowPreview,
      updateLastAssistantMessage,
    ]
  );

  const handleSend = useCallback(
    async (content: string) => {
      const regenSection = detectRegenerateSection(content);
      if (regenSection && activePortfolio) {
        addMessage({ role: "user", content });
        await runGeneratePortfolio(regenSection, content);
        return;
      }
      if (shouldGeneratePortfolio(content)) {
        addMessage({ role: "user", content });
        await runGeneratePortfolio(undefined, content);
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
        ? `${BUILDER_SYSTEM_PROMPT}\n\nCurrent data:\n${JSON.stringify(portfolioData, null, 2)}`
        : BUILDER_SYSTEM_PROMPT;

      try {
        const apiKey = getApiKey();
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
        if (extracted) setPortfolioData(mergePortfolioData(portfolioData, extracted));
        const display = stripPortfolioDataBlock(fullContent);
        if (display !== fullContent) updateLastAssistantMessage(display);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          const msg = error instanceof Error ? error.message : "Chat failed";
          updateLastAssistantMessage(`Error: ${msg}`);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [
      activePortfolio,
      addMessage,
      messages,
      portfolioData,
      runGeneratePortfolio,
      setIsStreaming,
      setPortfolioData,
      updateLastAssistantMessage,
    ]
  );

  const handleExportHtml = useCallback(() => {
    if (!activePortfolio) return;
    downloadPortfolioHtml(activePortfolio);
  }, [activePortfolio]);

  const hasProfile = Boolean(portfolioData.name);

  return (
    <div className="flex min-h-[100dvh] flex-col lg:flex-row">
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col ${
          showPreview ? "lg:w-1/2" : "w-full"
        }`}
      >
        <ChatLayout
          hasPortfolio={Boolean(activePortfolio)}
          previewOpen={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
          headerExtra={
            <div className="ml-1 flex items-center gap-0.5 sm:ml-2 sm:gap-1">
              {hasProfile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => setShowEditor(!showEditor)}
                >
                  <Pencil className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
              {activePortfolio && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={handleExportHtml}
                >
                  <Download className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">HTML</span>
                </Button>
              )}
            </div>
          }
          input={
            <ChatInput
              onSend={handleSend}
              disabled={isStreaming || isParsing}
              placeholder={
                hasProfile
                  ? "Refine your portfolio or say generate my portfolio..."
                  : "Describe your role, skills, and projects..."
              }
            />
          }
        >
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-1 sm:px-0">
            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col">
                <EmptyState />
                <div className="px-3 pb-4 sm:px-4">
                  <ResumeDropzone
                    onFileSelect={handleResumeUpload}
                    isLoading={isParsing}
                  />
                </div>
              </div>
            ) : (
              <>
                {showEditor && (
                  <div className="px-3 pt-3 sm:px-4 sm:pt-4">
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

      {showPreview && activePortfolio && (
        <>
          <div className="fixed inset-0 z-30 flex flex-col bg-background lg:hidden">
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-medium">Portfolio preview</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowPreview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="min-h-0 flex-1">
              <PortfolioPreview portfolio={activePortfolio} mobile />
            </div>
          </div>
          <div className="hidden h-dvh min-h-0 w-full shrink-0 border-t border-border lg:flex lg:w-1/2 lg:flex-col lg:border-t-0 lg:border-l">
            <PortfolioPreview portfolio={activePortfolio} />
          </div>
        </>
      )}
    </div>
  );
}
