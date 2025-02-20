import { MessagesType } from "@/lib/db/schema";
import { BaseMessagePromptTemplateLike, ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

 export const preparePrompt = async ({
      contextData,
      history,
      instructions,
    }: {
      contextData?: any,
      history: MessagesType[];
      instructions: string;
    }) => {
      const hasPreviousMessages = history?.length > 0;

      const system: BaseMessagePromptTemplateLike = [
        "system",
        `${instructions}\n Things to remember: \n ${
          hasPreviousMessages
            ? `You can also refer to these previous conversations`
            : ``
        }`,
      ];

      const messageHolders = new MessagesPlaceholder("chat_history");

      const userContent = `{input}\n\n${
        contextData
          ? `Answer user's question based on the following context: """${contextData}"""`
          : ``
      }`;

      const user: BaseMessagePromptTemplateLike = [
        "user",
        userContent,
      ];

      const prompt = ChatPromptTemplate.fromMessages([
        system,
        messageHolders,
        user,
        ["placeholder", "{agent_scratchpad}"],
      ]);

      return prompt;
    };