"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { TModelKey } from "@/hooks/use-llm";
import { runAgent } from "@/actions/ai/ai-call";
import ModalSelect from "@/components/protected/chat/modal-select";
import { Markdown } from "@/components/protected/chat/use-markdown";

type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState<TModelKey>("gpt-4o-mini");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    // Add user message
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), content: input, role: "user" }
    ]);

    const assistantMessageId = Date.now().toString();
    setMessages(prev => [
      ...prev,
      { id: assistantMessageId, content: "", role: "assistant" }
    ]);

    try {
      const { streamData } = await runAgent(input, selectedModel);
      let accumulatedContent = "";

      for await (const chunk of readStreamableValue(streamData)) {
        if (!chunk) continue;

        if (chunk.error) {
          throw new Error(chunk.error);
        }

        if (chunk.content) {
          accumulatedContent = chunk.content;
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg
          ));
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId
          ? { ...msg, content: errorMessage }
          : msg
      ));
    } finally {
      setIsLoading(false);
      setInput("");
    }
  }   

  return (
    <div className="container mx-auto p-4">
      <ModalSelect
        selectedModelKey={selectedModel}
        onModelSelect={setSelectedModel}
      />
      
      <form onSubmit={handleSubmit} className="my-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your query"
          className="flex-1 p-2 border rounded"
          disabled={isLoading}
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </form>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Chat:</h2>
        <div className="overflow-y-auto h-[500px] space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`max-w-[80%] p-4 rounded-lg ${
                message.role === "user" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100"
              }`}
              >
                <Markdown>
                  {message.content}
                </Markdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}