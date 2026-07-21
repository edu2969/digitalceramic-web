"use client"

import Image from "next/image"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import InputRut from "./prefabs/RutInput"
import { useState } from "react"

type FormState = {
  nombre: string
  apellido: string
  email: string
  rut: string;
  password: string
  passwordConfirm: string
  telefono: string
  centro_medico: string
  direccion: string
  numero_registro: string
}

const inputClass = `
  w-full px-4 py-3 rounded-xl border-2 border-gray-200
  focus:border-[#1C4880] focus:outline-none transition text-gray-700
`

const errorInputClass = `
  w-full px-4 py-3 rounded-xl border-2 border-red-500
  focus:border-red-500 focus:outline-none transition text-gray-700
`

export default function NewAccount() {
  const [error, setError] = useState<null | string>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState<null | string>(null)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid, isSubmitting }    
  } = useForm<FormState>({
    mode: "onChange",
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      rut: "",
      password: "",
      passwordConfirm: "",
      telefono: "",
      centro_medico: "",
      direccion: "",
      numero_registro: "",
    },
  })

  const password = watch("password")

   const onSubmit = async (form: FormState) => {
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

    setSent(form.email)
  }

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-white px-6 mt-30 py-4">
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
              src="/logo_02.png"
              alt="DigitalCeramic"
              width={64}
              height={64}
              priority
            />
            <div className="mt-3 text-[#1C4880] text-2xl font-bold">
              Digital<span className="text-[#269FD0]">Ceramic</span>
            </div>
          </div>

          {!sent && <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-[#1C4880]">
              Crear cuenta
            </h1>
            <p className="text-gray-600 mt-3">
              Completa tus datos para acceder a la plataforma.
            </p>
          </div>}

          {sent ? (
            <div className="text-center py-8 space-y-4">
              <h1 className="text-2xl font-bold text-[#1C4880]">
                Revisa tu correo
              </h1>
              <p className="text-gray-600">
                Te enviamos un enlace a <strong>{sent}</strong> para
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                  Nombres
                </label>
                <input
                  {...register("nombre", {
                    required: "El nombre es requerido",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                  })}
                  className={errors.nombre ? errorInputClass : inputClass}
                />
                {errors.nombre && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.nombre.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                  Apellidos
                </label>
                <input
                  {...register("apellido", {
                    required: "El apellido es requerido",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                  })}
                  className={errors.apellido ? errorInputClass : inputClass}
                />
                {errors.apellido && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.apellido.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">RUT</label>
                  <Controller
                    name="rut"
                    control={control}
                    rules={{ required: "RUT es requerido" }}
                    render={({ field }) => (
                      <InputRut
                        className={inputClass}
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1C4880] mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "El email es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido",
                    },
                  })}
                  placeholder="correo@empresa.cl"
                  className={errors.email ? errorInputClass : inputClass}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 8,
                      message: "Mínimo 8 caracteres",
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                      message: "Debe combinar letras y números",
                    },
                  })}
                  placeholder="••••••••"
                  className={errors.password ? errorInputClass : inputClass}
                />
                {!errors.password && <span className="text-gray-500 text-xs ml-2">
                  mínimo 8 caracteres, letras y números
                </span>}
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  {...register("passwordConfirm", {
                    required: "Confirma tu contraseña",
                    validate: (value) =>
                      value === password || "Las contraseñas no coinciden",
                  })}
                  placeholder="••••••••"
                  className={errors.passwordConfirm ? errorInputClass : inputClass}
                />
                {errors.passwordConfirm && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.passwordConfirm.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    {...register("telefono", {
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "Debe tener 9 dígitos",
                      },
                    })}
                    placeholder="Número"
                    className={`${errors.telefono ? errorInputClass : inputClass} pl-11`}
                    inputMode="numeric"
                  />
                  <span className="text-gray-400 absolute left-2 top-3.5">
                    +56
                  </span>
                </div>
                {errors.telefono && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.telefono.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                  Centro médico
                </label>
                <input
                  {...register("centro_medico")}
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
                  {...register("direccion")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C4880] mb-2">
                  Número de registro <small>(opcional)</small>
                </label>
                <input
                  {...register("numero_registro")}
                  placeholder="Registro odontológico"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`
                w-full text-white font-semibold py-3 rounded-xl transition
                ${!isValid || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1C4880] hover:opacity-90 shadow-lg shadow-[#1C4880]/20"
                }
              `}
            >
              {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
            </button>
          </form>
            </>
          )}



          {!sent && <div className="mt-6 text-center text-sm text-gray-500">
            <span>
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-[#269FD0] hover:underline"
              >
                Iniciar sesión
              </Link>
            </span>
          </div>}
        </div>
      </div>
    </section>
  )
}