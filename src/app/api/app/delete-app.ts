import type { NextApiRequest, NextApiResponse } from "next"
import { deleteApp } from "@/actions/app/app-action"
import { ZodError } from "zod"

import { DatabaseError } from "@/lib/errors/errors"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  let appId
  try {
    // Parse the request body if it's a string
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
    appId = body.appId

    console.log(appId, "appId to delete")
    await deleteApp(appId)
    res.status(200).json({ message: "App deleted successfully" })
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation error",
        zodError: new ZodError(error.issues),
      })
    } else {
      res
        .status(500)
        .json({ error: "Failed to delete app", details: new DatabaseError() })
    }
  }
}
