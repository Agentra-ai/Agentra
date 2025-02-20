import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { z, ZodError } from "zod";
import {
  DatabaseError,
  ValidationError,
  UnauthorizedError,
} from "@/lib/errors/errors";
import { getContextAction } from "@/actions/context-action";

const querySchema = z.object({
  queryText: z.string(),
  fileKeys: z.array(
    z.object({
      fileKey: z.string(),
      isActive: z.boolean(),
    }),
  ),
  topKvalue: z.preprocess((val) => Number(val), z.number()),
});

export const POST = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const body = await req.json();
    const { queryText, fileKeys, topKvalue } = querySchema.parse(body);
    console.log("vectorId in get-vector API", queryText, topKvalue, fileKeys);

    const vectorData = await getContextAction(queryText, fileKeys, topKvalue);
    console.log("vectorData in get-vector API", vectorData);

    return NextResponse.json(
      {
        data: vectorData,
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
          error: "Failed to get vector data",
          databaseError: new DatabaseError(),
        },
        { status: 500 },
      );
    }
  }
});
