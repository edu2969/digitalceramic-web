"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { LuMoveRight } from "react-icons/lu";

export default function Services() {
  const router = useRouter();
  return (<section id="servicios" className="px-6 text-[#24335D]">
    <div className="mx-auto text-center">      
      <div className="grid md:grid-cols-5 gap-8 mt-6">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:col-span-3 gap-4">
          <div className="text-left col-span-2 sm:col-span-3">
            <h2 className="text-2xl sm:text-3xl font-bold">SOLUCIONES DIGITALES</h2>
            <p className="text-base sm:text-lg">
              Todo lo que necesitas para trabajar digital
            </p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6 px-3 text-center">
            <Image src="/tool_b_01.png" width={142} height={112} className="mx-auto w-22.5 h-auto" alt="Escaneo intraoral"/>
            <p className="font-bold">Escaneo intraoral</p>
            <p className="text-xs">Captura digital precisa sin impresiones tradicionales</p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6 px-3 text-center">
            <Image src="/tool_b_02.png" width={142} height={112} className="mx-auto w-22.5 h-auto" alt="Escaneo de modelos"/>
            <p className="font-bold">Escaneo de modelos</p>
            <p className="text-xs">Digitalizamos tus modelos físicos con máxima fidelidad</p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6 px-3 text-center">
            <Image src="/tool_b_03.png" width={142} height={112} className="mx-auto w-22.5 h-auto" alt="Diseño CAD/CAM"/>
            <p className="font-bold">Diseño CAD/CAM</p>
            <p className="text-xs">Diseño asistido por computador para cada restauración</p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6 px-3 text-center">
            <Image src="/tool_b_04.png" width={142} height={112} className="mx-auto w-22.5 h-auto" alt="Coronas y prótesis"/>
            <p className="font-bold">Coronas y prótesis</p>
            <p className="text-xs">Coronas unitarias y prótesis fija de alta precisión</p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6 px-3 text-center">
            <Image src="/tool_b_05.png" width={142} height={112} className="mx-auto w-22.5 h-auto" alt="Arriendo de box equipado"/>
            <p className="font-bold">Arriendo de box equipado</p>
            <p className="text-xs">Espacio clínico equipado para tu flujo digital</p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6 px-3 text-center">
            <Image src="/tool_b_06.png" width={142} height={112} className="mx-auto w-22.5 h-auto" alt="Soporte técnico digital"/>
            <p className="font-bold">Soporte técnico digital</p>
            <p className="text-xs">Acompañamiento en cada etapa del proceso</p>
          </div>
        </div>

        <div className="md:col-span-2 w-full bg-linear-to-r from-[#0B1036] to-80% to-[#130E54] rounded-2xl h-full p-6 text-left">
          <p className="text-[#7E3EDA] text-2xl font-bold">PLAN BIENVENIDA</p>
          <p className="text-white text-3xl font-bold">10 CORONAS</p>
          <p className="text-white text-2xl font-bold -mt-1">DIGITALES</p>
          <div className="w-full text-left mt-2">
            <span className="bg-[#7E3EDA] text-white px-3 py-1.5 text-xs">PRECIO PREFERENCIAL PARA NUEVOS INSCRITOS</span>
          </div>
          <div className="grid grid-cols-5">
            <div className="col-span-3 space-y-2 mt-4 text-white">
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Sin inversión inicial</p>
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Flujo digital completo</p>
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Diseño CAD/CAM incluido</p>
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Materiales de alta calidad</p>
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Soporte técnico y clínico</p>
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Cupos limitados</p>
            </div>
            <div className="col-span-2">
              <Image src="/molar-plat.png" width={245} height={197} className="mt-16 w-40 h-auto" alt="molar plat"/>
            </div>
          </div>
          <div className="col-span-10">
            <button className="w-full bg-[#F1C71D] py-3 text-black font-bold rounded-md mt-6 flex justify-center cursor-pointer"
            onClick={() => {
              router.push('/new-account')
            }}>
              <div className="flex">
                QUIERO MIS 10 CORONAS
                <LuMoveRight size="24" className="ml-6"/>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>);
}