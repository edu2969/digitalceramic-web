"use client"

import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  FiCamera,
  FiMail,
  FiLock,
  FiUser,
  FiBriefcase,
  FiShield,
  FiPhone,
  FiMapPin,
  FiHash,
  FiTrash2,
} from "react-icons/fi"
import { createClient } from "@/lib/supabase/client"
import { UserRole } from "@/lib/userRole"

type ProfileResponse = {
  profile: {
    id: string
    email: string | null
    nombre: string | null
    apellido: string | null
    telefono: number | null
    centroMedico: string | null
    direccion: string | null
    numeroRegistro: string | null
    userRole: UserRole | null
  } | null
}

type FormState = {
  nombre: string
  apellido: string
  telefono: string
  centro_medico: string
  direccion: string
  numero_registro: string
  user_role: string
}

const EMPTY: FormState = {
  nombre: "",
  apellido: "",
  telefono: "",
  centro_medico: "",
  direccion: "",
  numero_registro: "",
  user_role: "",
}

const ROLE_LABEL: Record<UserRole, string> = {
  ODONTOLOGO: "Odontólogo",
  LABORATORIO: "Laboratorio",
  ADMINISTRADOR: "Administrador",
}

async function fetchProfile(): Promise<ProfileResponse> {
  const res = await fetch("/api/profile/me")
  if (!res.ok) throw new Error("Error cargando perfil")
  return res.json()
}

async function patchProfile(payload: Record<string, unknown>) {
  const res = await fetch("/api/profile/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? "Error actualizando perfil")
  }
  return res.json() as Promise<ProfileResponse>
}

