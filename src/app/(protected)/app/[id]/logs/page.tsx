"use client";

import React from "react";
import { redirect, usePathname } from "next/navigation";
import dayjs from "dayjs";
import { RiArrowLeftFill, RiArrowRightFill } from "react-icons/ri";
import { ConversationType } from "@/drizzle/schema";
import { Button } from "@/components/ui/button";
import LoadingIcon from "@/components/loading";
import useFetchAppConversations from "@/app/services/conversation/app-conversation-service";
import { LogDrawer } from "./log-drawer";
import { TbMessage } from "react-icons/tb";

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

  const [open, setOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<ConversationType | null>(
    null,
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const logsPerPage = 10;

  const { appConversations, totalConversations, totalPages, error, isLoading } =
    useFetchAppConversations(appId, currentPage, logsPerPage);

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

  return (
    <div className="min-h-screen w-full p-6 pt-4 text-[13px]">
      {/* Header Section */}
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Logs</h2>
        <p className="mt-2 text-gray-600">
          The logs record the running status of the application, including user
          inputs and AI replies.
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-3 flex flex-wrap gap-3">
        <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100">
          Last 3 months
        </button>
        <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100">
          Search
        </button>
        <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100">
          By Time
        </button>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
          Error: {error.message}
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Title
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                End User or Account
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Message Count
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                User Rate
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Op. Rate
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Updated Time
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
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
            ) : appConversations.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <TbMessage className="h-12 w-12 text-gray-300" />
                    <p className="text-lg text-gray-500">
                      No conversations found
                    </p>
                    <p className="text-gray-400">
                      Start a conversation to see it appear here
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              appConversations.map((log, index) => (
                <tr
                  key={index}
                  className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
                  onClick={() => {
                    setSelectedLog(log);
                    setOpen(true);
                  }}
                >
                  <td className="flex items-center px-6 py-2">
                    <span className="mr-3 h-2 w-2 rounded-full bg-blue-500"></span>
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

      {/* Pagination Section - Only show if there are conversations */}
      {
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
      }

      {/* Log Drawer */}
      <LogDrawer open={open} onOpenChange={setOpen} selectedLog={selectedLog} />
    </div>
  );
};

export default LogsHistory;
