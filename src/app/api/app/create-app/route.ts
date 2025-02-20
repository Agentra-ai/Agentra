import { createApp } from "@/actions/app/app-action"
import { z, ZodError } from "zod"
import { DatabaseError, ValidationError } from "@/lib/errors/errors"

const appSchema = z.object({
  description: z.string().default(""),
  icon: z.string().default(""),
  tags: z.array(z.string()),
  appType: z.string(),
  existingAppId: z.string().nullable().default(null),
  name: z.string(),
})

export async function POST(req: Request, res: Response): Promise<Response> {
  if (req.method !== "PUT" && req.method !== "POST") {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405,
      headers: { Allow: "PUT, POST" },
    })
  }

  try {
    const body = await req.json()
    const appDetails = appSchema.parse(body)
    console.log(appDetails)

    const AppId = await createApp(appDetails)
    return new Response(JSON.stringify({ message: "App updated successfully", appId: AppId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation error",
          validationError: new ValidationError(error.issues),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    } else {
      return new Response(
        JSON.stringify({
          error: "Failed to update app",
          databaseError: new DatabaseError(),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }
  }
}

export async function PUT(req: Request, res: Response): Promise<Response> {
  if (req.method !== "PUT" && req.method !== "POST") {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405,
      headers: { Allow: "PUT, POST" },
    })
  }

  try {
    const body = await req.json()
    const appDetails = appSchema.parse(body)
    console.log(appDetails)

    const AppId = await createApp(appDetails)
    return new Response(JSON.stringify({ message: "App updated successfully", appId: AppId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation error",
          validationError: new ValidationError(error.issues),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    } else {
      return new Response(
        JSON.stringify({
          error: "Failed to update app",
          databaseError: new DatabaseError(),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }
  }
}