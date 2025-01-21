import React from "react"
import Image from "next/image"
import {
  PiFacebookLogoFill,
  PiInstagramLogo,
  PiInstagramLogoFill,
  PiLinkedinLogoFill,
  PiTwitterLogoFill,
  PiYoutubeLogoFill,
} from "react-icons/pi"

const Footer = () => {
  return (
    <div className=" mx-auto flex flex-col px-8 pb-10 lg:items-center lg:px-0 xl:w-3/4 2xl:w-[55%] ">
      <div className="md:px-0  lg:flex lg:space-x-32 ">
        <div className="pt-4">
          <Image
            src="/logos/logo.svg"
            width={35}
            height={35}
            alt="logo"
            className=" mb-[10px] w-[35px]"
          />
          <div className="flex  space-x-2">
            <PiInstagramLogoFill className="text-2xl text-gray-500" />
            <PiTwitterLogoFill className="text-2xl text-gray-500" />
            <PiFacebookLogoFill className="text-2xl text-gray-500" />
            <PiYoutubeLogoFill className="text-2xl text-gray-500" />
            <PiLinkedinLogoFill className="text-2xl text-gray-500" />
          </div>
        </div>

        <div className="flex-col space-y-6 ">
          <div className="pt-10 font-medium">PRODUCT</div>
          <div className="space-y-4 text-sm font-light">
            <div>Home</div>
            <div>Product</div>
            <div>What&apos;s New</div>
            <div>Pricing</div>
            <div>Premium</div>
          </div>
        </div>

        <div className="flex flex-col space-y-6 ">
          <div className="pt-10 font-medium">USE CASES</div>
          <div className="space-y-4 text-sm font-light">
            <div>Company</div>
            <div>Leadership</div>

            <div>Customers</div>
            <div>Diversity</div>
          </div>
        </div>

        <div className="flex flex-col space-y-6 ">
          <div className="pt-10 font-medium">FOR BUSINESS</div>
          <div className="space-y-4 text-sm font-light">
            <div>Project Management</div>
            <div>Goal Management</div>

            <div>Increase Productivity</div>
            <div>Work Management</div>
            <div>Project Planning</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
