import { NextApiRequest, NextApiResponse } from "next";
import { getAppConversations } from "@/actions/app/logs-action";
import { getChatMessagesByConvId } from "@/actions/chat/chat-action";
import { ZodError } from "zod";

import { db } from "@/config/db";
import { conversations, ConversationType } from "@/db/schema";

import { DatabaseError, ValidationError } from "@/lib/errors/errors";

interface ConversationWithCount extends ConversationType {
  messageCount: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { appId, page = "1", limit = "10" } = req.query;

    if (!appId) {
      return res.status(400).json({ error: "Please provide appId" });
    }

    // Convert page and limit to numbers
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * limitNumber;

    // Fetch paginated conversations
    const { conversations: appConversations, total } = await getAppConversations(
      appId as string,
      limitNumber,
      offset
    );

    // Iterate through each conversation to get message counts
    const conversationsWithCount: ConversationWithCount[] = [];
    for (const convo of appConversations) {
      const messages = await getChatMessagesByConvId(convo.id);
      conversationsWithCount.push({
        ...convo,
        messageCount: messages.length,
      });
    }

    // Return paginated conversations with message counts
    return res.status(200).json({
      data: conversationsWithCount,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        validationError: new ValidationError(error.issues),
      });
    } else {
      return res.status(500).json({
        error: "Failed to get conversations",
        databaseError: new DatabaseError(),
      });
    }
  }
}