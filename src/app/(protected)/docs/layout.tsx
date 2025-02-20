"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { MdOutlineFileCopy } from "react-icons/md"
import { PiTargetDuotone } from "react-icons/pi"
import { TbSettings } from "react-icons/tb"

import StudioSidebar from "@/components/protected/studio-sidebar"

import AppFilesPage from "./[docsId]/documents/[fileId]/page"
import Documents from "./[docsId]/documents/page"
import SettingsPage from "./[docsId]/settings/page" // Renaming to avodocsId conflict with the `Settings` import
import Testing from "./[docsId]/testing/page"

interface Tab {
  id: string
  label: string
  href: (id: string) => string
  icon: React.ReactNode
}

// Define tabs for DocsLayout
const tabs: Tab[] = [
  {
    id: "documents",
    label: "Documents",
    href: (id: string) => `/docs/${id}/documents`,
    icon: <MdOutlineFileCopy size={18} />,
  },
  {
    id: "testing",
    label: "Testing",
    href: (id: string) => `/docs/${id}/testing`,
    icon: <PiTargetDuotone size={18} />,
  },
  {
    id: "settings",
    label: "Settings",
    href: (id: string) => `/docs/${id}/settings`,
    icon: <TbSettings size={18} />,
  },
]

const DocsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  if (!pathname) {
    return null
  }
  const id = pathname?.split("/")[2]

  if (!id) {
    return <div>Error: ID not found in URL.</div>
  }
  const currentTab = tabs.find((tab) => pathname.includes(tab.id)) || tabs[0]

  return (
    <div className="flex h-screen overflow-hidden">
      <StudioSidebar
        links={tabs.map((tab) => ({
          href: tab.href(id),
          label: tab.label,
          icons: tab.icon,
        }))}
      />

      {/* Main Content Area */}
      <div className="flex w-full flex-col">
        <motion.div
          key={currentTab!.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export default DocsLayout
