import type { NextApiRequest, NextApiResponse } from "next"
import {
  deleteAppDoument,
  deleteAppFile,
} from "@/actions/documents/app-docs-action"
import { ZodError } from "zod"

import { DatabaseError } from "@/lib/errors/errors"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
    const { fileId } = body

    console.log(fileId, " fileId  to delete")
    await deleteAppFile(fileId)

    res.status(200).json({ message: "fileId deleted successfully" })
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation error",
        zodError: error.issues,
      })
    } else {
      res
        .status(500)
        .json({ error: "Failed to delete file", details: new DatabaseError() })
    }
  }
}
