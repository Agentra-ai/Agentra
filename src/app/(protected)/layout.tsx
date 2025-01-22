// import { Navbar } from "./_components/navbar";
// import { SidebarBody } from "@/components/ui/sidebar";

import { Inter } from "next/font/google"
import { redirect } from "next/navigation"
import { getUserDetails } from "@/actions/user"

import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/lib/config/defaults"

import auth from "@/lib/auth"

import Navbar from "@/components/protected/navbar"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

// const font = Inter({ subsets: ["latin"], weight: ["400"] });

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth()
  const user = await getUserDetails()

  if (!session || !user) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)
  return (
    <div className={`flex h-screen w-full flex-col overflow-hidden`}>
      <Navbar />
      {children}
    </div>
  )
}

export default ProtectedLayout
