import Navbar from "@/components/Nav"
import Footer from "@/components/Footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mt-24">
      <Navbar />

      <main>{children}</main>

      <Footer />
    </div>
  )
}