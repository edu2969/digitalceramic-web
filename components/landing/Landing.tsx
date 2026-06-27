import Hero from "@/components/landing/Hero"
import Club from "@/components/landing/Club"
import Services from "@/components/landing/Services"
import HowWorks from "@/components/landing/HowWorks"
import Whatsapp from "@/components/Whatsapp";

export default function Landing() {
    return <main className="bg-[#F3F2F5] text-[#1C4880]">

      {/* HERO */}
      <Hero />

      {/* APOYO */}
      <Club />

      {/* SERVICIOS */}
      <Services />

      {/* COMO FUNCIONA */}
      <HowWorks />

      <div className="fixed bottom-4 right-4">
        <Whatsapp />
      </div>
    </main>
}