"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { getApiKey, withBasePath } from "@/lib/config";
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
          content: `I've extracted your profile from the resume:\n\n${data.name} — ${data.title}\n\n${data.skills.length} skills and ${data.projects.length} projects found.\n\nWould you like to edit anything, or should I generate your portfolio?`,
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
    [addMessage, setIsParsing, setPortfolioData, setShowPreview]
  );

  const runGeneratePortfolio = useCallback(
    async (section?: string) => {
      setIsStreaming(true);
      addMessage({
        role: "assistant",
        content: section
          ? `Regenerating the ${section} section...`
          : "Crafting your portfolio... This may take a moment.",
      });

      try {
        const apiKey = getApiKey();
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
            : `Your portfolio is ready — a ${portfolio.design.palette} design with ${portfolio.design.layoutVariant} layout.\n\nView: ${portfolioUrl}`
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
      portfolioData,
      saveGeneratedPortfolio,
      setIsStreaming,
      setShowPreview,
      updateLastAssistantMessage,
    ]
  );

  const handleSend = useCallback(
    async (content: string) => {
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
      messages,
      portfolioData,
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
    <div className="flex h-dvh">
      <motion.div
        layout
        className={`flex min-h-0 flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showPreview ? "w-full lg:w-1/2" : "w-full"
        }`}
      >
        <ChatLayout
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
          headerExtra={
            <div className="ml-2 flex items-center gap-1">
              {hasProfile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs hover:bg-gold/10 hover:text-gold"
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
                  className="h-7 text-xs hover:bg-gold/10 hover:text-gold"
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
                hasProfile
                  ? "Refine your portfolio or say 'generate my portfolio'..."
                  : "Tell us about yourself, your skills, and your best work..."
              }
            />
          }
        >
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col">
                <EmptyState />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="px-4 pb-4"
                >
                  <ResumeDropzone
                    onFileSelect={handleResumeUpload}
                    isLoading={isParsing}
                  />
                </motion.div>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {showEditor && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden px-4 pt-4"
                    >
                      <ProfileEditor
                        data={portfolioData}
                        onChange={setPortfolioData}
                        onClose={() => setShowEditor(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <MessageList messages={messages} isStreaming={isStreaming} />
              </>
            )}
          </div>
        </ChatLayout>
      </motion.div>

      <AnimatePresence>
        {showPreview && (
          <>
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-40 bg-background lg:hidden"
            >
              <div className="glass-panel flex h-14 items-center justify-between px-4">
                <span className="text-sm font-medium">Live Preview</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowPreview(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-[calc(100dvh-3.5rem)] overflow-y-auto">
                <PortfolioPreview portfolio={activePortfolio} mobile />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="hidden min-h-0 w-1/2 border-l border-gold/10 lg:block"
            >
              <PortfolioPreview portfolio={activePortfolio} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
