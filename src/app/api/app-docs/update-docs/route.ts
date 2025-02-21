import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateAppDocumentAction } from "@/actions/documents/app-docs-action";
import { z } from "zod";
import {
  DatabaseError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/errors/errors";

const updateDocumentSchema = z.object({
  documentId: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const PUT = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const body = await req.json();
    const parsedBody = updateDocumentSchema.parse(body);
    const { documentId, name, description, icon } = parsedBody;

    await updateAppDocumentAction(documentId, { name, description, icon });

    return NextResponse.json({
      success: true,
      message: "Document updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = new ValidationError(error.issues);
      return NextResponse.json(
        {
          success: false,
          error: validationError.userMessage,
        },
        { status: validationError.statusCode },
      );
    }

    const dbError = new DatabaseError("Failed to update document");
    return NextResponse.json(
      {
        success: false,
        error: dbError.userMessage,
      },
      { status: dbError.statusCode },
    );
  }
});
