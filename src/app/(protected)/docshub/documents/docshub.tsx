"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { FilePenLine, Trash2 } from "lucide-react"
import { AppDocuments as _appDocuments, AppDocumentType } from "@/lib/db/schema"
import { deleteMultipleFilesFromS3 } from "@/hooks/api-action/s3"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import LoadingIcon from "@/components/loading"
import DeleteAppDocsModal from "@/components/protected/Modals/delete-docs-modal"
import UpdateDocsModal from "@/components/protected/Modals/update-docs-modal"
import {
  useAppDocs,
  useDeleteAppDocument,
  useDocsHubData,
  useUpdateAppDocument,
} from "@/app/services/app-docs/app-docs-service"
import { LuEllipsisVertical } from "react-icons/lu"

type Props = {}

const DocsHubDocument = (props: Props) => {
  const router = useRouter()
  const [appDocumentFolder, setAppDocumentFolder] = React.useState<
    AppDocumentType[]
  >([])

  //dont delete it, it will be helping for edit documents in popover
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedApp, setSelectedApp] = React.useState<AppDocumentType | null>(
    null
  )
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [documentToDelete, setDocumentToDelete] =
    React.useState<AppDocumentType | null>(null)

  const { toast } = useToast()
  const { DocsHubData, isLoading, error } = useDocsHubData()
  const { deleteAppDocument } = useDeleteAppDocument()

  React.useEffect(() => {
    if (
      DocsHubData &&
      !isLoading &&
      JSON.stringify(DocsHubData) !== JSON.stringify(appDocumentFolder)
    ) {
      const sortedDocs = [...DocsHubData].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setAppDocumentFolder(sortedDocs)
    }
  }, [DocsHubData, isLoading, appDocumentFolder])

  const handleDeleteConfirmation = (documents: AppDocumentType) => {
    setDocumentToDelete(documents)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteApp = async () => {
    if (documentToDelete) {
      //@ts-ignore
      const deletionFile = documentToDelete?.fileKeys?.map((file) =>
        typeof file === "object" ? file.fileKey : file
      )
      try {
        await deleteAppDocument(documentToDelete.id)
        if (documentToDelete.fileKeys) {
          await deleteMultipleFilesFromS3(deletionFile as string[])
        }
        toast({
          title: "Document Deleted",
          description: `${documentToDelete.name} has been deleted successfully.`,
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

  const { updateAppDocument } = useUpdateAppDocument()

  const handleUpdateDocs = async (data: {
    name: string
    description: string
    icon: string
  }) => {
    console.log(data)
    try {
      if (selectedApp?.id) {
        console.log("clicked")
        await updateAppDocument(selectedApp.id, data)
        handleModalClose()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      })
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedApp(null)
  }

  return (
    <div className="flex h-[calc(100vh-60px)] flex-col bg-[#f3f5f7]">
      {/* Header Section */}
      <div className="flex flex-col px-6 py-2">
        {/* Header Section */}
        <div className="mb-4 mt-2 flex items-center justify-between">
          {/* filter */}
          <div className="flex gap-6 text-[16px] text-gray-600">
            <button className="text-blue-700">DOCSHUB</button>
          </div>
          <div className="flex space-x-4">  
            <button className="rounded-[8px] px-4 py-1 text-sm text-gray-700">
              All Tags
            </button>
            <input
              type="text"
              className="rounded-[8px] border border-gray-300 px-4 py-2 text-sm"
              placeholder="Search"
            />
          </div>
        </div>

        {/* <FileUpload /> */}
      </div>
      {/* Documents Section - Only this part scrolls */}
      <div className="h-[calc(100vh-300px)] flex-1 overflow-y-auto px-6 py-2 pt-3">
        <div className="grid auto-rows-[180px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Static CREATE APP Card */}
          <div
            onClick={() => router.push("/docshub/create?isDocshub=true")}
            className="flex h-[180px] cursor-pointer flex-col rounded-xl border border-gray-300 bg-gray-200 p-4 shadow-sm hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between text-[12px]">
              <div className="flex items-center">
                <div className="mr-4 h-10 w-10 rounded-[8px] bg-gray-100 text-center text-2xl text-blue-700">
                  +
                </div>
                <h2 className="flex flex-col text-gray-800">
                  <span className="text-[14px] font-semibold text-blue-700">
                    Create new Document{" "}
                  </span>
                </h2>
              </div>
            </div>
            <p className="mt-6 text-[12px] text-gray-600">
              Import your own text data or write data in real-time and organize
              your way.
            </p>
          </div>
          {isLoading && (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <LoadingIcon />
            </div>
          )}
          {!isLoading && DocsHubData && DocsHubData.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-gray-600">No documents found</p>
            </div>
          )}
          {error && <p>Error loading documents: {error.message}</p>}
          {!isLoading && (
            <>
              {/* Mapped Apps (Scrollable) */}
              {appDocumentFolder &&
                appDocumentFolder.map((docs) => (
                  <div
                    key={docs.id}
                    className="relative h-[180px] cursor-pointer rounded-xl border-gray-300 bg-white p-4 shadow transition-shadow hover:shadow-md"
                    onClick={(e) => {
                      if (!e.defaultPrevented) {
                        router.push(`/docs/${docs.id}/documents`)
                      }
                    }}
                  >
                    <div className="flex items-center justify-start">
                      {docs.icon && docs.icon.length > 10 ? (
                        <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-[8px]">
                          <Image
                            src={docs.icon ?? ""}
                            alt="🤖"
                            className="rounded-[8px]"
                            width={44}
                            height={44}
                          />
                        </span>
                      ) : (
                        <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-[8px] bg-blue-100">
                          <span className="text-[18px]">{docs.icon}</span>
                        </span>
                      )}
                      <h2 className="flex flex-col text-gray-800">
                        <span className="text-[14px] font-semibold break-words">
                          {docs.name.length > 22 ? `${docs.name.substring(0, 22)}...` : docs.name}
                        </span>
                        <span className="text-[11px] text-gray-600">
                          20 files
                        </span>
                      </h2>
                    </div>
                    <p className="mt-2 text-[12px] text-gray-600">
                      {docs.description}
                    </p>

                    {/* edit options */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-4 right-4"
                    >
                      {" "}
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="z-50 rounded-lg p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <LuEllipsisVertical size={18} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="z-10 mt-2 w-36 rounded-md bg-white p-0 shadow-lg">
                          <ul className="rounded-[8px] p-1">
                            <li>
                              <button
                                className="flex w-full gap-2 px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  setSelectedApp(docs)
                                  setIsModalOpen(true)
                                }}
                              >
                                <FilePenLine
                                  className="h-5 w-5"
                                  strokeWidth={1.5}
                                />{" "}
                                Edit info
                              </button>
                            </li>
                            {/* <li>
                              <button className="flex w-full gap-2 px-2 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                                <CopyPlus
                                  className="w-5 h-5"
                                  strokeWidth={1.5}
                                />{" "}
                                Duplicate
                              </button>
                            </li> */}
                            <li>
                              <button
                                onClick={() => handleDeleteConfirmation(docs)}
                                className="flex w-full gap-2 px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Trash2
                                  className="h-5 w-5 text-red-500"
                                  strokeWidth={1.5}
                                />{" "}
                                Delete
                              </button>
                            </li>
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
      <DeleteAppDocsModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={() => setIsDeleteModalOpen(false)}
        confirmDeleteApp={confirmDeleteApp}
        documentsToDelete={documentToDelete as AppDocumentType}
      />
      <UpdateDocsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        documentsToUpdate={selectedApp}
        onUpdateDocs={handleUpdateDocs}
      />
    </div>
  )
}

export default DocsHubDocument
