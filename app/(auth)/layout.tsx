import { redirect } from "next/navigation"
import MenuBar from "@/components/MenuBar"
import QueryProvider from "../(public)/providers/QueryProvider"
import { createClient } from "@/lib/supabase/server"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen bg-[#000A13]">
      <QueryProvider>
        <MenuBar>{children}</MenuBar>
      </QueryProvider>
    </main>
  )
}
