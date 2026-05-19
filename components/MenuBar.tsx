"use client"

import { useState } from "react"
import {
  FiHome,
  FiUser,
  FiLogOut,
} from "react-icons/fi"
import { useRouter } from "next/navigation"

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const router = useRouter();
  const [open, setOpen] = useState(false)

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
            Smile Factory
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Panel de laboratorio
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
                router.push('/dashboard')
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
            className="
              w-full
              flex items-center gap-4
              px-4 py-4
              rounded-xl
              text-red-600
              hover:bg-red-50
              transition cursor-pointer
            "
            onClick={() => {
                setOpen(false);
                router.push('/login')
            }}
          >
            <FiLogOut className="w-5 h-5" />

            <span>Cerrar sesión</span>
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
              ET
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                Eduardo Troncoso
              </p>

              <p className="text-sm text-gray-500">
                Smile Factory
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