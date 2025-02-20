import useSWR from "swr";
import fetcher from "../fetcher";

export function useAppConfig(appId: string) {

  const { data, error, isLoading, mutate } = useSWR(
    `/api/app/get-config?appId=${appId}`,
    fetcher
  );

  async function updateConfig(newConfig: any) {
    const response = await fetch(`/api/app/update-config?appId=${appId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newConfig),
    });
    if (!response.ok) {
      throw new Error("Failed to update configuration");
    }
    const updatedData = await response.json();
    mutate(updatedData, false);
    return updatedData;
  }

  return {
    config: data,
    isLoading,
    error,
    updateConfig,
  };
}
