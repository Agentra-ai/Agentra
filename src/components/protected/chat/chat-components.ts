import { MessagesType } from "@/db/schema"
import { Message } from "ai"
import { useEffect } from "react"

export const useMessageScroll = (messages: MessagesType[]) => {
    useEffect(() => {
      const messageContainer = document.getElementById("message-container")
      if (messageContainer) {
        const isAtBottom =
          messageContainer.scrollHeight -
            messageContainer.scrollTop -
            messageContainer.clientHeight <
          100
        if (isAtBottom) {
          messageContainer.scrollTop = messageContainer.scrollHeight
        }
      }
    }, [messages])
  
    // Scroll to bottom on send message
    useEffect(() => {
      const messageContainer = document.getElementById("message-container")
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight
        messageContainer.scrollTo({
          top: messageContainer.scrollHeight,
          behavior: "smooth",
        })
      }
    }, [messages.length])
  }