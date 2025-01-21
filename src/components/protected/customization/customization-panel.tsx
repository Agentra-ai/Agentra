"use client"

import React from "react"
import { redirect, usePathname } from "next/navigation"
import { uploadImageToS3 } from "@/actions/app/aws/s3-action"
import {
  getAppCustomization,
  updateAppCustomization,
} from "@/actions/customization/customization-action"
import { useAppStore } from "@/store/useAppStore"
import { RiChatSmile3Fill } from "react-icons/ri"
import { useShallow } from "zustand/react/shallow"

import { getS3Url } from "@/hooks/api-action/s3"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import AddImageModal from "../Modals/add-image-modal"

// Move this check outside the component
const getAppId = (pathname: string | null) => {
  const id = pathname?.split("/")[2]
  if (!id) {
    redirect("apps/studio")
  }
  return id
}

const AppCustomizationPanel = () => {
  const pathname = usePathname()
  const appId = React.useMemo(() => getAppId(pathname), [pathname])
  const { toast } = useToast()

  const { appCustomization, setCustomization } = useAppStore(
    useShallow((state) => ({
      appCustomization: state.appCustomization,
      setCustomization: state.setCustomization,
    }))
  )

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [localImageUrl, setLocalImageUrl] = React.useState<string | undefined>(
    undefined
  )
  const [appIcon, setAppIcon] = React.useState<string | undefined>(undefined)
  const [isAddImageModalOpen, setIsAddImageModalOpen] = React.useState(false)

  const {
    botLogo,
    botName,
    bgColor,
    aiChatColor,
    userChatColor,
    botTextColor,
    userTextColor,
    botFontSize,
    botFontWeight,
    botFontFamily,
  } = appCustomization

  const fetchCustom = React.useCallback(async () => {
    const constomizationResponse = await getAppCustomization(appId)
    setCustomization({
      ...appCustomization,
      botLogo: constomizationResponse.botLogo,
      botName: constomizationResponse.botName,
      bgColor: constomizationResponse.bgColor,
      aiChatColor: constomizationResponse.aiChatColor,
      userChatColor: constomizationResponse.userChatColor,
      botTextColor: constomizationResponse.botTextColor,
      userTextColor: constomizationResponse.userTextColor,
      botFontSize: constomizationResponse.botFontSize,
      botFontWeight: constomizationResponse.botFontWeight,
      botFontFamily: constomizationResponse.botFontFamily,
    })
    if ((constomizationResponse.botLogo?.length ?? 0) > 10) {
      if (selectedFile) {
        const { file_key } = await uploadImageToS3(selectedFile)
        const presignedUrl = await getS3Url(file_key)
      }
      setLocalImageUrl(constomizationResponse.botLogo ?? "")
    } else {
      setCustomization({
        ...appCustomization,
        botLogo: constomizationResponse.botLogo,
      })
      setAppIcon(constomizationResponse.botLogo ?? "")
    }
  }, [appId])

  React.useEffect(() => {
    fetchCustom()
  }, [])

  const updateCustomization = (key: string, value: any) => {
    setCustomization({
      ...appCustomization,
      [key]: value,
    })
    // if (key === "botLogo") {
    //   setCustomization({
    //     ...appCustomization,
    //     botLogo: value,
    //   })
    // }
  }

  const handleInputChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      updateCustomization(key, event.target.value)
    }

  const handleSaveCustomizations = async () => {
    try {
      console.log("Saving customizations...", appCustomization)
      let uploadedIconUrl = null
      if (selectedFile && appIcon !== localImageUrl) {
        try {
          const { file_key } = await uploadImageToS3(selectedFile)
          const s3ImagUrl = await getS3Url(file_key)
          uploadedIconUrl = s3ImagUrl
          updateCustomization("botLogo", file_key)
          console.log("image saved")
        } catch (error) {
          toast({
            title: "Failed",
            description: "Error saving customizations",
            variant: "destructive",
          })
          console.error("Error saving customizations:", error)
          return
        }
      } else if (appIcon) {
        uploadedIconUrl = appIcon
        updateCustomization("botLogo", appIcon)
        console.log("icon saved")
      }

      await updateAppCustomization(appId, {
        ...appCustomization,
        id: appCustomization.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        appId: appId,
        botLogo: uploadedIconUrl ? uploadedIconUrl : appCustomization.botLogo,
      })

      toast({
        title: "Success",
        description: "Customizations saved successfully",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Failed",
        description: "Error saving customizations",
        variant: "destructive",
      })
      console.error("Error saving customizations:", error)
    }
  }

  return (
    <div className="flex w-full flex-col border-r">
      <div className="flex items-center justify-between p-2 shadow-sm">
        <h2 className="text-lg font-semibold">App Customization</h2>
        <Button variant="blue" onClick={handleSaveCustomizations}>
          Save Customizations
        </Button>
      </div>

      <div className="tex-sm h-full overflow-auto px-6 pb-4 text-gray-600">
        {/* Change Bot Name */}
        <div className="grid-col-2 my-2 grid">
          <label className="font-semibold text-black">Bot Name</label>
          <input
            type="text"
            value={botName}
            onChange={handleInputChange("botName")}
            className="mt-2 rounded-[8px] border bg-gray-100 px-4 py-2 outline-none"
          />
        </div>

        {/* Change Bot Logo */}
        <div className="my-6 rounded-lg bg-gray-50 p-6">
          <label className="mb-4 block text-lg font-semibold text-black">
            Bot Logo
          </label>
          <div className="flex items-start gap-6">
            {/* Logo Preview */}
            <div
              onClick={() => setIsAddImageModalOpen(true)}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              {appIcon || selectedFile || localImageUrl ? (
                localImageUrl ? (
                  <img
                    src={localImageUrl}
                    alt="Bot Logo"
                    className="h-24 w-24 rounded-full border-2 border-gray-200 object-cover"
                    width={96}
                    height={96}
                  />
                ) : (
                  <span className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-3xl">
                    {appIcon}
                  </span>
                )
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 transition-colors hover:bg-blue-700">
                    <RiChatSmile3Fill className="h-14 w-14 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    Default Logo
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setIsAddImageModalOpen(true)}
                className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
                variant="default"
              >
                Change Logo
              </Button>

              {(appIcon || selectedFile || localImageUrl) && (
                <Button
                  onClick={() => {
                    updateCustomization("botLogo", null)
                    setAppIcon(undefined)
                    setLocalImageUrl(undefined)
                  }}
                  variant="gray"
                  className="min-w-[140px]"
                >
                  Remove Logo
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Color Customization */}
        <section className="my-6 rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-black">
            Theme Colors
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Background Color */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <label className="mb-3 block font-medium text-gray-700">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={handleInputChange("bgColor")}
                  className="h-12 w-12 min-w-12 cursor-pointer rounded-md border-2 border-gray-200 p-1 transition hover:border-blue-500"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={handleInputChange("bgColor")}
                  className="w-20 flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm transition hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* AI Chat Bubble Color */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <label className="mb-3 block font-medium text-gray-700">
                AI Chat Bubble
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={aiChatColor}
                  onChange={handleInputChange("aiChatColor")}
                  className="h-12 w-12 min-w-12 cursor-pointer rounded-md border-2 border-gray-200 p-1 transition hover:border-blue-500"
                />
                <input
                  type="text"
                  value={aiChatColor}
                  onChange={handleInputChange("aiChatColor")}
                  className="w-20 flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm transition hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="#f5f5fa"
                />
              </div>
            </div>

            {/* User Chat Bubble Color */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <label className="mb-3 block font-medium text-gray-700">
                User Chat Bubble
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={userChatColor}
                  onChange={handleInputChange("userChatColor")}
                  className="h-12 w-12 min-w-12 cursor-pointer rounded-md border-2 border-gray-200 p-1 transition hover:border-blue-500"
                />
                <input
                  type="text"
                  value={userChatColor}
                  onChange={handleInputChange("userChatColor")}
                  className="w-20 flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm transition hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="#ebf5ff"
                />
              </div>
            </div>

            {/* Bot Text Color */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <label className="mb-3 block font-medium text-gray-700">
                AI Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={botTextColor}
                  onChange={handleInputChange("botTextColor")}
                  className="h-12 w-12 min-w-12 cursor-pointer rounded-md border-2 border-gray-200 p-1 transition hover:border-blue-500"
                  placeholder={botTextColor}
                  />
                <input
                  type="text"
                  value={botTextColor}
                  onChange={handleInputChange("botTextColor")}
                  className="w-20 flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm transition hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={botTextColor}
                />
              </div>
            </div>

            {/* User Text Color */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <label className="mb-3 block font-medium text-gray-700">
                User Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={userTextColor}
                  onChange={handleInputChange("userTextColor")}
                  className="h-12 w-12 min-w-12 cursor-pointer rounded-md border-2 border-gray-200 p-1 transition hover:border-blue-500"
                  placeholder={userTextColor}
                />
                <input
                  type="text"
                  value={userTextColor}
                  onChange={handleInputChange("userTextColor")}
                  className="w-20 flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm transition hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={userTextColor}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Text Style Customization */}
        <section className="my-6 rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-black">
            Text Style Customization
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {/* Font Family */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <label className="mb-3 block font-medium text-gray-700">
                Font Family
              </label>
              <Select
                value={botFontFamily}
                onValueChange={(value) =>
                  updateCustomization("botFontFamily", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a font family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Times New Roman">
                    Times New Roman
                  </SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <label className="mb-3 block font-medium text-gray-700">
                Font Size (px)
              </label>
              <input
                type="number"
                value={botFontSize}
                onChange={(e) =>
                  updateCustomization("botFontSize", e.target.value)
                }
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm transition hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter font size"
                min="8"
                max="32"
              />
            </div>

            {/* Font Weight */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <label className="mb-3 block font-medium text-gray-700">
                Font Weight
              </label>
              <Select
                value={String(botFontWeight)}
                onValueChange={(value) =>
                  updateCustomization("botFontWeight", Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a font weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">Light (200)</SelectItem>
                  <SelectItem value="300">Book (300)</SelectItem>
                  <SelectItem value="400">Regular (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semibold (600)</SelectItem>
                  <SelectItem value="700">Bold (700)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      </div>

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
          setLocalImageUrl("")
          setAppIcon(icon)
          setSelectedFile(null)
          setIsAddImageModalOpen(false)
          console.log(icon)
        }}
        onFileSelect={(file) => {
          setAppIcon("")
          setSelectedFile(file)
          setLocalImageUrl(URL.createObjectURL(file))
          setIsAddImageModalOpen(false)
          console.log(file)
        }}
      />
    </div>
  )
}

export default AppCustomizationPanel
