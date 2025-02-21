"use client";

import React from "react";
import { Inbox, Loader2, X } from "lucide-react"; // Import close icon
import { useDropzone } from "react-dropzone";

import { useToast } from "@/hooks/use-toast";

type FileUploadProps = {
  onFileSelected: (file: File | null) => void;
  setFileName: (fileName: string | null) => void;
  fileName: string | null;
};

const FileUpload = ({
  onFileSelected,
  fileName,
  setFileName,
}: FileUploadProps) => {
  const [uploading, setUploading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setFileName(fileName || null);
  }, [fileName, setFileName]);

  const handleRemoveFile = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the file input from opening
    setFileName(null);
    if (onFileSelected) {
      onFileSelected(null);
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    noClick: true, // disable default click behavior
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (onFileSelected && file) {
        onFileSelected(file);
      }
      if (!file) {
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        toast({
          title: "Error",
          description: "File size should be less than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setFileName(file.name); // Set the file name
    },
  });

  return (
    <div className="rounded-xl bg-white py-2">
      <div
        {...getRootProps({
          onClick: open, // trigger file selection on click
          className:
            "border rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <>
            {!fileName ? (
              <>
                <Inbox className="h-10 w-10 text-blue-600" />
                <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
              </>
            ) : (
              <div className="mt-2 flex flex-col items-center">
                <Inbox className="h-10 w-10 text-blue-600" />
                <div className="mt-2 flex items-center rounded-lg bg-[#f3f5f7] px-2 py-1">
                  <p className="text-sm text-slate-600">{fileName}</p>
                  <X
                    className="ml-2 h-4 w-4 cursor-pointer text-red-500"
                    onClick={handleRemoveFile}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
