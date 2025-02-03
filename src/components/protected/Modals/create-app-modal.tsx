import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getS3Url, uploadImageToS3 } from "@/actions/aws/s3-action"
import { z } from "zod"

import { App } from "@/lib/db/schema"

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MultiSelect from "@/components/ui/multi-select"
import { TextArea } from "@/components/ui/textarea"
import Modal from "@/components/modal"
import { useUpdateApp } from "@/app/services/apps/app-service"

import AddImageModal from "./add-image-modal"

type CreateAppModalProps = {
  isOpen: boolean
  onClose: () => void
  selectedAppDetails: App | null
}

const appSchema = z.object({
  name: z.string().min(1, "App name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  appType: z.string().min(1, "App type is required"),
})

interface Option {
  label: string
}

export default function CreateAppModal({
  isOpen,
  onClose,
  selectedAppDetails,
}: CreateAppModalProps) {
  //hooks to manage the state of the modal
  const [selectedTags, setSelectedTags] = useState<Option[]>([])
  const [appName, setAppName] = useState("")
  const [appDescription, setAppDescription] = useState("")
  const [appType, setAppType] = useState("")
  const [appIcon, setAppIcon] = useState("🤖")
  const [tagsOptions, setTagsOptions] = useState<Option[]>([
    { label: "Tag1" },
    { label: "Tag2" },
    { label: "Tag3" },
  ])
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  )
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [localImageUrl, setLocalImageUrl] = useState<string>("")

  //components
  const { toast } = useToast()

  const { updateApp, isLoading } = useUpdateApp()
  const router = useRouter() // Initialize router

  useEffect(() => {
    if (selectedAppDetails) {
      setAppName(selectedAppDetails.name ?? "")
      setAppDescription(selectedAppDetails.description ?? "")
      setAppIcon(selectedAppDetails.icon ?? "")
      const tags = Array.isArray(selectedAppDetails.tags)
        ? selectedAppDetails.tags.map((tag) => ({ label: tag }))
        : []
      setSelectedTags(tags)
      setAppType(selectedAppDetails.appType ?? "")
    } else {
      // Reset form fields to default values
      setAppName("")
      setAppDescription("")
      setAppIcon("🤖")
      setSelectedTags([])
      setAppType("")
    }
  }, [selectedAppDetails, isOpen])

  const handleSubmit = async () => {
    let uploadedIconUrl = ""

    if (selectedFile && appIcon !== localImageUrl) {
      try {
        const { file_key } = await uploadImageToS3(selectedFile)
        const presignedUrl = await getS3Url(file_key)
        uploadedIconUrl = presignedUrl
        console.log("uploadedIconUrl", uploadedIconUrl)
      } catch (error) {
        console.error("Failed to upload image:", error)
        return
      }
    }

    const appData = {
      name: appName,
      description: appDescription,
      icon: selectedFile ? uploadedIconUrl : appIcon,
      tags: selectedTags.map((option) => option.label),
      appType: appType,
      existingAppId: selectedAppDetails?.id ? selectedAppDetails.id : null,
    }

    console.log("subit data from modal", appData)

    console.log("icon", appIcon)
    try {
      appSchema.parse(appData)
      setErrors({}) // Clear previous errors

      const CreateAppResponse = await updateApp(appData)
      const createdAppId = CreateAppResponse.appId
      // console.log("createdAppId", CreateAppResponse)

      if (selectedAppDetails?.id) {
        toast({
          title: "Success",
          description: "The app has been updated successfully.",
          variant: "default",
        })
      } else {
        toast({
          title: "Success",
          description: "The app has been created successfully.",
          variant: "default",
        })
      }

      onClose()

      if (
        (!selectedAppDetails || selectedAppDetails?.id === null) &&
        createdAppId
      ) {
        console.log("createdAppId", createdAppId)
        router.push(`/app/${createdAppId}/configuration`)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { name?: string; description?: string } = {}
        error.errors.forEach((err) => {
          if (err.path.includes("name")) fieldErrors.name = err.message
          if (err.path.includes("description"))
            fieldErrors.description = err.message
        })
        setErrors(fieldErrors)
      }
    }
  }

  return (
    <>
      <Modal isShow={isOpen} onClose={onClose}>
        <div className="flex flex-col items-center gap-4 p-2 text-[14px] text-gray-700">
          <h2 className="w-full text-left text-[14px] text-lg font-medium text-black">
            {selectedAppDetails !== null ? "EDIT APP" : "CREATE APP"}
          </h2>
          <div className="flex w-full gap-4">
            <div className="w-1/2 border-r pr-6 text-left lg:w-[400px]">
              <span className="text-md w-full font-medium text-black">
                What type of app do you want to{" "}
                {selectedAppDetails ? "edit" : "create"}?
              </span>
              <div className="mt-2 grid grid-cols-2 gap-5">
                {[
                  { icon: "🤖", name: "BOT" },
                  { icon: "👨‍💼", name: "AGENT" },
                  { icon: "🧩", name: "PROBLEM SOLVER" },
                  { icon: "📝", name: "TEXT GENERATOR" },
                  { icon: "📊", name: "ANALYTICS" },
                  { icon: "🔄", name: "WORKFLOW" },
                ].map((template) => (
                  <div
                    key={template.name}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-md border hover:bg-slate-100 ${
                      appType === template.name
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 p-[2px]"
                        : ""
                    }`}
                    onClick={() => {
                      setAppType(template.name)
                    }}
                  >
                    <div
                      className={`flex size-full flex-col p-5 ${
                        appType === template.name ? "bg-gray-50" : "bg-white"
                      } items-center justify-center rounded hover:bg-slate-50`}
                    >
                      <span className="text-2xl">{template.icon}</span>
                      <span className="mt-2 text-sm">{template.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-1/2 flex-col gap-3 px-2 lg:w-[400px]">
              <label className="w-full">
                <span className="text-md block text-left font-medium text-black">
                  App icon & name
                </span>
                <div className="mt-2 flex w-full cursor-pointer items-center">
                  <div onClick={() => setIsAddImageModalOpen(true)}>
                    {localImageUrl ? (
                      <Image
                        src={localImageUrl}
                        alt="App Icon"
                        className="mr-2 flex flex-shrink-0 cursor-pointer rounded-md object-cover"
                        width={38}
                        height={32}
                      />
                    ) : appIcon && appIcon.length > 10 ? (
                      <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-[8px]">
                        <Image
                          src={appIcon ?? ""}
                          alt="🤖"
                          width={32}
                          height={32}
                        />
                      </span>
                    ) : (
                      <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-[8px] bg-green-200">
                        <span className="text-[18px]">{appIcon}</span>
                      </span>
                    )}
                  </div>
                  <Input
                    type="text"
                    className="w-full flex-grow rounded border bg-slate-100 p-2"
                    placeholder="Give your app a name"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
              </label>
              <label className="mt-2 w-full">
                <span className="text-md block text-left font-medium text-black">
                  Description
                </span>
                <TextArea
                  className="mt-2 w-full flex-grow rounded border bg-slate-100 p-2"
                  placeholder="Enter the description of the app"
                  rows={3}
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </label>
              <label className="mt-2 w-full">
                <span className="text-md block text-left font-medium text-black">
                  Tags
                </span>
                <div className="mt-2 flex items-center ">
                  <MultiSelect
                    className="z-10 !w-full" // Add z-index to ensure dropdown is above other elements
                    options={tagsOptions}
                    selected={selectedTags}
                    onChange={setSelectedTags}
                  />
                  <Button
                    variant={"gray"}
                    className="ml-2 bg-gray-200 text-gray-800 hover:bg-gray-100"
                    onClick={() => {
                      const newTag = prompt("Enter new tag:")
                      if (newTag) {
                        const newOption = { label: newTag }
                        setSelectedTags([...selectedTags, newOption])
                        setTagsOptions([...tagsOptions, newOption])
                      }
                    }}
                  >
                    + Add Tag
                  </Button>
                </div>
              </label>
              <div className="mt-4 flex w-full justify-end gap-2">
                <Button
                  variant={"gray"}
                  className="bg-gray-100 text-[#6c6c6c] hover:bg-gray-200"
                  onClick={() => {
                    onClose()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant={"gray"}
                  className="bg-blue-700 text-white hover:bg-blue-800"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Creating..."
                    : selectedAppDetails?.id
                      ? "Update"
                      : "Create"}
                </Button>
              </div>
            </div>
          </div>
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
          setAppIcon(icon)
          setLocalImageUrl("")
          setSelectedFile(null)
          setIsAddImageModalOpen(false)
        }}
        onFileSelect={(file) => {
          setSelectedFile(file)
          setLocalImageUrl(URL.createObjectURL(file))
          setAppIcon("")
          setIsAddImageModalOpen(false)
        }}
      />
    </>
  )
}
