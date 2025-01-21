"use client"

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { updateAppConfig } from "@/actions/app/app-config-action"
import { createConversation } from "@/actions/chat/chat-action"
import { useAppStore } from "@/store/useAppStore"
import { Message } from "ai"
import { useChat } from "ai/react"
import Cookies from "js-cookie"
import { BsArrowRepeat, BsFillSendFill } from "react-icons/bs"
import {
  RiChatSmile3Fill,
  RiSendPlane2Fill,
  RiSendPlaneFill,
} from "react-icons/ri"
import useSWR from "swr"
import { v4 } from "uuid"
import { useShallow } from "zustand/react/shallow"
import { messages as _messages, MessagesType } from "@/db/schema"
import { useToast } from "@/hooks/use-toast"
import { TextArea } from "@/components/ui/textarea"
import { useMessageScroll } from "./chat-components"
import MessageList from "./message-list"
import ModalSelect from "./modal-select"
import { Button } from "@/components/ui/button"

// Main component
const ConfigChat = () => {
  const router = useRouter()
  const pathname = usePathname()
  const appId = pathname?.split("/")[2] || ""
  const { toast } = useToast()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    bgColor,
    userChatColor,
    botLogo,
    selectedFileKeys,
    appConfigDetails,
    openingStatement,
    refresh,
    setRefresh,
  } = useAppStore(
    useShallow((state) => ({
      ...state.appCustomization,
      selectedFileKeys: state.selectedFileKeys,
      appConfigDetails: state.appConfigDetails,
      openingStatement: state.openingStatement,
      refresh: state.refresh,
      setRefresh: state.setRefresh,
    }))
  )

  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (appId) {
      const storedId = Cookies.get(`conversationIdFor${appId}`)
      if (storedId) setConversationId(storedId)
    }
  }, [appId])

  const getChats = useCallback(async () => {
    const res = await fetch(
      `/api/conversation/get-messages?conversationId=${conversationId}`
    )
    const { data } = await res.json()
    return data
  }, [conversationId])

  const { data: previousChat } = useSWR(
    conversationId ? ["chat", conversationId] : null,
    async () => {
      if (!conversationId) return []
      const chats = await getChats()
      return chats.map((message: MessagesType) => ({
        ...message,
        createdAt: new Date(message.createdAt),
        role: message.role as "system" | "user" | "assistant" | "data",
      }))
    }
  )

  const [payloadState, setPayloadState] = useState({
    instructions: appConfigDetails.instructions,
    followUp: appConfigDetails?.followUp,
    suggestedQuestions: appConfigDetails?.suggestedQuestions,
    appDocumentsKeys: selectedFileKeys,
    appId: appConfigDetails?.appId,
    suggestedQuestionsEnabled: appConfigDetails?.suggestedQuestionsEnabled,
    conversationId: conversationId || Cookies.get(`conversationIdFor${appId}`),
  })

  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    setMessages,
    isLoading,
  } = useChat({
    api: "/api/chat",
    body: { ...payloadState },
    initialMessages: previousChat || [],
  })

  useMessageScroll(messages)

  useEffect(() => {
    if (!isLoading && conversationId) {
      getChats()
    }
  }, [isLoading, conversationId, getChats])

  const handleSendMessage = useCallback(async () => {
    if (isCreating) return

    // If there's no conversation ID, create one first
    if (!conversationId) {
      setIsCreating(true)
      const ConvId = v4()
      const newConvId = await createConversation({
        appId,
      fileKeys: selectedFileKeys,
        newConversationId: ConvId,
        openingStatement:
          openingStatement || appConfigDetails?.openingStatement || "",
      })
      console.log("New Conversation ID:", newConvId, ConvId)
      Cookies.set(`conversationIdFor${appId}`, ConvId, { expires: 0.03125 })
      setConversationId(ConvId)
      setIsCreating(false)

      setPayloadState({
        conversationId: ConvId,
        instructions: appConfigDetails.instructions,
        followUp: appConfigDetails?.followUp,
        suggestedQuestions: appConfigDetails?.suggestedQuestions,
        appDocumentsKeys: selectedFileKeys,
        appId: appConfigDetails?.appId,
        suggestedQuestionsEnabled: appConfigDetails?.suggestedQuestionsEnabled,
      })

      console.log("Payload State:", payloadState)
      handleSubmit()
    } else {
      setPayloadState({
        conversationId: conversationId,
        instructions: appConfigDetails.instructions,
        followUp: appConfigDetails?.followUp,
        suggestedQuestions: appConfigDetails?.suggestedQuestions,
        appDocumentsKeys: selectedFileKeys,
        appId: appConfigDetails?.appId,
        suggestedQuestionsEnabled: appConfigDetails?.suggestedQuestionsEnabled,
      })
      console.log("Payload State:", payloadState)
      handleSubmit()
    }
  }, [
    isCreating,
    conversationId,
    appId,
    selectedFileKeys,
    openingStatement,
    appConfigDetails,
    handleSubmit,
  ])

  const handleRefresh = useCallback(async () => {
    try {
      const newConfig = {
        ...appConfigDetails,
        appId,
        contextFileKeys: JSON.stringify(selectedFileKeys),
      }
      await updateAppConfig(appId, newConfig)
      toast({
        title: "Config Updated",
        description: "Start new conversation...",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to update config before refresh:", error)
    }
    Cookies.remove(`conversationIdFor${appId}`)
    setMessages([])
    setConversationId(null)
    setRefresh(false)
  }, [appConfigDetails, appId, selectedFileKeys, toast, setMessages, setConversationId, setRefresh])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault() // Prevent new line
        handleSendMessage() // Trigger send message
      }
    },
    [handleSendMessage]
  )

  useEffect(() => {
    setRefresh(false)
  }, [setRefresh])

  const MemoizedMessageList = React.memo(MessageList)

  if (!appId) {
    router.push("apps/studio")
    return null
  }

  return (
    <>
      <ModalSelect />
      <div className="flex h-full w-full flex-col items-center justify-between rounded-[8px]">
        <div
          className={`flex h-[calc(100vh-100px)] w-full flex-col bg-[#f1f3f7] gap-2 ${
            refresh ? "" : "overflow-y-auto"
          } rounded-b-[8px] border z-0 relative`}
          id="message-container"
        >
          {refresh && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <Button onClick={handleRefresh} variant="whiteblue">
                <BsArrowRepeat size={20} />
                <span className="font-semibold">Press to refresh</span>
              </Button>
            </div>
          )}
          <div className="sticky top-0 bg-gray-100 flex items-center justify-between p-2 z-20">
            <span className="text-md">preview</span>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <BsArrowRepeat className="text-gray-600" size={20} />
            </button>
          </div>

          <MemoizedMessageList
            messages={messages as MessagesType[]}
            isLoading={isLoading}
          />
          <section
            className="sticky z-1 bottom-5 flex w-full flex-col justify-center px-10"
            style={{ backgroundColor: "", color: userChatColor }}
          >
            <div className="relative flex-1">
              <TextArea
                className="w-full resize-none rounded-[8px] border-none bg-white px-4 py-4 pr-16 text-gray-800 shadow-md focus:ring-blue-700"
                placeholder="Let's talk..."
                rows={1}
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              ></TextArea>
              <button
                onClick={handleSendMessage}
                className="absolute bottom-3.5 right-2 cursor-pointer rounded-lg bg-blue-700 p-[6px] pl-[4px]"
              >
                <div className="rotate-45 mr-1">
                  <RiSendPlaneFill color="white" size={24} />
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default React.memo(ConfigChat)