// "use client";

// import LoadingIcon from "@/components/loading";
// import { useState } from "react";
// import ChatInput from "./component/chat-input";
// import { ChatMessages, TMessage } from "./component/render-message";

// const ChatSessionPage = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [messages] = useState<TMessage[]>([
//     {
//       role: "human",
//       rawHuman: "What are the benefits of React?",
//       inputProps: { context: "Programming discussion" }
//     },
//     {
//       role: "ai",
//       rawAI: "**Here are key benefits of React:**\n\n- *Virtual DOM* for optimal performance\n- *Component-based* architecture\n- *Large ecosystem* of libraries\n- *Strong community* support\n- *Easy learning curve*"
//     },
//     {
//       role: "human",
//       rawHuman: "Can you explain Virtual DOM?",
//       inputProps: { context: "React concepts" }
//     },
//     {
//       role: "ai",
//       rawAI: "**Virtual DOM Explanation:**\n\n1. It's a lightweight copy of the real DOM\n2. React compares Virtual DOM with real DOM\n3. Only updates what's necessary\n4. Results in faster rendering"
//     },
//     {
//       role: "human",
//       rawHuman: "Thanks! That's helpful",
//       inputProps: { context: "Conversation closing" }
//     },
//     {
//       role: "ai",
//       rawAI: "*You're welcome!* Let me know if you have any other questions about React! 👋"
//     },
//     {
//       role: "human",
//       rawHuman: "Can you show me a simple React component?",
//       inputProps: { context: "React code example" }
//     },
//     {
//       role: "ai",
//       rawAI: "**Here's a simple React component:**\n\n```jsx\nimport React from 'react';\n\nconst HelloWorld = () => {\n  return <h1>Hello, World!</h1>;\n};\n\nexport default HelloWorld;\n```"
//     }
//   ]);

//   const renderLoader = () => {
//     return (
//       <div className="w-full h-full flex justify-center items-center">
//         <LoadingIcon />
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col items-center w-full h-[calc(100vh-150px)] bg-white dark:bg-zinc-800 rounded-xl py-6 px-4 relative overflow-hidden">
//       {!isLoading && (
//         <>
//           <ChatMessages messages={messages} />
//           <ChatInput />
//         </>
//       )}
//     </div>
//   );
// };

// export default ChatSessionPage;