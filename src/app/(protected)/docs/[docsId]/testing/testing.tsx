"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Clock, FileText, Search, Send } from "lucide-react";
import { FaFileLines } from "react-icons/fa6";
import { toast } from "sonner";

import { truncateString } from "@/lib/helpers";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import Modal from "@/components/modal";
import { useAppFiles } from "@/app/services/app-docs/app-docs-service";
import {
  MatchVectorResponse,
  useGetDocsQueryResults,
} from "@/app/services/vectors/vector-service";
import ShowVectorModal from "@/components/protected/Modals/show-vector-modal";

interface RecentSearch {
  text: string;
  time: string;
}

interface RetrievalParagraph {
  content: string;
  source: string;
}

const RetrievalTesting: React.FC = () => {
  const [sourceText, setSourceText] = useState("");
  const [topK, setTopK] = useState<string>("3");
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] =
    useState<MatchVectorResponse | null>(null);

  const pathname = usePathname();
  const documentId = pathname?.split("/")[2] || "";

  const { appFiles } = useAppFiles(documentId);
  const fileKeyArray = appFiles.map((file) => ({
    fileKey: file.fileKey,
    isActive: file.isActive,
  }));

  const { getDocsQueryResults, vectorResult, isLoading, error } =
    useGetDocsQueryResults();

  console.log(vectorResult);

  const handleTesting = () => {
    const trimmedText = sourceText.trim();
    if (trimmedText.length === 0) {
      toast.error("Please enter some text to search");
      return;
    }

    try {
      getDocsQueryResults({
        queryText: trimmedText,
        fileKeys: fileKeyArray,
        topKvalue: topK,
      });
    } catch (error) {
      console.error("Error in testing", error);
      toast.error("Something went wrong while fetching results");
    }
  };

  const getFileNameByFileKey = (fileKey: string) => {
    const file = appFiles.find((file) => file.fileKey === fileKey);
    return file?.name || "";
  };

  const handleOpenModal = (data: MatchVectorResponse) => {
    setSelectedResult(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedResult(null);
  };

  return (
    <div className="flex h-[calc(100vh-60px)] gap-4 bg-[#f3f5f7] p-4">
      {/* Left Section */}
      <div className="flex h-full max-w-xl flex-1 flex-col gap-6">
        {/* Retrieval Testing Box */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-semibold text-gray-700">
                <Search className="h-4 w-4" />
                Source text
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Top-K:</span>
                  <Select value={topK} onValueChange={setTopK}>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <TextArea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter your query here..."
              maxLength={300}
              rows={5}
              className="h-50 h-40 w-full resize-none rounded-[8px] border-blue-500 bg-gray-50 px-4 py-4 pr-16 text-[14px] text-gray-800 ring-1 focus:ring-1 focus:ring-blue-700"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                {sourceText.length} / 300 characters
              </span>
              <Button
                onClick={handleTesting}
                variant="blue"
                className="items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Query Search"}
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Searches - with overflow */}
        <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h4 className="text-md mb-4 flex items-center gap-2 font-semibold text-gray-700">
            <Clock className="h-5 w-5" />
            Recent Searches (Not saving as of now)
          </h4>
          <ul className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 divide-y divide-gray-100 overflow-y-auto">
            {recentSearches.map((search, index) => (
              <li
                key={index}
                className="flex cursor-pointer justify-between px-2 py-3 transition-colors hover:bg-gray-50"
              >
                <span className="flex items-center gap-2 text-[14px]">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  {search.text}
                </span>
                <span className="text-xs text-gray-500">{search.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Section - Retrieval Paragraphs with overflow */}
      <div className="flex h-full flex-1 flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h4 className="mb-4 flex shrink-0 items-center gap-2 text-lg font-semibold text-gray-700">
          <FileText className="h-5 w-5" />
          Retrieval Results
        </h4>
        <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 space-y-4 overflow-y-auto pr-2">
          {!vectorResult || vectorResult.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 animate-spin" />
                  <span className="text-gray-500">Loading...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <FileText className="h-5 w-5" />
                  <span>No results found</span>
                </div>
              )}
            </div>
          ) : (
            vectorResult.map(
              (paragraph: MatchVectorResponse, index: number) => (
                <div
                  key={index}
                  className="group cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 text-[14px] transition-colors hover:bg-white hover:shadow-md"
                  onClick={() => handleOpenModal(paragraph)}
                >
                  <p className="whitespace-pre-wrap break-words leading-relaxed text-gray-700">
                    {truncateString(paragraph.metadata.text, 400)}
                  </p>
                  <div className="mt-3 flex w-full items-center gap-2 rounded-lg bg-orange-50 p-2 text-[13px] transition-colors group-hover:bg-orange-50">
                    <FaFileLines className="h-4 w-4" fill="#1155ff" />
                    <span className="font-medium text-black">
                      {getFileNameByFileKey(paragraph.metadata.file_key)}
                    </span>
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </div>
      <ShowVectorModal
        selectedResult={selectedResult}
        onClose={handleCloseModal}
        getFileNameByFileKey={getFileNameByFileKey}
      />
    </div>
  );
};

export default RetrievalTesting;
