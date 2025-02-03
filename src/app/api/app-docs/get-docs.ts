import { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { getAppDocuments } from "@/actions/documents/app-docs-action"

import { AppDocumentType } from "@/lib/db/schema"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const documents: AppDocumentType[] = await getAppDocuments()

    const stringifiedDocuments = documents.map((doc) => ({
      ...doc,
      fileKeys: doc.fileKeys ? JSON.parse(doc.fileKeys) : null,
    }))

    //  console.log('stringly', stringifiedDocuments)

    return res.status(200).json({ data: stringifiedDocuments })

    // return res.status(200).json({data: stringifiedDocuments})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to fetch documents" })
  }
}
