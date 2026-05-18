"use client"

import {
  FiAlertTriangle,
  FiClock,
} from "react-icons/fi"

import {
  HiOutlineSparkles,
} from "react-icons/hi"

import {
  MdLayers,
} from "react-icons/md"

import {
  PiShieldWarning,
  PiCrownSimple,
} from "react-icons/pi"

type PieceType =
  | "Corona"
  | "Implante"
  | "Inlay"
  | "Onlay"
  | "Carilla"

interface WorkItem {
  id: number
  patient: string
  clinic: string
  createdAt: string
  dueDate: string
  pieces: number
  urgent: boolean
  overdue: boolean
  overdueDays?: number
  types: PieceType[]
}

const works: WorkItem[] = [
  {
    id: 1,
    patient: "María González",
    clinic: "Clínica Las Condes",
    createdAt: "12 May 2026",
    dueDate: "18 May 2026",
    pieces: 2,
    urgent: true,
    overdue: true,
    overdueDays: 2,
    types: ["Implante", "Corona"],
  },
  {
    id: 2,
    patient: "Carlos Rojas",
    clinic: "Integra Dental",
    createdAt: "10 May 2026",
    dueDate: "20 May 2026",
    pieces: 1,
    urgent: false,
    overdue: false,
    types: ["Carilla"],
  },
  {
    id: 3,
    patient: "Fernanda Silva",
    clinic: "Oral Studio",
    createdAt: "11 May 2026",
    dueDate: "17 May 2026",
    pieces: 3,
    urgent: true,
    overdue: true,
    overdueDays: 1,
    types: ["Implante", "Onlay"],
  },
  {
    id: 4,
    patient: "José Martínez",
    clinic: "Dental Prime",
    createdAt: "09 May 2026",
    dueDate: "22 May 2026",
    pieces: 4,
    urgent: false,
    overdue: false,
    types: ["Corona"],
  },
  {
    id: 5,
    patient: "Ana Torres",
    clinic: "Vital Dent",
    createdAt: "13 May 2026",
    dueDate: "19 May 2026",
    pieces: 2,
    urgent: false,
    overdue: false,
    types: ["Inlay"],
  },
  {
    id: 6,
    patient: "Ricardo Díaz",
    clinic: "OdontoLab",
    createdAt: "08 May 2026",
    dueDate: "15 May 2026",
    pieces: 6,
    urgent: true,
    overdue: true,
    overdueDays: 4,
    types: ["Implante"],
  },
  {
    id: 7,
    patient: "Paula Herrera",
    clinic: "Nova Dental",
    createdAt: "14 May 2026",
    dueDate: "24 May 2026",
    pieces: 2,
    urgent: false,
    overdue: false,
    types: ["Corona", "Carilla"],
  },
  {
    id: 8,
    patient: "Luis Soto",
    clinic: "Dental Concept",
    createdAt: "15 May 2026",
    dueDate: "21 May 2026",
    pieces: 1,
    urgent: true,
    overdue: false,
    types: ["Onlay"],
  },
  {
    id: 9,
    patient: "Camila Fuentes",
    clinic: "Oral Health",
    createdAt: "12 May 2026",
    dueDate: "18 May 2026",
    pieces: 5,
    urgent: false,
    overdue: true,
    overdueDays: 2,
    types: ["Implante", "Corona"],
  },
  {
    id: 10,
    patient: "Diego Araya",
    clinic: "Smile Clinic",
    createdAt: "16 May 2026",
    dueDate: "27 May 2026",
    pieces: 2,
    urgent: false,
    overdue: false,
    types: ["Carilla"],
  },
  {
    id: 11,
    patient: "Valentina Cruz",
    clinic: "Integra Dental",
    createdAt: "10 May 2026",
    dueDate: "17 May 2026",
    pieces: 3,
    urgent: true,
    overdue: true,
    overdueDays: 1,
    types: ["Inlay"],
  },
  {
    id: 12,
    patient: "Cristóbal Vega",
    clinic: "Oral Studio",
    createdAt: "11 May 2026",
    dueDate: "25 May 2026",
    pieces: 1,
    urgent: false,
    overdue: false,
    types: ["Corona"],
  },
  {
    id: 13,
    patient: "Daniela Reyes",
    clinic: "Dental Prime",
    createdAt: "07 May 2026",
    dueDate: "16 May 2026",
    pieces: 4,
    urgent: true,
    overdue: true,
    overdueDays: 3,
    types: ["Implante", "Carilla"],
  },
  {
    id: 14,
    patient: "Felipe Navarro",
    clinic: "Vital Dent",
    createdAt: "14 May 2026",
    dueDate: "28 May 2026",
    pieces: 2,
    urgent: false,
    overdue: false,
    types: ["Onlay"],
  },
  {
    id: 15,
    patient: "Javiera Mella",
    clinic: "Nova Dental",
    createdAt: "13 May 2026",
    dueDate: "22 May 2026",
    pieces: 1,
    urgent: false,
    overdue: false,
    types: ["Corona"],
  },
  {
    id: 16,
    patient: "Tomás Paredes",
    clinic: "Dental Concept",
    createdAt: "09 May 2026",
    dueDate: "18 May 2026",
    pieces: 7,
    urgent: true,
    overdue: true,
    overdueDays: 2,
    types: ["Implante"],
  },
  {
    id: 17,
    patient: "Sofía Morales",
    clinic: "Smile Clinic",
    createdAt: "16 May 2026",
    dueDate: "26 May 2026",
    pieces: 2,
    urgent: false,
    overdue: false,
    types: ["Carilla", "Inlay"],
  },
  {
    id: 18,
    patient: "Matías Campos",
    clinic: "Oral Health",
    createdAt: "15 May 2026",
    dueDate: "20 May 2026",
    pieces: 3,
    urgent: true,
    overdue: false,
    types: ["Corona"],
  },
  {
    id: 19,
    patient: "Francisca León",
    clinic: "OdontoLab",
    createdAt: "08 May 2026",
    dueDate: "14 May 2026",
    pieces: 5,
    urgent: true,
    overdue: true,
    overdueDays: 5,
    types: ["Implante", "Onlay"],
  },
  {
    id: 20,
    patient: "Benjamín Salas",
    clinic: "Clínica Las Condes",
    createdAt: "17 May 2026",
    dueDate: "30 May 2026",
    pieces: 1,
    urgent: false,
    overdue: false,
    types: ["Corona"],
  },
]

