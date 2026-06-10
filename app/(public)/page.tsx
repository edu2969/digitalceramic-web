"use client"

import Hero from "@/components/landing/Hero"
import Support from "@/components/landing/Support"
import Services from "@/components/landing/Services"
import HowWorks from "@/components/landing/HowWorks"
import Whatssap from "@/components/Whatssap"
import Footer from "@/components/landing/Footer"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-[#F3F2F5] text-[#1C4880]">

      {/* HERO */}
      <Hero />

      {/* APOYO */}
      <Support />

      {/* SERVICIOS */}
      <Services />

      {/* COMO FUNCIONA */}
      <HowWorks />
      <Whatssap />
    </main>
  );
}