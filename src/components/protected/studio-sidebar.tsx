"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon } from "lucide-react";

interface SidebarLinkProps {
  href: string;
  label: string;
  icons: React.ReactNode;
}

interface SidebarProps {
  links: SidebarLinkProps[];
}

const StudioSidebar = ({ links }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get current path to determine active link

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex h-full flex-col rounded-r-xl">
      <motion.aside
        initial={{ width: 60 }} // Sidebar starts in collapsed state
        animate={{ width: isOpen ? 200 : 60 }} // Adjust width for open/collapsed state
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex h-full flex-col rounded-br-xl border-r bg-[#fdfdfd]"
      >
        <button
          onClick={toggleSidebar}
          className={`flex bg-blue-50 p-2 text-blue-700 ${
            isOpen ? "justify-end" : "justify-center"
          } items-center`}
        >
          {isOpen ? (
            <ArrowLeftFromLineIcon size={20} strokeWidth={1.5} />
          ) : (
            <ArrowRightFromLineIcon size={20} strokeWidth={1.5} />
          )}
        </button>

        <ul className="p-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li
                key={link.href}
                className={`${
                  isOpen ? "mb-1 py-[7px]" : "mb-2 py-[7px]"
                } flex items-center justify-start rounded-[6px] transition-all ${
                  isActive
                    ? "bg-[#ebf2ff] text-[#1a53ff]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Link
                  href={link.href}
                  className="flex w-full items-center rounded-[8px] text-sm"
                >
                  <span className="mx-2">{link.icons}</span>
                  {isOpen && <span>{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.aside>
    </div>
  );
};

export default StudioSidebar;
