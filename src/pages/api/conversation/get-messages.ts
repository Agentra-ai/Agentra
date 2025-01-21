import { NextApiRequest, NextApiResponse } from "next"
import { getAppConversations } from "@/actions/app/logs-action"
import { getChatMessagesByConvId } from "@/actions/chat/chat-action"
import { ZodError } from "zod"

import { conversations } from "@/db/schema"

import { DatabaseError, ValidationError } from "@/lib/errors/errors"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { conversationId } = req.query

    console.log("appId in get-conversation API", conversationId)

    if (Array.isArray(conversationId)) {
      return res
        .status(400)
        .json({ error: "Please provide valid conversationId" })
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Please provide conversationId" })
    }

    const chatMessages = await getChatMessagesByConvId(conversationId)

    return res.status(200).json({ data: chatMessages })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        validationError: new ValidationError(error.issues),
      })
    } else {
      return res.status(500).json({
        error: "Failed to get mess ",
        databaseError: new DatabaseError(),
      })
    }
  }
}
