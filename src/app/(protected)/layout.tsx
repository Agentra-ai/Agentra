
import { redirect } from "next/navigation"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import auth from "@/lib/auth"
import Navbar from "@/components/protected/navbar"
interface ProtectedLayoutProps {
  children: React.ReactNode
}

// const font = Inter({ subsets: ["latin"], weight: ["400"] });

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth()

  if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)
  return (
    <div className={`flex h-screen w-full flex-col overflow-hidden`}>
      <Navbar />
      {children}
    </div>
  )
}

export default ProtectedLayout
