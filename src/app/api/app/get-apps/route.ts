import { getWorkspaceApps } from "@/actions/app/app-action";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export const GET = auth(async (req) => {
  if (!req.auth) {
    console.log(req.auth);
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  console.log("get-apps Called");

  const workspaceApps = await getWorkspaceApps();
  return NextResponse.json({
    workspaceApps,
  });
});
