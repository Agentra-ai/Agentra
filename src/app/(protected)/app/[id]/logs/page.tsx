"use client";

import React from "react";
import { redirect, usePathname } from "next/navigation";
import dayjs from "dayjs";
import { RiArrowLeftFill, RiArrowRightFill } from "react-icons/ri";
import { ConversationType } from "@/db/schema";
import { Button } from "@/components/ui/button";
import LoadingIcon from "@/components/loading";
import useGetAppConversation from "@/app/services/conversation/app-conversation-service";
import { LogDrawer } from "./log-drawer";

const getAppId = (pathname: string | null) => {
  const id = pathname?.split("/")[2];
  if (!id) {
    redirect("apps/studio");
  }
  return id;
};

const LogsHistory = ({ params }: { params?: { id: string } }) => {
  const pathname = usePathname();
  const appId = React.useMemo(() => getAppId(pathname), [pathname]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const logsPerPage = 10;

  const {
    appConversations,
    totalConversations,
    totalPages,
    error,
    isLoading,
  } = useGetAppConversation(appId, currentPage, logsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const [open, setOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<ConversationType | null>(
    null
  );

  return (
    <div className="w-full p-6 pt-4 min-h-screen text-[13px]">
      {/* Header Section */}
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Logs</h2>
        <p className="text-gray-600 mt-2">
          The logs record the running status of the application, including user
          inputs and AI replies.
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-3 mb-3">
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          Last 3 months
        </button>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          Search
        </button>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          By Time
        </button>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 mb-6">
          Error: {error.message}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">
                Title
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">
                End User or Account
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">
                Message Count
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">
                User Rate
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">
                Op. Rate
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">
                Updated Time
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">
                Created Time
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center">
                  <LoadingIcon />
                </td>
              </tr>
            ) : (
              appConversations.map((log, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedLog(log);
                    setOpen(true);
                  }}
                >
                  <td className="px-6 py-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {log.name}
                  </td>
                  <td className="px-6 py-2 text-gray-700">{log.userId}</td>
                  <td className="px-6 py-2 text-gray-700">
                    {log.messageCount}
                  </td>
                  <td className="px-6 py-2 text-gray-700">N/A</td>
                  <td className="px-6 py-2 text-gray-700">N/A</td>
                  <td className="px-6 py-2 text-gray-700">
                    {dayjs(log.createdAt).format("MM/DD/YYYY hh:mm A")}
                  </td>
                  <td className="px-6 py-2 text-gray-700">
                    {dayjs(log.createdAt).format("MM/DD/YYYY hh:mm A")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-gray-600">
          Showing {(currentPage - 1) * logsPerPage + 1} to{" "}
          {Math.min(currentPage * logsPerPage, totalConversations)} of{" "}
          {totalConversations} entries
        </div>
        <div className="flex gap-2">
          <Button
            variant="gray"
            className="flex items-center gap-2"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <RiArrowLeftFill />
            Previous
          </Button>
          <Button
            variant="blue"
            className="flex items-center gap-2"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <RiArrowRightFill />
          </Button>
        </div>
      </div>

      {/* Log Drawer */}
      <LogDrawer open={open} onOpenChange={setOpen} selectedLog={selectedLog} />
    </div>
  );
};

export default LogsHistory;