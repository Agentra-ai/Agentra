
import { redirect } from "next/navigation"
import Navbar from "@/components/protected/navbar"
import { validateRequest } from "@/lib/auth/get-session"
interface ProtectedLayoutProps {
  children: React.ReactNode
}

// const font = Inter({ subsets: ["latin"], weight: ["400"] });

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await validateRequest()

  if (!session) redirect('/auth/login')
  return (
    <div className={`flex h-screen w-full flex-col overflow-hidden`}>
      <Navbar />
      {children}
    </div>
  )
}

export default ProtectedLayout
