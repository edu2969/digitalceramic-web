"use client"

import { useRouter } from "next/navigation";
import CountdownJulio2026 from "../prefabs/Countdown";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoGiftOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";

interface IContadores {
  count: number;
  total: number;
  limitDay: Date;
}

export default function Club() {
  const router = useRouter();
  const { data: contadores, isLoading } = useQuery<IContadores>({
    queryKey: ['contadores-club'],
    queryFn: async () => {
      const resp = await fetch('/api/club');
      return await resp.json();
    }
  });

  return (
    <section id="club" className="relative w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 overflow-visible bg-[#F2F2F2] z-40">
      <div className="max-w-7xl mx-auto relative -top-12 md:-top-20 z-10 p-4 sm:p-6 md:p-8 lg:p-10 bg-white rounded-2xl shadow-2xl -mb-16">
        {/* Grid principal: 2 columnas en desktop, 1 en móvil */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 lg:gap-8 shadow-[0_4px_12px_rgba(0,0,0,0.05),0_0_40px_rgba(0,0,0,0.08)] p-6 rounded-2xl">
          {/* Columna izquierda: Texto principal */}
          <div className="flex col-span-3 items-center">
            <div className="bg-[#4812D0] w-18 h-18 text-white rounded-full">
              <IoGiftOutline className="h-18 w-18 p-4"/>
            </div>
            <div className="text-[#1F2035] ml-6">
              <p className="font-bold text-xl">Inscripción gratis</p>
              <p className="text-lg">hasta el <span className="text-[#4812D0] font-bold">{contadores?.limitDay ? new Date(contadores.limitDay).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long"
              }) : '--'}</span></p>
              <p className="text-xs">Valor inscriptión a contar de 1 octubre: <b>1 UF</b></p>
            </div>
          </div>

          <div className="flex col-span-2 text-center border-0 xl:border-x-2 border-[#4812D0]/20 items-center">
            <div className="mx-auto">
              <p className="text-sm font-bold">Odontólogos inscritos</p>
              <div className="flex items-baseline">
                <p className="text-6xl font-bold text-[#4812D0]">{contadores?.count}</p>
                <p className="text-2xl text-[#4812D0]">/{contadores?.total}</p>
              </div>
            </div>
          </div>

          {/* Columna derecha: Countdown */}
          <div className="flex justify-center lg:justify-end col-span-3">
            <div className="mx-auto sm:w-auto relative">
              <p className="text-xs text-center font-semibold tracking-wider">Cierre de inscripción en:</p>
              <CountdownJulio2026 className="text-[#1F2035]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 space-x-5 mt-6">
          <div className="w-full border-t-2 border-[#1F2035] mt-3"></div>
          <div className="mx-auto text-center text-[#1F2035] tracking-widest">OPCIONES DE ACUERDO A TU NECESIDAD</div>
          <div className="w-full border-t-2 border-[#1F2035] mt-3"></div>
        </div>

        {/* Grid de tarjetas: 1 columna móvil, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 py-6 md:py-8">
          {[{
            beneficios: ["Diseño CAD/CAM", "Corona digital de alta precisión"],
            discount: 25
          }, {
            beneficios: ["Impresión de modelo", "Diseño CAD/CAM", "Corona digital de alta precisión"],
            discount: 30
          }, {
            beneficios: ["Sillón de preparación dental", "Escáner intraoral", "Diseño CAD/CAM", "Corona digital de alta precisión",
              "Box de cementación", "Asistencia técnica especializada"
            ],
            discount: 30
          }, {
            beneficios: ["Escaneo intraoral en tu clínica", "Diseño CAD/CAM", "Asistencia técnica especializada",
              "Fabricación de coronas digitales", "Logística y soporte completo"
            ],
            discount: 0
          }].map((elem, index) => (
            <div 
              key={`ruta_${index}`} 
              className={`relative 
                rounded-2xl p-4 sm:p-6 space-y-2 transition-all 
                duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.05),0_0_40px_rgba(0,0,0,0.08)] ${elem.discount == 0 ? ' grayscale-60 opacity-50' : ''}`}
            >
              <div className="text-[#1F2035] text-3xl sm:text-2xl font-medium">Digital<span className="text-[#4812D0]">Pro {index + 1}</span></div>
              <div className="text-[#1F2035] text-md sm:text-sm font-medium mb-8">
                {elem.beneficios.map((beneficio, index2) => {
                  return <div key={`beneficio_${index}_${index2}`} className="flex">
                    <FaRegCheckCircle size="1rem" className="mr-2 mt-0.5 text-[#4812D0]" />
                    <p className="font-extralight">{beneficio}</p>
                  </div>   
                })}
              </div>
              <div>
                {elem.discount !== 0 ? 
                  <p className="absolute bottom-4 text-white">'-' + elem.discount + "%"</p> : 
                  <div className="text-md text-center bg-[#4812D0] text-white p-2 rounded-lg">
                  PRÓXIMAMENTE
                </div>}
              </div>
            </div>
          ))}
        </div>

        {/* Footer: Botón + mensaje */}
        <div className="flex justify-center items-center sm:items-center gap-4 sm:gap-6 md:gap-8 mt-4 md:mt-6">
          <button 
            className="flex items-center justify-center w-full sm:w-auto bg-[#4812D0] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 font-bold rounded-lg hover:shadow-xl transition-colors cursor-pointer group"
            onClick={() => router.push('/cuenta')}
          >
            <span className="text-xl sm:text-base">Crea mi cuenta gratuita</span>            
          </button>
          
          <div className="flex col-span-3 items-center border-l-3 border-l-[#4812D0]/20">
            <div className="bg-[#E1D9F0] w-18 h-18 text-[#4812D0] rounded-full ml-6">
              <IoGiftOutline className="h-18 w-18 p-4"/>
            </div>
            <div className="text-[#1F2035] ml-6">
              <p className="font-bold text-xl">Beneficio por inscripción</p>
              <p className="text-lg text-[#4812D0] font-bold">10 coronas a $59.000 c/u</p>
              <p className="text-xs">Vence el 1 de enero 2027.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}