"use client"

import { useRouter } from "next/navigation";
import { LuMoveRight } from "react-icons/lu";
import CountdownJulio2026 from "../prefabs/Countdown";

export default function Club() {
  const router = useRouter();
  return (
    <section id="club" className="relative w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 overflow-visible bg-[#F3F2F5] z-40">
      <div className="max-w-7xl mx-auto relative -top-12 md:-top-20 z-10 p-4 sm:p-6 md:p-8 lg:p-10 bg-[#102A52] rounded-2xl shadow-2xl -mb-16">
        {/* Grid principal: 2 columnas en desktop, 1 en móvil */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Columna izquierda: Texto principal */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            <div className="text-[#F4C20D] text-xs sm:text-sm font-semibold tracking-wider">
              PROMOCIÓN FUNDADORES • JUNIO Y JULIO
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Membresía</p>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#F4C20D]">$0 para siempre</p>
            </div>
            
            <div className="text-white/40 text-xs sm:text-sm">
              Después: 0.5 UF mensual • precios protegidos para miembros
            </div>
          </div>

          {/* Columna derecha: Countdown */}
          <div className="flex justify-center lg:justify-end">
            <div className="border border-[#F4C20D] rounded-xl p-3 pb-0 sm:p-4 bg-[#F4C20D]/10 mx-auto sm:w-auto">
              <p className="text-xs text-center text-[#F4C20D] font-semibold tracking-wider">CIERRA EN</p>
              <CountdownJulio2026 className="text-[#F4C20D]" />
            </div>
          </div>
        </div>

        {/* Grid de tarjetas: 1 columna móvil, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 py-6 md:py-8">
          {[{
            nombre: "Corona y diseño",
            antes: 95000,
            ahora: 71250,
            discount: "-25% • descuento permanente"
          }, {
            nombre: "Impresión de molde y fabricación de corona",
            antes: 120000,
            ahora: 84000,
            discount: "-30% descuento permanente"
          }, {
            nombre: "Sillón de preparación dental + escáner digital + fabricación de corona + box de cementación",
            antes: 140000,
            ahora: 98000,
            discount: "-30% • descuento permanente"
          }].map((elem, index) => (
            <div 
              key={`ruta_${index}`} 
              className="relative border-2 border-white/20 rounded-2xl p-4 sm:p-6 space-y-2 hover:border-[#F4C20D]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#F4C20D]/5"
            >
              <div className="text-white/40 text-3xl sm:text-2xl font-medium">RUTA {index + 1}</div>
              <div className="text-white/80 text-md sm:text-sm font-medium mb-8">{elem.nombre}</div>
              {/*<div className="line-through text-white/40 text-sm sm:text-base">${elem.antes.toLocaleString('es-CL')}</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">${elem.ahora.toLocaleString('es-CL')}</div>*/}
              <div className={`absolute bottom-4 text-sm sm:text-base ${index === 0 ? 'text-[#F4C20D] font-bold' : 'text-white/60'}`}>
                {elem.discount}
              </div>
            </div>
          ))}
        </div>

        {/* Footer: Botón + mensaje */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8 mt-4 md:mt-6">
          <button 
            className="flex items-center justify-center w-full sm:w-auto bg-[#F1C71D] px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-black font-bold rounded-xl hover:bg-[#F4C20D] transition-colors cursor-pointer group"
            onClick={() => router.push('/cuenta')}
          >
            <span className="text-sm sm:text-base">Incríbete gratis ahora</span>
            <LuMoveRight size="24" className="ml-3 sm:ml-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-white/60 text-xs sm:text-sm md:text-base">
            Todas incluyen diseño + 10 coronas de bienvenida a <span className="font-semibold text-white">$59.000 c/u</span>
          </p>
        </div>
      </div>
    </section>
  );
}