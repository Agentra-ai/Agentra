"use client";

import React from "react";
import { ConversationType } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import LogMessagesList from "@/components/protected/message-lists/log-messages";
import { useConversationMessages } from "@/app/services/conversation/app-conversation-service";

interface LogDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLog: ConversationType | null;
}

export const LogDrawer = ({
  open,
  onOpenChange,
  selectedLog,
}: LogDrawerProps) => {
  // Use the custom hook to fetch messages
  const { messages, isLoading, isError } = useConversationMessages(
    selectedLog?.id || ""
  );

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={handleClose} direction="right">
      <DrawerContent
        direction="right"
        className="h-screen w-[50%] rounded-l-[8px] text-[13px]"
      >
        <DrawerHeader className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b py-2">
            <div className="flex flex-col space-y-1">
              <DrawerTitle>{selectedLog?.name || "Log Details"}</DrawerTitle>
              <DrawerDescription>ID : {selectedLog?.id}</DrawerDescription>
            </div>
            <div className="flex items-center space-x-2"></div>
            <span className="rounded-md border bg-gray-100 p-2 text-[14px]">
              openai-4o-mini{" "}
            </span>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Render messages using LogMessagesList */}
            <LogMessagesList
              messages={messages}
              isLoading={isLoading}
            />
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};