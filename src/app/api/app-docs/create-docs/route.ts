import { NextRequest, NextResponse } from "next/server";
import db from "@/drizzle";
import {
  AppDocuments,
  Appfile,
  DocumentStatus,
  EmbeddingModal,
  User,
} from "@/drizzle/schema";
import { getUserDetails } from "@/actions/user";
import { loadFilesIntoPinecone } from "@/hooks/api-action/pinacone";
import { uploadToS3 } from "@/hooks/api-action/s3";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      file,
      documentName,
      docId,
      fileId,
      fileSizeInMB,
      embeddingModal,
      maxChunkLength,
      chunkOverlap,
      isDocshub,
    } = body;

    // Check user
    const user = (await getUserDetails()) as User;
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 401 },
      );
    }

    // Upload to S3
    const s3Data = await uploadToS3(file);
    // Insert into AppDocuments
    await db.insert(AppDocuments).values({
      id: docId,
      userId: user.id,
      workspaceId: user.workspaceId,
      fileKeys: JSON.stringify([{ fileKey: s3Data.file_key, isActive: true }]),
      name: documentName,
      description: "here is the details of your documents.",
      appIds: [],
      isDocshub: isDocshub,
    });

    // Insert into AppFile
    await db.insert(Appfile).values({
      id: fileId,
      name: s3Data.file_name,
      workspaceId: user.workspaceId,
      isActive: true,
      documentsId: docId,
      embeddingModal: embeddingModal,
      fileKey: s3Data.file_key,
      fileSize: fileSizeInMB,
      status: DocumentStatus.ACTIVE,
      words: 0,
      chunkSize: maxChunkLength,
      chunkOverlap: chunkOverlap,
    });

    // Load into Pinecone
    await loadFilesIntoPinecone(
      s3Data.file_key,
      embeddingModal,
      chunkOverlap,
      maxChunkLength,
      fileId,
      isDocshub,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create docs" },
      { status: 500 },
    );
  }
}
