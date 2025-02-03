import React, { useEffect, useState } from "react"
import { FilePenLineIcon } from "lucide-react"

import { TypeVectorDBData } from "@/lib/db/schema"

import { Button } from "@/components/ui/button"
import { TextArea } from "@/components/ui/textarea"
import Modal from "@/components/modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  onAdd: (
    content: string,
    vectorId?: string,
    chunkSize?: number,
    chunkOverlap?: number
  ) => Promise<void>
  selectedVector?: TypeVectorDBData
  isUpdateLoading?: boolean
  defaultChunkSize?: number
  defaultChunkOverlap?: number
}

const AddVectorModal = ({
  isOpen,
  onClose,
  onAdd,
  selectedVector,
  isUpdateLoading,
  defaultChunkSize = 1000,
  defaultChunkOverlap = 150,
}: Props) => {
  const [content, setContent] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [chunkSize, setChunkSize] = useState(defaultChunkSize)
  const [chunkOverlap, setChunkOverlap] = useState(defaultChunkOverlap)

  console.log(defaultChunkSize, defaultChunkOverlap)

  useEffect(() => {
    if (selectedVector) {
      setContent(selectedVector.content)
      setIsEditMode(false) // Reset edit mode when modal opens
    } else {
      setContent("")
      setIsEditMode(true) // Always edit mode for new vectors
    }
    setChunkSize(defaultChunkSize)
    setChunkOverlap(defaultChunkOverlap)
  }, [selectedVector, isOpen, defaultChunkSize, defaultChunkOverlap])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      await onAdd(content, selectedVector?.vectorId, chunkSize, chunkOverlap)
      setContent("")
      onClose()
    } catch (error) {
      console.error("Error saving vector:", error)
    }
  }

  return (
    <Modal
      isShow={isOpen}
      onClose={onClose}
      wrapperClassName="bg-[#000033]/40 backdrop-blur-sm"
    >
      <div className="max-w-[900px]">
        <div className="flex items-center justify-between p-2 pr-0 pt-0 text-left text-lg font-semibold">
          <div className="flex items-center justify-between gap-4 w-full">
            <h1 className="flex-1">
              {selectedVector ? "View Chunk" : "Add New Chunk"}
            </h1>
            {isEditMode && (
              <div className="flex items-center text-[14px] gap-2">
                <span>Chunk Size:</span>
                <input
                  type="number"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-20 rounded-md border p-1 bg-gray-50"
                  placeholder="chunkSize"
                />
                <span>Overlap:</span>
                <input
                  type="number"
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(Number(e.target.value))}
                  className="w-20 rounded-md border p-1 bg-gray-50"
                  placeholder="overlap"
                />
              </div>
            )}
          </div>
          {selectedVector && !isEditMode && (
            <Button
              type="button"
              onClick={() => setIsEditMode(true)}
              variant="blue"
              className="gap-1"
            >
              <FilePenLineIcon size={16} /> Edit
            </Button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter chunk content..."
            className="min-h-[300px] w-full min-w-[700px] whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-2"
            disabled={selectedVector && !isEditMode}
          />
            <div className="flex justify-between items-center w-full">
            <div className="text-sm text-gray-500">
              Characters: {content.length}
            </div>
            <div className="flex justify-end gap-2">
              {selectedVector && isEditMode ? (
              <>
                <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditMode(false)}
                >
                Cancel
                </Button>
                <Button type="submit" disabled={isUpdateLoading}>
                {isUpdateLoading ? "Saving..." : "Update Chunk"}
                </Button>
              </>
              ) : !selectedVector ? (
              <>
                <Button type="button" variant="outline" onClick={onClose}>
                Cancel
                </Button>
                <Button type="submit" disabled={isUpdateLoading}>
                {isUpdateLoading ? "Saving..." : "Add Chunk"}
                </Button>
              </>
              ) : (
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
              )}
            </div>
            </div>
        </form>
      </div>
    </Modal>
  )
}

export default AddVectorModal
