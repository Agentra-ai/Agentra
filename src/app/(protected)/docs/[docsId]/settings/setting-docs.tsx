"use client";
import React, { useState } from "react";
import {
  Settings,
  FileText,
  Lock,
  Database,
  Save,
  Search,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  useUpdateAppDocument,
  useAppDocument,
} from "@/app/services/app-docs/app-docs-service";
import { useToast } from "@/hooks/use-toast";

const DocsSetting: React.FC = () => {
  const [knowledgeName, setKnowledgeName] = useState("");
  const [knowledgeDescription, setKnowledgeDescription] = useState("");
  const [permission, setPermission] = useState("Only me");
  const [topK, setTopK] = useState(2);
  const { toast } = useToast();
  const pathname = usePathname();
  const documentId = pathname?.split("/")[2] || "";

  const { document, isLoading } = useAppDocument(documentId);

  React.useEffect(() => {
    if (document) {
      setKnowledgeName(document.name);
      setKnowledgeDescription(document.description);
    }
  }, [document]);

  const { updateAppDocument, isLoading: updateLoading } =
    useUpdateAppDocument();

  const handleUpdateDocs = async () => {
    const data = {
      name: knowledgeName,
      description: knowledgeDescription,
      icon: document?.icon,
    };
    try {
      if (document?.id) {
        await updateAppDocument(document.id, {
          ...data,
          icon: document?.icon || "",
        });
        toast({
          title: "Success",
          description: "Document updated successfully",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-xl bg-white p-10 pt-4">
      <div className="flex items-center gap-2 border-b pb-5">
        <Settings className="h-7 w-7 text-black" />
        <h1 className="text-xl font-bold text-gray-800">Documents Settings</h1>
      </div>

      {/* Knowledge Name */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2.5 font-semibold text-gray-700">
          <FileText className="h-5 w-5 text-emerald-500" />
          Documents Name
        </label>
        <input
          type="text"
          value={knowledgeName}
          onChange={(e) => setKnowledgeName(e.target.value)}
          className="rounded-lg border-0 bg-gray-50 p-3.5 text-[13px] placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      {/* Knowledge Description */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2.5 font-semibold text-gray-700">
          <FileText className="h-5 w-5 text-orange-500" />
          Documents Description
        </label>
        <textarea
          value={knowledgeDescription}
          onChange={(e) => setKnowledgeDescription(e.target.value)}
          className="min-h-[100px] rounded-lg border-0 bg-gray-50 p-3.5 text-[13px] placeholder:text-gray-400 focus:outline-none"
          rows={3}
        />
      </div>

      {/* Permissions */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2.5 font-semibold text-gray-700">
          <Lock className="h-5 w-5 text-purple-500" />
          Permissions
        </label>
        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          className="rounded-lg border-0 bg-gray-50 p-3.5 text-[13px] focus:outline-none"
        >
          <option>Only me</option>
          <option>Everyone</option>
        </select>
      </div>

      {/* Index Method */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2.5 font-semibold text-gray-700">
          <Database className="h-5 w-5 text-blue-500" />
          Index Method
        </label>
        <div className="w-full">
          <div className="rounded-lg border border-blue-500 bg-blue-50/50 p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h4 className="font-semibold text-gray-800">High Quality</h4>
            </div>
            <p className="text-[13px] text-gray-600">
              Call Embedding model for processing to provide higher accuracy
              when users query.
            </p>
            <p className="mt-2 text-[13px] italic text-gray-400">
              No other indexing methods available at the moment
            </p>
          </div>
        </div>
      </div>

      {/* Retrieval Setting */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2.5 font-semibold text-gray-700">
          <Search className="h-5 w-5 text-rose-500" />
          Retrieval Setting
        </label>
        <div className="flex flex-col rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h4 className="mb-2 font-semibold text-gray-800">Inverted Index</h4>
          <p className="mb-4 text-[13px] text-gray-600">
            Inverted Index is a structure used for efficient retrieval.
            Organized by terms, each term points to documents or web pages
            containing it.
          </p>
          <div className="flex items-center gap-5">
            <label className="min-w-[50px] text-[13px] font-medium text-gray-700">
              Top K
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="flex-1 border-none accent-[#1a55ff]"
            />
            <span className="w-8 text-center text-[13px] font-medium text-gray-600">
              {topK}
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={() => handleUpdateDocs()}
        className="gap-2 self-end"
        variant="blue"
        disabled={updateLoading}
      >
        <Save className="h-4 w-4" />
        <span className="text-[13px] font-medium">
          {updateLoading ? "updating..." : "save changes"}
        </span>
      </Button>
    </div>
  );
};

export default DocsSetting;
