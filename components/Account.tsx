"use client"

import { useRef, useState } from "react"
import {
  FiCamera,
  FiMail,
  FiLock,
  FiUser,
  FiBriefcase,
  FiShield,
  FiTrash2,
} from "react-icons/fi"

export default function AccountSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [avatar, setAvatar] = useState<string | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    const url = URL.createObjectURL(file)
    setAvatar(url)
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1C4880]">
            Configuración de cuenta
          </h1>

          <p className="text-gray-500 mt-2">
            Administra tu información personal y seguridad
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
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
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-4xl font-bold">
                      ET
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
                  Eduardo Troncoso
                </h2>

                <p className="text-gray-500 mt-1">
                  Smile Factory
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
                  Nombre completo
                </label>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    defaultValue="Eduardo Troncoso"
                    className="
                      w-full
                      pl-12 pr-4 py-3
                      rounded-xl
                      border border-gray-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#1C4880]
                      focus:border-transparent
                      transition
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
                    value="eduardo@smilefactory.cl"
                    disabled
                    className="
                      w-full
                      pl-12 pr-4 py-3
                      rounded-xl
                      border border-gray-200
                      bg-gray-100
                      text-gray-500
                      cursor-not-allowed
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
                    className="
                      w-full
                      pl-12 pr-4 py-3
                      rounded-xl
                      border border-gray-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#1C4880]
                      focus:border-transparent
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
                    className="
                      w-full
                      pl-12 pr-4 py-3
                      rounded-xl
                      border border-gray-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#1C4880]
                      focus:border-transparent
                    "
                  />
                </div>
              </div>

              {/* Empresa */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Empresa
                </label>

                <div className="relative">
                  <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    defaultValue="Smile Factory"
                    className="
                      w-full
                      pl-12 pr-4 py-3
                      rounded-xl
                      border border-gray-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#1C4880]
                      focus:border-transparent
                    "
                  />
                </div>
              </div>

              {/* Rol */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Rol
                </label>

                <div className="relative">
                  <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <select
                    defaultValue="Administrador"
                    className="
                      w-full
                      pl-12 pr-4 py-3
                      rounded-xl
                      border border-gray-300
                      bg-white
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#1C4880]
                      focus:border-transparent
                    "
                  >
                    <option>Administrador</option>
                    <option>Operador</option>
                    <option>Diseñador CAD</option>
                    <option>Recepción</option>
                  </select>
                </div>
              </div>
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
                  className="
                    flex-1 md:flex-none
                    px-8 py-3
                    rounded-xl
                    bg-[#1C4880]
                    text-white
                    font-semibold
                    hover:opacity-90
                    transition
                    shadow-lg
                  "
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
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