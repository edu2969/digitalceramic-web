"use client";

import Image from "next/image";
import { BiCheckShield } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa";

const pasos = [
  {
    titulo: "Te inscribes",
    descripcion:
      "Crea tu cuenta gratuitamente y accede a nuestra plataforma.",
  },
  {
    titulo: "Coordinas",
    descripcion:
      "Agenda scanner, box clínico o envía tus archivos STL.",
  },
  {
    titulo: "Escaneamos / Diseñamos",
    descripcion:
      "Diseñamos digitalmente o recibimos tu diseño para fabricación.",
  },
  {
    titulo: "Fabricamos",
    descripcion:
      "Fresado, impresión, maquillaje y control de calidad.",
  },
  {
    titulo: "Recibes y cementas",
    descripcion:
      "Tu restauración llega lista para instalar.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      {/* Glow superior */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-linear-to-r from-blue-400/15 via-violet-400/20 to-fuchsia-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center sm:mb-20">
          <h2 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            ¿CÓMO FUNCIONA?
          </h2>

          <div className="mx-auto mt-5 h-1.5 w-28 rounded-full bg-linear-to-r from-blue-500 via-violet-500 to-fuchsia-500" />

          <p className="mt-5 text-lg text-zinc-700 sm:text-xl lg:text-2xl">
            En solo{" "}
            <span className="bg-linear-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text font-bold text-transparent">
              5 pasos.
            </span>
          </p>
        </div>

        {/* Grid */}
        <div className="relative grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-5">
          {pasos.map((paso, index) => (
            <div key={index} className="relative flex items-center">
              {/* Flecha Desktop */}
              {index !== 0 && (
                <div className="absolute -left-8 top-1/2 hidden -translate-y-1/2 xl:block">
                  <FaArrowRight className="bg-linear-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text" />
                </div>
              )}

              {/* Flecha Mobile */}
              {index !== 0 && (
                <div className="absolute left-1/2 -top-10 flex -translate-x-1/2 xl:hidden">
                  <svg width="24" height="42" viewBox="0 0 24 42">
                    <defs>
                      <linearlinear id={`grad-v-${index}`}>
                        <stop stopColor="#3B82F6" />
                        <stop offset=".5" stopColor="#7C3AED" />
                        <stop offset="1" stopColor="#D946EF" />
                      </linearlinear>
                    </defs>

                    <path
                      d="M12 0V32"
                      stroke={`url(#grad-v-${index})`}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    <path
                      d="M5 24L12 32L19 24"
                      stroke={`url(#grad-v-${index})`}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {/* Tarjeta */}
              <div
                className="
                  group
                  relative
                  h-full
                  w-full
                  rounded-[34px]
                  bg-white
                  p-4
                  sm:pt-2
                  sm:pb-6
                  sm:px-8
                  md:px-2
                  shadow-[0_20px_60px_rgba(15,23,42,.08)]
                  ring-1
                  ring-zinc-100
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:shadow-[0_30px_80px_rgba(124,58,237,.15)]
                "
              >
                {/* Número */}
                <div
                  className="
                    absolute
                    left-1/2
                    -top-6
                    flex
                    h-12
                    w-12
                    sm:h-14
                    sm:w-14
                    -translate-x-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-linear-to-br
                    from-blue-500
                    via-violet-500
                    to-fuchsia-500
                    text-lg
                    sm:text-xl
                    font-bold
                    text-white
                    shadow-xl
                  "
                >
                  {index + 1}
                </div>

                {/* Imagen */}
                <div className="relative mx-auto mt-6 aspect-square w-24 sm:w-28 lg:w-32">
                  <Image
                    src={`/comofunciona/paso_0${index + 1}.png`}
                    alt={paso.titulo}
                    fill
                    sizes="(max-width:640px) 96px,
                           (max-width:1024px) 112px,
                           128px"
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Línea */}
                <div className="mx-auto mb-3 h-0.5 w-16 rounded-full bg-linear-to-r from-blue-500 via-violet-500 to-fuchsia-500" />

                <h3 className="text-center font-bold text-zinc-900 text-md sm:text-xl xl:text-sm">
                  {paso.titulo}
                </h3>

                <p className="mt-2 text-center leading-6 text-zinc-800 sm:text-lg md:text-xs">
                  {paso.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-[0_10px_50px_rgba(15,23,42,.06)]">
          <div className="flex flex-col items-center justify-center gap-6 px-6 py-8 lg:flex-row">            
            <div className="relative">

    <div
        className="
            absolute
            inset-0
            rounded-full
            bg-linear-to-r
            from-blue-500
            via-violet-500
            to-fuchsia-500
            blur-xl
            opacity-30
        "
    />

<>
  <svg width="0" height="0">
    <defs>
      <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#D946EF" />
      </linearGradient>
    </defs>
  </svg>

  <BiCheckShield
    size={48}
    style={{
      fill: "url(#iconGradient)",
    }}
  />
</>

</div>
            <div className="hidden h-12 w-px bg-zinc-200 lg:block" />
            <p className="text-center text-lg font-medium text-zinc-800 sm:text-xl lg:text-2xl">
              Baja la{" "}
              <span className="bg-linear-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text font-bold text-transparent">
                incertidumbre
              </span>{" "}
              del proceso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}