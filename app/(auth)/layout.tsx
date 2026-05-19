import MenuBar from "@/components/MenuBar"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen">
      <MenuBar>{children}</MenuBar>
    </main>
  )
}