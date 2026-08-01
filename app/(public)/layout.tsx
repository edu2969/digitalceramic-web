import Navbar from "@/components/Nav"
import Footer from "@/components/landing/Footer"
import QueryProvider from "./providers/QueryProvider"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      <QueryProvider>
      <main>{children}</main>
      </QueryProvider>
      <Footer />
    </div>
  )
}