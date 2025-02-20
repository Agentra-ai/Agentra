import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { uploadToS3 } from "@/hooks/api-action/s3";
import { loadFilesIntoPinecone } from "@/hooks/api-action/pinacone";
import { EmbeddingModal } from "@/drizzle/schema";
import db from "@/drizzle";
import { AppDocuments, Appfile, DocumentStatus } from "@/drizzle/schema";
import { UnauthorizedError } from "@/lib/errors/errors";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Validate required form fields
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const documentName = formData.get("documentName") as string;
    if (!documentName) {
      return NextResponse.json(
        { error: "Document name is required" },
        { status: 400 },
      );
    }

    const embeddingModal = formData.get("embeddingModal") as EmbeddingModal;
    if (!embeddingModal) {
      return NextResponse.json(
        { error: "Embedding modal is required" },
        { status: 400 },
      );
    }

    const maxChunkLength = parseInt(formData.get("maxChunkLength") as string);
    const chunkOverlap = parseInt(formData.get("chunkOverlap") as string);
    const isDocshub = formData.get("isDocshub") === "true";

    // Generate IDs
    const newDocumentId = uuidv4();
    const newFileId = uuidv4();

    // Get user session
    const session = await auth();
    const user = session?.user;

    if (!user?.workspaceId || !user?.id) {
      return NextResponse.json({ error: "User unauthorized" }, { status: 401 });
    }

    // Upload to S3
    const AWSS3data = await uploadToS3(file);
    if (!AWSS3data) {
      return NextResponse.json(
        { error: "Failed to upload file to S3" },
        { status: 500 },
      );
    }

    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);

    // Create new document
    await db.transaction(async (tx) => {
      await tx.insert(AppDocuments).values({
        id: newDocumentId,
        workspaceId: user.workspaceId,
        userId: user.id,
        fileKeys: JSON.stringify([
          { fileKey: AWSS3data.file_key, isActive: true },
        ]),
        name: documentName,
        description: "here is the details of your documents.",
        appIds: [],
        isDocshub: isDocshub,
      });

      await tx.insert(Appfile).values({
        id: newFileId,
        name: AWSS3data.file_name,
        workspaceId: user.workspaceId,
        isActive: true,
        documentsId: newDocumentId,
        embeddingModal: embeddingModal,
        fileKey: AWSS3data.file_key,
        fileSize: fileSizeInMB,
        status: DocumentStatus.ACTIVE,
        words: 0,
        chunkSize: maxChunkLength,
        chunkOverlap: chunkOverlap,
      });
    });

    // Load into Pinecone
    await loadFilesIntoPinecone(
      AWSS3data.file_key,
      embeddingModal,
      chunkOverlap,
      maxChunkLength,
      newFileId,
      isDocshub,
    );

    return NextResponse.json({
      success: true,
      documentId: newDocumentId,
      fileId: newFileId,
      ...AWSS3data,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
