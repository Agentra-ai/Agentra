import React, { useCallback } from "react"
import { PiFoldersFill } from "react-icons/pi"

import { AppDocumentType } from "@/lib/db/schema"

import { Button } from "@/components/ui/button"
import LoadingIcon from "@/components/loading"
import Modal from "@/components/modal"
import { useAppDocs } from "@/app/services/app-docs/app-docs-service"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelectFile: (
    fileKeys: { fileKey: string; docName: string; isActive: boolean }[]
  ) => void
}

const AddDocsModal = React.memo(
  ({ isOpen, onClose, onSelectFile }: Props) => {
    const [appDocumentFolder, setAppDocumentFolder] = React.useState<
      AppDocumentType[]
    >([])
    const { appDocs, isLoading, error: fetchError } = useAppDocs()

    React.useEffect(() => {
      if (isOpen && appDocs && !isLoading) {
        setAppDocumentFolder(appDocs)
      }
    }, [isOpen, appDocs, isLoading])

    const handleSelectFile = useCallback(
      (fileKeys: { fileKey: string; docName: string; isActive: boolean }[]) => {
        console.log("Selected fileKeys :::::", fileKeys)
        onSelectFile(fileKeys)
      },
      [onSelectFile]
    )

    return (
      <Modal isShow={isOpen} onClose={onClose} className="min-w-[350px] z-50">
        <div className="gap-2 mb-3 z-50">
          <h2>Select a Document</h2>

          {/* Loading state */}
          {isLoading && ( 
            <p>
              <LoadingIcon />
            </p>
          )}

          {/* Error state */}
          {fetchError && <p>Error: {fetchError.message}</p>}

          {/* Documents list */}
          <div>
            {!isLoading && appDocumentFolder.length === 0 && (
              <p>No documents found</p>
            )}

            {appDocumentFolder && appDocumentFolder.length > 0 && (
              <ul className="flex w-full flex-col gap-2 rounded-lg px-2 py-1 overflow-y-auto h-[400px] p-3 my-2">
                {appDocumentFolder.map((file: AppDocumentType) => (
                  <li
                    className="flex cursor-pointer items-center gap-4 rounded border border-gray-100 p-1"
                    key={file.id}
                    onClick={() =>
                      Array.isArray(file.fileKeys) &&
                      handleSelectFile(
                        file.fileKeys.map((fileKey) => ({
                          fileKey: fileKey.fileKey,
                          docName: file.name,
                          isActive: fileKey.isActive,
                        }))
                      )
                    }
                  >
                    <span className="flex items-center gap-2 text-[13px] font-medium">
                      <span className="rounded-[6px] border border-[#1a55ff]/10 bg-[#1a55ff]/5 p-1">
                        <PiFoldersFill className="text-[#1a55ff]" size={15} />
                      </span>
                      {file.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer buttons */}
          <div className="mt-5 flex w-full justify-end gap-x-2">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-100 p-1 px-3 text-gray-700"
            >
              Cancel
            </button>
            <Button variant={"blue"} onClick={onClose}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.isOpen === nextProps.isOpen
  }
)

export default AddDocsModal
