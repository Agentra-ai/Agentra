import { ReactNode } from "react";
import { HammerIcon, TelescopeIcon, TvMinimalPlayIcon } from "lucide-react";
import { PiCubeDuotone } from "react-icons/pi";
import { RiFileList3Line } from "react-icons/ri";

import Sidebar from "@/components/protected/sidebar";

interface LayoutProps {
  children: ReactNode;
}

const agentsLinks = [
  {
    href: "/apps/explore",
    label: "Explore",
    icons: <TelescopeIcon size={20} strokeWidth={1.5} />,
  },
  {
    href: "/apps/studio",
    label: "AiStudio",
    icons: <PiCubeDuotone size={20} strokeWidth={1.5} />,
  },
  {
    href: "/apps/documents",
    label: "Documents",
    icons: <RiFileList3Line size={18} className="ml-[1px]" />,
  },
  {
    href: "/apps/tools",
    label: "Tools",
    icons: <HammerIcon size={20} strokeWidth={1.5} />,
  },
  // {
  //   href: "/apps/liveagents",
  //   label: "LiveAgents",
  //   icons: <TvMinimalPlayIcon size={20} strokeWidth={1.5} />,
  // },
];

const AppLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar links={agentsLinks} />
        <main className="flex-1 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
