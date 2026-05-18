import Image from "next/image";

export default function Support() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
      <div className="flex justify-center">
        <Image src="/todo_4_servicios.png" alt="Apoyo" width={1200} height={420} className="rounded-xl shadow-lg opacity-50" />
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4">Apoyamos tu labor</h2>
        <p className="text-lg text-gray-700">
          Junto con instalaciones de alto nivel y herramientas a tu disposición, te alistamos a entregar el mejor servicio.
        </p>
      </div>
    </section>
  );
}