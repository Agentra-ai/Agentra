'use server';

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { createInstance, getModelByKey, TModelKey } from "@/hooks/use-llm";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { TokenUsage } from "@langchain/core/language_models/base";
import { LLMResult } from "@langchain/core/outputs";
import { messages as _messages, MessagesType } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/config/db";
import { getContext } from "@/hooks/api-action/get-match-embedding";

export async function runAgent({
  instruction,
  input,
  conversationId,
  modelKey = "gpt-4o-mini",
  messages = [],
  fileKeys = [],
  followUp = false,
}: {
  instruction: string;
  input: string;
  conversationId: string;
  modelKey?: TModelKey;
  messages?: MessagesType[];
  fileKeys?: { fileKey: string; isActive: boolean }[];
  followUp?: boolean;
}) {
  
console.log(instruction,
  input,
  conversationId,
  modelKey,
  messages ,
  fileKeys ,
  followUp )
  
  const stream = createStreamableValue<{
    content: string;
    tokenUsage?: TokenUsage;
    error?: string;
  }>();
  
  (async () => {
    let accumulatedText = "";
    let tokenUsage: TokenUsage | undefined;

    try {
      const model = getModelByKey(modelKey);    
      if (!model) throw new Error("Invalid model selected");
      
      const apiKey = process.env[`${model.baseModel.toUpperCase()}_API_KEY`];
      if (!apiKey) throw new Error("Missing API key");

      await db.insert(_messages).values({
        id: uuidv4(),
        conversationId,
        content: input,
        role: "user",
        messageType: "text",
      });

      const llm = await createInstance(model, apiKey);

      const tools = [new WikipediaQueryRun({ topKResults: 3, maxDocContentLength: 4000 })];
      
      // const context = fileKeys.length > 0 
      //   ? await getContext(
      //       followUp ? messages.map(m => m.content).join("\n") : input,
      //       fileKeys
      //     )
      //   : "No context available";

      const prompt = await createPromptTemplate(messages, instruction, followUp, fileKeys);

      const agent = createToolCallingAgent({ llm, tools, prompt });
      const executor = new AgentExecutor({ agent, tools, maxIterations: 5 });

      await executor.invoke(
        {
          input,
          time: new Date().toLocaleString(),
          agent_scratchpad: [],
          chat_history: messages
        },
        {
          callbacks: [
            {
              handleLLMStart: async () => {
                stream.update({ content: "" });
              },
              handleLLMNewToken: async (token: string) => {
                accumulatedText += token;
                stream.update({ content: accumulatedText });
              },
              handleLLMEnd: async (output: LLMResult) => {
                tokenUsage = output.llmOutput?.tokenUsage;
              },
              handleLLMError: async (error: Error) => {
                stream.update({ 
                  content: accumulatedText,
                  error: `LLM Error: ${error.message}`
                });
              },
              handleChainError: async (error: Error) => {
                stream.update({ 
                  content: accumulatedText,
                  error: `Chain Error: ${error.message}`
                });
              }
            }
          ]
        }
      );

      stream.update({ 
        content: accumulatedText,
        tokenUsage
      });
      stream.done();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      stream.update({ 
        content: accumulatedText,
        error: `Execution Error: ${errorMessage}`
      });
      stream.done();
    }
  })();

  return { streamData: stream.value };
}


export const createPromptTemplate = async (
  messages: any[],
  instructions: string,
  followUp: boolean,
  appDocumentsKeys:  { fileKey: string; isActive: boolean }[]
) => {
  const lastMessage = messages[messages.length - 1]?.content || "";
  const queryMessages = followUp 
    ? messages.map(({ role, content }) => ({ role, content })) 
    : [{ role: messages[messages.length - 1]?.role || "user", content: lastMessage }];
  
  const context = appDocumentsKeys?.length > 0 
    ? await getContext(queryMessages.toString(), appDocumentsKeys)
    : "No context available";

  return ChatPromptTemplate.fromMessages([
    ["system", instructions],
    ["human", `Context: ${context}\n\nQuery: {input}`],
    new MessagesPlaceholder("chat_history"),
    ["placeholder", "{agent_scratchpad}"],
  ]);  
};