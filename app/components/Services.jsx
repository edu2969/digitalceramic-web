import Image from "next/image";

export default function Services() {
  return (<section className="bg-[#F7FBFF] py-16 px-6">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl font-bold">Nuestros servicios</h2>
      <p className="mt-2 text-gray-600">
        Soluciones completas para clínicas y laboratorios dentales
      </p>

      <div className="grid md:grid-cols-4 gap-8 mt-12">

        {/* Servicio 1: Box de arriendo */}
        <div className="border rounded-xl hover:shadow-lg transition hover:scale-105">
          <div className="w-full aspect-4/3 relative">
            <Image src="/serv_box.png" alt="servicio" fill style={{ objectFit: 'cover' }} className="rounded-lg rounded-b-none" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-xl">Box de arriendo</h3>
            <p className="mt-2 text-gray-600">
              Espacios equipados para realizar implantes y procedimientos dentales con infraestructura profesional.
            </p>
          </div>
        </div>

        {/* Servicio 2: Escáner dental */}
        <div className="border rounded-xl hover:shadow-lg transition hover:scale-105">
          <div className="w-full aspect-4/3 relative">
            <Image src="/serv_escaner_dental.png" alt="servicio" fill style={{ objectFit: 'cover' }} className="rounded-lg rounded-b-none" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-xl">Escáner dental</h3>
            <p className="mt-2 text-gray-600">
              Servicio de escaneo intraoral con herramienta de escáner manual para digitalización precisa de la boca del paciente.
            </p>
          </div>
        </div>

        {/* Servicio 3: Diseño de piezas dentales */}
        <div className="border rounded-xl hover:shadow-lg transition hover:scale-105">
          <div className="w-full aspect-4/3 relative">
            <Image src="/serv_diseno_3d.png" alt="servicio" fill style={{ objectFit: 'cover' }} className="rounded-lg rounded-b-none" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-xl">Diseño de piezas dentales</h3>
            <p className="mt-2 text-gray-600">
              Modelado digital personalizado de coronas, puentes y otros elementos protésicos según requerimientos clínicos.
            </p>
          </div>
        </div>

        {/* Servicio 4: Coronas dentales */}
        <div className="border rounded-xl hover:shadow-lg transition hover:scale-105">
          <div className="w-full aspect-4/3 relative">
            <Image src="/serv_corona.png" alt="servicio" fill style={{ objectFit: 'cover' }} className="rounded-lg rounded-b-none" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-xl">Coronas dentales</h3>
            <p className="mt-2 text-gray-600">
              Producción de coronas en zirconio y cerámica, listas para instalación, con envío internacional rápido.
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>);
}