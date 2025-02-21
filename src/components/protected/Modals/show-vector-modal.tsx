import React from "react";
import Modal from "@/components/modal";
import { TextArea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MatchVectorResponse } from "@/app/services/vectors/vector-service";
import { FaFileLines } from "react-icons/fa6";

interface ShowVectorModalProps {
  selectedResult: MatchVectorResponse | null;
  onClose: () => void;
  getFileNameByFileKey: (fileKey: string) => string;
}

const ShowVectorModal: React.FC<ShowVectorModalProps> = ({
  selectedResult,
  onClose,
  getFileNameByFileKey,
}) => {
  const isOpen = !!selectedResult;

  return (
    <Modal isShow={isOpen} onClose={onClose}>
      <div className="mx-auto flex flex-col gap-3 p-2">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h2 className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <FaFileLines className="h-4 w-4" fill="#1155ff" />
            {getFileNameByFileKey(selectedResult?.metadata?.file_key || "")}
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <TextArea
            value={selectedResult?.metadata?.text || ""}
            placeholder="Content not available"
            className="h-[300px] w-[600px] whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-4 text-sm text-black"
            disabled
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="rounded-lg bg-gray-800 px-6 py-2 text-white transition-colors hover:bg-gray-700"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShowVectorModal;
