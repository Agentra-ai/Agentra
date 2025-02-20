import { NextResponse } from "next/server";
import db from "@/drizzle";
import { AppDocuments, Appfile, DocumentStatus } from "@/drizzle/schema";
import { auth } from "@/auth";
import { z } from "zod";
import { getUserDetails } from "@/actions/user";
import { DatabaseError, UnauthorizedError } from "@/lib/errors/errors";

const createDocsSchema = z.object({
  data: z.object({
    file_key: z.string(),
    file_name: z.string(),
  }),
  newDocumentId: z.string(),
  newFileId: z.string(),
  fileSizeInMB: z.string(),
  embeddingModal: z.any(),
  documentName: z.string(),
  maxChunkLength: z.number(),
  chunkOverlap: z.number(),
  isDocsHub: z.boolean().optional().default(false),
});

export const POST = auth(async (request) => {
  try {
    if (!request.auth) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const parsed = createDocsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const user = await getUserDetails();

    if (!user || !user.id || !user.workspaceId) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const {
      data,
      newDocumentId,
      newFileId,
      fileSizeInMB,
      embeddingModal,
      documentName,
      maxChunkLength,
      chunkOverlap,
      isDocsHub,
    } = parsed.data;

    console.log("check session in API");
    console.log("session is working");
    console.log("working 1st step", body);

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
      .returning();

    console.log("Document inserted:", documentResult);

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
      .returning();

    return NextResponse.json({ documentResult, fileResult }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        {
          success: false,
          error: error.userMessage,
        },
        { status: error.statusCode },
      );
    }

    const dbError = new DatabaseError("Failed to fetch documents");
    return NextResponse.json(
      {
        success: false,
        error: dbError.userMessage,
      },
      { status: dbError.statusCode },
    );
  }
});
