import type { Metadata, Viewport } from "next"
import { M_PLUS_1 } from "next/font/google"
import "./globals.css"
import QueryProvider from "@/components/providers/QueryProvider"
import ToastProvider from "@/components/providers/ToastProvider"
import { cn } from "@/lib/utils"

const mPlus1 = M_PLUS_1({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Base App",
  description: "Base App",
}

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={cn(mPlus1.className, "antialiased")}>
        <QueryProvider>
          <ToastProvider />
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
