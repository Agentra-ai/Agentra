import type { NextApiRequest, NextApiResponse } from "next"
import { createApp } from "@/actions/app/app-action"
import { z, ZodError } from "zod"

import { DatabaseError, ValidationError } from "@/lib/errors/errors"

const appSchema = z.object({
  description: z.string().default(""),
  icon: z.string().default(""),
  tags: z.array(z.string()),
  appType: z.string(),
  existingAppId: z.string().nullable().default(null),
  name: z.string(),
})

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse
  // next: (err?: any) => void
) {
  if (req.method !== "PUT" && req.method !== "POST") {
    res.setHeader("Allow", ["PUT", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  try {
    const appDetails = appSchema.parse(req.body)
    console.log(appDetails)

    const AppId = await createApp(appDetails)
    res.status(200).json({ message: "App updated successfully", appId: AppId })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        validationError: new ValidationError(error.issues),
      })
    } else {
      return res.status(500).json({
        error: "Failed to update app",
        databaseError: new DatabaseError(),
      })
    }
  }
}
