import React from "react";

export const ChatLoadingIcon = () => {
  return (
    <div className="flex items-end gap-3 self-start">
      <p className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></p>
      <div className="flex space-x-1 p-3">
        <div className="animate-wave h-2 w-2 rounded-full bg-blue-500 [animation-delay:0s]"></div>
        <div className="animate-wave h-2 w-2 rounded-full bg-blue-500 [animation-delay:0.2s]"></div>
        <div className="animate-wave h-2 w-2 rounded-full bg-blue-500 [animation-delay:0.4s]"></div>
      </div>
    </div>
  );
};
