"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "¿Qué garantía tienen mis trabajos?",
    answer:
      "Todos los trabajos realizados por DigitalCeramic cuentan con garantía del 100%. Si una pieza presenta algún inconveniente atribuible a nuestro proceso de fabricación, la volveremos a elaborar y enviar sin costo adicional. Si la situación lo amerita, reembolsaremos el 100% del valor pagado. Puedes comunicarte con nosotros mediante WhatsApp o utilizando el formulario de contacto.",
  },
  {
    question:
      "¿Se elaboran piezas en cerámica, feldespato u otros materiales distintos a Disilicato y Zirconia?",
    answer:
      "Trabajamos principalmente con Disilicato y Zirconia por ser los materiales que ofrecen los mejores resultados clínicos. Sin embargo, podemos fabricar piezas en otros materiales cuando el odontólogo tratante lo solicite expresamente en las observaciones del caso. Siempre entregaremos nuestra asesoría para recomendar la alternativa más adecuada según nuestra experiencia.",
  },
  {
    question:
      "¿Qué requisitos debo cumplir para acceder al Club DigitalCeramic?",
    answer:
      "Debes ser odontólogo titulado. Una vez validada tu información podrás acceder a todos los beneficios exclusivos del Club DigitalCeramic.",
  },
  {
    question:
      "¿Puedo cancelar la elaboración de un trabajo después de enviarlo?",
    answer:
      "Sí, mientras el trabajo no haya sido pagado. La fabricación comienza una vez confirmado el pago y considera un plazo aproximado de siete días de elaboración. Una vez iniciado el proceso ya no es posible cancelar la orden.",
  },
  {
    question: "¿Puedo salir del Club DigitalCeramic?",
    answer:
      "Sí. Solo debes solicitarlo a nuestro equipo de contacto y eliminaremos tu registro sin costo. Al hacerlo dejarás de acceder a todos los beneficios exclusivos del Club.",
  },
  {
    question: "¿Puedo realizar yo mismo el escaneo? ¿Recibiré ayuda?",
    answer:
      "Sí. En nuestro plan Ruta 3 tendrás acceso a nuestras instalaciones y recibirás asesoría personalizada para realizar correctamente el escaneo, asegurando que el caso pueda ser fabricado sin inconvenientes.",
  },
];

export default function Contact() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          para: "contacto@yopmail.com",
        }),
      });

      if (res.ok) {
        setEnviado(true);
      } else {
        alert("Error al enviar el mensaje.");
      }
    } catch {
      alert("Error de conexión.");
    }
  }

  return (
    <section className="bg-[#F7FBFF] py-20 px-6">

      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1C4880] mt-8">
            Preguntas Frecuentes
          </h2>

          <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
            Hemos recopilado las consultas más habituales de nuestros clientes.
            Si aún tienes dudas, encontrarás un formulario de contacto al final
            de esta página.
          </p>
        </div>

        <div className="space-y-4">

          {faqs.map((faq, index) => {

            const opened = openIndex === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(opened ? null : index)
                  }
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-slate-50"
                >
                  <span className="text-lg font-semibold text-[#1C4880]">
                    {faq.question}
                  </span>

                  <span
                    className={`text-2xl text-[#1C4880] transition-transform duration-300 ${
                      opened ? "rotate-180" : ""
                    }`}
                  >
                    <FaChevronDown />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    opened
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-gray-100 px-6 py-5 text-gray-600 leading-8">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        <div className="mt-16 rounded-2xl bg-[#1C4880] px-10 py-10 text-center text-white shadow-xl">

          <h3 className="text-3xl font-bold">
            ¿No encontraste la respuesta que buscabas?
          </h3>

          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto leading-8">
            Escríbenos mediante el siguiente formulario. Uno de nuestros
            especialistas responderá tu consulta a la brevedad y te orientará
            para encontrar la mejor solución para tu caso.
          </p>

        </div>

        <div className="mt-12 max-w-xl mx-auto rounded-2xl bg-white p-8 shadow-xl">

          <h2 className="text-3xl font-bold text-center text-[#1C4880]">
            Contáctanos
          </h2>

          <p className="mt-3 text-center text-gray-600">
            Completa el formulario y responderemos tu consulta lo antes posible.
          </p>

          {enviado ? (
            <div className="mt-8 rounded-lg bg-green-50 p-5 text-center font-semibold text-green-700">
              ¡Gracias por tu mensaje! Nos pondremos en contacto contigo muy
              pronto.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              <div>
                <label
                  htmlFor="nombre"
                  className="mb-2 block font-semibold"
                >
                  Nombre
                </label>

                <input
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#1C4880] focus:ring-2 focus:ring-[#1C4880]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-semibold"
                >
                  Correo electrónico
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#1C4880] focus:ring-2 focus:ring-[#1C4880]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="mb-2 block font-semibold"
                >
                  Teléfono
                </label>

                <input
                  id="telefono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#1C4880] focus:ring-2 focus:ring-[#1C4880]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="mensaje"
                  className="mb-2 block font-semibold"
                >
                  Mensaje
                </label>

                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  value={form.mensaje}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#1C4880] focus:ring-2 focus:ring-[#1C4880]/20"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#1C4880] py-3 text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Enviar mensaje
              </button>
            </form>
          )}

        </div>

      </div>

    </section>
  );
}