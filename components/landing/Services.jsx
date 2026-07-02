import Image from "next/image";

export default function Services() {
  const titulos = ["Restauraciones digitales", "Arriendos de box Digital",
    "Planificación y diseño CAD/CAM", "Escaneo digital de modelos"];

  const descripciones = ["Carillas, coronas sobre implante, coronas cementadas e incrustaciones Onlay e Inlay. Excelente estética, máxima naturalidad y durabilidad garantizada.",
    "Boxes equipados con escáner intraoral y flujo digital completo para planificación y rehabilitación de casos clínicos",
    "Diseño digital de restauraciones, análisis de casos y planificación precisa para resultados predecibles",
    "Digitalización de impresiones y modelos físicos para integrar casos analógicos al flujo digital"
  ]

  return (<section id="servicios" className="pb-6 px-6 text-[#24335D]">
    <div className="mx-auto text-center">
      <div>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:col-span-3 gap-4">
          <div className="text-center col-span-2 sm:col-span-3">
            <h2 className="text-2xl sm:text-3xl font-bold">SOLUCIONES DIGITALES</h2>
            <p className="text-base sm:text-lg">
              Todo lo que necesitas para trabajar digital
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 pt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="
        overflow-hidden
        rounded-[40px]
        bg-white
        shadow-lg
        hover:shadow-2xl
        transition-all
        duration-300
        border border-gray-100
      "
            >
              {/* Imagen */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={`/soluciones/solucion_0${[6, 1, 8, 7][index]}.png`}
                  alt={`service ${index}`}
                  fill
                  className="
            object-cover
            object-center
            hover:scale-105
            transition-transform
            duration-500
          "
                  sizes="
    (max-width: 639px) 100vw,
    (max-width: 1279px) 50vw,
    25vw
  "
                />
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  {titulos[index]}
                </h3>

                <p className="leading-relaxed">
                  {descripciones[index]}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  </section>);
}