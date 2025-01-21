import { NextApiRequest, NextApiResponse } from "next"
import { getAppFiles } from "@/actions/documents/app-docs-action"

import { AppFileType } from "@/db/schema"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { documentId } = req.query

    console.log("documentId get-files", documentId)

    if (!documentId || typeof documentId !== "string") {
      return res.status(400).json({ error: "Invalid or missing documentId" })
    }

    const files: AppFileType[] = await getAppFiles(documentId)
    return res.status(200).json({ data: files })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to fetch documents" })
  }
}
