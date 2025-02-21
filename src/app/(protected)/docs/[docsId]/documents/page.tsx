"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { AppFileType } from "@/drizzle/schema";

import { Button } from "@/components/ui/button";
import LoadingIcon from "@/components/loading";
import Table from "@/components/table";
import { useAppFiles } from "@/app/services/app-docs/app-docs-service";

const Documents = () => {
  const [appFileData, setAppfileData] = React.useState<AppFileType[]>([]);

  const pathname = usePathname();
  const documentId = pathname?.split("/")[2] || "";

  const { appFiles, isLoading, error } = useAppFiles(documentId);

  React.useEffect(() => {
    if (appFiles && appFiles !== appFileData) {
      setAppfileData(appFiles);
    }
  }, [appFileData, appFiles]);

  const headers = [
    "",
    "FILE NAME",
    "WORDS",
    "RETRIEVAL COUNT",
    "UPLOAD TIME",
    "STATUS",
    "ACTION",
  ];

  return (
    <div className="w-full p-4 pt-2 text-sm">
      <h2 className="mb-2 border-b p-2 text-lg font-semibold">Documents</h2>
      <h2 className="px-2 text-gray-700">
        Here you can find all the files associated with the Knowledge base.
        These files can be linked to Agentra and indexed for easy retrieval and
        reference.
      </h2>
      <div className="my-2 flex justify-between">
        <div className="flex items-center space-x-2 p-2 pl-0 text-gray-600">
          <button className="rounded-[8px] bg-gray-100 px-4 py-2">
            Last 3 months
          </button>
          <button className="w-[200px] justify-start rounded-[8px] bg-gray-100 px-4 py-2">
            Search
          </button>
          <button className="rounded-[8px] bg-gray-100 px-4 py-2">
            Last 3 months
          </button>
          <button className="rounded-[8px] bg-gray-100 px-4 py-2">
            by time
          </button>
        </div>
        <Button variant={"blue"} className="flex items-center gap-1">
          <Plus size={20} /> add file
        </Button>
      </div>

      {!isLoading && (
        <Table
          headers={headers}
          documentData={appFileData}
          documentId={documentId}
        />
      )}

      {isLoading && (
        <div className="flex h-full items-center justify-center">
          <LoadingIcon />
        </div>
      )}
      {error && <p>Error loading documents: {error.message}</p>}
    </div>
  );
};

export default Documents;
