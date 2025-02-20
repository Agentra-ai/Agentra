import { deleteAppDoument } from "@/actions/documents/app-docs-action";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  BadRequestError,
  DatabaseError,
  UnauthorizedError,
} from "@/lib/errors/errors";

export const DELETE = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const { documentId } = await req.json();

    if (!documentId) {
      throw new BadRequestError("Document ID is required");
    }

    console.log(documentId, "docs ID to delete");
    await deleteAppDoument(documentId);

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof BadRequestError ||
      error instanceof UnauthorizedError
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.userMessage,
        },
        { status: error.statusCode },
      );
    }

    const dbError = new DatabaseError("Failed to delete document");
    return NextResponse.json(
      {
        success: false,
        error: dbError.userMessage,
      },
      { status: dbError.statusCode },
    );
  }
});
