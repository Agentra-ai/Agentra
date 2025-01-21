"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AlignJustify, X } from "lucide-react"

import { Button } from "@/components/ui/button"

import DropdownMenu from "./drop-down-menu"

const ActionButtons = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false)

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible)
  }

  const closeDropdown = () => {
    setDropdownVisible(false)
  }

  return (
    <div className="pr-2">
      <div className=" flex items-center justify-center ">
        <div className="flex xl:space-x-4">
          <Link
            href={"/contact-sales"}
            className="
            hidden
            items-center
            lg:flex
            
            "
          >
            <div className="">Request a demo</div>
          </Link>

          <div
            className="hidden     
        items-center
            font-thin
            lg:flex"
          >
            |
          </div>
        </div>

        <div className="flex items-center pr-4 lg:space-x-4">
          <Link href={"/auth/login"}>
            <Button
              variant={"outline"}
              className="
            text-md
            hidden
            items-center
                border-none 
                lg:flex
                
                "
            >
              Log in
            </Button>
          </Link>
          <Link href={"/auth/register"}>
            <Button className="hidden lg:block">Get WorkWave free</Button>
          </Link>
        </div>
      </div>

      {isDropdownVisible && (
        <div
          onClick={toggleDropdown}
          className="
        
             rounded-full
             xl:hidden
             "
        >
          <X className="h-5 w-5  cursor-pointer items-center justify-center rounded-full" />
        </div>
      )}
      {!isDropdownVisible && (
        <div onClick={toggleDropdown} className="flex lg:hidden">
          <AlignJustify className="mr-2 h-6 w-6 cursor-pointer items-center justify-center" />
        </div>
      )}

      {isDropdownVisible && <DropdownMenu onClose={closeDropdown} />}
    </div>
  )
}

export default ActionButtons
