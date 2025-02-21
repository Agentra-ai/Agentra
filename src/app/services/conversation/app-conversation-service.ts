import useSWR from "swr";
import { ConversationType, MessagesType } from "@/drizzle/schema";
import fetcher from "../fetcher";

interface ConversationWithCount extends ConversationType {
  messageCount: number;
}

// Define the pagination metadata
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Define the API response schema
export interface ApiResponse {
  data: ConversationWithCount[];
  pagination: Pagination;
}

export const useFetchAppConversations = (
  appId: string,
  page: number = 1, // Default to page 1
  limit: number = 10, // Default to 10 conversations per page
) => {
  const { data, error, isValidating, mutate } = useSWR<ApiResponse>(
    `/api/conversation/get-conversation?appId=${appId}&page=${page}&limit=${limit}`,
    fetcher,
  );

  // Sort conversations by createdAt date (newest first)
  if (data?.data) {
    data.data.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  // Manual fetch function
  const fetchAppConversations = async (newPage: number, newLimit: number) => {
    const url = `/api/conversation/get-conversation?appId=${appId}&page=${newPage}&limit=${newLimit}`;
    const response = await fetcher(url);
    mutate(response, false); // Update the SWR cache without revalidating
  };

  return {
    appConversations: data?.data || [],
    totalConversations: data?.pagination.total || 0,
    totalPages: data?.pagination.totalPages || 1,
    error,
    isLoading: isValidating && !data,
    fetchAppConversations, // Expose the manual fetch function
  };
};

export default useFetchAppConversations;

export const useConversationMessages = (conversationId: string) => {
  const { data, error, isLoading } = useSWR<{ data: MessagesType[] }>(
    `/api/conversation/get-messages?conversationId=${conversationId}`,
    fetcher,
  );

  return {
    messages: data?.data || [],
    isLoading: isLoading && !data,
    isError: error,
  };
};
