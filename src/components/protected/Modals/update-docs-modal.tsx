import React, { useState } from "react"
import Image from "next/image"
import { uploadImageToS3 } from "@/actions/app/aws/s3-action"

import { App, AppDocumentType } from "@/db/schema"

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/textarea"
import Modal from "@/components/modal"

import AddImageModal from "./add-image-modal"
import { getS3Url } from "@/hooks/api-action/s3"

interface UpdateDocsModalProps {
  isOpen: boolean
  onClose: () => void
  documentsToUpdate: AppDocumentType | null
  onUpdateDocs: (data: {
    name: string
    description: string
    icon: string
  }) => void
}

export default function UpdateDocsModal({
  isOpen,
  onClose,
  onUpdateDocs,
  documentsToUpdate,
}: UpdateDocsModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState(documentsToUpdate?.name ?? "")
  const [description, setDescription] = useState(
    documentsToUpdate?.description ?? ""
  )
  const [icon, setIcon] = useState(documentsToUpdate?.icon ?? "📝")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [localImageUrl, setLocalImageUrl] = useState<string>("")
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false)

  React.useEffect(() => {
    setName(documentsToUpdate?.name ?? "")
    setDescription(documentsToUpdate?.description ?? "")
    setIcon(documentsToUpdate?.icon ?? "📝")
  }, [documentsToUpdate])

  const handleUpdate = async () => {
    setIsLoading(true)
    let uploadedIconUrl = icon

    try {
      if (selectedFile && icon !== localImageUrl) {
        const { file_key } = await uploadImageToS3(selectedFile)
        uploadedIconUrl = await getS3Url(file_key)
      }

      if (onUpdateDocs) {
        onUpdateDocs({ name, description, icon: uploadedIconUrl })
      }

      onClose()
    } catch (error) {
      toast({ title: "Error updating document" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Modal
        isShow={isOpen}
        onClose={() => onClose()}
        className="w-full max-w-[500px] p-6 text-left"
      >
        <h2 className="text-left text-lg font-medium">Update Document</h2>
        <div className="mt-4 flex flex-col gap-3">
          <label className="text-sm font-medium">Icon</label>
          <div
            onClick={() => setIsAddImageModalOpen(true)}
            className="cursor-pointer"
          >
            {localImageUrl ? (
              <Image
                src={localImageUrl}
                alt="Document Icon"
                width={42}
                height={42}
                className="rounded-md object-cover"
              />
            ) : icon && icon.length > 10 ? (
              <img src={icon} alt="Icon" width={40} height={40} />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-green-200">
                <span className="text-[18px]">{icon}</span>
              </span>
            )}
          </div>

          <label className="text-sm font-medium">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full flex-grow text-[14px] rounded border bg-slate-100 p-2"
          />

          <label className="text-sm font-medium">Description</label>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full flex-grow text-[14px] rounded border bg-slate-100 p-2"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="gray" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </Modal>

      <AddImageModal
        isOpen={isAddImageModalOpen}
        onClose={(e) => {
          if (e) {
            e.preventDefault()
            e.stopPropagation()
          }
          setIsAddImageModalOpen(false)
        }}
        onSelect={(icon) => {
          setIcon(icon)
          setLocalImageUrl("")
          setSelectedFile(null)
          setIsAddImageModalOpen(false)
        }}
        onFileSelect={(file) => {
          setSelectedFile(file)
          setLocalImageUrl(URL.createObjectURL(file))
          setIcon("")
          setIsAddImageModalOpen(false)
        }}
      />
    </>
  )
}
