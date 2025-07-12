import Navigation from "@/components/auth/Navigation"
import { getServerSession } from "@/lib/auth"

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession()

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation initialSession={session} />
      <main className="flex-1">{children}</main>
      <footer className="text-center py-3 text-xs">
        Copyright(C) FullStackChannel All Rights Reserved.
      </footer>
    </div>
  )
}

export default AuthLayout
