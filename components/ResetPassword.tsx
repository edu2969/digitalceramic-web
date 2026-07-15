"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ResetPassword() {
  const router = useRouter()
  const supabase = createClient()

  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let active = true

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      setHasSession(Boolean(data.user))
      setChecking(false)
    })

    return () => {
      active = false
    }
  }, [supabase])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError(null)

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    if (password !== passwordConfirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setDone(true)
    setTimeout(() => router.push("/login"), 2000)
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
              src="/logo_02.png"
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

          {checking ? (
            <p className="text-center text-gray-500">Verificando enlace…</p>
          ) : !hasSession ? (
            <div className="text-center">
              <h1 className="text-xl font-bold text-[#1C4880]">
                Enlace inválido o expirado
              </h1>

              <p className="text-gray-600 mt-3">
                El enlace de recuperación no es válido o ya caducó. Solicita uno
                nuevo para continuar.
              </p>

              <Link
                href="/forgot-password"
                className="inline-block mt-8 text-[#269FD0] hover:underline font-semibold"
              >
                Solicitar un nuevo enlace
              </Link>
            </div>
          ) : done ? (
            <div className="text-center">
              <h1 className="text-xl font-bold text-[#1C4880]">
                Contraseña actualizada
              </h1>

              <p className="text-gray-600 mt-3">
                Tu contraseña se cambió correctamente. Te redirigimos al inicio
                de sesión…
              </p>
            </div>
          ) : (
            <>
              {/* Texto */}
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold text-[#1C4880]">
                  Nueva contraseña
                </h1>

                <p className="text-gray-600 mt-3">
                  Escribe tu nueva contraseña para acceder a tu cuenta.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                    Nueva contraseña
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

                <div>
                  <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                    Repetir contraseña
                  </label>

                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
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
                  {loading ? "Guardando…" : "Cambiar contraseña"}
                </button>
              </form>

              {/* Footer */}
              {error && (
                <div className="mt-8 text-center text-sm text-red-400">
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
