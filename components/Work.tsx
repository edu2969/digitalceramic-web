"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  FiCalendar,
  FiDownload,
  FiCheckCircle,
  FiAlertTriangle,
  FiPlayCircle,
  FiUser,
  FiBriefcase,
  FiLoader,
} from "react-icons/fi"
import { Estado, ESTADO_LABEL, ESTADO_BADGE } from "@/lib/estado"

type Transition = {
  target: Estado
  buttonLabel: string
  buttonIcon: React.ReactNode
  dialogTitle: string
  dialogText: string
  confirmLabel: string
  toastLoading: string
  toastSuccess: string
}

function transitionFor(estado: Estado): Transition | null {
  if (estado === "CRE") {
    return {
      target: "INI",
      buttonLabel: "Iniciar trabajo",
      buttonIcon: <FiPlayCircle className="w-5 h-5" />,
      dialogTitle: "¿Iniciar trabajo?",
      dialogText: "El trabajo pasará a estado en proceso.",
      confirmLabel: "Iniciar",
      toastLoading: "Iniciando trabajo…",
      toastSuccess: "Trabajo iniciado",
    }
  }
  if (estado === "INI") {
    return {
      target: "FIN",
      buttonLabel: "Terminado",
      buttonIcon: <FiCheckCircle className="w-5 h-5" />,
      dialogTitle: "¿Marcar como terminado?",
      dialogText:
        "El trabajo quedará marcado como completado y disponible para entrega.",
      confirmLabel: "Confirmar",
      toastLoading: "Marcando como terminado…",
      toastSuccess: "Trabajo terminado",
    }
  }
  return null
}

interface WorkColor {
  label: string
  value: string
}

interface WorkPiece {
  tooth: string
  type: string
  tiBase: {
    cementado: string
    plataforma: string
    gingival: string
  } | null
  colors: WorkColor[]
}

interface WorkFile {
  name: string
  href: string
}

interface WorkDetail {
  id: number
  orderNumber: string
  status: "Atrasado" | "Urgente" | "En tiempo"
  overdue: boolean
  overdueDays: number
  patient: { name: string; age: number | null }
  clinic: { name: string }
  dentist: { name: string }
  sentBy: { name: string | null; email: string | null }
  issueDate: string
  dueDate: string
  pieces: WorkPiece[]
  files: WorkFile[]
  notes: string
  monto: number | null
  estado: Estado
}

async function fetchWork(id: string): Promise<WorkDetail> {
  const res = await fetch(`/api/works/byId/${id}`)
  if (!res.ok) throw new Error("Error cargando trabajo")
  return res.json()
}

