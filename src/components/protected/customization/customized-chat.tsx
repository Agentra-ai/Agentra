"use client"

import React, { useRef, useState } from "react"
import { redirect, usePathname } from "next/navigation"
import { getAppCustomization } from "@/actions/customization/customization-action"
import { useAppStore } from "@/store/useAppStore"
import { PiUserCircleFill } from "react-icons/pi"
import { RiChatSmile3Fill, RiSendPlane2Fill } from "react-icons/ri"
import { useShallow } from "zustand/react/shallow"

import { TextArea } from "@/components/ui/textarea"
import { dummyChatArray } from "@/store/constant"
import Image from "next/image"

// Move this check outside the component
const getAppId = (pathname: string | null) => {
  const id = pathname?.split("/")[2]
  if (!id) {
    redirect("apps/studio")
  }
  return id
}

const CustomizedChat = () => {
  const [isChatVisible, setIsChatVisible] = useState<boolean>(true)

  const pathname = usePathname()
  const appId = React.useMemo(() => getAppId(pathname), [pathname])

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible)
  }

  const { appCustomization, setCustomization } = useAppStore(
    useShallow((state) => ({
      appCustomization: state.appCustomization,
      setCustomization: state.setCustomization,
    }))
  )

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

  const fetchCustomization = React.useCallback(async () => {
    try {
      const CustomizedData = await getAppCustomization(appId)
      setCustomization({
        ...CustomizedData,
      })
    } catch (error) {
      console.error("Error fetching customization:", error)
    }
  }, [appId, setCustomization])

  React.useEffect(() => {
    fetchCustomization()
  }, [fetchCustomization])

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const renderIcon = () => {
    if (botLogo) {
      return botLogo.length > 10 ? (
        <Image
          src={botLogo}
          alt="Bot Logo"
          className="h-6 w-6 rounded-full object-cover"
          width={6}
          height={6}
        />
      ) : (
        <div className="flex h-6 w-6 items-center justify-center rounded-full object-cover text-xl">
          {botLogo}
        </div>
      )
    } else {
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#116be1] object-cover">
          <RiChatSmile3Fill className="text-white" />
        </div>
      )
    }
  }

  return (
    <>
      {!isChatVisible && (
        <div className="flex h-full w-full flex-col items-center justify-between rounded-[8px] bg-white px-8 py-8">
          <RiChatSmile3Fill className="h-6 w-6 text-white" />
        </div>
      )}
      {isChatVisible && (
        <div className="flex h-full w-full flex-col items-center justify-between rounded-[8px] bg-white px-8 py-8">
          <div
            className="flex h-[calc(100vh-100px)] w-[80%] flex-col gap-2 overflow-y-auto rounded-[8px] border"
            style={{ backgroundColor: bgColor }}
          >
            {/* Keep the header part */}
            <div className="sticky top-0 flex w-full flex-col justify-center shadow-md"
              style={{ backgroundColor: aiChatColor }}>
              <div
                className="flex w-full items-center rounded-b-[8px] p-3"
              // style={{ backgroundColor: aiChatColor }}
              >
                {renderIcon()}
                {botName && (
                  <span className="ml-2 font-semibold text-black">
                    {botName}
                  </span>
                )}
              </div>
            </div>

            {/* Replace the chat messages section */}
            <div className="flex flex-1 flex-col gap-2 p-2">
              {dummyChatArray.map((message: { role: string, text: string }, index) => (
                <div key={index} className="flex w-full items-start">
                  {message.role === "system" ? (
                    <>
                      <div className="mr-2 flex-shrink-0">
                      {renderIcon()}
                      </div>
                      <div
                        className="mb-4 max-w-[80%] rounded-2xl p-2"
                        style={{ backgroundColor: aiChatColor }}
                      >
                        <p
                          style={{
                            color: botTextColor,
                            fontSize: botFontSize,
                            fontWeight: botFontWeight,
                            fontFamily: botFontFamily,
                          }}
                        >
                          {message.text}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="ml-auto flex max-w-[80%] items-start justify-end gap-2">
                        <div
                          className="mb-4 rounded-[8px] p-2"
                          style={{
                            backgroundColor: userChatColor,
                            color: userTextColor,
                          }}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <div className=" mt-1 flex-shrink-0">
                          <PiUserCircleFill className="h-6 w-6 rounded-full bg-white text-sm font-semibold text-gray-400" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Keep the input section */}
            <div className="sticky bottom-0 mt-2 flex w-full flex-col justify-center rounded-t-lg"
              style={{ backgroundColor: bgColor }}>
              <div
                className="flex w-full items-center rounded-[8px] p-1 px-4"
              // style={{ backgroundColor: aiChatColor }}
              >
                <div className="relative flex-1">
                  <TextArea
                    className="w-full resize-none rounded-[8px] border-none bg-white px-4 py-4 pr-16 shadow-[0_-1px_1px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.2)] focus:ring-blue-700"
                    placeholder="Ask me... 😄"
                    rows={1}
                    ref={textareaRef}
                    onInput={handleInput}
                  ></TextArea>
                    <div className="absolute bottom-4 right-2 cursor-pointer rounded-lg bg-blue-700 p-2"
                    style={{ backgroundColor: userChatColor }}
                    >
                    <RiSendPlane2Fill className="h-5 w-5"
                      style={{ color: userTextColor }}
                    />
                    </div>
                </div>
              </div>
              <div className="mt-2 flex w-full justify-center rounded-t-lg border bg-gray-100 p-1 text-black">
                <span>Powered by Agentra</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className="fixed bottom-4 right-4 mr-2 flex h-14 w-14 flex-shrink-0 flex-grow-0 cursor-pointer items-center justify-center rounded-full bg-[#116be1] object-cover"
        onClick={toggleChatVisibility}
      >
        <RiChatSmile3Fill className="h-8 w-8 text-white" />
      </div>
    </>
  )
}

export default CustomizedChat
