import React from "react"
import dayjs from "dayjs"
import { PiUserCircleFill } from "react-icons/pi"
import { RiChatSmile3Fill } from "react-icons/ri"
import ReactMarkdown from "react-markdown"

import { MessagesType } from "@/db/schema"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChatLoadingIcon } from "@/components/loading/chat-loading-icon"
import { Markdown } from "../chat/use-markdown"

type Props = {
  isLoading: boolean
  messages: MessagesType[] | null
}

const LogMessagesList = ({ messages, isLoading }: Props) => {
  // const {
  //   botLogo,
  //   botName,
  //   aiChatColor,
  //   userChatColor,
  //   botTextColor,
  //   userTextColor,
  //   botFontSize,
  //   botFontWeight,
  //   botFontFamily,
  // } = useAppStore(useShallow((state) => state.appCustomization))

  console.log(messages)
  // const conversationOpener = useAppStore(
  //   (app) => app.appConfigDetails.openingStatement
  // )

  if (!messages || messages.length === 0)
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-semibold text-[#454545]">
          no message found. only session created.
        </span>
      </div>
    )

    if (isLoading) {
      return <div>Loading messages...</div>;
    }
  
  return (
    <div className="relative flex h-full w-full flex-1 flex-col gap-2 overflow-y-auto rounded-lg bg-[#f3f5f7] px-2 py-4 text-[14px]">
      {messages &&
        messages.map((message: MessagesType, index) => {
          return (
            <div key={index} className="flex w-full items-start">
              {message.role === "assistant" || message.role === "system" ? (
                <>
                  <div className="mr-2 flex-shrink-0">
                    {/* {botLogo ? (
                    <img
                      // src={URL.createObjectURL(botLogo)}
                      src={"/dama-logo.png"}
                      alt="Bot Logo"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : ( */}
                    <div className="mt-1 flex h-8 w-8 items-center justify-center  rounded-full bg-[#116be1]">
                      <RiChatSmile3Fill className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div
                        className="mb-4 max-w-[80%] items-center rounded-2xl bg-white p-4 py-3 cursor-pointer"
                      >
                        <div className="overflow-y-auto max-h-[1200px] prose prose-sm">
                          <Markdown children={message.content} />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      sideOffset={-8}
                      className="mt-2 rounded-md bg-white p-2 text-[13px] text-gray-500 shadow-lg"
                    >
                      {message.completionToken} token | {message.totalUsedToken}{" "}
                      total token | {message.timestamp} sec |{" "}
                      {dayjs(message.createdAt).format("DD/MM/YYYY, h:mm A")}
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip  delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div className="mb-4 ml-auto flex max-w-[80%] cursor-pointer items-center justify-end gap-2 rounded-[8px] bg-blue-100 text-black">
                        <p
                          // ref={textAreaRef}
                          className="w-full resize-none rounded-[8px] border-none bg-inherit px-4 py-3 focus:ring-blue-700"
                        >
                          {message.content}
                        </p>{" "}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      sideOffset={-8}
                      className="mt-2 rounded-md bg-white p-2 text-[13px] text-gray-500 shadow-lg"
                    >
                      {message.promptToken} token | {message.timestamp} sec |{" "}
                      {dayjs(message.createdAt).format("DD/MM/YYYY, h:mm A")}
                    </TooltipContent>
                  </Tooltip>
                  <div className="ml-2 mt-1 flex-shrink-0">
                    {" "}
                    <PiUserCircleFill className="h-9 w-9 text-gray-500" />{" "}
                  </div>
                </>
              )}
            </div>
          )
        })}
      {isLoading && (
        <div className="loading">
          <ChatLoadingIcon />
        </div>
      )}
    </div>
  )
}

export default LogMessagesList
