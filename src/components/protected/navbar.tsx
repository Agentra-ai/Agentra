"use client"

import { useEffect, useRef, useState } from "react"
import Img from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Route } from "lucide-react"
import { BsDatabaseCheck, BsRobot } from "react-icons/bs"
// import { RiRobot3Line } from "react-icons/ri";
import { MdOutlineAnalytics } from "react-icons/md"

import Profile from "./profile"
// import { ThemeToggle } from "../theme-toggle"

const tabs = [
  { href: "/apps/explore", label: "Apps", icon: <BsRobot size={20} /> },
  {
    href: "/boards/dashboard",
    label: "Boards",
    icon: <MdOutlineAnalytics size={20} />,
  },
  {
    href: "/docshub/askme",
    label: "DocsHub",
    icon: <BsDatabaseCheck size={20} />,
  },
  {
    href: "/integrations",
    label: "Integrations",
    icon: <Route size={20} strokeWidth={1.5} />,
  },
]

const Navbar = () => {
  const [selectedLink, setSelectedLink] = useState<string>(tabs[0]?.href || "")
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const navRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  const handleLinkClick = (href: string) => {
    setSelectedLink(href)
  }

  useEffect(() => {
    const selectedTab = document.querySelector(`[data-href="${selectedLink}"]`)

    if (selectedTab && navRef.current) {
      const { offsetLeft, offsetWidth } = selectedTab as HTMLElement
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth })
    }
  }, [selectedLink])

  // bg-[#f3f4f9]
  return (
    <div className="relative flex items-center justify-between bg-[#f3f5f7] px-2 py-[10px] text-black">
      <div
        onClick={() => router.push("/apps/studio")}
        className=" ml-1 flex cursor-pointer gap-1 font-anek font-[500] tracking-tight transition-opacity"
      >
        <Img
          src="/floxify-logo.png"
          alt="A"
          width={32}
          height={18}
          className="flex-shrink-0"
        />
        <>
          <span className="font-anek text-2xl font-semibold">floxify:</span>
          {/* <span className="text-blue-700">AI</span> */}
        </>
      </div>
      {/* <ThemeToggle /> */}
      <nav ref={navRef} className="relative flex items-center">
        {/* Animated Sliding Indicator */}
        <motion.div
          className={`absolute z-0 h-full rounded-xl bg-white py-4 ${
            (selectedLink === tabs[0]?.href ||
              selectedLink === tabs[1]?.href ||
              selectedLink === tabs[2]?.href ||
              selectedLink === tabs[3]?.href) &&
            "shadow-md"
          }`}
          animate={
            indicatorStyle.left !== undefined &&
            indicatorStyle.width !== undefined
              ? indicatorStyle
              : {}
          }
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        {/* Tab Links */}
        {tabs.map((link) => (
          <Link key={link.href} href={link.href}>
            <span
              data-href={link.href} // Set data attribute to identify the tab
              onClick={() => handleLinkClick(link.href)}
              className={`relative mx-[2px] flex cursor-pointer items-center justify-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold ${
                selectedLink === link.href
                  ? " text-[#1a55ff]"
                  : "text-gray-500 hover:bg-[#eaebf1] hover:text-blue-600 "
              }`}
            >
              {link.icon}
              {link.label}
            </span>
          </Link>
        ))}
      </nav>
      <Profile />
    </div>
  )
}

export default Navbar
