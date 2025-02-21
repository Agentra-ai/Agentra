import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  updateVectorDataByVectorId,
  updateVectorDataInPG,
} from "@/actions/vectors/vectordb-action";
import { z, ZodError } from "zod";
import {
  DatabaseError,
  ValidationError,
  UnauthorizedError,
} from "@/lib/errors/errors";

const updateVectorSchema = z.object({
  vectorId: z.string(),
  content: z.string(),
  fileKey: z.string(),
  isActive: z.boolean(),
  chunkSize: z.number().optional(),
  chunkOverlap: z.number().optional(),
});

export const PUT = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const body = await req.json();
    const parsedBody = updateVectorSchema.parse(body);
    const { vectorId, content, fileKey, isActive, chunkSize, chunkOverlap } =
      parsedBody;

    await updateVectorDataByVectorId(
      vectorId,
      fileKey,
      content,
      isActive,
      chunkSize,
      chunkOverlap,
    );
    await updateVectorDataInPG(vectorId, content);
    return NextResponse.json(
      {
        message: "Vector updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          validationError: new ValidationError(error.issues),
        },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        {
          error: "Failed to update vector",
          databaseError: new DatabaseError(),
        },
        { status: 500 },
      );
    }
  }
});
