import { useState } from "react"
import useSWR, { mutate } from "swr"
import useSWRMutation from "swr/mutation"

import { AppDocumentType, AppFileType } from "@/db/schema"
import axiosInstance from "@/config/axios-instance"

export function useAppDocs() {
  const { data, error, isValidating } = useSWR<{ data: AppDocumentType[] }>(
    "/api/app-docs/get-docs",
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  )
  const appDocs = data?.data || []

  return { appDocs, error, isLoading: isValidating && !data}
}

export function useDeleteAppDocument() {
  const {
    trigger: deleteAppDocument,
    isMutating,
    error,
  } = useSWRMutation(
    "/api/app-docs/delete-docs",
    async (url, { arg: documentId }: { arg: AppDocumentType["id"] }) => {
      console.log("document ID:", documentId)
      await axiosInstance.delete(url, {
        data: { documentId }, // The data to send with the DELETE request
        // withCredentials: true, // Include credentials
      })

      mutate("/api/app-docs/get-docs")
    },
    {
      onError: (error) => {
        console.log(error)
      },
      onSuccess(data, key) {
        console.log("Data:", data)
        console.log("Key:", key)
      },
    }
  )
  return { deleteAppDocument, isLoading: isMutating, error }
}

export function useAppFiles(documentId: string) {
  const { data, error, isValidating } = useSWR<{ data: AppFileType[] }>(
    `/api/app-docs/get-files?documentId=${documentId}`
  )
  const appFiles = data?.data || []

  return { appFiles, error, isLoading: isValidating && !data }
}

export function useDeleteAppFile(documentId: string) {
  const {
    trigger: deleteAppFile,
    isMutating,
    error,
  } = useSWRMutation(
    "/api/app-docs/delete-files",
    async (url, { arg: fileId }: { arg: AppFileType["id"] }) => {
      console.log("file ID:", fileId)
      await axiosInstance.delete(url, { data: { fileId } })
      mutate(`/api/app-docs/get-files?documentId=${documentId}`)
    },
    {
      onError: (error) => {
        console.log(error)
      },
      onSuccess(data, key) {
        console.log("Data:", data)
        console.log("Key:", key)
      },
    }
  )

  return { deleteAppFile, isLoading: isMutating, error }
}

export function useUpdateAppDocument() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateAppDocument = async (
    documentId: string,
    data: { name: string; description: string; icon: string }
  ) => {
    setIsLoading(true)
    setError(null)
    console.log(
      "documentId in update-doc API",
      documentId,
      data.name,
      data.description,
      data.icon
    )
    try {
      const response = await fetch(`/api/app-docs/update-docs`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          name: data.name,
          description: data.description,
          icon: data.icon,
        }),
      })
      const responseData = await response.json()

      if (response.ok) {
        mutate("/api/app-docs/get-docs")
      } else {
        throw new Error(responseData.message || "Failed to update document")
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return { updateAppDocument, isLoading, error }
}


export function useDocsHubData() {
  const { data, error, isValidating } = useSWR<{ data: AppDocumentType[] }>(
    "/api/app-docs/get-docshub",
  )
  // If the API returns `undefined`, fallback to an empty array
  const DocsHubData = data?.data || []

  console.log(DocsHubData)

  return { DocsHubData, error, isLoading: isValidating && !data }
}