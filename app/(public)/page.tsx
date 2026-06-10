import Hero from "@/components/landing/Hero"
import Club from "@/components/landing/Club"
import Services from "@/components/landing/Services"
import HowWorks from "@/components/landing/HowWorks"

export default function Home() {
  return (
    <main className="bg-[#F3F2F5] text-[#1C4880]">

      {/* HERO */}
      <Hero />

      {/* APOYO */}
      <Club />

      {/* SERVICIOS */}
      <Services />

      {/* COMO FUNCIONA */}
      <HowWorks />
    </main>
  );
}