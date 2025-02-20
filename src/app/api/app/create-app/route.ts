import { createApp } from "@/actions/app/app-action";
import { z, ZodError } from "zod";
import { DatabaseError, ValidationError } from "@/lib/errors/errors";
import { auth } from "@/auth";

const appSchema = z.object({
  description: z.string().default(""),
  icon: z.string().default(""),
  tags: z.array(z.string()),
  appType: z.string(),
  existingAppId: z.string().nullable().default(null),
  name: z.string(),
});

export const POST = auth(async (req) => {
  if (!req.auth) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const appDetails = appSchema.parse(body);
    const AppId = await createApp(appDetails);

    return Response.json({ message: "App updated successfully", appId: AppId });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          error: "Validation error",
          validationError: new ValidationError(error.issues),
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          error: "Failed to update app",
          databaseError: new DatabaseError(),
        },
        { status: 500 },
      );
    }
  }
});

export const PUT = auth(async (req) => {
  if (!req.auth) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const appDetails = appSchema.parse(body);
    const AppId = await createApp(appDetails);

    return Response.json({ message: "App updated successfully", appId: AppId });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          error: "Validation error",
          validationError: new ValidationError(error.issues),
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          error: "Failed to update app",
          databaseError: new DatabaseError(),
        },
        { status: 500 },
      );
    }
  }
});
