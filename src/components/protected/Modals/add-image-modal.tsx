import React, { useRef, useState } from "react";
import Image from "next/image";
import { emojisArray } from "@/store/constant";
import { Inbox, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";

interface AddImageModalProps {
  isOpen: boolean;
  onClose: (e?: React.MouseEvent) => void; // Update interface to accept event
  onSelect: (icon: string) => void;
  onFileSelect: (file: File) => void;
}

export default function AddImageModal({
  isOpen,
  onClose,
  onSelect,
  onFileSelect,
}: AddImageModalProps) {
  const [activeTab, setActiveTab] = useState<"emoji" | "upload">("emoji");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    setFile(null);
    onClose(e);
  };

  const handleDone = () => {
    if (activeTab === "upload" && file) {
      onFileSelect(file);
      setFile(null);
      onClose();
    } else if (activeTab === "emoji") {
      // Don't close modal on Done click for emoji tab
      // Let the emoji click handler handle the closing
    }
  };

  return (
    <Modal
      isShow={isOpen}
      onClose={onClose}
      wrapperClassName="bg-black/40 z-999"
    >
      <div className="flex h-[400px] w-[400px] flex-col rounded-md p-4">
        <nav className="mb-4 flex border-b">
          <button
            onClick={() => setActiveTab("emoji")}
            className={`mr-4 pb-2 ${activeTab === "emoji" ? "border- border-b-2" : ""}`}
          >
            Emoji
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-2 ${activeTab === "upload" ? "border-b-2 border-blue-500" : ""}`}
          >
            Upload
          </button>
        </nav>

        <div className="h-full flex-1">
          {activeTab === "emoji" && (
            <div className="grid h-[270px] grid-cols-6 gap-2 overflow-y-auto">
              {emojisArray.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSelect(emoji)}
                  className="rounded p-2 text-xl hover:bg-gray-100"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          {activeTab === "upload" && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelection}
                accept="image/*"
                className="hidden"
              />
              {!file ? (
                <div
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border bg-gray-50 py-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Inbox className="h-10 w-10 text-[#1a55ff]" />
                  <p className="mt-2 text-sm text-slate-400">Drop image Here</p>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Selected"
                    className="object-cover"
                    width={250}
                    height={250}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer buttons for both tabs */}
        <div className="mt-4 flex w-full gap-2">
          <Button
            onClick={handleCancel}
            variant="gray"
            className="flex-1 rounded border p-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDone}
            className="flex-1"
            disabled={activeTab === "upload" && !file}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// const emojisArray = [
//     "👍", "😀", "😘", "😍", "😆", "😜", "😅", "😂", "😱", "😃", "😄", "😁", "🤣", "🙂"
//   ];
