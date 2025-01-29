  'use server';

  import { ChatPromptTemplate } from "@langchain/core/prompts";
  import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
  import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
  import { createStreamableValue } from "ai/rsc";
  import { createInstance, getModelByKey, TModelKey } from "@/hooks/use-llm";
  import { MessagesPlaceholder } from "@langchain/core/prompts";
  import { TokenUsage } from "@langchain/core/language_models/base";
  import { LLMResult } from "@langchain/core/outputs";

  const TOOL_AGENT_PROMPT = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant that can access Wikipedia to answer questions.
  Follow these rules:
  1. Always use available tools to look up information
  2. Use factual, objective information from reliable sources
  3. If multiple sources exist, combine the most relevant information
  4. If you can't find information, say "I couldn't verify that information"

  Current time: {time}`,
    ],
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  export async function runAgent(input: string, modelKey: TModelKey = "gpt-4o-mini") {
    console.log("input", input)
    const stream = createStreamableValue<{ 
      content: string;
      tokenUsage?: TokenUsage;
      error?: string;
    }>();
    const model = getModelByKey(modelKey);

    if (!model) throw new Error("Invalid model selected");
    const apiKey = process.env[`${model.baseModel.toUpperCase()}_API_KEY`];
    if (!apiKey) throw new Error(`Missing API key for ${model.baseModel}`);

    (async () => {
      let accumulatedText = "";
      let tokenUsage: TokenUsage | undefined;

      try {
        const llm = await createInstance(model, apiKey);
        const tools = [new WikipediaQueryRun({
          topKResults: 3,
          maxDocContentLength: 4000,
        })];

        const agent = createToolCallingAgent({
          llm,
          tools,
          prompt: TOOL_AGENT_PROMPT,
        });

        const executor = new AgentExecutor({
          agent,
          tools,
          maxIterations: 5,
        });

        await executor.invoke(
          {
            input,
            time: new Date().toLocaleString(),
            agent_scratchpad: []
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
                  console.log("tokenUsage", tokenUsage)
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