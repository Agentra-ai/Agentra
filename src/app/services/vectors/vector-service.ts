import { useState } from "react"

const useDeleteVectorById = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const deleteVectorById = async (vectorId: string) => {
    setIsLoading(true)
    setError(null)
    setDeleteSuccess(false)

    try {
      const response = await fetch(
        `/api/vectors/delete-vector?vectorId=${vectorId}`,
        {
          method: "DELETE",
        }
      )
      const data = await response.json()

      if (response.ok) {
        setDeleteSuccess(data.success)
      } else {
        throw new Error(data.message || "Failed to delete vector")
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteVectorById, deleteSuccess, isLoading, error }
}

export default useDeleteVectorById

export const useUpdateVectorById = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const updateVectorById = async (
    vectorId: string,
    fileKey: string,
    content: string,
    isActive: boolean,
    chunkSize: number | undefined,
    chunkOverlap: number  | undefined
  ) => {
    setIsLoading(true)
    setError(null)
    setUpdateSuccess(false)
    console.log("vectorId in update-vector API", vectorId, content, fileKey,chunkSize,chunkOverlap)
    try {
      const response = await fetch(`/api/vectors/update-vector`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vectorId, fileKey, content, isActive, chunkSize,chunkOverlap }),
      })
      const data = await response.json()

      if (response.ok) {
        setUpdateSuccess(data.success)
      } else {
        throw new Error(data.message || "Failed to update vector")
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return { updateVectorById, updateSuccess, isLoading , error }
}

export type MatchVectorResponse = {
    id: string;
    score: number;
    values: any[];
    sparseValues?: any;
    metadata: {
        file_key: string;
        isActive: boolean;
        pageNumber: number;
        text: string;
    };
};

export const useGetDocsQueryResults = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [vectorResult, setVectorResult] = useState<MatchVectorResponse[]>([])

  const getDocsQueryResults = async ({
    queryText,
    fileKeys,
    topKvalue,
  }: {
    queryText: string
    fileKeys: { fileKey: string; isActive: boolean }[]
    topKvalue: string
  }) => {
    setIsLoading(true)
    setError(null)
    setVectorResult([])

    try {
      const response: Response = await fetch(`/api/vectors/get-vector-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queryText,
          fileKeys,
          topKvalue: Number(topKvalue),
        }),
      })
      const data = await response.json()

      if (response.ok) {
        setVectorResult(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch docs")
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return { getDocsQueryResults, vectorResult, isLoading : isLoading && !vectorResult, error }
}