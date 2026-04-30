"use client"

import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Aquí iría la lógica de envío (API, email, etc.)
    setEnviado(true);
  }

  return (
    <section className="bg-[#F7FBFF] py-16 px-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center">Contáctanos</h2>
        <p className="mt-2 text-gray-600 text-center">
          ¿Tienes dudas o quieres cotizar? Completa el formulario y te responderemos a la brevedad.
        </p>
        {enviado ? (
          <div className="mt-8 text-green-700 text-center font-semibold">
            ¡Gracias por tu mensaje! Nos pondremos en contacto pronto.
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-left font-semibold mb-1" htmlFor="nombre">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C4880]"
              />
            </div>
            <div>
              <label className="block text-left font-semibold mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C4880]"
              />
            </div>
            <div>
              <label className="block text-left font-semibold mb-1" htmlFor="telefono">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C4880]"
              />
            </div>
            <div>
              <label className="block text-left font-semibold mb-1" htmlFor="mensaje">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C4880]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1C4880] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Enviar mensaje
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
