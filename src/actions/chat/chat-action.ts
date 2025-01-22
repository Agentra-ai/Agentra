import { desc, eq } from "drizzle-orm"
import { v4 as uuidv4, validate as validateUUID } from "uuid"

import { db } from "@/db/db"
import { conversations, messages } from "@/db/schema"

import { getUserDetails } from "../user"

type FileKey = {
  fileKey: string
  docName: string
}

type CreateConversationProps = {
  appId: string
  fileKeys: FileKey[]
  newConversationId: string
  openingStatement: string
}

export const createConversation = async ({
  appId,
  fileKeys,
  newConversationId,
  openingStatement,
}: CreateConversationProps) => {
  try {
    console.log(
      "Creating conversation with:",
      appId,
      fileKeys,
      newConversationId,
      openingStatement
    )
    const users = await getUserDetails()
    if (users === null || !users.workspaceId) return null

    // Validate UUIDs
    if (!validateUUID(appId)) {
      throw new Error("Invalid appId UUID format")
    }
    if (!validateUUID(newConversationId)) {
      throw new Error("Invalid conversationId UUID format")
    }

    const newCon = await db.insert(conversations).values({
      id: newConversationId,
      appId: appId,
      fileKeys: JSON.stringify(fileKeys),
      name: "New conversation",
      userId: users.id || "", // Use user's ID if available
    })

    if (openingStatement) {
      const messagesId = uuidv4()
      const newMessanges = await db.insert(messages).values({
        id: messagesId,
        conversationId: newConversationId,
        content: openingStatement,
        role: "system",
        messageType: "text",
        timestamp: String(0),
        completionToken: String(0),
      })
      console.log("new message created", newMessanges)
    }

    console.log("new conversation created", newCon)
    
    return newConversationId
  } catch (error) {
    console.error("Error creating conversation:", error)
    throw error
  }
}

export const getChatMessagesByConvId = async (conversationId: string) => {
  try {
    const messanges = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))

    return messanges
  } catch (error) {
    console.error("Error getting conversation:", error)
    throw error
  }
}

export const getConversation = async (conversationId: string) => {
  try {
    const conversation = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
    // .orderBy(desc(conversations.createdAt))

    return conversation
  } catch (error) {
    console.error("Error getting conversation:", error)
    throw error
  }
}

export const getConversationsByIdAction = async (appId: string) => {
  try {
    const _conversations = await db
      .select()
      .from(conversations)
      .where(eq(conversations.appId, appId))
      .orderBy(desc(conversations.createdAt))

    return _conversations
  } catch (error) {
    console.error("Error getting conversations:", error)
    throw error
  }
}
