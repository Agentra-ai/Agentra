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

const Sidebar = ({ links }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get current path to determine active link

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex h-full flex-col rounded-l-md">
      <motion.aside
        initial={{ width: 60 }} // Sidebar starts in collapsed state
        animate={{ width: isOpen ? 200 : 60 }} // Adjust width for open/collapsed state
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex h-full flex-col border-r bg-[#f3f5f7]"
      >
        <button
          onClick={toggleSidebar}
          className={`flex bg-blue-100 p-2 text-[#1a53ff] ${
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
                  isOpen ? "mb-1" : "mb-2"
                } flex items-center justify-start rounded-[8px] py-[7px] transition-all ${
                  isActive
                    ? "bg-blue-400/15 font-semibold text-[#1a53ff]"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Link
                  href={link.href}
                  className="flex w-full items-center text-sm"
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

export default Sidebar;
