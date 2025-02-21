import React from "react";

type Props = {};

//this is demo chat component, we can reuse this component in the chat sections
const ChatComponent = (props: Props) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between rounded-[8px] bg-white">
      {/* Header */}
      <div className="flex w-full items-center justify-between p-2 px-4">
        <h2 className="text-lg font-semibold">Preview</h2>
        <button className="rounded-[8px] bg-blue-600 px-4 py-2 text-[14px] text-white">
          Deploy
        </button>
      </div>

      {/* Chat section */}
      <div className="flex h-[calc(100vh-100px)] w-full flex-col gap-2 overflow-y-auto rounded-[8px] border bg-[#fdfdff] px-4 py-3">
        {/* Chat messages */}
        <div className="flex flex-1 flex-col gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex w-full">
              {index % 2 === 0 ? (
                <div className="mb-4 flex w-[80%] items-center rounded-[8px] bg-[#f5f5fa] p-2">
                  <span className="mr-2 items-start justify-start text-sm font-semibold">
                    AI
                  </span>
                  <p className="text-sm">Haa bhai!</p>
                </div>
              ) : (
                <div className="mb-4 ml-auto flex w-[80%] items-center gap-2 rounded-[8px] bg-[#ebf5ff] p-2">
                  <p className="text-sm">
                    Hi, welcome to our interview. I am the interviewer for this
                    technology company.
                  </p>
                  <span className="mr-2 justify-start text-sm font-semibold">
                    User
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Fixed input for message */}
        <div className="sticky bottom-2 flex w-full items-center rounded-[8px] bg-[#fff0de] p-1">
          <input
            type="text"
            className="flex-1 rounded-[8px] border px-4 py-2 outline-none"
            placeholder="Type a message..."
          />
          <button className="ml-2 rounded-[8px] bg-blue-600 px-4 py-2 text-white">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
