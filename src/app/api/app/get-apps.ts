import type { NextApiRequest, NextApiResponse } from "next"
import { getWorkspaceApps } from "@/actions/app/app-action"

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const workspaceApps = await getWorkspaceApps()
  res.status(200).json(workspaceApps)
}
