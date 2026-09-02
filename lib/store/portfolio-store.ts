import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  ChatMessage,
  GeneratedPortfolio,
  PortfolioData,
} from "@/lib/types/portfolio";
import { emptyPortfolioData } from "@/lib/types/portfolio";

type PortfolioStore = {
  portfolioData: PortfolioData;
  messages: ChatMessage[];
  generatedPortfolios: GeneratedPortfolio[];
  activePortfolioId: string | null;
  isStreaming: boolean;
  isParsing: boolean;
  showPreview: boolean;
  setPortfolioData: (data: Partial<PortfolioData>) => void;
  addMessage: (message: Omit<ChatMessage, "id">) => void;
  updateLastAssistantMessage: (content: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setIsStreaming: (value: boolean) => void;
  setIsParsing: (value: boolean) => void;
  setShowPreview: (value: boolean) => void;
  saveGeneratedPortfolio: (portfolio: GeneratedPortfolio) => void;
  getPortfolioById: (id: string) => GeneratedPortfolio | undefined;
  setActivePortfolioId: (id: string | null) => void;
  reset: () => void;
};

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      portfolioData: emptyPortfolioData(),
      messages: [],
      generatedPortfolios: [],
      activePortfolioId: null,
      isStreaming: false,
      isParsing: false,
      showPreview: false,

      setPortfolioData: (data) =>
        set((state) => ({
          portfolioData: { ...state.portfolioData, ...data },
        })),

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, { ...message, id: uuidv4() }],
        })),

      updateLastAssistantMessage: (content) =>
        set((state) => {
          const messages = [...state.messages];
          const lastIndex = messages.length - 1;
          if (lastIndex >= 0 && messages[lastIndex].role === "assistant") {
            messages[lastIndex] = { ...messages[lastIndex], content };
          }
          return { messages };
        }),

      setMessages: (messages) => set({ messages }),

      setIsStreaming: (value) => set({ isStreaming: value }),

      setIsParsing: (value) => set({ isParsing: value }),

      setShowPreview: (value) => set({ showPreview: value }),

      saveGeneratedPortfolio: (portfolio) =>
        set((state) => ({
          generatedPortfolios: [
            ...state.generatedPortfolios.filter((p) => p.id !== portfolio.id),
            portfolio,
          ],
          activePortfolioId: portfolio.id,
        })),

      getPortfolioById: (id) =>
        get().generatedPortfolios.find((p) => p.id === id),

      setActivePortfolioId: (id) => set({ activePortfolioId: id }),

      reset: () =>
        set({
          portfolioData: emptyPortfolioData(),
          messages: [],
          activePortfolioId: null,
          isStreaming: false,
          isParsing: false,
          showPreview: false,
        }),
    }),
    {
      name: "portai-storage",
      partialize: (state) => ({
        portfolioData: state.portfolioData,
        messages: state.messages,
        generatedPortfolios: state.generatedPortfolios,
        activePortfolioId: state.activePortfolioId,
        showPreview: state.showPreview,
      }),
    }
  )
);
