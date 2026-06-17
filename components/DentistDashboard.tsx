"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { FiUpload } from "react-icons/fi"

import { Estado, ESTADO_LABEL, ESTADO_BADGE } from "@/lib/estado"

interface DentistWorkPiece {
  tooth: string
  type: string
}

interface DentistWork {
  id: string
  patient: string
  doctor?: string
  sentAt: string
  pieces: DentistWorkPiece[]
  estado: Estado
}

interface DentistDashboardResponse {
  works: DentistWork[]
  isAdmin?: boolean
}

async function fetchDashboard(): Promise<DentistDashboardResponse> {
  const res = await fetch("/api/dentist/dashboard")
  if (!res.ok) throw new Error("Error cargando trabajos")
  return res.json()
}

export default function DentistDashboard() {
  const router = useRouter()
  const { data, isLoading, isError } = useQuery<DentistDashboardResponse>({
    queryKey: ["dentist-dashboard"],
    queryFn: fetchDashboard,
  })

  const works = data?.works ?? []
  const isAdmin = data?.isAdmin ?? false
  const columnCount = isAdmin ? 5 : 4

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="ml-16 2xl:ml-0">
            <h1 className="text-3xl font-bold tracking-tight text-[#1C4880]">
              {isAdmin ? "Trabajos de odontólogos" : "Mis trabajos"}
            </h1>
            <p className="text-gray-500 mt-1">
              {isAdmin
                ? "Listado de todos los casos enviados al laboratorio."
                : "Sigue el estado de los casos que has enviado al laboratorio."}
            </p>
          </div>

          {!isAdmin && (
            <button
              type="button"
              onClick={() => router.push("/upload")}
              className="
                inline-flex items-center gap-2
                px-5 py-3 rounded-xl
                bg-[#1C4880] text-white font-semibold
                hover:opacity-90 transition shadow-lg
              "
            >
              <FiUpload className="w-5 h-5" />
              Subir nuevo caso
            </button>
          )}
        </div>

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            No se pudieron cargar tus trabajos.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Paciente
                  </th>

                  {isAdmin && (
                    <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Doctor
                    </th>
                  )}

                  <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Fecha de envío
                  </th>

                  <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Piezas
                  </th>

                  <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="px-6 py-10 text-center text-gray-500 text-sm"
                    >
                      Cargando trabajos…
                    </td>
                  </tr>
                )}

                {!isLoading && works.length === 0 && (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="px-6 py-10 text-center text-gray-500 text-sm"
                    >
                      Aún no has enviado trabajos.
                    </td>
                  </tr>
                )}

                {works.map((work) => (
                  <tr
                    key={work.id}
                    onClick={() => router.push(`/work/${work.id}?view=dentist`)}
                    className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {work.patient}
                    </td>

                    {isAdmin && (
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {work.doctor ?? "-"}
                      </td>
                    )}

                    <td className="px-4 py-4 text-sm text-gray-700">
                      {work.sentAt}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {work.pieces.length === 0 && (
                          <span className="text-xs text-gray-400">-</span>
                        )}

                        {work.pieces.map((piece, idx) => (
                          <span
                            key={`${piece.tooth}-${idx}`}
                            className="px-2 py-1 rounded-lg bg-blue-50 text-[#1C4880] text-xs font-semibold"
                          >
                            {piece.tooth} · {piece.type}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-bold ${ESTADO_BADGE[work.estado]}`}
                      >
                        {ESTADO_LABEL[work.estado]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
