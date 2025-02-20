import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteAppFile } from "@/actions/documents/app-docs-action";
import { z } from "zod";
import {
  DatabaseError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/errors/errors";

const deleteFileSchema = z.object({
  fileId: z.string(),
});

export const DELETE = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const body = await req.json();
    const { fileId } = deleteFileSchema.parse(body);

    await deleteAppFile(fileId);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
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

    const dbError = new DatabaseError("Failed to delete file");
    return NextResponse.json(
      {
        success: false,
        error: dbError.userMessage,
      },
      { status: dbError.statusCode },
    );
  }
});
