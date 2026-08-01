"use client"

import Image from "next/image";
import { BsFillGeoAltFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useSectionNav } from "@/app/hooks/useSectionNav";
import { useEffect, useState } from "react";
import { segoePR } from '@/app/fonts'

export default function Footer() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { goToInicio, scrollToSection } = useSectionNav();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 9);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleGoToInicio = () => {
        goToInicio();
    };

    const handleScrollToSection = (id: string) => {
        scrollToSection(id);
    };

  return (<footer className="bg-linear-to-br from-[#031529] to-[#020E29] text-white py-4 text-left">
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-4 px-6">
      <div className="col-span-2 sm:col-span-3 md:col-span-2 md:border-r-2 md:border-white/10">
        <div className="text-left">
          <button className="flex items-center gap-2 md:gap-3 shrink-0" onClick={handleGoToInicio}>
              <div className="relative w-14 h-14 md:w-16 md:h-16 transition-all duration-300 shrink-0">
                  <Image
                      src="/logo_02.png"
                      alt="Digital Ceramic"
                      fill
                      priority
                      sizes="64px"
                      className="object-contain"
                  />
              </div>
              <div className="min-w-0">
                  <div className={`hidden sm:flex text-xl md:text-2xl font-bold transition-all duration-300 ${scrolled ? 'opacity-100' : 'opacity-100'}`}>
                      <span className="text-white">Digital</span>
                      <span className="text-[#1D98EC]">Ceramic</span>
                  </div>
                  <div className={`hidden sm:flex ${segoePR.className} text-white text-[11px] sm:text-sm whitespace-nowrap`}>
                      simplemente odontología digital
                  </div>
              </div>
          </button>
        </div>
      </div>
      <div className="md:border-r-2 md:border-white/10">
        <p className="font-semibold text-md">Enlaces rápidos</p>
        <div className="w-fit text-xs border-b border-transparent hover:border-[#1F9CE7] cursor-pointer" onClick={handleGoToInicio}>Inicio</div>
        <div className="w-fit text-xs border-b border-transparent hover:border-[#1F9CE7] cursor-pointer" onClick={() => handleScrollToSection('club')}>Club de Beneficios</div>
        <div className="w-fit text-xs border-b border-transparent hover:border-[#1F9CE7] cursor-pointer" onClick={() => handleScrollToSection('servicios')}>Servicios</div>
        <div className="w-fit text-xs border-b border-transparent hover:border-[#1F9CE7] cursor-pointer" onClick={() => { router.push('/somos') }}>Quienes somos</div>
        <div className="w-fit text-xs border-b border-transparent hover:border-[#1F9CE7] cursor-pointer" onClick={() => { router.push('/contacto') }}>Contacto</div>
      </div>
      <div className="md:border-r-2 md:border-white/10">
        <p className="font-semibold text-md">Contáctenos</p>
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
    </div>
    <p className="text-xs text-center opacity-80 border-t border-white/10 pt-4 mx-4 md:mx-12">
      © {new Date().getFullYear()} DigitalCeramic. Todos los derechos reservados
    </p>
  </footer>);
}