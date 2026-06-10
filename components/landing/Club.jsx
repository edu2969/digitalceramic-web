"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { GoShieldLock } from "react-icons/go";
import { LuMoveRight } from "react-icons/lu";

export default function Club() {
  const router = useRouter();
  return (
    <section id="club" className="mx-auto px-6 items-center w-full overflow-visible text-white bg-[#F3F2F5]">
      <div className="relative p-6 h-56 -top-4 bg-linear-to-br from-[#5E21B9] to-[#04457F] z-10 rounded-2xl
        grid grid-cols-10 shadow-lg">
          <div className="col-span-3 space-y-4 border-r-2 border-white/20">
            <div className="flex">
              <GoShieldLock size="48" />
              <div className="text-left ml-3">
                <p className="text-2xl">CLUB</p>
                <p className="-my-2 text-lg text-[#1F9CE7]">DIGITAL CERAMIC</p>
              </div>
            </div>
            <div className="ml-1">
              Comienza con ventajas exclusivas
            </div>
          </div>
          <div className="border-r-2 border-white/20">
            <Image src={'/tool_01.png'} width={325} height={267} className="-mt-3 w-25 h-auto" alt="tool_01" />
            <p className="text-xs text-center">Escaneo intraoral profesional</p>
          </div>
          <div className="border-r-2 border-white/20">
            <Image src={'/tool_02.png'} width={325} height={267} className="-mt-3 w-25 h-auto" alt="tool_02" />
            <p className="text-xs text-center">Escaneo de modelos</p>
          </div>
          <div className="border-r-2 border-white/20">
            <Image src={'/tool_03.png'} width={325} height={267} className="-mt-3 w-25 h-auto" alt="tool_03" />
            <p className="text-xs text-center">Arriendo de box equipado</p>
          </div>
          <div className="border-r-2 border-white/20">
            <Image src={'/tool_04.png'} width={325} height={267} className="-mt-3 w-25 h-auto" alt="tool_04" />
            <p className="text-xs text-center">Diseño CAD/CAM</p>
          </div>
          <div className="border-r-2 border-white/20">
            <Image src={'/tool_05.png'} width={325} height={267} className="-mt-3 w-25 h-auto" alt="tool_05" />
            <p className="text-xs text-center">10 coronas promocionales de bienvenida</p>
          </div>
          <div className="border-r-2 border-white/20">
            <Image src={'/tool_06.png'} width={325} height={267} className="-mt-3 w-25 h-auto" alt="tool_06" />
            <p className="text-xs text-center">Soporte técnico digital</p>
          </div>
          <div>
            <Image src={'/tool_071.png'} width={325} height={267} className="-mt-3 w-25 h-auto" alt="tool_07" />
            <p className="text-xs text-center">Capacitación en flujo digital</p>
          </div>
          <div className="col-span-10">
            <button className="flex bg-[#F1C71D] px-6 py-2 mx-auto text-black font-bold rounded-md mt-3 cursor-pointer"
            onClick={() => {
              router.push('/new-account')
            }}>
              QUIERO INCRIBIRME AHORA AL CLUB
              <LuMoveRight size="24" className="ml-6"/>
            </button>
          </div>
      </div>
    </section>
  );
}