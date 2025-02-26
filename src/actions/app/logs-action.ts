import { desc, eq, sql } from "drizzle-orm";
import db from "@/drizzle";
import { conversations } from "@/drizzle/schema";

export const getAppConversations = async (
  appId: string,
  limit: number,
  offset: number,
) => {
  // Fetch paginated conversations
  const appConversations = await db
    .select()
    .from(conversations)
    .where(eq(conversations.appId, appId))
    .orderBy(desc(conversations.createdAt))
    .limit(limit)
    .offset(offset);

  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(conversations)
    .where(eq(conversations.appId, appId));

  const total = totalResult[0]?.count ?? 0;

  return {
    conversations: appConversations.map((conversation) => ({
      ...conversation,
      fileKeys: conversation.fileKeys ? JSON.parse(conversation.fileKeys) : [],
    })),
    total,
  };
};
