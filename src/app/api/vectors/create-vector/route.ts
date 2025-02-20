import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { z, ZodError } from "zod";
import {
  addVectorDataInPG,
  updateVectorDataByVectorId,
} from "@/actions/vectors/vectordb-action";
import {
  DatabaseError,
  ValidationError,
  UnauthorizedError,
} from "@/lib/errors/errors";

const createVectorSchema = z.object({
  vectorId: z.string(),
  fileId: z.string(),
  content: z.string(),
  fileKey: z.string(),
  chunkSize: z.number().optional(),
  chunkOverlap: z.number().optional(),
});

export const POST = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const body = await req.json();
    console.log("Received request body:", body); // Debug log

    const validation = createVectorSchema.safeParse(body);
    if (!validation.success) {
      console.log("Validation errors:", validation.error.issues); // Debug log
      return NextResponse.json(
        {
          error: "Validation error",
          validationError: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const { vectorId, fileId, content, fileKey, chunkSize, chunkOverlap } =
      validation.data;

    // First update vector data
    await updateVectorDataByVectorId(
      vectorId,
      fileKey,
      content,
      true,
      chunkSize,
      chunkOverlap,
    );

    // Then add to PostgreSQL
    await addVectorDataInPG(vectorId, fileId, content);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in create-vector route:", error); // Debug log
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          validationError: new ValidationError(error.issues),
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error: "Failed to create vector",
        databaseError: new DatabaseError(),
      },
      { status: 500 },
    );
  }
});
