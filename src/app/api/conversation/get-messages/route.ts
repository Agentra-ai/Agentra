import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getChatMessagesByConvId } from "@/actions/chat/chat-action";
import { ZodError } from "zod";
import {
  DatabaseError,
  ValidationError,
  UnauthorizedError,
} from "@/lib/errors/errors";
import { getAppConversations } from "@/actions/app/logs-action";
import { conversations } from "@/drizzle/schema";

export const GET = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Please provide conversationId" },
        { status: 400 },
      );
    }

    const chatMessages = await getChatMessagesByConvId(conversationId);
    return NextResponse.json({ data: chatMessages }, { status: 200 });
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
          error: "Failed to get mess ",
          databaseError: new DatabaseError(),
        },
        { status: 500 },
      );
    }
  }
});
