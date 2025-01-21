"use client"

import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Edit3Icon,
  Icon,
  Logs,
  Monitor,
  ScrollTextIcon,
  Settings,
} from "lucide-react"
// Import the icons
import { GiSpeedometer } from "react-icons/gi"
import { IoColorFilterOutline } from "react-icons/io5"
import { MdDisplaySettings, MdManageHistory } from "react-icons/md"
import { SiPoe } from "react-icons/si"

import StudioSidebar from "@/components/protected/studio-sidebar"

import Configuration from "./[id]/configuration/page"
import Customization from "./[id]/customization/page"
import LogsHistory from "./[id]/logs/page"
import Monitoring from "./[id]/monitoring/page"

interface Tab {
  id: string
  label: string
  href: (id: string) => string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  {
    id: "configuration",
    label: "Configuration",
    href: (id: string) => `/app/${id}/configuration`,
    icon: <SiPoe size={18} />,
  },
  {
    id: "logs",
    label: "Logs & History",
    href: (id: string) => `/app/${id}/logs`,
    icon: <ScrollTextIcon size={18} />,
  },
  {
    id: "monitoring",
    label: "Monitoring",
    href: (id: string) => `/app/${id}/monitoring`,
    icon: <GiSpeedometer size={18} strokeWidth={1.5} />,
  },
  {
    id: "customization",
    label: "Customization",
    href: (id: string) => `/app/${id}/customization`,
    icon: <IoColorFilterOutline size={18} strokeWidth={1.5} />,
  },
]

const StudioLayout = () => {
  const router = useRouter()
  const pathname = usePathname()
  const appId = pathname?.split("/")[2] // Extract the dynamic id from the URL

  console.log(appId)
  if (!appId) {
    return <div>Error: ID not found in URL.</div>
  }

  const currentTab = tabs.find((tab) => pathname.includes(tab.id)) || tabs[0]

  const handleTabChange = (href: string) => {
    router.push(href) // Navigate to the selected tab route
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <StudioSidebar
        links={tabs.map((tab) => ({
          href: tab.href(appId),
          label: tab.label,
          icons: tab.icon, // Pass the icon to Sidebar
        }))}
      />

      {/* Main Content Area */}
      <div className="flex w-full flex-col">
        {/* Content Area */}
        <motion.div
          key={currentTab!.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-hidden" // Prevent overflow on parent
        >
          <div className="h-full overflow-y-auto">
            {" "}
            {/* Inner wrapper for scrolling */}
            {currentTab!.id === "configuration" && <Configuration />}
            {currentTab!.id === "logs" && <LogsHistory />}
            {currentTab!.id === "monitoring" && <Monitoring />}
            {currentTab!.id === "customization" && <Customization />}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StudioLayout
