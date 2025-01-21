import React, { useState } from "react"

import { App } from "@/db/schema"

import { Button } from "@/components/ui/button"
import Modal from "@/components/modal"

interface DeleteAppModalProps {
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (isOpen: boolean) => void
  confirmDeleteApp: () => Promise<void>
  appToDelete: App
}

const DeleteAppModal: React.FC<DeleteAppModalProps> = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  confirmDeleteApp,
  // appToDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await confirmDeleteApp()
    } finally {
      setIsLoading(false)
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <Modal
      isShow={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      closableIcon={true}
      className="w-full max-w-[500px] p-6 text-left"
      wrapperClassName="bg-black/40 backdrop-blur-sm"
    >
      <h2 className="text-left text-lg font-medium">
        Are you sure you want to delete this app?
      </h2>
      <p className="mt-2 text-sm">
        Deleting the app is irreversible. Users will no longer be able to access
        your app, and all prompt configurations and logs will be permanently
        deleted.
      </p>
      <div className="mt-10 flex w-full justify-end gap-x-2">
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="rounded-lg bg-gray-100 p-1 px-3 text-gray-700"
        >
          Cancel
        </button>
        <Button
          variant={"destructive"}
          className="bg-red-600 p-1 px-4 hover:bg-red-700"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Confirm"}
        </Button>
      </div>
    </Modal>
  )
}
export default DeleteAppModal
