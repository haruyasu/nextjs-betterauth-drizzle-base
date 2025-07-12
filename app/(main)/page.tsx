import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"

export default async function MainPage() {
  const session = await getServerSession()

  if (session?.user) {
    redirect("/suggestion")
  } else {
    redirect("/login")
  }
}
