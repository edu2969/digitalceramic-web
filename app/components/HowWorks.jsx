export default function HowWorks() {
    return (<section className="py-16 px-6 max-w-7xl mx-auto text-center">
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
      </section>);    
}