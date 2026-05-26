"use client"

import { useState } from "react"
import {
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi"

import {
  MdOutlineMedicalServices,
  MdStar,
  MdStarBorder,
} from "react-icons/md"

type JobStatus = "ACTIVO" | "RETRASADO" | "ENTREGADO"

interface Job {
  id: number
  patient: string
  rut: string
  age: number
  work: string
  createdAt: string
  deliveryDate: string
  status: JobStatus
  comment?: string
}

const activeJobs: Job[] = [
  {
    id: 1,
    patient: "María González",
    rut: "18.442.112-4",
    age: 34,
    work: "Corona unitaria",
    createdAt: "12 Mayo 2026",
    deliveryDate: "19 Mayo 2026",
    status: "RETRASADO",
    comment:
      "Se requiere validar adaptación cervical antes del glaseado final.",
  },
  {
    id: 2,
    patient: "Rodrigo Pérez",
    rut: "16.921.445-9",
    age: 52,
    work: "Corona sobre implante",
    createdAt: "15 Mayo 2026",
    deliveryDate: "22 Mayo 2026",
    status: "ACTIVO",
  },
  {
    id: 3,
    patient: "Camila Soto",
    rut: "19.001.112-8",
    age: 28,
    work: "Carilla",
    createdAt: "16 Mayo 2026",
    deliveryDate: "23 Mayo 2026",
    status: "ACTIVO",
    comment:
      "Paciente solicita un valor más claro en zona incisal.",
  },
]

const historyJobs: Job[] = [
  {
    id: 4,
    patient: "Ignacio Torres",
    rut: "15.991.221-1",
    age: 47,
    work: "Inlay",
    createdAt: "02 Abril 2026",
    deliveryDate: "09 Abril 2026",
    status: "ENTREGADO",
  },
  {
    id: 5,
    patient: "Fernanda Ruiz",
    rut: "17.442.118-0",
    age: 41,
    work: "Onlay",
    createdAt: "11 Marzo 2026",
    deliveryDate: "18 Marzo 2026",
    status: "ENTREGADO",
  },
]

export default function ClientJobs() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[#1C4880]">
            Mis trabajos
          </h1>

          <p className="text-gray-500 mt-2">
            Seguimiento de trabajos activos e historial de entregas
          </p>
        </div>

        {/* Active jobs */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FiClock className="w-6 h-6 text-[#1C4880]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1C4880]">
                Trabajos activos
              </h2>

              <p className="text-gray-500">
                Trabajos actualmente en producción
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {activeJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        {/* History */}
        <section className="space-y-5 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <MdOutlineMedicalServices className="w-6 h-6 text-green-700" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1C4880]">
                Historial
              </h2>

              <p className="text-gray-500">
                Trabajos previamente entregados
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {historyJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showFeedback
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function JobCard({
  job,
  showFeedback = false,
}: {
  job: Job
  showFeedback?: boolean
}) {
  const [openComment, setOpenComment] = useState(false)
  const [openFeedback, setOpenFeedback] = useState(false)
  const [rating, setRating] = useState(0)

  return (
    <>
      <div
        className={`
          bg-white
          rounded-3xl
          border
          shadow-sm
          overflow-hidden
          transition
          hover:shadow-md
          ${
            job.status === "RETRASADO"
              ? "border-red-200"
              : "border-gray-200"
          }
        `}
      >
        {/* Top */}
        <div className="p-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            {/* Patient */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-[#1C4880]">
                  {job.patient}
                </h3>

                {job.status === "RETRASADO" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wide">
                    <FiAlertTriangle className="w-3 h-3" />
                    Retrasado
                  </div>
                )}

                {job.status === "ACTIVO" && (
                  <div className="px-3 py-1 rounded-full bg-blue-100 text-[#1C4880] text-xs font-bold uppercase tracking-wide">
                    Activo
                  </div>
                )}

                {job.status === "ENTREGADO" && (
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                    Entregado
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
                <span>RUT: {job.rut}</span>

                <span>{job.age} años</span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 text-[#1C4880] font-semibold mt-2">
                <MdOutlineMedicalServices className="w-5 h-5" />

                {job.work}
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-col md:flex-row gap-4">
              <DateBox
                label="Enviado"
                value={job.createdAt}
              />

              <DateBox
                label="Entrega"
                value={job.deliveryDate}
                danger={job.status === "RETRASADO"}
              />
            </div>
          </div>

          {/* Comment */}
          {job.comment && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setOpenComment(!openComment)}
                className="
                  flex items-center gap-2
                  text-[#1C4880]
                  font-semibold
                  hover:opacity-80
                  transition
                "
              >
                <FiMessageSquare className="w-4 h-4" />

                Ver observación
              </button>

              {openComment && (
                <div className="mt-3 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
                  {job.comment}
                </div>
              )}
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setOpenFeedback(true)}
                className="
                  px-5 py-3
                  rounded-2xl
                  bg-[#1C4880]
                  text-white
                  font-semibold
                  hover:opacity-90
                  transition
                "
              >
                Dar feedback
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback modal */}
      {openFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-3xl font-bold text-[#1C4880] text-center">
                Feedback del trabajo
              </h3>

              <p className="text-gray-500 text-center mt-2">
                Evalúa el resultado recibido
              </p>

              {/* Stars */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition hover:scale-110"
                  >
                    {star <= rating ? (
                      <MdStar className="w-10 h-10 text-amber-400" />
                    ) : (
                      <MdStarBorder className="w-10 h-10 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>

              {/* Comment */}
              <div className="mt-8">
                <label className="text-sm font-semibold text-gray-700">
                  Comentario
                </label>

                <textarea
                  rows={5}
                  placeholder="Escribe tu opinión sobre el trabajo realizado..."
                  className="
                    mt-2
                    w-full
                    rounded-2xl
                    border border-gray-300
                    px-4 py-4
                    resize-none
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#1C4880]
                    focus:border-transparent
                  "
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setOpenFeedback(false)}
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
                    bg-[#1C4880]
                    text-white
                    font-semibold
                    hover:opacity-90
                    transition
                  "
                >
                  Enviar feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function DateBox({
  label,
  value,
  danger = false,
}: {
  label: string
  value: string
  danger?: boolean
}) {
  return (
    <div
      className={`
        min-w-[170px]
        rounded-2xl
        border
        p-4
        ${
          danger
            ? "bg-red-50 border-red-200"
            : "bg-gray-50 border-gray-200"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <FiCalendar
          className={`w-4 h-4 ${
            danger ? "text-red-500" : "text-[#1C4880]"
          }`}
        />

        <p
          className={`text-xs uppercase tracking-wide font-bold ${
            danger ? "text-red-500" : "text-gray-500"
          }`}
        >
          {label}
        </p>
      </div>

      <p
        className={`text-lg font-bold mt-2 ${
          danger ? "text-red-600" : "text-[#1C4880]"
        }`}
      >
        {value}
      </p>
    </div>
  )
}