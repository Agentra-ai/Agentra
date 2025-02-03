'use client'

import React, { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/hooks/use-chat';
import { useAppStore } from '@/store/useAppStore';
import { BsArrowRepeat } from 'react-icons/bs';
import { RiSendPlaneFill } from 'react-icons/ri';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import { useMessageScroll } from './chat-components';
import MessageList from './message-list';
import ModalSelect from './modal-select';
import { useShallow } from 'zustand/react/shallow';
import Cookies from 'js-cookie';
import { updateAppConfig } from '@/actions/app/app-config-action';
import { useChatStore } from '@/store/useChatStore';

const ConfigChat = () => {
  const router = useRouter();
  const pathname = usePathname();
  const appId = pathname?.split('/')[2] || '';
  const { toast } = useToast();

  const {
    selectedFileKeys,
    appConfigDetails,
    openingStatement,
    refresh,
    setRefresh,
  } = useAppStore(
    useShallow((state) => ({
      selectedFileKeys: state.selectedFileKeys,
      appConfigDetails: state.appConfigDetails,
      openingStatement: state.openingStatement,
      refresh: state.refresh,
      setRefresh: state.setRefresh,
    }))
  );

  const {
      setConversationId,
    setSelectedModel,
    setMessages
  } = useChatStore();

  const {
    messages,
    isLoading,
    input,
    selectedModel,
    setInput,
    handleSendMessage,
  } = useChat(appId);

  useMessageScroll(messages);

  const handleRefresh = useCallback(async () => {
    try {
      await updateAppConfig(appId, {
        ...appConfigDetails,
        contextFileKeys: selectedFileKeys.toString(),
      });
      toast({
        title: 'Config Updated',
        description: 'Start new conversation...',
        variant: 'success',
      });
    } catch (error) {
      console.error('Update error:', error);
    }
    Cookies.remove(`conversationIdFor${appId}`);
    setMessages([]);
    setConversationId(null);
    setRefresh(false);
  }, [appConfigDetails, appId, selectedFileKeys, toast, setRefresh, setConversationId, setMessages]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  if (!appId) {
    router.push('apps/studio');
    return null;
  }

  return (
    <section className="w-full">
      <ModalSelect
        selectedModelKey={selectedModel}
        onModelSelect={(modelKey) => setSelectedModel(modelKey)}
      />
      <div className="flex h-full w-full flex-col items-center justify-between rounded-[8px]">
        <div
          className={`flex h-[calc(100vh-100px)] w-full flex-col gap-2 bg-[#f1f3f7] ${
            refresh ? '' : 'overflow-y-auto'
          } relative z-0 rounded-b-[8px] border`}
          id="message-container"
        >
          {refresh && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
              <Button onClick={handleRefresh} variant="whiteblue">
                <BsArrowRepeat size={20} />
                <span className="font-semibold">Press to refresh</span>
              </Button>
            </div>
          )}

          <div className="sticky top-0 z-20 flex items-center justify-between bg-gray-100 p-2">
            <span className="text-lg">preview</span>
            <button
              onClick={handleRefresh}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <BsArrowRepeat className="text-gray-600" size={20} />
            </button>
          </div>

          <MessageList messages={messages} isLoading={isLoading} />

          <section className="z-1 sticky bottom-5 flex w-full flex-col justify-center px-10">
            <div className="relative flex-1">
              <TextArea
                className="w-full resize-none rounded-[8px] border-none bg-white px-4 py-4 pr-16 text-gray-800 shadow-md focus:ring-blue-700"
                placeholder="Let's talk..."
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className="absolute bottom-3.5 right-2 cursor-pointer rounded-lg bg-blue-700 p-[6px] pl-[4px]"
                disabled={isLoading}
              >
                <div className="mr-1 rotate-45">
                  <RiSendPlaneFill color="white" size={24} />
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ConfigChat);