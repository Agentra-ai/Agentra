// 'use client'

// import { useRef } from "react";
// import { Flex } from "@/components/ui/flex";
// import { useMarkdown } from "@/hooks/use-markdown";

// export type TAIMessage = {
//   chatMessage: any;
//   isLast: boolean;
// };

// export const AIMessage = ({ chatMessage }: any) => {
//   const { rawAI, messageId } = chatMessage;
//   const messageRef = useRef<HTMLDivElement>(null);
//   const { renderMarkdown } = useMarkdown();

//   return (
//     <div className="flex flex-row mt-4 w-full">
//       <Flex
//         ref={messageRef}
//         direction="col"
//         gap="md"    
//         items="start"
//         className="w-full p-2 flex-1 overflow-hidden prose prose-slate dark:prose-invert max-w-none"
//       >
//         {rawAI && renderMarkdown(rawAI, false, messageId)}
//       </Flex>
//     </div>
//   );
// };