import { NextApiRequest, NextApiResponse } from "next"
import {
  getChatMessagesByConvId,
  getConversationsByIdAction,
} from "@/actions/chat/chat-action"
import {
  getAppMonitoring,
  getPastDaysData,
} from "@/actions/monitoring/monitoring-action"
import { ZodError } from "zod"

import { DatabaseError, ValidationError } from "@/lib/errors/errors"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //  const authcheck = await auth()

  // if (!authcheck) {
  //   return res.status(401).json({ error: "Unauthorized" })
  // }

  try {
    const { appId, days } = req.query

    if (!appId || typeof appId !== "string") {
      return res.status(400).json({ error: "Please provide a valid appId" })
    }

    const data = await getAppMonitoring(appId as string)
    console.log("data", data)

    const chartData = await getPastDaysData(appId, Number(days) || 1)
    console.log("chartData", chartData) 

    return res.status(200).json({
      data: {
        totalConversationCount: Number(data.data.conversationCount),
        totalMessageCount: Number(data.data.totalMessageCount),
        totalUsedToken: Number(data.data.totalUsedToken),
        completionToken: Number(data.data.completionToken),
        promptToken: Number(data.data.promptToken),
        messageTimestamp: Number(data.data.timestamp),
        chartData,
      },
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        validationError: new ValidationError(error.issues),
      })
    } else {
      return res.status(500).json({
        error: "Failed to get Monitoring details",
        databaseError: new DatabaseError(),
      })
    }
  }
}
