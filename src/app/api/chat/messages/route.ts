import { NextRequest, NextResponse } from "next/server";
import db from "@/drizzle";
import { messages as _messages } from "@/drizzle/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, conversationId, content, role, messageType } = body;

    const result = await db.insert(_messages).values({
      id,
      conversationId,
      content,
      role,
      messageType,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Save message error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save message" },
      { status: 500 }
    );
  }
}
