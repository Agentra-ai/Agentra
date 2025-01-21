import { PineconeRecord } from "@pinecone-database/pinecone"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

import { db } from "@/config/db"
import { DocumentStatus, VectorsDBData } from "@/db/schema"

import { getEmbeddings } from "@/hooks/api-action/embedding"
import { embedDocument, getPineconeClient, splitTextContent } from "@/hooks/api-action/pinacone"
import { convertToAscii } from "@/lib/utils"

import { getWorkspaceDetails } from "../workspace-action"

export const insertVectorsDataToPG = async (
  dataSaveToPG: { vectorId: string; filekey: string; content: string }[],
  newFileId: string
): Promise<void> => {
  try {
    const insertPromises = dataSaveToPG.map(async (data) => {
      await db.insert(VectorsDBData).values({
        id: uuidv4(),
        fileId: newFileId!,
        vectorId: data.vectorId,
        content: data.content,
        charecterLength: data.content.length,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })
    await Promise.all(insertPromises)
  } catch (error) {
    console.error("Error inserting vectors data to PG:", error)
    throw error
  }
}

export async function deleteVectorsByFileKey(fileKey: string): Promise<void> {
  try {
    const workspaceDetails = await getWorkspaceDetails()
    const workspaceNamespace = workspaceDetails?.workspaceVectorDB

    if (!workspaceNamespace) {
      throw new Error("Workspace namespace not found in workspace details")
    }

    // Initialize Pinecone client
    const pineconeClient = await getPineconeClient()
    // Connect to the index
    const pineconeIndex = await pineconeClient.index("agentra-app-documents")
    const nameSpaceName = convertToAscii(workspaceNamespace)
    const namespace = pineconeIndex.namespace(nameSpaceName)

    // Perform the deletion based on `filekey`
    await namespace.deleteMany({
      filter: {
        filekey: { $eq: fileKey },
      },
    })

    console.log(`Successfully deleted vectors with filekey: ${fileKey}`)
  } catch (error) {
    console.error("Error deleting vectors by filekey:", error)
    throw error
  }
}

export async function deleteVectorsByFileKeys(
  fileKeys: string[]
): Promise<void> {
  try {
    const workspaceDetails = await getWorkspaceDetails()
    const workspaceNamespace = workspaceDetails?.workspaceVectorDB

    if (!workspaceNamespace) {
      throw new Error("Workspace namespace not found in workspace details")
    }

    // Initialize Pinecone client
    const pineconeClient = await getPineconeClient()
    // Connect to the index
    const pineconeIndex = await pineconeClient.index("agentra-app-documents")
    const nameSpaceName = convertToAscii(workspaceNamespace)
    const namespace = pineconeIndex.namespace(nameSpaceName)

    // Perform the deletion based on `filekey`
    await namespace.deleteMany({
      filter: {
        filekey: { $in: fileKeys },
      },
    })

    console.log(`Successfully deleted vectors with filekeys: ${fileKeys}`)
  } catch (error) {
    console.error("Error deleting vectors by filekeys:", error)
    throw error
  }
}

export async function deleteVectorByVectorId(vectorId: string): Promise<void> {
  try {
    // Delete from Postgres first
    await db.delete(VectorsDBData).where(eq(VectorsDBData.vectorId, vectorId))

    const workspaceDetails = await getWorkspaceDetails()
    const workspaceNamespace = workspaceDetails?.workspaceVectorDB

    if (!workspaceNamespace) {
      throw new Error("Workspace namespace not found in workspace details")
    }

    // Initialize Pinecone client
    const pineconeClient = await getPineconeClient()
    // Connect to the index
    const pineconeIndex = await pineconeClient.index("agentra-app-documents")
    const nameSpaceName = convertToAscii(workspaceNamespace)
    const namespace = pineconeIndex.namespace(nameSpaceName)

    console.log("Deleting vector by vectorId", vectorId)
    // Perform the deletion based on `vectorId`
    await namespace.deleteOne(vectorId)

    console.log(`Successfully deleted vector with vectorId: ${vectorId}`)
  } catch (error) {
    console.error("Error deleting vector by vectorId:", error)
    throw error
  }
}

export async function getVectorsDataByVectorIds(vectorIds: string[]) {
  try {
    const workspaceDetails = await getWorkspaceDetails()
    const workspaceNamespace = workspaceDetails?.workspaceVectorDB

    if (!workspaceNamespace) {
      throw new Error("Workspace namespace not found in workspace details")
    }

    // Initialize Pinecone client
    const pineconeClient = await getPineconeClient()
    // Connect to the index
    const pineconeIndex = await pineconeClient.index("agentra-app-documents")
    const nameSpaceName = convertToAscii(workspaceNamespace)
    const namespace = pineconeIndex.namespace(nameSpaceName)

    const response = await namespace.fetch(vectorIds)

    return response
  } catch (error) {
    console.error("Error getting vectors by vectorIds:", error)
    throw error
  }
}

export async function updateVectorDataByVectorId(
  vectorId: string,
  filekey: string,
  content: string,
  isActive: boolean,
  maxChunkLength: number = 150,
  chunkOverlap: number = 50
) {
  console.log(maxChunkLength, chunkOverlap) 
  try {
    const workspaceDetails = await getWorkspaceDetails()
    const workspaceNamespace = workspaceDetails?.workspaceVectorDB

    if (!workspaceNamespace) {
      throw new Error("Workspace namespace not found in workspace details")
    }

    // Split the content into chunks
    const splitterList = await splitTextContent(
      content,
      maxChunkLength,
      chunkOverlap
    )
    console.log("splitterList : ", splitterList)

    console.log("filekey : ", filekey)

    // Create document objects
    const documents = splitterList.map((content, index) => ({
      pageContent: content,
      metadata: {
      pageNumber: index + 1,
      text: content,
      file_key: filekey,
      isActive: isActive
      }
    }))

    console.log("documents : ", documents)

    // Get embeddings for each document
    const vectors = await Promise.all(
      documents.map((doc) => embedDocument(doc, "text-embedding-ada-002"))
    )

    console.log("vectors : ", vectors)

    // Initialize Pinecone client
    const pineconeClient = await getPineconeClient()
    const pineconeIndex = await pineconeClient.index("agentra-app-documents")
    const nameSpaceName = convertToAscii(workspaceNamespace)
    const namespace = pineconeIndex.namespace(nameSpaceName)

    // Upsert the vectors
    await namespace.upsert(vectors.map(vector => ({
      id: vectorId,
      values: vector.values,
      metadata: vector.metadata
    })))

    console.log(`Successfully updated vector with vectorId: ${vectorId}`)
  } catch (error) {
    console.error("Error updating vector by vectorId:", error)
    throw error
  }
}

export async function upsertVectorDataInDB(vectorData: PineconeRecord[]) {
  try {
    const workspaceDetails = await getWorkspaceDetails()
    const workspaceNamespace = workspaceDetails?.workspaceVectorDB

    if (!workspaceNamespace) {
      throw new Error("Workspace namespace not found in workspace details")
    }

    // Initialize Pinecone client
    const pineconeClient = await getPineconeClient()
    // Connect to the index
    const pineconeIndex = await pineconeClient.index("agentra-app-documents")
    const nameSpaceName = convertToAscii(workspaceNamespace)
    const namespace = pineconeIndex.namespace(nameSpaceName)

    // Upsert updated vector
    await namespace.upsert(vectorData)
  } catch (error) {
    console.error("Error upserting vector data in DB:", error)
    throw error
  }
}

export async function getVectorsByfileId(fileId: string) {
  try {
    const vectors = await db
      .select()
      .from(VectorsDBData)
      .where(eq(VectorsDBData.fileId, fileId))
    return vectors
  } catch (error) {
    console.error("Error getting vectors by fileId:", error)
    throw error
  }
}

export async function updateVectorDataInPG(vectorId: string, content: string) {
  try {
    await db
      .update(VectorsDBData)
      .set({ content: content })
      .where(eq(VectorsDBData.vectorId, vectorId))
  } catch (error) {
    console.error("Error updating vector data in PG:", error)
    throw error
  }
}

export async function addVectorDataInPG(
  vectorId: string,
  fileId: string,
  content: string
) {
  try {
    await db.insert(VectorsDBData).values({
      id: uuidv4(),
      fileId: fileId,
      vectorId: vectorId,
      content: content,
      charecterLength: content.length,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error adding vector data in PG:", error)
    throw error
  }
}
