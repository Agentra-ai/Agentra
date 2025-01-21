// "use client"

// import React, { useRef } from "react"
// import { useAppStore } from "@/store/useAppStore"
// import { PiChatTeardropTextLight, PiUserCircleFill } from "react-icons/pi"
// import {
//   RiChatNewLine,
//   RiChatSmile3Fill,
//   RiSendPlane2Fill,
// } from "react-icons/ri"

// import { Button } from "@/components/ui/button"
// import { TextArea } from "@/components/ui/textarea"

// type Props = {}

// const ChatBotApp = (props: Props) => {
//   const {
//     botLogo,
//     // botName,
//     bgColor,
//     aiChatColor,
//     userChatColor,
//     botTextColor,
//     userTextColor,
//     botFontSize,
//     botFontWeight,
//     botFontFamily,
//   } = useAppStore()

//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   const handleInput = () => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto"
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
//     }
//   }

//   return (
//     <>
//       <div className="flex h-screen">
//         <div className="flex w-[20%] flex-col gap-3 overflow-hidden rounded-[8px] bg-slate-50 p-4">
//           <h1 className="text-xl font-semibold">🤖 AI Front-end interviewer</h1>
//           <Button className="mt-4 flex w-full items-center justify-start gap-2 rounded-lg bg-white py-2 text-gray-600 hover:bg-gray-50">
//             <RiChatNewLine className="h-5 w-5" />
//             New chat
//           </Button>
//           <Button className="mt-2 flex w-full items-center  justify-start gap-2 rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700">
//             <PiChatTeardropTextLight className="h-5 w-5" />
//             Current conversation
//           </Button>
//         </div>

//         {/* Chat Section */}
//         <div className="flex h-full w-[80%] flex-col rounded-[8px] bg-white">
//           {/* Header */}
//           <div
//             className="flex h-[70px] items-center justify-start  text-lg font-semibold"
//             style={{ backgroundColor: aiChatColor }}
//           >
//             cuttn
//           </div>

//           {/* Messages */}
//           <div
//             className="flex-1 overflow-y-auto"
//             style={{ backgroundColor: bgColor }}
//           >
//             <div className="flex flex-col gap-2 px-32 py-3">
//               {/* Chat messages */}
//               {Array.from({ length: 10 }).map((_, index) => (
//                 <div key={index} className="flex w-full items-start">
//                   {index % 2 === 0 ? (
//                     <>
//                       {/* Bot Logo */}
//                       <div className="mr-2 flex-shrink-0">
//                         {botLogo ? (
//                           <img
//                             src={URL.createObjectURL(botLogo)}
//                             alt="Bot Logo"
//                             className="h-6 w-6 rounded-full object-cover"
//                           />
//                         ) : (
//                           <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#116be1] object-cover">
//                             <RiChatSmile3Fill className="text-white" />
//                           </div>
//                         )}
//                       </div>
//                       <div
//                         className="mb-4 flex w-[80%] items-center rounded-[8px] p-2"
//                         style={{ backgroundColor: aiChatColor }}
//                       >
//                         <p
//                           className="text-md resize-none border-none p-1 shadow-none outline-none focus:border-none focus:outline-none focus:ring-0"
//                           style={{
//                             color: botTextColor,
//                             fontSize: botFontSize,
//                             fontWeight: botFontWeight,
//                             fontFamily: botFontFamily,
//                           }}
//                         >
//                           Hi, welcome to our interview. I am the interviewer for
//                           this technology company, and I will test your web
//                           front-end development skills. Next, I will generate
//                           questions for interviews.
//                         </p>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <div
//                         className="mb-4 ml-auto flex w-[80%] items-center justify-end gap-2 rounded-[8px] p-2"
//                         style={{
//                           backgroundColor: userChatColor,
//                           color: userTextColor,
//                         }}
//                       >
//                         <p className="border-none p-1  text-sm shadow-none outline-none focus:border-none focus:outline-none focus:ring-0">
//                           Hi, welcome to our interview... Hi, welcome to our
//                           interview... Hi, welcome to our interview... Hi,
//                           welcome to our interview... Hi, welcome to our
//                           interview... Hi, welcome to our interview...
//                         </p>
//                       </div>
//                       <div className="ml-2 mt-1 flex-shrink-0">
//                         <PiUserCircleFill className="h-6 w-6 rounded-full bg-white text-sm font-semibold text-gray-400" />
//                       </div>
//                     </>
//                   )}
//                 </div>
//               ))}
//               {/* Fixed input for message */}
//             </div>
//           </div>

//           {/* Input area */}
//           <div
//             className="w-full px-32 py-3"
//             style={{ backgroundColor: bgColor }}
//           >
//             <div className="flex w-full items-center rounded-[8px] p-1 px-4">
//               <div className="relative flex-1">
//                 <TextArea
//                   className="w-full resize-none rounded-[8px] border border-none bg-white px-4 py-4 pr-16 shadow-md focus:ring-blue-700"
//                   placeholder="Ask me... 😄"
//                   rows={1}
//                   ref={textareaRef}
//                   onInput={handleInput}
//                 ></TextArea>
//                 <div className="absolute bottom-4 right-2 cursor-pointer rounded-lg bg-blue-700 p-2">
//                   <RiSendPlane2Fill className="h-5 w-5 text-white " />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default ChatBotApp
