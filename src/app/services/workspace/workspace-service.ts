import useSWR from "swr";

import { Workspace } from "@/drizzle/schema";

export function useWorkspaceApps() {
  const { data, error, isValidating } = useSWR<{ data: Workspace }>(
    "/api/workspace/workspace-details",
  );

  // If the API returns `undefined`, fallback to an empty array
  const workspaceDetails = data?.data || [];

  return { workspaceDetails, error, isLoading: isValidating && !data };
}
