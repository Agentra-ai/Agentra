import { NextApiRequest, NextApiResponse } from "next"
import { updateVectorDataByVectorId } from "@/actions/vectors/vectordb-action"
import { z, ZodError } from "zod"

import { DatabaseError, ValidationError } from "@/lib/errors/errors"

const updateVectorSchema = z.object({
  vectorId: z.string(),
  content: z.string(),
  fileKey: z.string(),
  isActive: z.boolean(),
  chunkSize: z.number().optional(),
  chunkOverlap: z.number().optional(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const parsedBody = updateVectorSchema.parse(req.body)
    const { vectorId, content, fileKey, isActive,chunkSize,chunkOverlap } = parsedBody

    await updateVectorDataByVectorId(vectorId, fileKey, content, isActive, chunkSize, chunkOverlap)
    res.status(200).json({ message: "Vector updated successfully" })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        validationError: new ValidationError(error.issues),
      })
    } else {
      return res.status(500).json({
        error: "Failed to update vector",
        databaseError: new DatabaseError(),
      })
    }
  }
}
