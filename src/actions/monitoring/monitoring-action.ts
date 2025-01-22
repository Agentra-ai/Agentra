import { getChatMessagesByConvId, getConversation, getConversationsByIdAction } from "../chat/chat-action"
import { and, count, eq, gte, sql } from "drizzle-orm"
import { conversations, messages } from "@/db/schema" // Adjust import path as needed
import { db } from "@/db/db"

export const getAppMonitoring = async (appId: string) => {
  // const appId = 'pp/a243f2ac-a423-4e8b-a028-f5d48df8072d'
 const conversations = await getConversationsByIdAction(appId)
 
     if (!conversations || !Array.isArray(conversations)) {
       console.error("No conversations found or invalid response")
       return{
         data: {
           conversationCount: 0,
           totalMessageCount: 0,
           totalUsedToken: 0,
           completionToken: 0,
           promptToken: 0,
         },
       }
     }
 
     const conversationCount = conversations.length
     let totalMessageCount = 0
     let totalUsedToken = 0
     let totalCompletionToken = 0
     let totalPromptToken = 0
     let timestamp = 0
 
     await Promise.all(
       conversations.map(async (conv) => {
         try {
           const messages = await getChatMessagesByConvId(conv.id)
           if (messages && Array.isArray(messages)) {
             totalMessageCount += messages.length
             messages.forEach((msg) => {
               if (msg) {
                 const usedToken = parseFloat(msg.totalUsedToken ?? "") || 0
                 const completionToken =
                   parseFloat(msg.completionToken ?? "") || 0
                 const promptToken = parseFloat(msg.promptToken ?? "") || 0
                 const msgTimestamp = parseFloat(msg.timestamp ?? "") || 0
 
                 // Ensure we only add valid numbers
                 if (!isNaN(usedToken)) totalUsedToken += usedToken
                 if (!isNaN(completionToken))
                   totalCompletionToken += completionToken
                 if (!isNaN(promptToken)) totalPromptToken += promptToken
                 if (msg.role === "system" && !isNaN(msgTimestamp))
                   timestamp += msgTimestamp
               }
             })
           }
         } catch (err) {
           console.error(
             `Error processing conversation ${conv.id} in monitoring API:`,
             err
           )
         }
       })
     )  
     const calcuteTime = timestamp / totalMessageCount

     return {
       data: {
         conversationCount,
         totalMessageCount,
         totalUsedToken,
         completionToken: totalCompletionToken,
         promptToken: totalPromptToken,
         timestamp : calcuteTime,
       },
     }
     
    }

const generateDateRange = (days: number) => {
  const dates = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates;
};

export const getPastDaysData = async (appId: string, days: number = 7) => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - days)
  
  // Get all dates in range
  const dateRange = generateDateRange(days);

  // Get daily conversation counts
  const conversationData = await db
    .select({
      date: sql`DATE(${conversations.createdAt})`,
      count: count(conversations.id),
    })
    .from(conversations)
    .where(
      and(
        eq(conversations.appId, appId),
        gte(conversations.createdAt, startDate)
      )
    )
    .groupBy(sql`DATE(${conversations.createdAt})`)
    .orderBy(sql`DATE(${conversations.createdAt})`)

  // Get daily message counts
  const messageData = await db
    .select({
      date: sql`DATE(${messages.createdAt})`,
      count: count(messages.id),
      totalTokens: sql`SUM(CAST(${messages.totalUsedToken} AS INTEGER))`,
      completionTokens: sql`SUM(CAST(${messages.completionToken} AS INTEGER))`,
      promptTokens: sql`SUM(CAST(${messages.promptToken} AS INTEGER))`,
      avgTimestamp: sql`AVG(CAST(${messages.timestamp} AS FLOAT))`
    })
    .from(messages)
    .innerJoin(
      conversations,
      eq(messages.conversationId, conversations.id)
    )
    .where(
      and(
        eq(conversations.appId, appId),
        gte(messages.createdAt, startDate)
      )
    )
    .groupBy(sql`DATE(${messages.createdAt})`)
    .orderBy(sql`DATE(${messages.createdAt})`)

  // Create lookup maps for easy access
  const messageDateMap = new Map(
    messageData.map(row => [row.date?.toString(), row])
  );
  const conversationDateMap = new Map(
    conversationData.map(row => [row.date?.toString(), row])
  );

  // Generate complete dataset with 0s for missing dates
  const completeDataset = dateRange.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const messageRow = messageDateMap.get(dateStr) || {
      count: 0,
      totalTokens: 0,
      completionTokens: 0,
      promptTokens: 0,
      avgTimestamp: 0
    };
    const convRow = conversationDateMap.get(dateStr) || { count: 0 };

    return {
      date: dateStr,
      messageCount: Number(messageRow.count) || 0,
      totalTokens: Number(messageRow.totalTokens) || 0,
      completionTokens: Number(messageRow.completionTokens) || 0,
      promptTokens: Number(messageRow.promptTokens) || 0,
      conversationCount: Number(convRow.count) || 0,
      tokenSpeed: messageRow.avgTimestamp ? 
        Number(messageRow.totalTokens) / Number(messageRow.avgTimestamp) : 0
    };
  });

  return {
    conversations: {
      title: "Total conversations",
      values: completeDataset.map(row => ({
        x_axis: new Date(row.date as string).toLocaleDateString(),
        y_axis: row.conversationCount.toString()
      })),
      totalValue: completeDataset.reduce((acc, row) => acc + row.conversationCount, 0)
    },
    messages: {
      title: "Total messages",
      values: completeDataset.map(row => ({
        x_axis: new Date(row.date as string).toLocaleDateString(),
        y_axis: row.messageCount.toString()
      })),
      totalValue: completeDataset.reduce((acc, row) => acc + row.messageCount, 0)
    },
    totalTokens: {
      title: "Total tokens",
      values: completeDataset.map(row => ({
        x_axis: new Date(row.date as string).toLocaleDateString(),
        y_axis: row.totalTokens.toString()
      })),
      totalValue: completeDataset.reduce((acc, row) => acc + row.totalTokens, 0)
    },
    completionTokens: {
      title: "Completion tokens",
      values: completeDataset.map(row => ({
        x_axis: new Date(row.date as string).toLocaleDateString(),
        y_axis: row.completionTokens.toString()
      })),
      totalValue: completeDataset.reduce((acc, row) => acc + row.completionTokens, 0)
    },
    promptTokens: {
      title: "Prompt tokens",
      values: completeDataset.map(row => ({
        x_axis: new Date(row.date as string).toLocaleDateString(),
        y_axis: row.promptTokens.toString()
      })),
      totalValue: completeDataset.reduce((acc, row) => acc + row.promptTokens, 0)
    },
    tokenSpeed: {
      title: "Token Output Speed (tokens/sec)",
      values: completeDataset.map(row => ({
        x_axis: new Date(row.date as string).toLocaleDateString(),
        y_axis: row.tokenSpeed.toFixed(2)
      })),
      totalValue: completeDataset.reduce((sum, row) => sum + row.tokenSpeed, 0) / completeDataset.length
    }
  }
}