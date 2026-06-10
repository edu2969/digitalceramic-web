"use client"

import Image from "next/image";
import { BiSolidPhoneCall } from "react-icons/bi";
import { BsFillGeoAltFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import Whatssap from "../Whatssap";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  return (<footer className="bg-linear-to-br from-[#031529] to-[#020E29] text-white py-4 text-left">
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-4 px-6">
      <div className="col-span-2 sm:col-span-3 md:col-span-2 md:border-r-2 md:border-white/10">
        <div className="text-left">
          <div className="flex items-center">
            <Image src="/logo.png" width={509} height={507} className="w-16 h-auto" alt="logo footer"/>
            <div className="ml-4">
              <p className="font-bold text-2xl sm:text-3xl">DigitalCeramic</p>
              <p className="text-[#1F9CE7]">ODONTOLOGÍA DIGITAL</p>
            </div>
          </div>
        </div>
      </div>
      <div className="md:border-r-2 md:border-white/10">
        <p className="font-semibold text-md">Enlaces rápidos</p>
        <div className="w-fit text-xs border-b border-transparent hover:border-[#1F9CE7] cursor-pointer" onClick={() => { router.push('/') }}>Inicio</div>
        <div className="w-fit text-xs border-b border-transparent hover:border-[#1F9CE7] cursor-pointer" onClick={() => { router.push('/') }}>Club de Beneficios</div>
        <div className="w-fit text-xs border-b border-transparent hover:border-[#1F9CE7] cursor-pointer" onClick={() => { router.push('/') }}>Servicios</div>
        <div className="w-fit text-xs border-b border-transparent hover:border-[#1F9CE7] cursor-pointer" onClick={() => { router.push('/') }}>Casos clínicos</div>
        <div className="w-fit text-xs border-b border-transparent hover:border-[#1F9CE7] cursor-pointer" onClick={() => { router.push('/contact') }}>Contacto</div>
      </div>
      <div className="md:border-r-2 md:border-white/10">
        <p className="font-semibold text-md">Contáctenos</p>
        <div className="flex py-1.5 space-x-2">
          <BiSolidPhoneCall className="text-[#1F9CE7]" />
          <p className="text-xs">+56 9 1234 5678</p>
        </div>
        <div className="flex py-1.5 space-x-2">
          <MdEmail className="text-[#1F9CE7]" />
          <p className="text-xs">contacto@digitalceramic.cl</p>
        </div>
        <div className="flex py-1.5 space-x-2">
          <BsFillGeoAltFill className="text-[#1F9CE7]" />
          <p className="text-xs">Concepción, Chile.</p>
        </div>        
      </div>
      <div className="md:border-r-2 md:border-white/10">
        <p className="font-semibold text-md">Horario de atención</p>
        <p className="text-sm">Lunes a viernes</p>
        <p className="text-xs">9:00 - 18:30</p>
        <p className="text-sm mt-1">Sábado</p>
        <p className="text-xs">9:00 - 13:00</p>        
      </div>
      <div className="col-span-2 sm:col-span-3 md:col-span-1 h-full md:mt-6">
        <Whatssap />
      </div>
    </div>
    <p className="text-xs text-center opacity-80 border-t border-white/10 pt-4 mx-4 md:mx-12">
      © {new Date().getFullYear()} DigitalCeramic. Todos los derechos reservados
    </p>
  </footer>);
}