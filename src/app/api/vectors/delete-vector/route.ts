import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteVectorByVectorId } from "@/actions/vectors/vectordb-action";
import { ZodError } from "zod";
import {
  DatabaseError,
  ValidationError,
  UnauthorizedError,
} from "@/lib/errors/errors";

export const DELETE = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const { searchParams } = new URL(req.url);
    const vectorId = searchParams.get("vectorId");

    if (!vectorId) {
      return NextResponse.json(
        {
          error: "Vector ID not provided",
        },
        { status: 400 },
      );
    }

    await deleteVectorByVectorId(vectorId);

    return NextResponse.json(
      {
        message: "Vector deleted successfully",
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
          error: "Failed to delete vector",
          databaseError: new DatabaseError(),
        },
        { status: 500 },
      );
    }
  }
});
