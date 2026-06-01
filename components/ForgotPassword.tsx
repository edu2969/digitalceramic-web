"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPassword() {
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
    })

    setLoading(false)

    if (error) {
      setError("No se pudo enviar el correo. Intenta nuevamente.")
      return
    }

    setSent(true)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white px-6">
      {/* Fondo */}
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

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm border border-[#D7E6F5] shadow-2xl rounded-3xl p-8">
          {/* Logo */}
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
            <div className="text-center">
              <h1 className="text-xl font-bold text-[#1C4880]">
                Revisa tu correo
              </h1>

              <p className="text-gray-600 mt-3">
                Si existe una cuenta asociada a{" "}
                <span className="font-semibold">{email}</span>, te enviamos un
                enlace para restablecer tu contraseña.
              </p>

              <p className="text-sm text-gray-400 mt-4">
                ¿No lo ves? Revisa la carpeta de spam. El enlace es de un solo
                uso y caduca pronto.
              </p>

              <Link
                href="/login"
                className="inline-block mt-8 text-[#269FD0] hover:underline font-semibold"
              >
                Volver a iniciar sesión
              </Link>
            </div>
          ) : (
            <>
              {/* Texto */}
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold text-[#1C4880]">
                  Recuperar contraseña
                </h1>

                <p className="text-gray-600 mt-3">
                  Ingresa tu correo y te enviaremos un enlace para crear una
                  nueva contraseña.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@empresa.cl"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border-2
                      border-gray-200
                      focus:border-[#1C4880]
                      focus:outline-none
                      transition
                      text-gray-700
                    "
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    bg-[#1C4880]
                    hover:opacity-90
                    disabled:opacity-60
                    text-white
                    font-semibold
                    py-3
                    rounded-xl
                    transition
                    shadow-lg
                    shadow-[#1C4880]/20
                  "
                >
                  {loading ? "Enviando…" : "Enviar enlace"}
                </button>
              </form>

              {/* Footer */}
              <div
                className={`mt-8 text-center text-sm ${
                  error ? "text-red-400" : "text-gray-500"
                }`}
              >
                {error || (
                  <Link
                    href="/login"
                    className="text-[#269FD0] hover:underline font-semibold"
                  >
                    Volver a iniciar sesión
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
