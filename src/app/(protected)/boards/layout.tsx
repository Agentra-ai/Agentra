import { ReactNode } from "react"
import {
  BotMessageSquareIcon,
  CalendarDaysIcon,
  KanbanSquareIcon,
  LayoutGridIcon,
  UsersIcon,
} from "lucide-react"

import Sidebar from "@/components/protected/sidebar"

interface LayoutProps {
  children: ReactNode
}

const boardsLinks = [
  {
    href: "/boards/dashboard",
    label: "Dashboard",
    icons: <LayoutGridIcon size={20} strokeWidth={1.5} />,
  },
  {
    href: "/boards/aiboard",
    label: "AiBoard",
    icons: <BotMessageSquareIcon size={20} strokeWidth={1.5} />,
  },
  {
    href: "/boards/calender",
    label: "calender",
    icons: <CalendarDaysIcon size={20} strokeWidth={1.5} />,
  },
  {
    href: "/boards/kanban",
    label: "kanban",
    icons: <KanbanSquareIcon size={20} strokeWidth={1.5} />,
  },
  {
    href: "/boards/team",
    label: "Team",
    icons: <UsersIcon size={20} strokeWidth={1.5} />,
  },
  // { href: '/boards', label: 'Settings', icons: <setting className="w-5 h-5" /> },
  // Add more links as needed
]

const BoardLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar links={boardsLinks} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}

export default BoardLayout