export default function WorkPagePage({ id }: { id: string }) {
  const [openDialog, setOpenDialog] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery<WorkDetail>({
    queryKey: ["work", id],
    queryFn: () => fetchWork(id),
  })

  const mutation = useMutation({
    mutationFn: async (target: Estado) => {
      const res = await fetch(`/api/works/byId/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: target }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || "No se pudo cambiar el estado")
      }
      return res.json() as Promise<{ success: true; estado: Estado }>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work", id] })
      setOpenDialog(false)
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center text-gray-500">
            Cargando trabajo…
          </div>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-10 text-center text-red-700">
            No se pudo cargar el trabajo.
          </div>
        </div>
      </div>
    )
  }

  const statusStyles =
    data.status === "Atrasado"
      ? "bg-red-50 border-red-200 text-red-600"
      : data.status === "Urgente"
      ? "bg-amber-50 border-amber-200 text-amber-700"
      : "bg-emerald-50 border-emerald-200 text-emerald-700"

  const statusIconColor =
    data.status === "Atrasado"
      ? "text-red-600"
      : data.status === "Urgente"
      ? "text-amber-700"
      : "text-emerald-700"

  const transition = transitionFor(data.estado)
  const isPending = mutation.isPending

  const handleConfirm = () => {
    if (!transition) return
    toast.promise(mutation.mutateAsync(transition.target), {
      loading: transition.toastLoading,
      success: transition.toastSuccess,
      error: (e: Error) => e.message || "Error",
    })
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-7 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-sm font-semibold tracking-wider uppercase text-[#1C4880]">
                    Orden #{data.orderNumber}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${ESTADO_BADGE[data.estado]}`}
                  >
                    {ESTADO_LABEL[data.estado]}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-[#1C4880] mt-2">
                  Detalle de trabajo
                </h1>

                <p className="text-gray-500 mt-2">
                  Seguimiento y especificaciones protésicas
                </p>
              </div>

              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${statusStyles}`}
              >
                <FiAlertTriangle className={`w-6 h-6 ${statusIconColor}`} />

                <div>
                  <p className="text-xs uppercase tracking-wide font-bold">
                    Estado
                  </p>

                  <p className="text-lg font-bold">{data.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient info */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <InfoCard
              icon={<FiUser className="w-5 h-5" />}
              title="Paciente"
              value={data.patient.name}
              subtitle={
                data.patient.age !== null ? `${data.patient.age} años` : "—"
              }
            />

            <InfoCard
              icon={<FiBriefcase className="w-5 h-5" />}
              title="Centro médico"
              value={data.clinic.name}
              subtitle=""
            />

            <InfoCard
              icon={<FiUser className="w-5 h-5" />}
              title="Odontólogo"
              value={data.dentist.name}
              subtitle=""
            />

            <InfoCard
              icon={<FiUser className="w-5 h-5" />}
              title="Enviado por"
              value={data.sentBy.name ?? data.sentBy.email ?? "—"}
              subtitle={data.sentBy.name ? data.sentBy.email ?? "" : ""}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <FiCalendar className="w-7 h-7 text-[#1C4880]" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Fecha de emisión</p>

                <h3 className="text-2xl font-bold text-[#1C4880] mt-1">
                  {data.issueDate}
                </h3>
              </div>
            </div>
          </div>

          <div
            className={`bg-white rounded-3xl border-2 shadow-sm p-6 ${
              data.overdue ? "border-red-200" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  data.overdue ? "bg-red-100" : "bg-blue-100"
                }`}
              >
                {data.overdue ? (
                  <FiAlertTriangle className="w-7 h-7 text-red-600" />
                ) : (
                  <FiCalendar className="w-7 h-7 text-[#1C4880]" />
                )}
              </div>

              <div>
                <p
                  className={`text-sm font-medium ${
                    data.overdue ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  Fecha de entrega
                </p>

                <h3
                  className={`text-2xl font-bold mt-1 ${
                    data.overdue ? "text-red-600" : "text-[#1C4880]"
                  }`}
                >
                  {data.dueDate}
                </h3>

                {data.overdue && (
                  <p className="text-xs text-red-500 mt-1">
                    Retraso: {data.overdueDays} días
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Work specification */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-[#1C4880]">
              Especificación del trabajo
            </h2>

            <p className="text-gray-500 mt-1">
              Piezas y configuración protésica
            </p>
          </div>

          <div className="p-8 space-y-6">
            {data.pieces.length === 0 && (
              <p className="text-sm text-gray-500">Sin piezas registradas.</p>
            )}

            {data.pieces.map((piece, idx) => (
              <PieceCard
                key={`${piece.tooth}-${idx}`}
                tooth={piece.tooth}
                type={piece.type}
                tiBase={piece.tiBase ?? undefined}
                colors={piece.colors}
              />
            ))}
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#1C4880]">Notas</h2>
            </div>
            <div className="p-8 text-gray-700 whitespace-pre-line">
              {data.notes}
            </div>
          </div>
        )}

        {/* Files */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-[#1C4880]">
              Archivos adjuntos
            </h2>

            <p className="text-gray-500 mt-1">Descarga de modelos 3D</p>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.files.length === 0 && (
              <p className="text-sm text-gray-500">Sin archivos cargados.</p>
            )}

            {data.files.map((file) => (
              <DownloadCard key={file.name} name={file.name} href={file.href} />
            ))}
          </div>
        </div>

        {/* Actions */}
        {transition && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setOpenDialog(true)}
              disabled={isPending}
              className="
                px-8 py-4
                rounded-2xl
                bg-[#1C4880]
                text-white
                font-semibold
                flex items-center gap-3
                hover:opacity-90
                transition
                shadow-lg
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isPending ? (
                <FiLoader className="w-5 h-5 animate-spin" />
              ) : (
                transition.buttonIcon
              )}
              {transition.buttonLabel}
            </button>
          </div>
        )}
      </div>

      {/* Dialog */}
      {openDialog && transition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <div
                className="
                  w-16 h-16
                  rounded-2xl
                  bg-green-100
                  text-green-600
                  flex items-center justify-center
                  mx-auto
                  mb-5
                "
              >
                {transition.buttonIcon}
              </div>

              <h3 className="text-2xl font-bold text-center text-[#1C4880]">
                {transition.dialogTitle}
              </h3>

              <p className="text-gray-500 text-center mt-3 leading-relaxed">
                {transition.dialogText}
              </p>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setOpenDialog(false)}
                  disabled={isPending}
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    border border-gray-300
                    font-semibold
                    hover:bg-gray-100
                    transition
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isPending}
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-[#1C4880]
                    text-white
                    font-semibold
                    hover:opacity-90
                    transition
                    flex items-center justify-center gap-2
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                >
                  {isPending && (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  )}
                  {transition.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-blue-100 text-[#1C4880] flex items-center justify-center">
          {icon}
        </div>

        <p className="text-sm font-semibold text-gray-500">{title}</p>
      </div>

      <h3 className="text-lg font-bold text-gray-900">{value}</h3>

      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  )
}

function PieceCard({
  tooth,
  type,
  tiBase,
  colors,
}: {
  tooth: string
  type: string
  tiBase?: {
    cementado: string
    plataforma: string
    gingival: string
  }
  colors: {
    label: string
    value: string
  }[]
}) {
  return (
    <div className="rounded-3xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#1C4880] font-bold">
            Pieza dental
          </p>

          <h3 className="text-2xl font-bold text-[#1C4880] mt-1">{tooth}</h3>
        </div>

        <div className="px-4 py-2 rounded-xl bg-blue-100 text-[#1C4880] font-semibold text-sm">
          {type}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {tiBase && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SpecBadge label="Cementado" value={tiBase.cementado} />
            <SpecBadge label="Plataforma" value={tiBase.plataforma} />
            <SpecBadge label="Gingival" value={tiBase.gingival} />
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-gray-500 mb-3">Colores</p>

          <div className="flex flex-wrap gap-3">
            {colors.map((color, index) => (
              <div
                key={index}
                className="
                  px-4 py-3
                  rounded-2xl
                  bg-[#1C4880]
                  text-white
                  shadow-sm
                "
              >
                <p className="text-[10px] uppercase tracking-wider opacity-80">
                  {color.label}
                </p>

                <p className="text-lg font-bold mt-1">{color.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SpecBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
      <p className="text-xs uppercase tracking-wide text-[#1C4880] font-bold">
        {label}
      </p>

      <p className="text-xl font-bold text-[#1C4880] mt-1">{value}</p>
    </div>
  )
}

function DownloadCard({ name, href }: { name: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        rounded-2xl
        border border-gray-200
        bg-gray-50
        p-5
        hover:border-[#1C4880]
        hover:bg-blue-50
        transition
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">
            Archivo 3D
          </p>

          <h3 className="text-lg font-bold text-[#1C4880] mt-1">{name}</h3>
        </div>

        <div
          className="
            w-12 h-12
            rounded-2xl
            bg-white
            border border-gray-200
            flex items-center justify-center
            group-hover:bg-[#1C4880]
            group-hover:text-white
            transition
          "
        >
          <FiDownload className="w-5 h-5" />
        </div>
      </div>
    </a>
  )
}
