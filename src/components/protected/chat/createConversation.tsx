"use client"

import { useEffect, useState } from "react"
import { createConversation } from "@/actions/chat/chat-action"
import Cookies from "js-cookie"
import { v4 as uuidv4 } from "uuid"

type ChatState = {
  conversationId: string | null
  setConversationId: (id: string | null) => void
}

export const useConversation = (
  appId: string,
  selectedFileKeys: { fileKey: string; docName: string }[],
  openingStatement: string
): ChatState => {
  const [conversationId, setConversationId] = useState<string | null>(null)

  useEffect(() => {
    const initializeConversation = async () => {
      try {
        let id = Cookies.get("conversationId")
        if (!id) {
          const newConversationId = uuidv4()
          console.log(
            "Selected newConversationId :::::",
            newConversationId,
            selectedFileKeys
          )
          console.log(openingStatement)
          await createConversation({
            appId,
            fileKeys: selectedFileKeys,
            newConversationId,
            openingStatement: openingStatement,
          })

          if (newConversationId && newConversationId !== "") {
            id = newConversationId
            Cookies.set("conversationId", id, { expires: 1 / 24 })
            setConversationId(id)
          }
        } else {
          setConversationId(id)
        }
        console.log("Conversation ID :::::", id)
      } catch (error) {
        console.error("Error initializing conversation:", error)
      }
    }

    initializeConversation()
  }, [appId, selectedFileKeys, openingStatement])

  return { conversationId, setConversationId }
}
