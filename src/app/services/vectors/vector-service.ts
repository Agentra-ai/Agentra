import { AppFileType, TypeVectorDBData } from "@/drizzle/schema";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import fetcher from "../fetcher";

const useDeleteVectorById = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const deleteVectorById = async (vectorId: string, fileId: string) => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(false);

    try {
      const response = await fetch(
        `/api/vectors/delete-vector?vectorId=${vectorId}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();

      if (response.ok) {
        setDeleteSuccess(data.success);
        mutate(`/api/vectors/get-vectors-by-file-id?fileId=${fileId}`);
      } else {
        throw new Error(data.message || "Failed to delete vector");
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteVectorById, deleteSuccess, isLoading, error };
};

export default useDeleteVectorById;

export const useUpdateVectorById = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const updateVectorById = async (
    vectorId: string,
    fileId: string,
    fileKey: string,
    content: string,
    isActive: boolean,
    chunkSize: number | undefined,
    chunkOverlap: number | undefined,
  ) => {
    setIsLoading(true);
    setError(null);
    setUpdateSuccess(false);
    console.log(
      "vectorId in update-vector API",
      vectorId,
      content,
      fileKey,
      chunkSize,
      chunkOverlap,
    );
    try {
      const response = await fetch(`/api/vectors/update-vector`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vectorId,
          fileKey,
          content,
          isActive,
          chunkSize,
          chunkOverlap,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setUpdateSuccess(data.success);
        mutate(`/api/vectors/get-vectors-by-file-id?fileId=${fileId}`);
      } else {
        throw new Error(data.message || "Failed to update vector");
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateVectorById, updateSuccess, isLoading, error };
};

export const useAddVector = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const addVector = async (
    vectorId: string,
    fileId: string,
    content: string,
    fileKey: string,
    isActive: boolean, // make isActive required
    chunkSize?: number,
    chunkOverlap?: number,
  ) => {
    setIsLoading(true);
    setError(null);
    setAddSuccess(false);

    console.log("Adding vector with params:", {
      vectorId,
      fileId,
      content,
      fileKey,
      isActive,
      chunkSize,
      chunkOverlap,
    });

    try {
      const response = await fetch("/api/vectors/create-vector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vectorId,
          fileId,
          content,
          fileKey,
          isActive,
          chunkSize,
          chunkOverlap,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setAddSuccess(data.success);
        mutate(`/api/vectors/get-vectors-by-file-id?fileId=${fileId}`);
      } else {
        throw new Error(data.message || "Failed to create vector");
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { addVector, addSuccess, isLoading, error };
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [vectorResult, setVectorResult] = useState<MatchVectorResponse[]>([]);

  const getDocsQueryResults = async ({
    queryText,
    fileKeys,
    topKvalue,
  }: {
    queryText: string;
    fileKeys: { fileKey: string; isActive: boolean }[];
    topKvalue: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setVectorResult([]);

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
      });
      const data = await response.json();

      if (response.ok) {
        setVectorResult(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch docs");
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getDocsQueryResults,
    vectorResult,
    isLoading: isLoading,
    error,
  };
};

export const useVectorsByFileId = (fileId: string) => {
  const { data, error } = useSWR<{ data: TypeVectorDBData[] }>(
    `/api/vectors/get-vectors-by-file-id?fileId=${fileId}`,
  );
  return {
    vectors: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useFileDetails = (fileId: string) => {
  const { data, error } = useSWR<{ data: AppFileType }>(
    `/api/vectors/get-file-details?fileId=${fileId}`,
  );

  return {
    fileDetails: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
};
