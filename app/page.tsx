import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-white text-[#1C4880]">

      {/* HERO */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <Image src="/titulo.png" alt="title" width={400} height={120} />
          <h1 className="text-3xl md:text-5xl font-bold mt-6 leading-tight">
            Fabricación y envío de coronas dentales de alta precisión
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Reduce costos, aumenta tu capacidad y recibe coronas listas para instalar con estándares internacionales.
          </p>

          <div className="mt-6 flex gap-4 flex-wrap">
            <button className="bg-[#1C4880] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90">
              Cotizar ahora
            </button>
            <button className="border border-[#1C4880] px-6 py-3 rounded-lg font-semibold">
              Ver servicios
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <Image src="/familia.png" alt="familia" width={300} height={300} />
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="bg-[#F7FBFF] py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Nuestros servicios</h2>
          <p className="mt-2 text-gray-600">
            Soluciones completas para clínicas y laboratorios dentales
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">

            {/* Servicio 1 */}
            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <Image src="/corona.png" alt="servicio" width={120} height={120} className="mx-auto"/>
              <h3 className="mt-4 font-semibold text-xl">Coronas dentales</h3>
              <p className="mt-2 text-gray-600">
                Producción de coronas en zirconio y cerámica, listas para instalación, con envío internacional rápido.
              </p>
            </div>

            {/* Servicio 2 */}
            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <Image src="/box.png" alt="servicio" width={120} height={120} className="mx-auto"/>
              <h3 className="mt-4 font-semibold text-xl">Arriendo de box clínico</h3>
              <p className="mt-2 text-gray-600">
                Espacios equipados para realizar implantes con infraestructura profesional.
              </p>
            </div>

            {/* Servicio 3 */}
            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <Image src="/impresora.png" alt="servicio" width={120} height={120} className="mx-auto"/>
              <h3 className="mt-4 font-semibold text-xl">Arriendo de impresoras</h3>
              <p className="mt-2 text-gray-600">
                Equipamiento bajo modelo por volumen: paga según cantidad de coronas producidas.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold">Cómo funciona</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div>
            <h3 className="font-semibold text-xl">1. Envío digital</h3>
            <p className="text-gray-600 mt-2">
              Recibimos tu escaneo STL o impresión digital.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl">2. Fabricación</h3>
            <p className="text-gray-600 mt-2">
              Diseñamos y fabricamos con tecnología CAD/CAM.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl">3. Entrega rápida</h3>
            <p className="text-gray-600 mt-2">
              Envío internacional seguro y trazable.
            </p>
          </div>
        </div>
      </section>

      {/* DIFERENCIADORES */}
      <section className="bg-[#269FD0] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 text-center">
          {/* Coronas fabricadas */}
          <div>
            <div className="flex justify-center mb-2">
              {/* Ícono corona */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 64 64"><path fill="#fff" d="M8 44l6-24 18 18 18-18 6 24-24 12z"/><circle cx="14" cy="14" r="4" fill="#fff"/><circle cx="50" cy="14" r="4" fill="#fff"/><circle cx="32" cy="8" r="4" fill="#fff"/></svg>
            </div>
            <h3 className="text-3xl font-bold">+5000</h3>
            <p>Coronas fabricadas</p>
          </div>
          {/* Tiempo de entrega */}
          <div>
            <div className="flex justify-center mb-2">
              {/* Ícono reloj */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" stroke="#fff" strokeWidth="4" fill="none"/><path stroke="#fff" strokeWidth="4" strokeLinecap="round" d="M32 16v18l12 6"/></svg>
            </div>
            <h3 className="text-3xl font-bold">5-7 días</h3>
            <p>Tiempo de entrega</p>
          </div>
          {/* Tecnología avanzada */}
          <div>
            <div className="flex justify-center mb-2">
              {/* Ícono chip */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 64 64"><rect x="16" y="16" width="32" height="32" rx="6" stroke="#fff" strokeWidth="4"/><rect x="26" y="26" width="12" height="12" rx="2" fill="#fff"/><path stroke="#fff" strokeWidth="3" strokeLinecap="round" d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l4 4M48 48l4 4M12 52l4-4M48 16l4-4"/></svg>
            </div>
            <h3 className="text-3xl font-bold">CAD/CAM</h3>
            <p>Tecnología avanzada</p>
          </div>
          {/* Atención personalizada */}
          <div>
            <div className="flex justify-center mb-2">
              {/* Ícono corazón */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 64 64"><path d="M32 56s-20-12.36-20-28A12 12 0 0132 16a12 12 0 0120 12c0 15.64-20 28-20 28z" stroke="#fff" strokeWidth="4" fill="#fff"/></svg>
            </div>
            <h3 className="text-3xl font-bold">Soporte</h3>
            <p>Atención personalizada</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Empieza a reducir costos hoy
        </h2>
        <p className="mt-4 text-gray-600">
          Agenda una llamada o solicita tu primera cotización sin compromiso.
        </p>

        <button className="mt-6 bg-[#1C4880] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90">
          Solicitar cotización
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1C4880] text-white py-4 text-center">
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} Dental Solutions. Todos los derechos reservados.
        </p>
      </footer>

    </main>
  );
}