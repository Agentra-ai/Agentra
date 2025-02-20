import { updateAppConfig } from "@/actions/app/app-config-action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get("appId");
  const requestBody = await request.json();

  console.log('update config API body',requestBody);

  if (!appId) {
    return NextResponse.json({ error: "App ID is required" }, { status: 400 });
  }

  await updateAppConfig(appId, requestBody);

  return NextResponse.json({ success: true }, { status: 200 });
}
