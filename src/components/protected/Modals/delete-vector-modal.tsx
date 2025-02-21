import React from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";

interface DeleteVectorModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  confirmDeleteVector: () => void;
  isLoading: boolean;
}

const DeleteVectorModal: React.FC<DeleteVectorModalProps> = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  confirmDeleteVector,
  isLoading,
}) => {
  return (
    <Modal
      isShow={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      wrapperClassName="bg-[#000033]/40 backdrop-blur-sm"
    >
      <div className="p-2 text-left">
        <h2 className="text-lg font-semibold">
          Are you sure you want to delete this vector?{" "}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {" "}
          Deleting the Document is irreversible. Users will no longer be able{" "}
          <br /> to access your Knowledge.
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDeleteVector}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteVectorModal;
