import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAppFiles } from "@/actions/documents/app-docs-action";
import {
  BadRequestError,
  DatabaseError,
  UnauthorizedError,
} from "@/lib/errors/errors";
import { AppFileType } from "@/drizzle/schema";

export const GET = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      throw new BadRequestError("Document ID is required");
    }

    const files: AppFileType[] = await getAppFiles(documentId);

    return NextResponse.json({
      data: files,
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return NextResponse.json(
        {
          success: false,
          error: error.userMessage,
        },
        { status: error.statusCode },
      );
    }

    const dbError = new DatabaseError("Failed to fetch files");
    return NextResponse.json(
      {
        success: false,
        error: dbError.userMessage,
      },
      { status: dbError.statusCode },
    );
  }
});
