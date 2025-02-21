import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { App } from "@/drizzle/schema"; // Ensure this matches your actual type definition.
import { axiosInstance } from "@/app/services/fetcher";
import { useState, useEffect } from "react";
export function useWorkspaceApps() {
  const { data, error, isLoading } = useSWR(
    "/api/app/get-apps",
    async (url) => {
      const response = await axiosInstance.get(url);
      if (!response) {
        throw new Error("Failed to fetch apps");
      }
      return response.data.workspaceApps || [];
    },
  );

  return { workspaceApps: data, error, isLoading: isLoading && !data };
}

export function useDeleteApp() {
  const {
    trigger: deleteApp,
    isMutating,
    error,
  } = useSWRMutation(
    "/api/app/delete-app",
    async (url, { arg: appId }: { arg: App["id"] }) => {
      console.log("App ID:", appId);
      await axiosInstance.delete(url, { data: { appId } });
      mutate("/api/app/get-apps");
    },
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess(data, key) {
        console.log("Data:", data);
        console.log("Key:", key);
      },
    },
  );

  return { deleteApp, isLoading: isMutating, error };
}

export function useUpdateApp() {
  const {
    trigger: updateApp,
    isMutating,
    error,
  } = useSWRMutation(
    "/api/app/create-app",
    async (
      url,
      {
        arg: appDetails,
      }: {
        arg: {
          name: string;
          description: string;
          icon: string;
          tags: string[];
          appType: string;
          existingAppId: string | null;
        };
      },
    ) => {
      console.log("service app", appDetails);
      let res;
      if (appDetails.existingAppId) {
        res = await axiosInstance.put(url, appDetails);
      } else {
        res = await axiosInstance.post(url, appDetails);
      }
      // console.log(res.data)
      // mutate("/api/app/get-apps")
      return res.data as { appId: string; message: string };
    },
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess(data, key) {
        // console.log("App ID:", data.appId)
        console.log("Data:", data);
        console.log("Key:", key);
        mutate("/api/app/get-apps");
        // return res
      },
    },
  );

  return { updateApp, isLoading: isMutating, error };
}
