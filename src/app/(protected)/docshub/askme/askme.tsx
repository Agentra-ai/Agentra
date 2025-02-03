"use client"

import React, { useRef, useState } from "react"
import { PiFinnTheHumanDuotone, PiUserCircleFill } from "react-icons/pi"
import { RiChatSmile3Fill, RiSendPlane2Fill, RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri"
import { FaCode, FaReact, FaNodeJs, FaPython } from "react-icons/fa"
import { SiTypescript } from "react-icons/si"
import { Button } from "@/components/ui/button"
import { TextArea } from "@/components/ui/textarea"
import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon } from "lucide-react"


type Bot = {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const bots: Bot[] = [
  { id: 'frontend', name: 'Frontend Interview', icon: <FaReact className="h-6 w-6" /> },
  { id: 'typescript', name: 'TypeScript Expert', icon: <SiTypescript className="h-6 w-6" /> },
  { id: 'backend', name: 'Backend Interview', icon: <FaNodeJs className="h-6 w-6" /> },
  { id: 'dsa', name: 'DSA Expert', icon: <FaCode className="h-6 w-6" /> },
  { id: 'python', name: 'Python Interview', icon: <FaPython className="h-6 w-6" /> },
]

type Props = {}

const AskMe = (props: Props) => {
  const [selectedBot, setSelectedBot] = useState(bots[0])
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div className="flex h-[calc(100vh-55px)] w-full text-[14px] bg-[#f3f5f7] overflow-hidden p-3 pr-0">
      <div className={`
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-[240px]' : 'w-[55px]'}
        overflow-hidden bg-white rounded-l-2xl shadow-lg
      `}>
        <div className="p-2">
          <h2 className="mb-4 text-md font-semibold text-gray-800">AI</h2>
          <div className="space-y-2">
            {bots.map((bot) => (
              <button
                key={bot.id}
                onClick={() => setSelectedBot(bot)}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors
                  ${selectedBot?.id === bot.id
                    ? 'bg-purple-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {bot.icon}
                <span className={`${isSidebarOpen ? 'inline' : 'hidden'}`}>{bot.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 relative h-full overflow-hidden shadow-md shadow-gray-200">
        {/* Header - Sticky with toggle button */}
        <div className="sticky top-0 z-10 flex h-[60px] shadow-sm items-center justify-between bg-[#fafcff] px-4 ">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            {isSidebarOpen ?
              <ArrowLeftFromLineIcon className="h-5 w-5 text-gray-600" /> :
              <ArrowRightFromLineIcon className="h-5 w-5 text-gray-600" />
            }
          </button>
          <span className="text-lg font-semibold text-gray-800">{selectedBot?.name}</span>
          <div className="w-[40px]"></div> {/* Spacer for centering */}
        </div>

        {/* Messages - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 bg-[#f3f5f7]">
          <div className={`mx-auto max-w-3xl ${isSidebarOpen ? 'w-[calc(100%-220px)]' : 'w-full'} rounded-l-2xl transition-all duration-300 ease-in-out`}>
            <div className="flex flex-col gap-6 py-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className={`flex w-full items-start ${index % 2 !== 0 ? 'justify-end' : ''}`}>
                  {index % 2 === 0 ? (
                    <div className="flex w-full max-w-[85%] gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                          <RiChatSmile3Fill className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 rounded-2xl bg-white p-3 shadow-sm">
                        {/* <div className="mb-1 text-sm font-medium text-gray-600">Assistant</div> */}
                        <div className="text-gray-800">
                          Hi, welcome to our interview. I am the interviewer for
                          this technology company, and I will test your web
                          front-end development skills.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full max-w-[85%] justify-end gap-2">
                      
                      <div className="rounded-2xl bg-[#e1eaff] p-3 text-black shadow-sm">

                        {/* <div className="mb-1 text-sm font-medium text-blue-100">You</div> */}
                        <div>
                          Hi, I&apos;m ready for the interview...
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <PiFinnTheHumanDuotone className="h-5 w-5 text-gray-700" />
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Input area - Sticky at bottom */}
        <div className="sticky bottom-0 w-full bg-[#f3f5f7] pt-2">
          <div className={`mx-auto max-w-3xl ${isSidebarOpen ? 'w-[calc(100%-220px)]' : 'w-full'} pb-2 transition-all duration-300 ease-in-out`}>
            <div className="relative flex items-center rounded-xl p-2 shadow-md bg-white ">
              <TextArea
                className="w-full resize-none border-0 bg-transparent py-2 pl-3 pr-16 focus:ring-0"
                placeholder="Type your message here..."
                rows={1}
                ref={textareaRef}
                onInput={handleInput}
              />
              <Button
                className="absolute right-2 rounded-lg bg-blue-600 p-2 hover:bg-blue-700"
                size="icon"
              >
                <RiSendPlane2Fill className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AskMe
