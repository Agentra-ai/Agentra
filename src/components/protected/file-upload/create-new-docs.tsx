import { getUserDetails } from "@/actions/user"

import { db } from "@/lib/db"
import {
  AppDocuments,
  Appfile,
  DocumentStatus,
  EmbeddingModal,
  User,
} from "@/lib/db/schema"

interface S3Data {
  file_key: string
  file_name: string
}
export const CreateNewDocs = async (
  user: User,
  data: S3Data,
  toast: Function,
  newDocumentId: string,
  newFileId: string,
  fileSizeInMB: string,
  embeddingModal: EmbeddingModal,
  documentName: string,
  maxChunkLength: number,
  chunkOverlap: number,
  isDocsHub: boolean = false
) => {
  console.log("file size in MB", fileSizeInMB)

  if (!user) {
    console.error("User details not found.")
    const user = await getUserDetails()
    if (!user) {
      console.error("User details not found.")
      toast({
        title: "Error",
        description: "User details not found.",
        variant: "destructive",
      })
    }

    return
  }

  console.log("User details:", data)
  try {
    console.log("New Document ID:", newDocumentId)
    // Insert into AppDocuments
    const documentResult = await db
      .insert(AppDocuments)
      .values({
        id: newDocumentId,
        workspaceId: user.workspaceId,
        userId: user.id,
        fileKeys: JSON.stringify([{ fileKey: data.file_key, isActive: true }]),
        name: documentName,
        description: "here is the details of your documents.",
        appIds: [],
        isDocshub: isDocsHub,
      })
      .returning()
    console.log("Document inserted:", documentResult)

    // Insert into Appfile
    const fileResult = await db
      .insert(Appfile)
      .values({
        id: newFileId,
        name: data.file_name,
        workspaceId: user.workspaceId,
        isActive: true,
        documentsId: newDocumentId,
        embeddingModal: embeddingModal,
        fileKey: data.file_key,
        fileSize: fileSizeInMB,
        status: DocumentStatus.ACTIVE,
        words: 0,
        chunkSize: maxChunkLength,
        chunkOverlap: chunkOverlap,

      })
      .returning()
    console.log("File inserted:", fileResult)

    // Show success toast only if inserts were successful
    if (documentResult.length && fileResult.length) {
      // toast({
      //   title: "Success",
      //   description: "The file Uploaded successfully.",
      //   variant: "default",
      // })
      console.log("The file Uploaded successfully.")
      return
    } else {
      throw new Error("Insert operations did not return results.")
    }
  } catch (error) {
    console.error("Error inserting data:", error)
    toast({
      title: "Error",
      description: "Failed to Save file.",
      variant: "destructive",
    })
  }
}
