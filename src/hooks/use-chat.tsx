// hooks/useChat.ts
import { useCallback, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { createConversation } from '@/actions/chat/chat-action';
import { messages as _messages } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { cookies } from "next/headers";
import { useAppStore } from '@/store/useAppStore';
import { useShallow } from 'zustand/react/shallow';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { WikipediaQueryRun } from '@langchain/community/tools/wikipedia_query_run';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { createInstance, getModelByKey, TModelKey } from '@/hooks/use-llm';
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { TokenUsage } from '@langchain/core/language_models/base';
import { LLMResult } from '@langchain/core/outputs';
import { getContext } from './api-action/get-match-embedding';
import { db } from '@/lib/db';
import Cookies from "js-cookie"

export const useChat = (appId: string) => {
  const {
    messages,
    isLoading,
    input,
    conversationId,
    selectedModel,
    setMessages,
    setIsLoading,
    setInput,
    setConversationId,
    appendMessage,
    updateLastMessage,
  } = useChatStore();

  const { selectedFileKeys, appConfigDetails, openingStatement } = useAppStore(
    useShallow((state) => ({
      selectedFileKeys: state.selectedFileKeys,
      appConfigDetails: state.appConfigDetails,
      openingStatement: state.openingStatement,
    }))
  );

  const { toast } = useToast();
  const streamedMessage = useRef('');
  const currentAbortController = useRef<AbortController | null>(null);

  const updateCurrentMessage = useCallback(
    (updates: {
      isLoading: boolean;
      rawAI: string;
      stop: boolean;
      stopReason?: 'cancel' | 'error';
    }) => {
      updateLastMessage({
        content: updates.rawAI,
        isLoading: updates.isLoading,
        stop: updates.stop,
        stopReason: updates.stopReason,
      });
    },
    [updateLastMessage]
  );

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const newConvId = conversationId || uuidv4();
    const userMessageId = uuidv4();
    const assistantMessageId = uuidv4();

    try {
      if (!conversationId) {
        await createConversation({
          appId,
          fileKeys: selectedFileKeys,
          newConversationId: newConvId,
          openingStatement: openingStatement || appConfigDetails?.openingStatement || '',
        });
        Cookies.set(`conversationIdFor${appId}`, newConvId, { expires: 0.03125 });
        setConversationId(newConvId);
      }

      // Add user message
      appendMessage({
        id: userMessageId,
        content: input,
        role: 'user',
        createdAt: new Date(),
        conversationId: newConvId,
        messageType: 'text',
        totalUsedToken: null,
        completionToken: null,
        promptToken: null,
        timestamp: null,
      });

      setIsLoading(true);
      streamedMessage.current = '';

      // Initialize AI message
      appendMessage({
        id: assistantMessageId,
        content: '',
        role: 'assistant',
        createdAt: new Date(),
        conversationId: newConvId,
        messageType: 'text',
        totalUsedToken: null,
        completionToken: null,
        promptToken: null,
        timestamp: null,
        isLoading: true,
      });

      // Get model instance
      const model = getModelByKey(selectedModel);
      if (!model) throw new Error('Invalid model selected');

      const apiKey = process.env[`${model.baseModel.toUpperCase()}_API_KEY`];
      if (!apiKey) throw new Error('Missing API key');

      const llm = await createInstance(model, apiKey);
      const tools = [new WikipediaQueryRun({ topKResults: 3, maxDocContentLength: 4000 })];
      const prompt = await createPromptTemplate(
        messages,
        appConfigDetails?.instructions || '',
        appConfigDetails?.followUp ?? false,
        selectedFileKeys.map((file) => ({ fileKey: file.fileKey, isActive: file.isActive })),
      );

      const agent = createToolCallingAgent({ llm, tools, prompt });
      const executor = new AgentExecutor({ agent, tools, maxIterations: 5 });

      currentAbortController.current = new AbortController();

      await executor.invoke(
        {
          input,
          time: new Date().toLocaleString(),
          agent_scratchpad: [],
          chat_history: messages,
        },
        {
          callbacks: [
            {
              handleLLMStart: async () => {
                updateCurrentMessage({
                  isLoading: true,
                  rawAI: '',
                  stop: false,
                });
              },
              handleLLMNewToken: async (token: string) => {
                streamedMessage.current += token;
                updateCurrentMessage({
                  isLoading: true,
                  rawAI: streamedMessage.current,
                  stop: false,
                });
              },
              handleLLMEnd: async (output: LLMResult) => {
                updateCurrentMessage({
                  isLoading: false,
                  rawAI: streamedMessage.current,
                  stop: true,
                });

                // Save assistant message to DB
                await db.insert(_messages).values({
                  id: assistantMessageId,
                  conversationId: newConvId,
                  content: streamedMessage.current,
                  role: 'assistant',
                  messageType: 'text',
                });
              },
              handleLLMError: async (error: Error) => {
                console.error('handleLLMError', error);
                if (!currentAbortController.current?.signal.aborted) {
                  toast({
                    title: 'Error',
                    description: 'Something went wrong',
                    variant: 'destructive',
                  });
                }

                updateCurrentMessage({
                  isLoading: false,
                  rawAI: streamedMessage.current,
                  stop: true,
                  stopReason: currentAbortController.current?.signal.aborted ? 'cancel' : 'error',
                });
              },
              handleChainError: async (error: Error) => {
                console.error('handleChainError', error);
                updateCurrentMessage({
                  isLoading: false,
                  rawAI: streamedMessage.current,
                  stop: true,
                  stopReason: 'error',
                });
              },
            },
          ],
          signal: currentAbortController.current.signal,
        }
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setInput('');
      setIsLoading(false);
      currentAbortController.current = null;
    }
  }, [
    input,
    conversationId,
    messages,
    appConfigDetails,
    appId,
    selectedFileKeys,
    openingStatement,
    toast,
    selectedModel,
    isLoading,
    // setMessages,
    setIsLoading,
    setInput,
    setConversationId,
    appendMessage,
    // updateLastMessage,
    updateCurrentMessage,
  ]);

  return {
    messages,
    isLoading,
    input,
    conversationId,
    selectedModel,
    setInput,
    handleSendMessage,
  };
};

// Helper function for creating prompt template
const createPromptTemplate = async (
  messages: any[],
  instructions: string,
  followUp: boolean,
  appDocumentsKeys: { fileKey: string; isActive: boolean }[]
) => {
  const lastMessage = messages[messages.length - 1]?.content || '';
  const queryMessages = followUp
    ? messages.map(({ role, content }) => ({ role, content }))
    : [{ role: messages[messages.length - 1]?.role || 'user', content: lastMessage }];

  const context = appDocumentsKeys?.length > 0
    ? await getContext(queryMessages.toString(), appDocumentsKeys)
    : 'No context available';

  return ChatPromptTemplate.fromMessages([
    ['system', instructions],
    ['human', `Context: ${context}\n\nQuery: {input}`],
    new MessagesPlaceholder('chat_history'),
    ['placeholder', '{agent_scratchpad}'],
  ]);
};