export default function AccountSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const supabase = createClient()
  const queryClient = useQueryClient()

  const [avatar, setAvatar] = useState<string | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile-me"],
    queryFn: fetchProfile,
  })

  const profile = data?.profile

  useEffect(() => {
    if (!profile) return
    setForm({
      nombre: profile.nombre ?? "",
      apellido: profile.apellido ?? "",
      telefono: profile.telefono !== null ? String(profile.telefono) : "",
      centro_medico: profile.centroMedico ?? "",
      direccion: profile.direccion ?? "",
      numero_registro: profile.numeroRegistro ?? "",
      user_role: profile.userRole ?? "",
    })
  }, [profile])

  const profileMutation = useMutation({
    mutationFn: patchProfile,
    onSuccess: (result) => {
      queryClient.setQueryData(["profile-me"], result)
      toast.success("Perfil actualizado")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error actualizando perfil")
    },
  })

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    const url = URL.createObjectURL(file)
    setAvatar(url)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const profilePayload = {
      nombre: form.nombre,
      apellido: form.apellido,
      telefono: form.telefono ? Number(form.telefono) : null,
      centro_medico: form.centro_medico || null,
      direccion: form.direccion || null,
      numero_registro: form.numero_registro || null,
    }

    const profilePromise = profileMutation.mutateAsync(profilePayload)

    if (password) {
      if (password.length < 8) {
        toast.error("La contraseña debe tener al menos 8 caracteres")
        return
      }
      if (password !== passwordConfirm) {
        toast.error("Las contraseñas no coinciden")
        return
      }
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Contraseña actualizada")
        setPassword("")
        setPasswordConfirm("")
      }
    }

    await profilePromise
  }

  const fullName =
    [profile?.nombre, profile?.apellido].filter(Boolean).join(" ").trim() ||
    "Usuario"

  const initials =
    fullName
      .split(/\s+/)
      .map((s) => s.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") || "U"

  const roleLabel = profile?.userRole ? ROLE_LABEL[profile.userRole] : "—"

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="ml-16 lg:ml-0">
          <h1 className="text-3xl font-bold tracking-tight text-[#1C4880] text-right md:text-left">
            Configuración de cuenta
          </h1>

          <p className="text-gray-500 mt-2 text-right md:text-left">
            Administra tu información personal y de seguridad
          </p>
        </div>

        {isError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            No se pudo cargar tu perfil.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
        >
          {/* Avatar */}
          <div className="px-8 pt-10 pb-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div
                  className="
                    w-32 h-32
                    rounded-full
                    overflow-hidden
                    bg-[#1C4880]
                    shadow-xl
                    border-4 border-white
                    flex items-center justify-center
                  "
                >
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-4xl font-bold">
                      {initials}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="
                    absolute bottom-1 right-1
                    w-10 h-10
                    rounded-full
                    bg-[#1C4880]
                    text-white
                    flex items-center justify-center
                    shadow-lg
                    hover:scale-105
                    transition
                  "
                >
                  <FiCamera className="w-5 h-5" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-[#1C4880]">
                  {isLoading ? "Cargando…" : fullName}
                </h2>

                <p className="text-gray-500 mt-1">
                  {profile?.centroMedico ?? "Sin centro médico"}
                </p>

                <p className="text-sm text-gray-400 mt-3">
                  JPG, PNG o WEBP · Máximo 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Nombre
                </label>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300
                      focus:outline-none focus:ring-2 focus:ring-[#1C4880] focus:border-transparent transition
                    "
                  />
                </div>
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Apellido
                </label>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300
                      focus:outline-none focus:ring-2 focus:ring-[#1C4880] focus:border-transparent transition
                    "
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    value={profile?.email ?? ""}
                    disabled
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200
                      bg-gray-100 text-gray-500 cursor-not-allowed
                    "
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Teléfono
                </label>

                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300
                      focus:outline-none focus:ring-2 focus:ring-[#1C4880] focus:border-transparent transition
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Nueva contraseña
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300
                      focus:outline-none focus:ring-2 focus:ring-[#1C4880] focus:border-transparent
                    "
                  />
                </div>
              </div>

              {/* Repassword */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Repetir contraseña
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300
                      focus:outline-none focus:ring-2 focus:ring-[#1C4880] focus:border-transparent
                    "
                  />
                </div>
              </div>

              {/* Centro médico */}
              {form.user_role === "dentista" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Centro médico
                  </label>

                <div className="relative">
                  <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="centro_medico"
                    value={form.centro_medico}
                    onChange={handleChange}
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300
                      focus:outline-none focus:ring-2 focus:ring-[#1C4880] focus:border-transparent
                    "
                  />
                </div>
              </div>)}

              {/* Número de registro */}
              {form.user_role === "dentista" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Número de registro
                  </label>

                <div className="relative">
                  <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="numero_registro"
                    value={form.numero_registro}
                    onChange={handleChange}
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300
                      focus:outline-none focus:ring-2 focus:ring-[#1C4880] focus:border-transparent
                    "
                  />
                </div>
              </div>)}

              {/* Dirección */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Dirección
                </label>

                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300
                      focus:outline-none focus:ring-2 focus:ring-[#1C4880] focus:border-transparent
                    "
                  />
                </div>
              </div>

              {/* Rol */}
              {form.user_role === "dentista" && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Rol
                  </label>

                <div className="relative">
                  <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={roleLabel}
                    disabled
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200
                      bg-gray-100 text-gray-500 cursor-not-allowed
                    "
                  />
                </div>
              </div>)}
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10">
              <button
                type="button"
                onClick={() => setOpenDeleteModal(true)}
                className="
                  w-full md:w-auto
                  px-6 py-3
                  rounded-xl
                  border border-red-200
                  bg-red-50
                  text-red-600
                  font-semibold
                  flex items-center justify-center gap-2
                  hover:bg-red-100
                  transition
                "
              >
                <FiTrash2 className="w-5 h-5" />

                Cerrar cuenta
              </button>

              <div className="flex gap-4 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (!profile) return
                    setForm({
                      nombre: profile.nombre ?? "",
                      apellido: profile.apellido ?? "",
                      telefono:
                        profile.telefono !== null
                          ? String(profile.telefono)
                          : "",
                      centro_medico: profile.centroMedico ?? "",
                      direccion: profile.direccion ?? "",
                      numero_registro: profile.numeroRegistro ?? "",
                      user_role: profile.userRole ?? "",
                    })
                    setPassword("")
                    setPasswordConfirm("")
                  }}
                  className="
                    flex-1 md:flex-none
                    px-6 py-3
                    rounded-xl
                    border-2 border-[#1C4880]
                    text-[#1C4880]
                    font-semibold
                    hover:bg-blue-50
                    transition
                  "
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={profileMutation.isPending || isLoading}
                  className="
                    flex-1 md:flex-none
                    px-8 py-3
                    rounded-xl
                    bg-[#1C4880]
                    text-white
                    font-semibold
                    hover:opacity-90
                    disabled:opacity-60
                    transition
                    shadow-lg
                  "
                >
                  {profileMutation.isPending
                    ? "Guardando…"
                    : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Modal */}
      {openDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <div
                className="
                  w-16 h-16
                  rounded-2xl
                  bg-red-100
                  text-red-600
                  flex items-center justify-center
                  mx-auto
                  mb-5
                "
              >
                <FiTrash2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-center text-gray-900">
                ¿Cerrar cuenta?
              </h3>

              <p className="text-gray-500 text-center mt-3 leading-relaxed">
                Esta acción eliminará permanentemente el acceso a tu
                cuenta y toda la información asociada.
              </p>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setOpenDeleteModal(false)}
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    border border-gray-300
                    font-semibold
                    hover:bg-gray-100
                    transition
                  "
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-red-600
                    text-white
                    font-semibold
                    hover:bg-red-700
                    transition
                  "
                >
                  Sí, cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
