import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { AppDocuments, AppDocumentType, Appfile } from "@/db/schema"

import { getUserDetails } from "../user"

export const getAppDocuments = async () => {
  const user = await getUserDetails()
  if (!user || !user.workspaceId) return []
  const appDocuments = await db
    .select()
    .from(AppDocuments)
    .where(and(eq(AppDocuments.isDocshub,false),
      eq(AppDocuments.workspaceId, user.workspaceId))).orderBy(AppDocuments.createdAt)
  return appDocuments
}

export const getDocshubData = async () => {
  const user = await getUserDetails()
  if (!user || !user.workspaceId) return []
  const appDocuments = await db
    .select()
    .from(AppDocuments)
    .where(
      and(
        eq(AppDocuments.workspaceId, user.workspaceId), 
        eq(AppDocuments.isDocshub, true)
      )
    )
    .orderBy(AppDocuments.createdAt)

  return appDocuments
}

export const getAppFiles = async (documentId: string) => {
  const appFiles = await db
    .select()
    .from(Appfile)
    .where(eq(Appfile.documentsId, documentId))
  return appFiles
}

export const deleteAppDoument = async (documentId: string) => {
  await db.delete(AppDocuments).where(eq(AppDocuments.id, documentId))
}

export const deleteAppFile = async (fileId: string) => {
  await db.delete(Appfile).where(eq(Appfile.id, fileId))
}

export const getFileByFileId = async (fileId: string) => {
  const file = await db.select().from(Appfile).where(eq(Appfile.id, fileId))
  return file[0]
}

export const updateAppDocumentAction = async (
  documentId: string,
  data: { name: string; description: string; icon?: string }
) => {
  await db
    .update(AppDocuments)
    .set({
      name: data.name,
      description: data.description,
      icon: data.icon,
    })
    .where(eq(AppDocuments.id, documentId))

  // revalidatePath("/apps/documents")
}

export const getAppDocumentById = async (documentId: string) => {
  const document = await db
    .select()
    .from(AppDocuments)
    .where(eq(AppDocuments.id, documentId))
  return document[0] as AppDocumentType
}