import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAppConversations } from "@/actions/app/logs-action";
import { getChatMessagesByConvId } from "@/actions/chat/chat-action";
import { ZodError } from "zod";
import {
  DatabaseError,
  ValidationError,
  UnauthorizedError,
} from "@/lib/errors/errors";
import { ConversationType } from "@/drizzle/schema";

interface ConversationWithCount extends ConversationType {
  messageCount: number;
}

export const GET = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }
  try {
    const { searchParams } = new URL(req.url);
    const appId = searchParams.get("appId");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    if (!appId) {
      return NextResponse.json(
        { error: "Please provide appId" },
        { status: 400 },
      );
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const { conversations: appConversations, total } =
      await getAppConversations(appId, limitNumber, offset);

    const conversationsWithCount = await Promise.all(
      appConversations.map(async (convo: ConversationType) => {
        const messages = await getChatMessagesByConvId(convo.id);
        return { ...convo, messageCount: messages.length };
      }),
    );

    return NextResponse.json(
      {
        data: conversationsWithCount,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          validationError: new ValidationError(error.issues),
        },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        {
          error: "Failed to get conversations",
          databaseError: new DatabaseError(),
        },
        { status: 500 },
      );
    }
  }
});
