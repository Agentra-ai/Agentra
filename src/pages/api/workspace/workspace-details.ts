import type { NextApiRequest, NextApiResponse } from "next"
import { getWorkspaceApps } from "@/actions/app/app-action"
import { getWorkspaceDetails } from "@/actions/workspace-action"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const workspaceDetails = await getWorkspaceDetails()
  console.log(workspaceDetails)
  res.status(200).json(workspaceDetails)
}
