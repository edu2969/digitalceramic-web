"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <section
  className="relative mt-20 md:mt-24 flex items-center overflow-hidden bg-[#000A13] text-white z-0 min-h-[500px] md:h-[calc(100vh/2)]"
>
  {/* Contenedor de la imagen - desktop: mitad derecha, móvil: fondo completo */}
  <div className="absolute inset-0 md:inset-y-0 md:left-1/2 md:right-0">
    {/* Degradado azul que cubre la mitad izquierda de la imagen */}
    <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#000A13] via-[#000A13]/80 to-transparent md:from-[#000A13] md:via-[#000A13]/60 md:to-transparent" />
    
    <div className="relative w-full h-full">
      <Image
        src="/soluciones/solucion_03.png"
        alt="Sonrisa antes-despues"
        fill
        className="object-cover md:object-cover object-center"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{
          objectPosition: 'center 30%', // Enfoca en el tercio superior de la imagen (ajustable)
        }}
      />
      
      {/* Degradado azul superpuesto en la mitad inferior de la imagen (efecto de acercamiento) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#000A13]/20 to-[#000A13]/60 pointer-events-none" />
      
      {/* Degradado lateral izquierdo para mejor fusión con el texto */}
      <div className="absolute inset-y-0 left-0 w-1/2 z-10 bg-gradient-to-r from-[#000A13] to-transparent md:from-[#000A13]/80 md:to-transparent pointer-events-none" />
    </div>
  </div>

  {/* Contenido textual */}
  <div className="relative z-20 w-full px-6 md:ml-12 md:max-w-1/2 text-left py-8">
    <div className="flex text-3xl md:text-5xl font-bold">
      <p>Digital</p>
      <p className="text-[#1F9CE7] ml-2">Ceramic</p>
    </div>
    
    <p className="mt-4 text-lg md:text-2xl font-bold leading-tight">
      Coronal digitales de alta precisión,{' '}
      <span className="text-[#1F9CE7]">hasta 30% más baratas</span> - sin invertir en escáner
    </p>
    
    <p className="mt-2 text-sm md:text-base text-gray-100 max-w-xl">
      Escaneo intraoral, diseño CAD/CAM y fabricación con flujo 100% digital. Únete al Club Digital Ceramic y fija precios protegidos desde tu primera corona.
    </p>
    
    <div className="mt-6 md:mt-8 flex gap-4 flex-wrap">
      <button
        className="flex bg-gradient-to-b from-[#7C31CF] to-[#731BD1] px-8 md:px-10 py-3 md:py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        onClick={() => {
          const element = document.getElementById('club');
          if (!element) return;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offset = 80;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
        }}
      >
        <p className="text-base md:text-lg">Ver beneficios del club</p>
      </button>
      
      <button className="flex font-bold bg-[#22B35E] px-6 md:px-8 py-3 md:py-4 rounded-lg hover:opacity-90 transition-opacity gap-3 items-center">
        <span>Escribenos por WhatsApp</span>
      </button>
    </div>
  </div>

  {/* Línea decorativa inferior */}
  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1F9CE7]/20 via-[#1F9CE7]/50 to-transparent" />
</section>
  );
}