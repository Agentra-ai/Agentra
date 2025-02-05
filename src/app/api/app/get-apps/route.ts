// app/api/app/get-apps/route.ts
import { getWorkspaceApps } from "@/actions/app/app-action";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Replace this with your actual data-fetching logic.
    const apps = await getWorkspaceApps(); // Your function to retrieve apps
    return NextResponse.json({ data: apps });
  } catch (error) {
    console.error("Error fetching apps:", error);
    return NextResponse.json(
      { error: "Failed to fetch apps" },
      { status: 500 }
    );
  }
}
