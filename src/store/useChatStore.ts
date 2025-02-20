// store/useChatStore.ts
import { create } from 'zustand';
import { MessagesType } from '@/lib/db/schema';
import { TokenUsage } from '@langchain/core/language_models/base';
import { TModelKey } from '@/hooks/use-llm';

interface ChatState {
  messages: MessagesType[];
  isLoading: boolean;
  input: string;
  conversationId: string | null;
  selectedModel: TModelKey;
  setMessages: (messages: MessagesType[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setInput: (input: string) => void;
  setConversationId: (conversationId: string | null) => void;
  setSelectedModel: (selectedModel: TModelKey) => void;
  appendMessage: (message: MessagesType & { isLoading?: boolean; stop?: boolean; stopReason?: 'cancel' | 'error' }) => void;
  updateLastMessage: (updates: Partial<MessagesType & { isLoading?: boolean; stop?: boolean; stopReason?: 'cancel' | 'error' }>) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  input: '',
  conversationId: null,
  selectedModel: 'gpt-4o-mini',

  // Actions
  setMessages: (messages) => set({ messages }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setInput: (input) => set({ input }),
  setConversationId: (conversationId) => set({ conversationId }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),

  // Append a new message to the list
  appendMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      
    })),

  // Update the last message in the list
  updateLastMessage: (updates) =>
    set((state) => {
      const lastMessage = state.messages[state.messages.length - 1];
      if (!lastMessage) return state;

      return {
        messages: [
          ...state.messages.slice(0, -1), // All messages except the last one
          { ...lastMessage, ...updates }, // Updated last message
        ],
      };
    }),
}));