const typeStyles: Record<PieceType, string> = {
  Corona: "bg-blue-100 text-blue-800",
  Implante: "bg-indigo-100 text-indigo-800",
  Inlay: "bg-amber-100 text-amber-800",
  Onlay: "bg-orange-100 text-orange-800",
  Carilla: "bg-emerald-100 text-emerald-800",
}

export default function Dashboard() {
  const overdue = works.filter((w) => w.overdue).length

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1C4880]">
            Dashboard Laboratorio
          </h1>

          <p className="text-gray-500 mt-1">
            Gestión de trabajos protésicos y producción
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Trabajos en cola
                </p>

                <h2 className="text-4xl font-bold text-[#1C4880] mt-2">
                  28
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <FiClock className="w-7 h-7 text-[#1C4880]" />
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
                  {overdue}
                </h2>

                <p className="text-xs text-red-500 mt-2">
                  Último retraso: 5 días
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
                  124
                </h2>
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
                {works.map((work) => (
                  <tr
                    key={work.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 text-base">
                          {work.patient}
                        </p>

                        <p className="text-sm text-gray-500 mt-0.5">
                          {work.clinic}
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
                        {work.urgent && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-bold w-fit">
                            <FiAlertTriangle className="w-3 h-3" />
                            Urgente
                          </span>
                        )}

                        {!work.overdue && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold w-fit">
                            En tiempo
                          </span>
                        )}

                        {work.overdue && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-bold w-fit">
                            Vencido
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