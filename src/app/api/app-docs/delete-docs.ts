import type { NextApiRequest, NextApiResponse } from "next"
import { deleteAppDoument } from "@/actions/documents/app-docs-action"
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
  console.log(req.headers, "headers")
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
    const { documentId } = body
    console.log(body, "body")
    console.log(documentId, "docs ID to delete")
    await deleteAppDoument(documentId)

    res.status(200).json({ message: "Document deleted successfully" })
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation error",
        zodError: error.issues,
      })
    } else {
      res.status(500).json({
        error: "Failed to delete Document",
        details: new DatabaseError(),
      })
    }
  }
}
