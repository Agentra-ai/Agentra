// 'use client'
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { ArrowDown } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function ChatInput() {
//   const [message, setMessage] = useState("");
//   const [showButton, setShowButton] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [transcribing, setTranscribing] = useState(false);

//   const scrollToBottom = () => {
//     // ...existing logic...
//   };

//   const handleSend = (e: React.FormEvent) => {
//     e.preventDefault();
//     // ...send message logic...
//   };

//   const renderScrollToBottom = () => {
//     if (showButton && !recording && !transcribing) {
//       return (
//         <motion.span
//           initial={{ scale: 0, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0, opacity: 0 }}
//         >
//           <Button onClick={scrollToBottom} variant="outline">
//             <ArrowDown size={16} />
//           </Button>
//         </motion.span>
//       );
//     }
//   };

//   return (
//     <form onSubmit={handleSend} className="w-full max-w-2xl mx-auto flex flex-row gap-2 border-t border-gray-300 dark:border-gray-600 pt-2">
//       <input
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none"
//       />
//       <Button type="submit" className="rounded-md">
//         Send
//       </Button>
//       {renderScrollToBottom()}
//     </form>
//   );
// }
