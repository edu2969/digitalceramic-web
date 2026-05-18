"use client"

import { useRouter } from "next/navigation"
import {
  FaClipboardList,
  FaClock,
  FaEye,
} from "react-icons/fa"

import { IoWarning } from "react-icons/io5"

export default function DashboardPage() {
  const router = useRouter()

  const activeJobs = 18
  const waitingJobs = 5

  const jobs = [
    {
      id: 1,
      patient: "Elisa Muñoz",
      age: 30,
      doctor: "Dra. María González",
      clinic: "Centro Dental Mood",
      entryDate: "11 mayo 2026",
      deliveryDate: "13 mayo 2026",
      remainingDays: 2,
    },
    {
      id: 2,
      patient: "Pedro Ramírez",
      age: 45,
      doctor: "Dr. Samuel Concha del Valle",
      clinic: "Clínica Oral Prime",
      entryDate: "10 mayo 2026",
      deliveryDate: "18 mayo 2026",
      remainingDays: 7,
    },
    {
      id: 3,
      patient: "Fernanda Torres",
      age: 26,
      doctor: "Dr. Felipe Araya",
      clinic: "Dental Studio",
      entryDate: "09 mayo 2026",
      deliveryDate: "12 mayo 2026",
      remainingDays: 1,
    },
  ]

  return (
    <section className="min-h-screen bg-[#F5F9FD] px-6 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#1C4880]">
          Dashboard
        </h1>

        <p className="text-gray-600 mt-3 text-lg">
          Gestión y seguimiento de trabajos dentales.
        </p>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Activos */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-xl
            border border-[#D7E6F5]
            p-8
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">
                Trabajos activos
              </p>

              <h2 className="text-5xl font-bold text-[#1C4880] mt-3">
                {activeJobs}
              </h2>
            </div>

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-[#1C4880]/10
                flex
                items-center
                justify-center
              "
            >
              <FaClipboardList
  size={32}
  className="text-[#1C4880]"
/>
            </div>
          </div>
        </div>

        {/* Espera */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-xl
            border border-[#D7E6F5]
            p-8
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">
                Trabajos en espera
              </p>

              <h2 className="text-5xl font-bold text-[#269FD0] mt-3">
                {waitingJobs}
              </h2>
            </div>

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-[#269FD0]/10
                flex
                items-center
                justify-center
              "
            >
              <FaClock
  size={32}
  className="text-[#269FD0]"
/>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div
        className="
          bg-white
          rounded-3xl
          shadow-xl
          border
          border-[#D7E6F5]
          overflow-hidden
        "
      >
        {/* Header tabla */}
        <div className="px-8 py-6 border-b border-[#E8F1FA]">
          <h2 className="text-2xl font-bold text-[#1C4880]">
            Trabajos recientes
          </h2>
        </div>

        {/* Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7FBFF]">
              <tr className="text-left">
                <th className="px-6 py-4 text-[#1C4880] font-semibold">
                  Paciente
                </th>

                <th className="px-6 py-4 text-[#1C4880] font-semibold">
                  Doctor
                </th>

                <th className="px-6 py-4 text-[#1C4880] font-semibold">
                  Clínica
                </th>

                <th className="px-6 py-4 text-[#1C4880] font-semibold">
                  Ingreso
                </th>

                <th className="px-6 py-4 text-[#1C4880] font-semibold">
                  Entrega
                </th>

                <th className="px-6 py-4 text-[#1C4880] font-semibold">
                  Estado
                </th>

                <th className="px-6 py-4 text-[#1C4880] font-semibold">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => {
                const urgent = job.remainingDays <= 2

                return (
                  <tr
                    key={job.id}
                    className="
                      border-t
                      border-[#EEF4FA]
                      hover:bg-[#FAFCFF]
                      transition
                    "
                  >
                    {/* Paciente */}
                    <td className="px-6 py-5">
                      <div className="font-semibold text-[#1C4880]">
                        {job.patient}
                      </div>

                      <div className="text-sm text-gray-500">
                        {job.age} años
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="px-6 py-5 text-gray-700">
                      {job.doctor}
                    </td>

                    {/* Clínica */}
                    <td className="px-6 py-5 text-gray-700">
                      {job.clinic}
                    </td>

                    {/* Ingreso */}
                    <td className="px-6 py-5 text-gray-700">
                      {job.entryDate}
                    </td>

                    {/* Entrega */}
                    <td className="px-6 py-5 text-gray-700">
                      {job.deliveryDate}
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-5">
                      {urgent ? (
                        <div
                          className="
                            inline-flex
                            items-center
                            gap-2
                            bg-red-50
                            text-red-600
                            px-3
                            py-2
                            rounded-full
                            text-sm
                            font-semibold
                          "
                        >
                          <IoWarning size={16} />

                          {job.remainingDays === 1
                            ? "Entrega mañana"
                            : "Quedan 2 días"}
                        </div>
                      ) : (
                        <div
                          className="
                            inline-flex
                            items-center
                            bg-[#1C4880]/10
                            text-[#1C4880]
                            px-3
                            py-2
                            rounded-full
                            text-sm
                            font-semibold
                          "
                        >
                          En proceso
                        </div>
                      )}
                    </td>

                    {/* Acción */}
                    <td className="px-6 py-5">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/jobs/${job.id}`)
                        }
                        className="
                          inline-flex
                          items-center
                          gap-2
                          bg-[#1C4880]
                          hover:opacity-90
                          text-white
                          px-4
                          py-2
                          rounded-xl
                          font-medium
                          transition
                        "
                      >
                        <FaEye size={18} />
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="lg:hidden p-5 space-y-5">
          {jobs.map((job) => {
            const urgent = job.remainingDays <= 2

            return (
              <div
                key={job.id}
                className="
                  border
                  border-[#E6EEF7]
                  rounded-2xl
                  p-5
                "
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[#1C4880] text-lg">
                      {job.patient}
                    </h3>

                    <p className="text-gray-500">
                      {job.age} años
                    </p>
                  </div>

                  {urgent && (
                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        text-red-500
                      "
                    >
                      <IoWarning size={18} />
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-[#1C4880]">
                      Doctor:
                    </span>{" "}
                    {job.doctor}
                  </p>

                  <p>
                    <span className="font-semibold text-[#1C4880]">
                      Clínica:
                    </span>{" "}
                    {job.clinic}
                  </p>

                  <p>
                    <span className="font-semibold text-[#1C4880]">
                      Entrega:
                    </span>{" "}
                    {job.deliveryDate}
                  </p>
                </div>

                <button
                  onClick={() =>
                    router.push(`/dashboard/jobs/${job.id}`)
                  }
                  className="
                    mt-5
                    w-full
                    bg-[#1C4880]
                    text-white
                    py-3
                    rounded-xl
                    font-semibold
                  "
                >
                  Ver detalle
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}