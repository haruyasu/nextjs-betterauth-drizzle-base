"use client"

import { Button } from "@/components/ui/button"
import type { Session } from "@/lib/auth"
import { signOut } from "@/lib/auth-client"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface NavigationProps {
  initialSession: Session | null
}

// ナビゲーション
const Navigation = ({ initialSession }: NavigationProps) => {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div className="font-bold text-lg">
          <Link href="/">AI商品提案サービス</Link>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {initialSession && initialSession?.user ? (
            <>
              <Button asChild size="sm">
                <Link href="/suggestion">
                  <Sparkles className="h-4 w-4 mr-1" />
                  提案
                </Link>
              </Button>
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navigation
