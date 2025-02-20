import { getAppDocumentById } from "@/actions/documents/app-docs-action";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { DatabaseError, UnauthorizedError } from "@/lib/errors/errors";

export const GET = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return NextResponse.json(
      { success: false, error: "Document ID is required" },
      { status: 400 },
    );
  }

  try {
    const document = await getAppDocumentById(documentId);
    if (!document) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: document });
  } catch (error) {
    const dbError = new DatabaseError("Failed to fetch document");
    return NextResponse.json(
      { success: false, error: dbError.userMessage },
      { status: dbError.statusCode },
    );
  }
});
