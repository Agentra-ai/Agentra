import { ReactNode } from "react";
import { BookOpenTextIcon, MessagesSquareIcon } from "lucide-react";
import { VscFolderLibrary } from "react-icons/vsc";

import Sidebar from "@/components/protected/sidebar";

const docsvaultLinks = [
  {
    href: "/docshub/askme",
    label: "Ask me",
    icons: <MessagesSquareIcon size={20} strokeWidth={1.5} />,
  },
  {
    href: "/docshub/documents",
    label: "Settings",
    icons: <VscFolderLibrary size={20} strokeWidth={0.2} />,
  },
  // Add more links as needed
];
interface LayoutProps {
  children: ReactNode;
}

const BoardLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar links={docsvaultLinks} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default BoardLayout;
