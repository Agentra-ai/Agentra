import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ZodError } from "zod";
import {
  DatabaseError,
  ValidationError,
  UnauthorizedError,
} from "@/lib/errors/errors";
import {
  getAppMonitoring,
  getPastDaysData,
} from "@/actions/monitoring/monitoring-action";

export const GET = auth(async (req) => {
  if (!req.auth) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    // Get query parameters from URL
    const url = new URL(req.url);
    const appId = url.searchParams.get("appId");
    const days = url.searchParams.get("days");

    if (!appId) {
      return NextResponse.json(
        { error: "Please provide a valid appId" },
        { status: 400 },
      );
    }

    const data = await getAppMonitoring(appId);
    console.log("data", data);

    const chartData = await getPastDaysData(appId, Number(days) || 1);
    console.log("chartData", chartData);

    return NextResponse.json(
      {
        data: {
          totalConversationCount: Number(data.data.conversationCount),
          totalMessageCount: Number(data.data.totalMessageCount),
          totalUsedToken: Number(data.data.totalUsedToken),
          completionToken: Number(data.data.completionToken),
          promptToken: Number(data.data.promptToken),
          messageTimestamp: Number(data.data.timestamp),
          chartData,
        },
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
          error: "Failed to get Monitoring details",
          databaseError: new DatabaseError(),
        },
        { status: 500 },
      );
    }
  }
});
