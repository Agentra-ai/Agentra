import { NextRequest, NextResponse } from "next/server";
import { createConversation } from "@/actions/chat/chat-action";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appId, fileKeys, newConversationId, openingStatement } = body;

    const result = await createConversation({
      appId,
      fileKeys,
      newConversationId,
      openingStatement,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
