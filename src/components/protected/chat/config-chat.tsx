"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { runAgent } from "@/actions/ai/ai-call"
import { updateAppConfig } from "@/actions/app/app-config-action"
import { createConversation } from "@/actions/chat/chat-action"
import { useAppStore } from "@/store/useAppStore"
import { TokenUsage } from "@langchain/core/language_models/base"
import { readStreamableValue } from "ai/rsc"
import Cookies from "js-cookie"
import { BsArrowRepeat } from "react-icons/bs"
import { RiSendPlaneFill } from "react-icons/ri"
import useSWR from "swr"
import { v4 as uuidv4 } from "uuid"
import { useShallow } from "zustand/react/shallow"

import { db } from "@/config/db"
import { messages as _messages, MessagesType } from "@/db/schema"

import { TModelKey } from "@/hooks/use-llm"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { TextArea } from "@/components/ui/textarea"

import { useMessageScroll } from "./chat-components"
import MessageList from "./message-list"
import ModalSelect from "./modal-select"

const ConfigChat = () => {
  const router = useRouter()
  const pathname = usePathname()
  const appId = pathname?.split("/")[2] || ""
  const { toast } = useToast()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    selectedFileKeys,
    appConfigDetails,
    openingStatement,
    refresh,
    setRefresh,
  } = useAppStore(
    useShallow((state) => ({
      selectedFileKeys: state.selectedFileKeys,
      appConfigDetails: state.appConfigDetails,
      openingStatement: state.openingStatement,
      refresh: state.refresh,
      setRefresh: state.setRefresh,
    }))
  )

  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessagesType[]>([])
  const [input, setInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<TModelKey>("gpt-4o-mini")

  useMessageScroll(messages)
  useEffect(() => {
    if (appId) {
      const storedId = Cookies.get(`conversationIdFor${appId}`)
      if (storedId) setConversationId(storedId)
    }
  }, [appId])

  const getChats = useCallback(async () => {
    if (!conversationId) return []
    const res = await fetch(
      `/api/conversation/get-messages?conversationId=${conversationId}`
    )
    const { data } = await res.json()
    return data
  }, [conversationId])

  const { data: previousChat } = useSWR(
    conversationId ? ["chat", conversationId] : null,
    async () => {
      const chats = await getChats()
      return chats.map((message: MessagesType) => ({
        ...message,
        createdAt: new Date(message.createdAt),
        role: message.role as "system" | "user" | "system" | "data",
      }))
    }
  )
  useEffect(() => {
    if (previousChat) {
      setMessages(previousChat)
    }
  }, [previousChat])

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const newConvId = conversationId || uuidv4()
    
    try {
      if (!conversationId) {
        await createConversation({
          appId,
          fileKeys: selectedFileKeys,
          newConversationId: newConvId,
          openingStatement:
            openingStatement || appConfigDetails?.openingStatement || "",
        })
        Cookies.set(`conversationIdFor${appId}`, newConvId, {
          expires: 0.03125,
        })
        setConversationId(newConvId)
      }

      await db.insert(_messages).values({
        id: uuidv4(),
        conversationId: newConvId,
        content: input,
        role: "user",
        messageType: "text",
        timestamp: new Date().toISOString(),
      })

      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          content: input,
          role: "user",
          createdAt: new Date(),
          conversationId: newConvId,
          messageType: "text",
          totalUsedToken: null,
          completionToken: null,
          promptToken: null,
          timestamp: null,
        },
      ])
      setIsLoading(true)

      const { streamData } = await runAgent({
        modelKey: selectedModel,
        instruction: appConfigDetails?.instructions || "",
        input,
        conversationId: newConvId,
        messages,
        fileKeys: selectedFileKeys.map((file) => ({
          fileKey: file.fileKey,
          isActive: true,
        })),
        followUp: appConfigDetails?.followUp ?? false,
      })

      let aiResponse = ""
      const startTime = Date.now()
      let finalTokenUsage: TokenUsage | undefined

      for await (const chunk of readStreamableValue(streamData)) {
        if (!chunk) continue

        if (chunk.error) {
          throw new Error(chunk.error)
        }

        if (chunk.content) {
          aiResponse = chunk.content
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            const tokenUsage = chunk.tokenUsage || {
              completionTokens: 0,
              promptTokens: 0,
              totalTokens: 0,
            }

            if (last?.role === "system") {
              return [
                ...prev.slice(0, -1),
                {
                  ...last,
                  content: aiResponse,
                  completionToken: String(tokenUsage.completionTokens),
                  promptToken: String(tokenUsage.promptTokens),
                  totalUsedToken: String(tokenUsage.totalTokens),
                },
              ]
            }
            return [
              ...prev,
              {
                id: uuidv4(),
                content: aiResponse,
                role: "system",
                createdAt: new Date(),
                conversationId: newConvId,
                messageType: "text",
                completionToken: String(tokenUsage.completionTokens),
                promptToken: String(tokenUsage.promptTokens),
                totalUsedToken: String(tokenUsage.totalTokens),
                timestamp: ((Date.now() - startTime) / 1000).toFixed(2),
              },
            ]
          })
        }

        if (chunk.tokenUsage) {
          finalTokenUsage = chunk.tokenUsage
        }
      }

      // Update final token usage after stream completes
      if (finalTokenUsage) {
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          if (last?.role === "system") {
            return [
              ...prev.slice(0, -1),
              {
                ...last,
                completionToken: String(finalTokenUsage?.completionTokens),
                promptToken: String(finalTokenUsage?.promptTokens),
                totalUsedToken: String(finalTokenUsage?.totalTokens),
              },
            ]
          }
          return prev
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setInput("")
      setIsLoading(false)
    }
  }, [
    input,
    conversationId,
    messages,
    appConfigDetails,
    appId,
    selectedFileKeys,
    openingStatement,
    toast,
    selectedModel,
  ])

  const handleRefresh = useCallback(async () => {
    try {
      await updateAppConfig(appId, {
        ...appConfigDetails,
        contextFileKeys: selectedFileKeys.toString(),
      })
      toast({
        title: "Config Updated",
        description: "Start new conversation...",
        variant: "success",
      })
    } catch (error) {
      console.error("Update error:", error)
    }
    Cookies.remove(`conversationIdFor${appId}`)
    setMessages([])
    setConversationId(null)
    setRefresh(false)
  }, [appConfigDetails, appId, selectedFileKeys, toast, setRefresh])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage]
  )

  if (!appId) {
    router.push("apps/studio")
    return null
  }

  return (
    <section className="w-full">
      <ModalSelect
        selectedModelKey={selectedModel}
        onModelSelect={(modelKey) => setSelectedModel(modelKey)}
      />
      <div className="flex h-full w-full flex-col items-center justify-between rounded-[8px]">
        <div
          className={`flex h-[calc(100vh-100px)] w-full flex-col gap-2 bg-[#f1f3f7] ${
            refresh ? "" : "overflow-y-auto"
          } relative z-0 rounded-b-[8px] border`}
          id="message-container"
        >
          {refresh && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
              <Button onClick={handleRefresh} variant="whiteblue">
                <BsArrowRepeat size={20} />
                <span className="font-semibold">Press to refresh</span>
              </Button>
            </div>
          )}

          <div className="sticky top-0 z-20 flex items-center justify-between bg-gray-100 p-2">
            <span className="text-lg">preview</span>
            <button
              onClick={handleRefresh}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <BsArrowRepeat className="text-gray-600" size={20} />
            </button>
          </div>

          <MessageList messages={messages} isLoading={isLoading} />

          <section className="z-1 sticky bottom-5 flex w-full flex-col justify-center px-10">
            <div className="relative flex-1">
              <TextArea
                className="w-full resize-none rounded-[8px] border-none bg-white px-4 py-4 pr-16 text-gray-800 shadow-md focus:ring-blue-700"
                placeholder="Let's talk..."
                rows={1}
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className="absolute bottom-3.5 right-2 cursor-pointer rounded-lg bg-blue-700 p-[6px] pl-[4px]"
                disabled={isLoading}
              >
                <div className="mr-1 rotate-45">
                  <RiSendPlaneFill color="white" size={24} />
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default React.memo(ConfigChat)
