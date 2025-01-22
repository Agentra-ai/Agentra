import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { Message, streamText } from "ai"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { ZodError } from "zod"

import { db } from "@/db/db"
import {
  messages as _messages,
  AiModalsEnum,
  conversations,
  MessageSender,
} from "@/db/schema"

import { getContext } from "@/hooks/api-action/get-match-embedding"
import { DatabaseError, ValidationError } from "@/lib/errors/errors"

export const runtime = "edge"

const model = openai(AiModalsEnum.GPT_4O_MINI)

export default async function handler(req: Request) {
  try {
    const {
      conversationId,
      messages,
      instructions,
      followUp,
      suggestedQuestions,
      appDocumentsKeys,
      appId,
      suggestedQuestionsEnabled,
    } = await req.json()

    console.log("Request data:", {
      conversationId,
      messages,
      instructions,
      followUp,
      suggestedQuestions,
      appDocumentsKeys,
      appId,
      suggestedQuestionsEnabled,
    })

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      )
    }

    const lastMessage = messages[messages.length - 1]
    // messages: user will send
    // appDocumentsKeys: fileKeys of [ { fileKey: string, isActive: boolean } ]
    // conversationId: conversationId to check the corrosponding context
    // workspaceName: workspaceName for querying to pert
    // Get the conversation from the db

    const _conversations = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
    if (_conversations.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 })
    }
    // const fileKey = _chats[0]?.fileKeys || ""
    const fileKeys = appDocumentsKeys
    const context = await getContext(lastMessage.content, fileKeys)

    console.log(lastMessage)
    console.log(context)

    const promptContent = `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    AI assistant is a big fan of Pinecone and Vercel.

    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK

    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.
    `

    const chatMessages = [
      { role: MessageSender.SYSTEM, content: promptContent },
      ...messages.filter(
        (message: Message) => message.role === MessageSender.USER
      ),
    ]

    // Stream the AI response
    const { text, usage } = await streamText({
      model,
      messages: chatMessages,
    })

    const UsedTokens = {
      totalToken: (await usage).totalTokens,
      CompletionToken: (await usage).completionTokens,
      promptToken: (await usage).promptTokens,
    }

    console.log(UsedTokens)

    console.log(text)
    // Save user message into db
    await db.insert(_messages).values({
      id: uuidv4(),
      conversationId: conversationId,
      content: lastMessage.content,
      role: "user",
      messageType: "text",
    })

    // Return the streaming response
    return NextResponse.json({ text })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          validationError: new ValidationError(error.issues),
        },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        {
          error: "Failed to update app",
          databaseError: new DatabaseError(),
        },
        { status: 500 }
      )
    }
  }
}
