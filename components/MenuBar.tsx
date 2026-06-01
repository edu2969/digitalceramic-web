"use client"

import { useState } from "react"
import {
  FiHome,
  FiUser,
  FiLogOut,
} from "react-icons/fi"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { dashboardPathFor, isUserRole } from "@/lib/userRole"

async function fetchProfile() {
  const res = await fetch("/api/profile/me")
  if (!res.ok) return null
  return res.json()
}

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const { data: profileData } = useQuery({
    queryKey: ["profile-me"],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  })

  const role = profileData?.profile?.userRole
  const homePath = dashboardPathFor(isUserRole(role) ? role : null)
  const fullName =
    [profileData?.profile?.nombre, profileData?.profile?.apellido]
      .filter(Boolean)
      .join(" ")
      .trim() || "Usuario"
  const subtitle =
    profileData?.profile?.centroMedico ?? profileData?.profile?.email ?? ""
  const initials =
    fullName
      .split(/\s+/)
      .map((s) => s.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") || "U"

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    setOpen(false)
    await supabase.auth.signOut()
    router.replace("/")
    router.refresh()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          fixed top-5 left-5 z-50
          w-12 h-12
          rounded-xl
          bg-[#1C4880]
          shadow-lg
          flex items-center justify-center
          group
        "
      >
        <div className="relative w-6 h-6">
          {/* line 1 */}
          <span
            className={`
              absolute left-0 top-1/2 w-6 h-0.5 bg-white rounded-full
              transition-all duration-300
              ${open ? "rotate-45 top-1/2" : "-translate-y-2"}
            `}
          />

          {/* line 2 */}
          <span
            className={`
              absolute left-0 top-1/2 w-6 h-0.5 bg-white rounded-full
              transition-all duration-300
              ${open ? "opacity-0" : ""}
            `}
          />

          {/* line 3 */}
          <span
            className={`
              absolute left-0 top-1/2 w-6 h-0.5 bg-white rounded-full
              transition-all duration-300
              ${open ? "-rotate-45 top-1/2" : "translate-y-2"}
            `}
          />
        </div>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-[290px]
          bg-white
          border-r border-gray-200
          shadow-2xl
          z-50
          transition-transform duration-300 ease-in-out
          flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="px-6 pt-24 pb-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#1C4880]">
            Digital Ceramic
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {role === "ODONTOLOGO"
              ? "Panel del odontólogo"
              : role === "ADMINISTRADOR"
              ? "Panel de administrador"
              : "Panel de laboratorio"}
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            type="button"
            className="
              w-full
              flex items-center gap-4
              px-4 py-4
              rounded-xl
              text-[#1C4880]
              bg-blue-50
              font-semibold
              hover:bg-blue-100
              transition cursor-pointer
            "
            onClick={() => {
                setOpen(false);
                router.push(homePath)
            }}
          >
            <FiHome className="w-5 h-5" />

            <span>Home</span>
          </button>

          <button
            type="button"
            className="
              w-full
              flex items-center gap-4
              px-4 py-4
              rounded-xl
              text-gray-700
              hover:bg-gray-100
              transition cursor-pointer
            "
            onClick={() => {
                setOpen(false);
                router.push('/account')
            }}
          >
            <FiUser className="w-5 h-5" />

            <span>Cuenta</span>
          </button>

          <button
            type="button"
            disabled={loggingOut}
            className="
              w-full
              flex items-center gap-4
              px-4 py-4
              rounded-xl
              text-red-600
              hover:bg-red-50
              disabled:opacity-60
              transition cursor-pointer
            "
            onClick={handleLogout}
          >
            <FiLogOut className="w-5 h-5" />

            <span>{loggingOut ? "Cerrando…" : "Cerrar sesión"}</span>
          </button>
        </nav>

        {/* User */}
        <div className="p-5 border-t border-gray-100">
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
            <div
              className="
                w-14 h-14
                rounded-full
                bg-[#1C4880]
                text-white
                flex items-center justify-center
                font-bold text-lg
                shadow-md
              "
            >
              {initials}
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                {fullName}
              </p>

              <p className="text-sm text-gray-500">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main
        className={`
          transition-all duration-300
          ${open ? "md:pl-[290px]" : ""}
        `}
      >
        {children}
      </main>
    </>
  )
}