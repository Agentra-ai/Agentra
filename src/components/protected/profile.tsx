import React, { useState } from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { SettingPopup } from "./setting-popup"
import { LogoutButton } from "../auth/LogoutButton"
import Image from "next/image"

// import { auth } from '@/auth'
// import { currentUser } from '@/lib/auth'
// import { getAccountByUserId } from '@/data/account'

type Props = {}

const Profile = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  // console.log(a)
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div className="cursor-pointer">
            <Image
              src="https://avatars.githubusercontent.com/u/43388613?v=4"
              className="h-8 w-8 rounded-full"
              alt="name"
              width={8}
              height={8}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="z-40 mr-4 mt-2 w-[220px] rounded-[7px] p-4 px-2 font-sans text-lg font-[400] text-gray-600">
          <div className="flex items-center justify-between">
            <Image
              src="https://avatars.githubusercontent.com/u/43388613?v=4"
              className="h-10 w-10 rounded-full"
              alt="name"
              width={8}
              height={8}
            />
            <p className="text-sm hover:text-black">Agentra</p>
          </div>
          <hr className="mt-2" />
          <p className="p-2 text-sm hover:bg-gray-100 hover:text-black">
            Workspace
          </p>
          <p
            onClick={() => setIsOpen(true)}
            className="p-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-black"
          >
            Settings
          </p>
          <hr className="" />
          <div className="flex flex-col">
            <p className="p-2 text-sm hover:bg-gray-100 hover:text-black">
              Feedback
            </p>
            <p className="p-2 text-sm hover:bg-gray-100 hover:text-black">
              Community
            </p>
            <p className="p-2 text-sm hover:bg-gray-100 hover:text-black">
              Help
            </p>
            <p className="p-2 text-sm hover:bg-gray-100 hover:text-black">
              Roadmap
            </p>
            <p className="p-2 text-sm hover:bg-gray-100 hover:text-black">
              About
            </p>
            <hr className="my-1" />
            <LogoutButton />
          </div>
        </PopoverContent>
      </Popover>
      {<SettingPopup isOpen={isOpen} onClose={close} />}
    </>
  )
}

export default Profile
