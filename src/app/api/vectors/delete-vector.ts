import { NextApiRequest, NextApiResponse } from "next"
import { deleteVectorByVectorId } from "@/actions/vectors/vectordb-action"
import { ZodError } from "zod"

import { DatabaseError, ValidationError } from "@/lib/errors/errors"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { vectorId } = req.query
    console.log("vectorId in delete-vector API", vectorId)
    if (typeof vectorId === "string") {
      await deleteVectorByVectorId(vectorId)
      res.status(200).json({ message: "Vector deleted successfully" })
    } else {
      res.status(405).json({ error: "id not found" })
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        validationError: new ValidationError(error.issues),
      })
    } else {
      return res.status(500).json({
        error: "Failed to get mess ",
        databaseError: new DatabaseError(),
      })
    }
  }
}
