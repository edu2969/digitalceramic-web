"use client"

import Hero from "@/app/components/Hero"
import Support from "@/app/components/Support"
import Services from "@/app/components/Services"
import HowWorks from "@/app/components/HowWorks"
import Hightlights from "@/app/components/Hightlights"
import Whatssap from "@/app/components/Whatssap"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-white text-[#1C4880]">

      {/* HERO */}
      <Hero />

      {/* APOYO */}
      <Support />

      {/* SERVICIOS */}
      <Services />

      {/* COMO FUNCIONA */}
      <HowWorks />

      {/* DIFERENCIADORES */}
      <Hightlights />

      {/* CTA FINAL */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Empieza a reducir costos hoy
        </h2>
        <p className="mt-4 text-gray-600">
          Agenda una llamada o solicita tu primera cotización sin compromiso.
        </p>

        <button className="mt-6 bg-[#1C4880] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90"
        onClick={() => router.push('/contact')}>
          Solicitar cotización
        </button>
      </section>

      <Whatssap />

    </main>
  );
}