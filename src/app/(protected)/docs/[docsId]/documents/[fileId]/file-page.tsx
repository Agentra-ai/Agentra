"use client"

import React from "react"
import { useParams } from "next/navigation"
import { getFileByFileId } from "@/actions/documents/app-docs-action"
import {
  addVectorDataInPG,
  getVectorsByfileId,
  updateVectorDataInPG,
} from "@/actions/vectors/vectordb-action"
import { EditIcon, Trash2Icon } from "lucide-react"
import { FaFileAlt } from "react-icons/fa"
import { MdOutlineAddToPhotos } from "react-icons/md"
import { TbDotsVertical } from "react-icons/tb"
import { v4 as uuidv4 } from "uuid"
import { LuTrendingUpDown } from "react-icons/lu"
import { AppFileType, TypeVectorDBData } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import AddVectorModal from "@/components/protected/Modals/add-vector-modal"
import DeleteVectorModal from "@/components/protected/Modals/delete-vector-modal"
import useDeleteVectorById, {
  useUpdateVectorById,
} from "@/app/services/vectors/vector-service"
import FileDetails from "./file-details"

const AppFilesPage = () => {
  const params = useParams()
  const fileId = params?.fileId as string

  const [vectors, setVectors] = React.useState<TypeVectorDBData[]>([])
  const [fileDetails, setFileDetails] = React.useState<AppFileType>()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [vectorToDeleteId, setVectorToDeleteId] = React.useState<string>("")
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [selectedVector, setSelectedVector] = React.useState<
    TypeVectorDBData | undefined
  >()

  const { deleteVectorById, isLoading } = useDeleteVectorById()
  const { updateVectorById, isLoading: isUpdateLoading } = useUpdateVectorById()

  // Memoized fetchVectors with useCallback
  const fetchVectors = React.useCallback(async () => {
    try {
      const data = await getVectorsByfileId(fileId)
      setVectors(data)
      const details = await getFileByFileId(fileId)
      setFileDetails(details)
    } catch (error) {
      console.error("Error fetching vectors:", error)
    }
  }, [fileId]) // Only recreates when fileId changes

  React.useEffect(() => {
    fetchVectors()
  }, [fetchVectors])

  const handleDeleteClick = (vectorId: string) => {
    setVectorToDeleteId(vectorId)
    setIsDeleteModalOpen(true)
  }

  const handleEditClick = (vector: TypeVectorDBData) => {
    setSelectedVector(vector)
    setIsAddModalOpen(true)
  }

  const confirmDeleteVector = async () => {
    if (vectorToDeleteId) {
      try {
        await deleteVectorById(vectorToDeleteId)
        setIsDeleteModalOpen(false)
        setVectorToDeleteId("")
        await fetchVectors()
      } catch (error) {
        console.error("Error in delete operation:", error)
      }
    }
  }

  const handleAddVector = async (
    content: string,
    vectorId?: string,
    cSize?: number,
    cOverlap?: number
  ) => {
    try {
      if (vectorId) {
        await updateVectorById(
          vectorId,
          fileDetails?.fileKey || "",
          content,
          selectedVector?.isActive ?? true,
          cSize,
          cOverlap
        )
        await updateVectorDataInPG(vectorId, content)
      } else {
        const newVectorId = uuidv4()
        await updateVectorById(
          newVectorId,
          fileDetails?.fileKey || "",
          content,
          selectedVector?.isActive ?? true,
          cSize,
          cOverlap
        )
        await addVectorDataInPG(newVectorId, fileDetails?.id || "", content)
      }
      setIsAddModalOpen(false)
      setSelectedVector(undefined)
      await fetchVectors()
    } catch (error) {
      console.error("Error saving vector:", error)
    }
  }

  return (
    <div className="mx-auto h-full w-full flex-1 overflow-hidden bg-white py-4 text-[13px]">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b px-6 pb-4">
        <h1 className="flex items-center text-xl font-semibold">
          <FaFileAlt color="#ff3333" />
          <span className="mx-2 h-6 border-l border-gray-300"></span>
          {fileDetails?.name}
        </h1>
        <div className="flex items-center space-x-4 text-[14px]">
          <span className="flex items-center gap-2 rounded-md px-3 py-1 font-semibold text-gray-900">
            {vectors.length} paragraphs
          </span>
          <span className="flex items-center gap-2 rounded-md border px-3 py-1 font-semibold text-gray-900">
            <span className="h-2 w-2 rounded-full border-green-700 bg-green-500"></span>
            Active
          </span>
          <span
            className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1 font-semibold text-gray-900 hover:bg-gray-50"
            onClick={() => setIsAddModalOpen(true)}
          >
            <MdOutlineAddToPhotos />
            Add chunk
          </span>
          <Button className="flex items-center border bg-white px-3 py-1 text-[13px] text-black shadow-none hover:bg-gray-100">
            <TbDotsVertical size={18} className="m-0 p-0" />
          </Button>
        </div>
      </div>

      <div className="flex h-full w-full flex-row overflow-hidden pb-0 pr-0 text-[13px]">
        <div className="h-[calc(100vh-160px)] w-2/3 overflow-y-auto border-r pl-6 pr-2">
          <div className="grid grid-cols-2 gap-4">
            {vectors.map((para, index) => (
              <div
                key={para.id}
                className="group relative h-[180px] w-full cursor-pointer overflow-hidden rounded-md border border-transparent bg-gray-50 hover:border-gray-200 hover:bg-white hover:shadow-md"
              >
                <div className="p-4">
                  <div className="sticky top-0 mb-2 flex items-center justify-between rounded-lg bg-gray-50 pr-1">
                    <span
                      className={`rounded-lg p-1 px-2 text-[12px] ${para.isActive ? "border border-green-200 bg-[#dfffe2] text-black" : "bg-red-50 text-gray-600"} text-sm font-medium`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex gap-2 text-xs text-gray-500">
                      {para.charecterLength} chars{" "}
                      <div className="flex gap-2">
                        <EditIcon
                          size={16}
                          className="cursor-pointer hover:text-blue-500"
                          onClick={() => handleEditClick(para)}
                        />
                        <Trash2Icon
                          size={16}
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => handleDeleteClick(para.vectorId)}
                        />
                      </div>
                    </span>
                  </div>
                  <div className="max-h-[40px]">
                    <p
                      className={`break-words text-sm ${para.isActive ? "text-gray-800" : "text-gray-500"}`}
                    >
                      {para.content.length > 200
                        ? `${para.content.substring(0, 180)}.....`
                        : para.content}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 hidden w-full items-center justify-between bg-white px-4 py-2 text-xs text-gray-800 group-hover:flex">
                  <div>
                    <LuTrendingUpDown
                      className="mr-1 inline text-gray-800"
                      size={15}
                    />
                    Id: {para.vectorId.substring(0, 13).toUpperCase()}...
                  </div>
                  <Switch
                    checked={para.isActive}
                    onChange={() => console.log("Toggle switch")}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[calc(100vh-140px)] w-1/3 overflow-y-auto">
          <FileDetails
            vectorsData={vectors}
            fileId={fileId}
            fileDetails={fileDetails as AppFileType}
          />
        </div>
      </div>

      {/* Modals */}
      <DeleteVectorModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        confirmDeleteVector={confirmDeleteVector}
        isLoading={isLoading}
      />
      <AddVectorModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setSelectedVector(undefined)
        }}
        onAdd={handleAddVector}
        selectedVector={selectedVector}
        isUpdateLoading={isUpdateLoading}
        defaultChunkSize={fileDetails?.chunkSize!}
        defaultChunkOverlap={fileDetails?.chunkOverlap!}
      />
    </div>
  )
}

export default AppFilesPage