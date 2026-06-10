"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaUserShield } from "react-icons/fa";

export default function Hero() {
  const router = useRouter();
  return (
    <section
      className="relative mt-20 md:mt-24 flex items-center overflow-hidden bg-[#000A13] text-white z-0 py-14 md:py-0 md:h-92"
    >
      {/* Fondo corona */}
      <div className="pointer-events-none absolute inset-0 md:inset-y-0 md:left-1/3 md:right-0">
        <Image
          src="/smile.png"
          alt="Sonrisa antes-despues"
          width={1200}
          height={0}
          className="
      absolute
      bottom-0
      right-0
      h-full
      w-auto
      max-h-full
      object-cover md:object-contain
      object-right
      opacity-20 md:opacity-100
    "
          priority
        />
      </div>
      <div className="relative z-20 w-full px-6 md:ml-12 md:max-w-1/2 text-left">
        <div className="flex text-4xl md:text-5xl font-bold">
          <p>Digital</p>
          <p className="text-[#1F9CE7]">Ceramic</p>
        </div>
        <p className="mt-4 text-xl md:text-2xl font-bold">
          Tu puerta de entrada a la odontología digital
        </p>
        <p className="mt-2 text-sm md:text-base text-gray-100">Escaneo intraoral, diseño CAD/CAM y restauraciones de alta precisión para
          odontólogos que buscan productividad, mejores resultados y menos inversión inicial
        </p>
        <div className="mt-6 mb-2 md:mb-8 flex gap-4 flex-wrap">
          <button
            className="flex gap-2 bg-linear-to-b from-[#7C31CF] to-[#731BD1] px-10 py-3 rounded-lg font-semibold hover:opacity-90"
            onClick={() => router.push("/new-account")}
          >
            <FaUserShield className="mt-1 text-5xl" />
            <div className="text-left ml-3">
              <p className="text-lg">INSCRÍBETE AL CLUB</p>
              <p className="text-md">Digital Ceramic</p>
            </div>
          </button>
          <button
            className="flex h-14 border border-white/80 px-8 py-3 rounded-lg hover:opacity-90 gap-4 items-center mt-2"
            onClick={() => {
              const element = document.getElementById('club');
              if(!element) return;
              const elementPosition = element.getBoundingClientRect().top + window.scrollY;
              const offset = 80; // Ajusta este valor (píxeles hacia arriba)              
              window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
              });             
            }}
          >
            <FaEye size={24}/>
            Ver beneficios
          </button>
        </div>
      </div>
    </section>
  );
}