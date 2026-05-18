import Image from "next/image";

export default function WhoWeAre() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-[#269FD0]">Quiénes somos</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Bienvenido a DigitalCeramic
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              Laboratorio Dental
            </h2>            
          </div>

          <div className="space-y-6 text-lg leading-8 text-gray-700">
            <p>
              En DigitalCeramic Laboratorio Dental, llevamos más de 15 años aportando a las sonrisas, combinando experiencia técnica con tecnología digital de última generación para ofrecer soluciones precisas, rápidas y confiables a odontólogos y clínicas.
            </p>
            <p>
              Nos especializamos en soluciones protésicas, integrando flujos de trabajo digitales que optimizan cada etapa del proceso clínico y de laboratorio.
            </p>
            <p>
              Nuestro enfoque va más allá de la fabricación: somos un aliado estratégico del odontólogo, facilitando su trabajo mediante servicios que incluyen escaneo intraoral, diseño digital y soporte técnico especializado, permitiendo reducir tiempos clínicos, mejorar la precisión y aumentar la rentabilidad de cada tratamiento.
            </p>
            <p>
              En DigitalCeramic creemos en una odontología moderna, eficiente y accesible. Por eso, desarrollamos soluciones que permiten a nuestros clientes dar el salto a lo digital sin necesidad de grandes inversiones, manteniendo siempre altos estándares de calidad.
            </p>
            <p className="font-semibold text-[#1C4880]">
              Precisión, compromiso y tecnología son la base de nuestro trabajo.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl overflow-hidden shadow-2xl border border-[#E5F0FB]">
            <Image
              src="/todo_4_servicios.png"
              alt="Servicios digitales para odontólogos"
              width={1000}
              height={700}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="rounded-3xl border border-[#E5F0FB] bg-[#F7FBFF] p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Un socio digital para tu clínica</h2>
            <p className="mt-4 text-gray-700 leading-7">
              Trabajamos con odontólogos que buscan soluciones de alto valor: desde digitalización rápida hasta piezas listas para instalar con acabados precisos.
            </p>
            <ul className="mt-6 space-y-4 text-gray-700">
              <li className="flex gap-3 items-start">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#269FD0] text-white text-sm">✓</span>
                <span>Coronas en circonio y disilicato de litio con procesos CAD/CAM avanzados.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#269FD0] text-white text-sm">✓</span>
                <span>Escaneo intraoral, diseño digital y soporte técnico para cada etapa clínica.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#269FD0] text-white text-sm">✓</span>
                <span>Soluciones modernas sin requerir grandes inversiones en equipos propios.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
