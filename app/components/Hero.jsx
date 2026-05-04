"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <section
      className="relative py-16 md:py-24 mx-auto flex flex-col items-center justify-center overflow-hidden"
      style={{ maxHeight: 400 }}
    >
      {/* Fondo corona */}
      <div className="pointer-events-none absolute inset-0 w-full h-full">
        <Image
          src="/corona_fondo_blanco_wide.png"
          alt="fondo corona"
          fill
          style={{ objectFit: "cover", objectPosition: "center", zIndex: 0 }}
          className="z-0"
          priority
        />
        <div className="absolute inset-0 bg-white/20 z-10" />
      </div>
      <div className="relative z-20 ml-12 mx-auto text-left max-w-1/2">
        <Image src="/titulo.png" alt="title" width={400} height={120} />
        <p className="mt-4 text-lg text-gray-600">
          Reduce costos, aumenta tu capacidad y recibe coronas listas para instalar con estándares internacionales.
        </p>
        <div className="mt-6 flex gap-4 flex-wrap">
          <button
            className="bg-[#1C4880] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
            onClick={() => router.push("/contact")}
          >
            Cotizar ahora
          </button>
          <button className="border border-[#1C4880] px-6 py-3 rounded-lg font-semibold text-[#1C4880]">
            Ver servicios
          </button>
        </div>
      </div>
    </section>
  );
}