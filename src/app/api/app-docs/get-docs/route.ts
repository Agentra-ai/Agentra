import { getAppDocuments } from "@/actions/documents/app-docs-action";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { DatabaseError, UnauthorizedError } from "@/lib/errors/errors";
import { AppDocumentType } from "@/drizzle/schema";

export const GET = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const documents: AppDocumentType[] = await getAppDocuments();

    const stringifiedDocuments = documents.map((doc) => ({
      ...doc,
      fileKeys: doc.fileKeys ? JSON.parse(doc.fileKeys) : null,
    }));

    return NextResponse.json({
      data: stringifiedDocuments,
    });
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
