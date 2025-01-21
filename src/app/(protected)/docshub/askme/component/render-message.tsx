// 'use client'

// import { useEffect, useRef } from "react";
// import { HumanMessage } from "./human-message";
// import { AIMessage } from "./agent-message";
// import { MessagesType } from "@/db/schema";

// export type TMessage = {
//   role: "human" | "ai";
//   rawHuman?: string;
//   rawAI?: string;
//   inputProps?: {
//     context?: string;
//     image?: string;
//   };
//   messageId?: string;
// };

// export function ChatMessages({ messages }: { messages: TMessage[] }) {
//   const chatContainer = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
//   const scrollToBottom = () => {
//     if (chatContainer.current) {
//       chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
//     }
//   };
//   return (
//     <div
//       className="flex flex-col w-full max-w-2xl items-center h-[100dvh] mx-auto overflow-y-auto no-scrollbar pt-[60px] pb-[200px]"
//       ref={chatContainer}
//       id="chat-container"
//     >
//       <div className="w-full p-2 flex flex-1 flex-col gap-8">
//         <div className="flex flex-col gap-6 w-full items-start">
//           { messages && messages.map((msg, index) => {
//             if (msg.role === "human") {
//               return <HumanMessage key={index} chatMessage={msg} isLast={false} />;
//             }
//             return <AIMessage key={index} chatMessage={msg} isLast={false} />;
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }