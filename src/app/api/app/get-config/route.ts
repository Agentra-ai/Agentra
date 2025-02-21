import { getAppConfigDetails } from "@/actions/app/app-config-action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get("appId");

  if (!appId) {
    return NextResponse.json({ error: "App ID is required" }, { status: 400 });
  }

  const appConfig = await getAppConfigDetails(appId);


  return NextResponse.json(appConfig);
}