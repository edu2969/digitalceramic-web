"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LuMoveRight } from "react-icons/lu";

export default function HowWorks() {
  const router = useRouter();
  return (<section className="py-6 px-6 max-w-7xl mx-auto text-center border-2 border-gray-100 mt-4 bg-[#F3F2F5]">
    <h2 className="text-3xl font-bold">¿POR QUÉ ELEGIR DIGITAL CERAMIC?</h2>
    <p>Más de 15 años impulsando la odontología en Chile.</p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
      <div className="w-full text-center px-4 md:border-r-2 md:border-gray-200">
        <Image src="/tool_3_01.png" width={85} height={93} className="mx-auto w-22.5 h-auto" alt="15 años de experiencia" />
        <p className="text-gray-600 mt-2 font-bold">
          15 años de experiencia
        </p>
        <p className="text-sm">Miles de casos y odontólogos respaldan nuestro trabajo</p>
      </div>
      <div className="w-full text-center px-4 md:border-r-2 md:border-gray-200">
        <Image src="/tool_3_02.png" width={132} height={99} className="mx-auto my-5 w-22.5 h-auto" alt="Flujo 100% digital" />
        <p className="text-gray-600 mt-2 font-bold">
          Flujo 100% digital
        </p>
        <p className="text-sm">Tecnología de última generación en cada etapa del proceso</p>
      </div>
      <div className="w-full text-center px-4 md:border-r-2 md:border-gray-200">
        <Image src="/tool_3_03.png" width={130} height={103} className="mx-auto mb-4 w-22.5 h-auto" alt="Escáner intraoral disponible" />
        <p className="text-gray-600 mt-2 font-bold">
          Escáner intraoral disponible
        </p>
        <p className="text-sm">Para odontólogos que no cuentan con esta tecnología</p>
      </div>
      <div className="w-full text-center px-4">
        <Image src="/tool_3_04.png" width={92} height={84} className="mx-auto my-3 w-22.5 h-auto" alt="Más de 5.000 restauraciones" />
        <p className="text-gray-600 mt-2 font-bold">
          Más de 5.000 restauraciones
        </p>
        <p className="text-sm">Resultados comprobados en todo tipo de casos</p>
      </div>
    </div>
    <div className="mt-8 relative overflow-hidden bg-linear-to-br from-[#051C70] to-[#040E28] z-10 rounded-2xl shadow-lg">
      <Image
        src="/molar-design.png"
        alt="Descripción molar design"
        fill
        className="object-contain object-right opacity-25 md:opacity-100"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="relative p-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="text-white text-left md:w-1/2">
          <p className="text-xl md:text-2xl">La odontología digital</p>
          <p className="text-xl md:text-2xl">al alcance de todos los odontólogos.</p>
          <p>Menos impresiones, más precisión.</p>
        </div>
        <div className="md:w-1/2 flex md:justify-end">
          <button className="flex items-center bg-linear-to-b from-[#7C31CF] to-[#731BD1] px-6 py-2 text-white rounded-xl"
            onClick={() => {
              router.push('/new-account')
            }}>
            <div className="text-left">
              <p className="font-bold">INSCRÍBETE AL CLUB</p>
              <p>y comienza hoy</p>
            </div>
            <LuMoveRight size="24" className="ml-6" />
          </button>
        </div>
      </div>
    </div>
  </section>);
}