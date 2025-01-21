import React from "react"
import { useRouter } from "next/navigation"
import dayjs from "dayjs"
import { AnimatePresence, motion } from "framer-motion"
import { PencilIcon, Trash2Icon } from "lucide-react"

import { AppFileType } from "@/db/schema"

import { deleteFileFromS3 } from "@/hooks/api-action/s3"
import { useToast } from "@/hooks/use-toast"

import { useDeleteAppFile } from "@/app/services/app-docs/app-docs-service"

import DeleteFileModal from "../protected/Modals/delete-file-modal"

interface Props {
  headers: string[]
  documentData?: AppFileType[]
  lessonType?: string
  documentId: string
  // setIsCourseConfirmModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const Table: React.FC<Props> = ({
  documentData,
  // onLessonClick,
  // setIsCourseConfirmModalOpen,
  headers,
  documentId,
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [fileToDelete, setDocumentToDelete] =
    React.useState<AppFileType | null>(null)

  const { deleteAppFile } = useDeleteAppFile(documentId)

  const confirmDeleteApp = async () => {
    console.log("deleting....", fileToDelete?.id)
    if (fileToDelete) {
      console.log("deleting....", fileToDelete)

      try {
        await deleteAppFile(fileToDelete.id)
        await deleteFileFromS3(fileToDelete.fileKey)
        toast({
          title: "Document Deleted",
          description: `${fileToDelete.name} has been deleted successfully.`,
          variant: "default",
        })
        setIsDeleteModalOpen(false)
        setDocumentToDelete(null)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete document",
          variant: "destructive",
        })
      }
    }
  }

  const handleRowClick = (fileId: string) => {
    router.push(`/docs/${documentId}/documents/${fileId}`)
  }

  const handleDeleteClick = (event: React.MouseEvent, file: AppFileType) => {
    event.stopPropagation()
    setIsDeleteModalOpen(true)
    setDocumentToDelete(file)
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700
                            ${index < 2 ? "border-r border-gray-200" : ""}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-[13px]">
          <AnimatePresence>
            {documentData &&
              documentData.map((file, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.1 }}
                  key={index}
                  className="cursor-pointer transition-colors duration-150 ease-in-out hover:bg-[#f9f9f9]"
                  onClick={() => handleRowClick(file.id)}
                >
                  <td className="border-r border-gray-200 px-2 py-2 text-center text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap border-r border-gray-200 px-6 py-2 text-sm text-gray-900">
                    {file.name}
                  </td>
                  <td className="whitespace-nowrap border-gray-200 px-6 py-2 text-sm text-gray-900">
                    {file.words}
                  </td>
                  <td className="whitespace-nowrap border-gray-200 px-6 py-2 text-sm text-gray-900">
                    {/* {file.retrievalCount} */}
                    retrieval count
                  </td>
                  <td className="whitespace-nowrap border-gray-200 px-6 py-2 text-sm text-gray-900">
                    {dayjs(file.updatedAt).format("DD/MM/YYYY h:mm A")}
                  </td>
                  <td className="whitespace-nowrap border-gray-200 px-6 py-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                        file.isActive
                          ? "bg-[#e6f3ea] text-[#2F9F4D]"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {file.isActive ? "Active" : "inactive"}
                    </span>
                  </td>
                  {
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-medium">
                      <div className="flex items-center justify-center gap-x-5">
                        <PencilIcon
                          onClick={() => handleRowClick(file.id)}
                          className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
                        />
                        <Trash2Icon
                          onClick={(e) => handleDeleteClick(e, file)}
                          className="h-5 w-5 cursor-pointer text-red-400 hover:text-red-600"
                        />
                      </div>
                    </td>
                  }
                </motion.tr>
              ))}
          </AnimatePresence>
        </tbody>
      </table>
      <DeleteFileModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={() => setIsDeleteModalOpen(false)}
        confirmDeleteFile={confirmDeleteApp}
        fileToDelete={fileToDelete as AppFileType}
      />
    </div>
  )
}

export default Table
