// import { Navbar } from "./_components/navbar";
// import { SidebarBody } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults";

import Navbar from "@/components/protected/navbar";
import { auth } from "@/auth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth();

  if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT);

  return (
    <div className={`flex h-screen w-full flex-col overflow-hidden`}>
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
