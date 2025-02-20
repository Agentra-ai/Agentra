import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { PiUserCircleFill } from "react-icons/pi";
import { RiChatSmile3Fill } from "react-icons/ri";
import { MessagesType } from "@/drizzle/schema";
import { ChatLoadingIcon } from "@/components/loading/chat-loading-icon";
import { useShallow } from "zustand/react/shallow";
import { Markdown } from "./use-markdown";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import dayjs from "dayjs";
import Image from "next/image";

type Props = {
  isLoading: boolean;
  messages: MessagesType[];
};

const MessageList = ({ messages, isLoading }: Props) => {
  const { botLogo, aiChatColor, userChatColor, botTextColor, userTextColor } =
    useAppStore(useShallow((state) => state.appCustomization));

  const conversationOpener = useAppStore(
    (app) => app.appConfigDetails.openingStatement,
  );

  if (!messages) return <> no messange</>;

  // Check if the conversation opener is already in the messages array
  const isConversationOpenerInMessages = messages.some(
    (message) => message.content === conversationOpener,
  );

  return (
    <div className="relative -z-10 flex w-full flex-1 flex-col gap-3 py-4 pl-1 pr-2">
      {/* Show conversation opener only if it's not already in the messages array */}
      {conversationOpener && !isConversationOpenerInMessages && (
        <div className="flex w-full items-start">
          <div className="mr-2 flex-shrink-0">
            {botLogo ? (
              <Image
                src={"/floxify-logo.png"}
                alt="Bot Logo"
                className="h-8 w-8 rounded-full object-cover"
                width={8}
                height={8}
              />
            ) : (
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#116be1]">
                <RiChatSmile3Fill className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
          <div className="mb-4 max-w-[80%] rounded-2xl bg-white p-4 py-3">
            <div className="prose prose-sm max-h-[1500px] cursor-pointer overflow-y-auto">
              {conversationOpener}
            </div>
          </div>
        </div>
      )}

      {messages.map((message, index) => {
        return (
          <div key={index} className="flex w-full items-start">
            {message.role === "assistant" || message.role === "system" ? (
              <>
                <div className="mr-2 flex-shrink-0">
                  {botLogo ? (
                    <Image
                      src="/floxify-logo.png"
                      alt="Bot Logo"
                      className="h-8 w-8 rounded-full object-cover"
                      width={8}
                      height={8}
                    />
                  ) : (
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#116be1]">
                      <RiChatSmile3Fill className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="mb-4 max-w-[80%] items-center rounded-2xl bg-white p-4 py-3">
                      <div className="prose prose-sm cursor-pointer overflow-y-auto">
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="start"
                    sideOffset={-6}
                    className="mt-2 rounded-md bg-white p-2 text-[13px] text-gray-500 shadow-lg"
                  >
                    {dayjs(message.createdAt).format("DD/MM/YYYY, h:mm A")}
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div
                      className="mb-4 ml-auto flex max-w-[80%] items-center justify-end gap-2 rounded-2xl bg-[#e3eaff]"
                      // style={{
                      //   backgroundColor: userChatColor,
                      //   color: userTextColor,
                      // }}
                    >
                      <p
                        className="rounded-2xlborder-none w-full resize-none px-4 py-3 text-[14px] focus:ring-blue-700"
                        // style={{
                        //   color: userTextColor,
                        //   backgroundColor: userChatColor,
                        // }}
                      >
                        {message.content}
                      </p>{" "}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="end"
                    sideOffset={-6}
                    className="mt-2 rounded-md bg-white p-2 text-[13px] text-gray-500 shadow-lg"
                  >
                    {dayjs(message.createdAt).format("DD/MM/YYYY, h:mm A")}
                  </TooltipContent>
                </Tooltip>
                <div className="ml-2 mt-1 flex-shrink-0">
                  {" "}
                  <PiUserCircleFill className="h-9 w-9 text-gray-400" />{" "}
                </div>
              </>
            )}
          </div>
        );
      })}

      {isLoading && (
        <div className="loading">
          <ChatLoadingIcon />
        </div>
      )}
    </div>
  );
};

export default MessageList;
