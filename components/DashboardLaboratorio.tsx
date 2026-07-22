"use client"

import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  FiAlertTriangle,
  FiClock,
  FiPlayCircle,
} from "react-icons/fi"

import {
  HiOutlineSparkles,
} from "react-icons/hi"

import {
  MdLayers,
} from "react-icons/md"

import {
  PiShieldWarning,
} from "react-icons/pi"

import { Estado, ESTADO_LABEL, ESTADO_BADGE } from "@/lib/estado"

type PieceType =
  | "Corona"
  | "Implante"
  | "Inlay"
  | "Onlay"
  | "Carilla"

interface WorkItem {
  id: string
  patient: string
  centroMedico: string
  createdAt: string
  dueDate: string
  pieces: number
  urgent: boolean
  overdue: boolean
  overdueDays?: number
  types: PieceType[]
  estado: Estado
}

interface DashboardStats {
  enEspera: number
  enProceso: number
  vencidos: number
  ultimoRetraso: number
  delMes: number
}

interface DashboardResponse {
  stats: DashboardStats
  works: WorkItem[]
}

const typeStyles: Record<PieceType, string> = {
  Corona: "bg-blue-100 text-blue-800",
  Implante: "bg-indigo-100 text-indigo-800",
  Inlay: "bg-amber-100 text-amber-800",
  Onlay: "bg-orange-100 text-orange-800",
  Carilla: "bg-emerald-100 text-emerald-800",
}

async function fetchDashboard(): Promise<DashboardResponse> {
  const res = await fetch("/api/dashboard")
  if (!res.ok) throw new Error("Error cargando dashboard")
  return res.json()
}

export default function Dashboard() {
  const router = useRouter()

  const { data, isLoading, isError } = useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  })

  const works = data?.works ?? []
  const stats = data?.stats

  const handleClickWork = (workId: string) => {
    router.push(`/caso/${workId}`)
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="ml-16 2xl:ml-0">
          <h1 className="text-3xl font-bold tracking-tight text-[#1C4880] text-right md:text-left">
            Dashboard Laboratorio
          </h1>

          <p className="text-gray-500 mt-1 text-right md:text-left">
            Gestión de trabajos protésicos y producción
          </p>
        </div>

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            No se pudo cargar la información del dashboard.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  En cola
                </p>

                <h2 className="text-4xl font-bold text-[#1C4880] mt-2">
                  {isLoading ? "—" : stats?.enEspera ?? 0}
                </h2>

                <p className="text-xs text-gray-400 mt-2">
                  Trabajos en espera
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <FiClock className="w-7 h-7 text-[#1C4880]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Procesando
                </p>

                <h2 className="text-4xl font-bold text-indigo-700 mt-2">
                  {isLoading ? "—" : stats?.enProceso ?? 0}
                </h2>

                <p className="text-xs text-gray-400 mt-2">
                  Trabajos en proceso
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <FiPlayCircle className="w-7 h-7 text-indigo-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-red-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-500 font-medium">
                  Trabajos vencidos
                </p>

                <h2 className="text-4xl font-bold text-red-600 mt-2">
                  {isLoading ? "—" : stats?.vencidos ?? 0}
                </h2>

                <p className="text-xs text-red-500 mt-2">
                  Último retraso: {stats?.ultimoRetraso ?? 0} días
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                <PiShieldWarning className="w-7 h-7 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Trabajos del mes
                </p>

                <h2 className="text-4xl font-bold text-[#1C4880] mt-2">
                  {isLoading ? "—" : stats?.delMes ?? 0}
                </h2>

                <p className="text-xs text-gray-400 mt-2">
                  Total mensual
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                <HiOutlineSparkles className="w-7 h-7 text-amber-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-bold text-[#1C4880]">
              Trabajos activos
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Producción y seguimiento clínico
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Paciente
                  </th>

                  <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Fechas
                  </th>

                  <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Piezas
                  </th>

                  <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Tipos
                  </th>

                  <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-sm">
                      Cargando trabajos…
                    </td>
                  </tr>
                )}

                {!isLoading && works.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-sm">
                      No hay trabajos activos.
                    </td>
                  </tr>
                )}

                {works.map((work) => (
                  <tr
                    key={work.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => {
                      handleClickWork(work.id)
                    }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 text-base">
                          {work.patient}
                        </p>

                        <p className="text-sm text-gray-500 mt-0.5">
                          {work.centroMedico}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700">
                          Ingreso: {work.createdAt}
                        </p>

                        <p
                          className={`text-sm font-medium ${
                            work.overdue
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          Entrega: {work.dueDate}
                        </p>

                        {work.overdue && (
                          <p className="text-xs text-red-500 font-semibold">
                            Retraso: {work.overdueDays} días
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                          <MdLayers className="w-5 h-5 text-[#1C4880]" />
                        </div>

                        <span className="font-bold text-lg text-[#1C4880]">
                          {work.pieces}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {work.types.map((type) => (
                          <span
                            key={type}
                            className={`
                              px-2 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide
                              ${typeStyles[type]}
                            `}
                          >
                            {type === "Corona" && "CR"}
                            {type === "Implante" && "IMP"}
                            {type === "Inlay" && "IN"}
                            {type === "Onlay" && "ON"}
                            {type === "Carilla" && "CAR"}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-bold w-fit ${ESTADO_BADGE[work.estado]}`}
                        >
                          {ESTADO_LABEL[work.estado]}
                        </span>

                        {work.urgent && !work.overdue && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold w-fit">
                            <FiAlertTriangle className="w-3 h-3" />
                            Urgente
                          </span>
                        )}

                        {work.overdue ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-bold w-fit">
                            <FiAlertTriangle className="w-3 h-3" />
                            Vencido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold w-fit">
                            En tiempo
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-2">
          Sistema de gestión protésica · Next.js 16
        </div>
      </div>
    </div>
  )
}
