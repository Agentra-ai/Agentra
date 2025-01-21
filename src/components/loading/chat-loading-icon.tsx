import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export const ChatLoadingIcon = () => {
  return (
    <div className="flex items-end gap-3 self-start">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex space-x-1 p-3">
        <div className="h-2 w-2 animate-wave rounded-full bg-blue-500 [animation-delay:0s]"></div>
        <div className="h-2 w-2 animate-wave rounded-full bg-blue-500 [animation-delay:0.2s]"></div>
        <div className="h-2 w-2 animate-wave rounded-full bg-blue-500 [animation-delay:0.4s]"></div>
      </div>
    </div>
  )
}
