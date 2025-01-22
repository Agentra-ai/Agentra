import { NextApiRequest, NextApiResponse } from "next"
import { getConversation } from "@/actions/chat/chat-action"
import { openai } from "@ai-sdk/openai"
import { Message, streamObject, streamText } from "ai"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { db } from "@/db/db"
import { messages as _messages, AiModalsEnum } from "@/db/schema"

import { getContext } from "@/hooks/api-action/get-match-embedding"
import Cookies from "js-cookie"
import { getAppConfigDetails } from "@/actions/app/app-config-action"

// Remove edge config
// export const config = {
//   runtime: 'edge'
// };

const AiModal = openai(AiModalsEnum.GPT_4O_MINI)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }

    const startTime = Date.now()

    const bodyData = req.body



    console.log("Request body:", bodyData)
    const {
      conversationId,
      messages,
      instructions,
      followUp,
      suggestedQuestions,
      appDocumentsKeys,
      appId,
      suggestedQuestionsEnabled,
    } = bodyData

    const configDetails = await getAppConfigDetails(appId)
    console.log("configDetails i APIIIIIIIIIIIIIIIIIIIIi:", configDetails)

    const lastMessage = messages[messages.length - 1]
    
    const resultss = await db.insert(_messages).values({
      id: uuidv4(),
      conversationId: conversationId,
      content: lastMessage.content,
      role: "user",
      messageType: "text",
      timestamp: "0",
      promptToken: "0",
    }).returning()


    let lastThreeMessages = ""

    if (followUp) {
      lastThreeMessages =
        `followUp: true\n` +
        messages
          .filter((msg: Message) => msg.role === "user")
          .slice(-3)
          .map(
            (msg: Message, index: number) =>
              ` ' 'this is latest last 3 message of user. use for follow up.' ->   Message ${index + 1}: ${msg.content}`
          )
          .join("\n")
    } else {
      lastThreeMessages = `followUp : false\n`
    }
    const queryMessanges = followUp
      ? lastThreeMessages + lastMessage.content
      : lastMessage.content

    // const context = await getContext(queryMessanges, appDocumentsKeys)
    const context = appDocumentsKeys && appDocumentsKeys.length > 0 ? await getContext(queryMessanges, appDocumentsKeys) : "no context"

    // (please maintain space in markdown)
    const prompt = `
    instructions you have to follow : ${instructions},
    to follow up current conversation : ${lastThreeMessages}
    user question: ${lastMessage.content},
    #START CONTEXT
    context Data : ${context},
    #END CONTEXT
    `

      const resultChat = streamText({
        model: AiModal,
        prompt: prompt,
        maxTokens:2000,
        async onFinish(event) {
          // console.log("System Message Saved:", event.text)
          const UsedTokens = {
            promptTokens: event.usage.promptTokens,
            completionTokens: event.usage.completionTokens,
            totalTokens: event.usage.totalTokens,
          }
          // console.log(UsedTokens)

          const timeTakenSecs = (Date.now() - startTime) / 1000
          // console.log("Time Taken:", timeTakenSecs)
          //save for system
          await db.insert(_messages).values({
            id: uuidv4(),
            conversationId: conversationId,
            content: event.text,
            role: "system",
            messageType: "text",
            completionToken: String(UsedTokens.completionTokens),
            totalUsedToken: String(UsedTokens.totalTokens),
            timestamp: String(timeTakenSecs),
          })
          // console.log("System Message Saved:")
        },
      })

      // Stream the data response back to the client  
      await resultChat.pipeDataStreamToResponse(res)
    

  } catch (error) {
    console.error("Error processing request:", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
