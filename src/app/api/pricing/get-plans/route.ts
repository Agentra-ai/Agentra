import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/drizzle";
import { pricingPlans } from "@/drizzle/schema";
import { DatabaseError } from "@/lib/errors/errors";

export const GET = auth(async () => {
  try {
    const data = await db.select().from(pricingPlans);

    return NextResponse.json(
      {
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get pricing plans",
        databaseError: new DatabaseError(),
      },
      { status: 500 },
    );
  }
});
