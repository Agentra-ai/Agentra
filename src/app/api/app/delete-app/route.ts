import { deleteApp } from "@/actions/app/app-action";
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
    const { appId } = await req.json();

    if (!appId) {
      throw new BadRequestError("App ID is required");
    }

    console.log(appId, "appId to delete");
    await deleteApp(appId);

    return NextResponse.json({
      success: true,
      message: "App deleted successfully",
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

    const dbError = new DatabaseError("Failed to delete app");
    return NextResponse.json(
      {
        success: false,
        error: dbError.userMessage,
      },
      { status: dbError.statusCode },
    );
  }
});
