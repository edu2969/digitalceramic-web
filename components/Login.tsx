"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null);

  const supabase = createClient()

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setLoginError("Credenciales inválidas")
      return
    }

    router.push("/dashboard")
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

          {/* Texto */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-[#1C4880]">
              Bienvenido
            </h1>

            <p className="text-gray-600 mt-3">
              Plataforma de gestión de trabajos dentales.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-[#1C4880]">
                  Contraseña
                </label>

                <button
                  type="button"
                  className="text-sm text-[#269FD0] hover:underline"
                  onClick={() => router.push("/forgot-password")}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

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

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-[#1C4880]
                hover:opacity-90
                text-white
                font-semibold
                py-3
                rounded-xl
                transition
                shadow-lg
                shadow-[#1C4880]/20
              "
            >
              Iniciar sesión
            </button>
          </form>

          {/* Footer */}
          <div className={`mt-8 text-center text-sm ${loginError ? 'text-red-400' : 'text-gray-500'}`}>
            {loginError || "Plataforma DigitalCeramic"}
          </div>
        </div>
      </div>
    </section>
  )
}