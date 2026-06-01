"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

type FormState = {
  nombre: string
  apellido: string
  email: string
  password: string
  passwordConfirm: string
  telefono: string
  centro_medico: string
  direccion: string
  numero_registro: string
}

const INITIAL: FormState = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  passwordConfirm: "",
  telefono: "",
  centro_medico: "",
  direccion: "",
  numero_registro: "",
}

const inputClass = `
  w-full px-4 py-3 rounded-xl border-2 border-gray-200
  focus:border-[#1C4880] focus:outline-none transition text-gray-700
`

export default function NewAccount() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    if (form.password !== form.passwordConfirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono ? Number(form.telefono) : null,
        centro_medico: form.centro_medico || null,
        direccion: form.direccion || null,
        numero_registro: form.numero_registro || null,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body?.error ?? "No se pudo crear la cuenta")
      return
    }

    setSent(true)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white px-6 py-16">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/corona_fondo_blanco_wide.png"
          alt="Fondo"
          fill
          priority
          className="object-cover object-center opacity-20"
        />
        <div className="absolute inset-0" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/95 backdrop-blur-sm border border-[#D7E6F5] shadow-2xl rounded-3xl p-8">
          <div className="flex justify-center mb-6 space-x-6">
            <Image
              src="/logo.png"
              alt="Digital Ceramic"
              width={64}
              height={64}
              priority
            />
            <Image
              src="/titulo_minimo.png"
              alt="Digital Ceramic"
              width={140}
              height={10}
              className="w-56 h-8 mt-6"
              priority
            />
          </div>

          {sent ? (
            <div className="text-center py-8 space-y-4">
              <h1 className="text-2xl font-bold text-[#1C4880]">
                Revisa tu correo
              </h1>
              <p className="text-gray-600">
                Te enviamos un enlace a <strong>{form.email}</strong> para
                confirmar tu cuenta. Una vez confirmado podrás iniciar sesión.
              </p>
              <Link
                href="/login"
                className="inline-block text-sm text-[#269FD0] hover:underline"
              >
                Volver a iniciar sesión
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold text-[#1C4880]">
                  Crear cuenta
                </h1>
                <p className="text-gray-600 mt-3">
                  Completa tus datos para acceder a la plataforma.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                      Nombre
                    </label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                      Apellido
                    </label>
                    <input
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@empresa.cl"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={inputClass}
                      minLength={8}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      name="passwordConfirm"
                      value={form.passwordConfirm}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={inputClass}
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="56912345678"
                      className={inputClass}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                      Centro médico
                    </label>
                    <input
                      name="centro_medico"
                      value={form.centro_medico}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                      Dirección
                    </label>
                    <input
                      name="direccion"
                      value={form.direccion}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                      Número de registro
                    </label>
                    <input
                      name="numero_registro"
                      value={form.numero_registro}
                      onChange={handleChange}
                      placeholder="Registro odontológico"
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full bg-[#1C4880] hover:opacity-90 disabled:opacity-60
                    text-white font-semibold py-3 rounded-xl transition
                    shadow-lg shadow-[#1C4880]/20
                  "
                >
                  {loading ? "Creando cuenta…" : "Crear cuenta"}
                </button>
              </form>

              <div
                className={`mt-6 text-center text-sm ${
                  error ? "text-red-500" : "text-gray-500"
                }`}
              >
                {error || (
                  <span>
                    ¿Ya tienes cuenta?{" "}
                    <Link
                      href="/login"
                      className="text-[#269FD0] hover:underline"
                    >
                      Iniciar sesión
                    </Link>
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
