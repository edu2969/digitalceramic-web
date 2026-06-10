import Navbar from "@/components/Nav"
import Footer from "@/components/landing/Footer"
import { Montserrat } from "next/font/google";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <Navbar />
      <main>{children}</main>      
      <Footer />
    </body>
    </html>
  )
}