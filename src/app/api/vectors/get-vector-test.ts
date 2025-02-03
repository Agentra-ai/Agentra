import { NextApiRequest, NextApiResponse } from "next"
import { z, ZodError } from "zod"

import { getContext } from "@/hooks/api-action/get-match-embedding"
import { DatabaseError, ValidationError } from "@/lib/errors/errors"
import { getContextAction } from "@/actions/context-action"

const querySchema = z.object({
  queryText: z.string(),
  fileKeys: z.array(
    z.object({
      fileKey: z.string(),
      isActive: z.boolean(),
    })
  ),
  topKvalue: z.preprocess((val) => Number(val), z.number()),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" })
  }
  try {
    const { queryText, fileKeys, topKvalue } = querySchema.parse(req.body)
    console.log("vectorId in get-vector API", queryText, topKvalue, fileKeys)

    const vectorData = await getContextAction(queryText, fileKeys, topKvalue)
    console.log("vectorData in get-vector API", vectorData)
    res.status(200).json({ data: vectorData })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        validationError: new ValidationError(error.issues),
      })
    } else {
      return res.status(500).json({
        error: "Failed to get vector data",
        databaseError: new DatabaseError(),
      })
    }
  }
}
