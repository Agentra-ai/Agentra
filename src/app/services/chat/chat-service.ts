import { createConversation } from "@/actions/chat/chat-action";

export function useChatService() {
  async function createNewConversation(data: {
    appId: string;
    fileKeys: any[];
    newConversationId: string;
    openingStatement: string;
  }) {
    const response = await fetch('/api/chat/create-conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }

    const result = await response.json();
    return result.data;
  }

  return { createNewConversation };
}

export function useMessageService() {
  async function saveMessage(data: {
    id: string;
    conversationId: string;
    content: string;
    role: string;
    messageType: string;
  }) {
    const response = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save message');
    }

    const result = await response.json();
    return result.data;
  }

  return { saveMessage };
}
