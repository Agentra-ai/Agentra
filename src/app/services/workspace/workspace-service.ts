import useSWR from "swr"

import { App, Workspace } from "@/lib/db/schema"

export function useWorkspaceApps() {
  const { data, error, isValidating } = useSWR<{ data: App[] }>(
    "/api/app/get-apps"
  )

  // If the API returns `undefined`, fallback to an empty array
  const workspaceDetails = data?.data || []

  return { workspaceDetails, error, isLoading: isValidating && !data }
}
