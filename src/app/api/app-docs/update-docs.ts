import { NextApiRequest, NextApiResponse } from "next"
import { updateAppDocumentAction } from "@/actions/documents/app-docs-action"
import { z, ZodError } from "zod"

import { DatabaseError, ValidationError } from "@/lib/errors/errors"

const updateDocumentSchema = z.object({
  documentId: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const parsedBody = updateDocumentSchema.parse(req.body)
    const { documentId, name, description, icon } = parsedBody
    const passingData = {
      name,
      description,
      icon,
    }
    await updateAppDocumentAction(documentId, passingData)
    res.status(200).json({ message: "Document updated successfully" })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        validationError: new ValidationError(error.issues),
      })
    } else {
      return res.status(500).json({
        error: "Failed to update document",
        databaseError: new DatabaseError(),
      })
    }
  }
}
