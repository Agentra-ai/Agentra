import crypto from "node:crypto"

import { NextResponse } from "next/server"
import {
  processWebhookEvent,
  storeWebhookEvent,
} from "@/actions/subscription-action"

import { webhookHasMeta } from "@/lib/typeguards"

export async function POST(request: Request) {
  if (request.method === "POST") {
    // Original POST request handling code
    if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      return new Response("Lemon Squeezy Webhook Secret not set in .env", {
        status: 500,
      })
    }

    /* -------------------------------------------------------------------------- */
    /*             First, make sure the request is from Lemon Squeezy.            */
    /* -------------------------------------------------------------------------- */

    // Get the raw body content.
    const rawBody = await request.text()

    // Get the webhook secret from the environment variables.
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

    console.log("API webhook called in route.ts")
    // Get the signature from the request headers.
    const signature = Buffer.from(
      request.headers.get("X-Signature") ?? "",
      "hex"
    )

    // Create a HMAC-SHA256 hash of the raw body content using the secret and
    // compare it to the signature.
    const hmac = Buffer.from(
      crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
      "hex"
    )

    if (!crypto.timingSafeEqual(hmac, signature)) {
      return new Response("Invalid signature", { status: 400 })
    }

    /* -------------------------------------------------------------------------- */
    /*                                Valid request                               */
    /* -------------------------------------------------------------------------- */

    const data = JSON.parse(rawBody) as unknown

    // Type guard to check if the object has a 'meta' property.
    if (webhookHasMeta(data)) {
      const webhookEventId = await storeWebhookEvent(data.meta.event_name, data)

      if (!webhookEventId) {
        return new Response("Failed to store webhook event", { status: 500 })
      }

      await processWebhookEvent(webhookEventId)

      return new Response("OK", { status: 200 })
    }

    return new Response("Data invalid", { status: 400 })
  }

  return new Response("Method Not Allowed", { status: 405 })
}
