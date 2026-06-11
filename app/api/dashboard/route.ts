import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createSessionClient } from "@/lib/supabase/server"
import { Estado, isEstado } from "@/lib/estado"

export const runtime = "nodejs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MONTHS_ES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
]

const TYPE_LABEL: Record<
  string,
  "Corona" | "Implante" | "Inlay" | "Onlay" | "Carilla"
> = {
  CORONA: "Corona",
  CORONA_IMPLANTE: "Implante",
  INLAY: "Inlay",
  ONLAY: "Onlay",
  CARILLA: "Carilla",
}

function formatDate(iso: string | null): string {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const day = String(d.getDate()).padStart(2, "0")
  return `${day} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`
}

function daysDiff(targetISO: string, fromISO: string): number {
  const target = new Date(targetISO)
  const from = new Date(fromISO)
  if (Number.isNaN(target.getTime()) || Number.isNaN(from.getTime())) return 0
  const ms = target.getTime() - from.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

type TrabajoRow = {
  id: string
  fecha_envio: string | null
  fecha_entrega: string | null
  estado: string | null
  pacientes: { nombre: string | null; apellido: string | null } | null
  clinica: { nombre: string | null } | null
  piezas: { tipo: string | null }[] | null
}

export async function GET() {
  try {
    const sessionClient = await createSessionClient()
    const {
      data: { user },
    } = await sessionClient.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No hay sesión activa" },
        { status: 401 }
      )
    }

    const { data: trabajosData, error: trabajosError } = await supabase
      .from("trabajos")
      .select(
        "id, fecha_envio, fecha_entrega, estado, pacientes (nombre, apellido), clinica (nombre), piezas (tipo)"
      )
      .order("fecha_envio", { ascending: false })

    if (trabajosError) throw trabajosError
    const trabajos = (trabajosData ?? []) as unknown as TrabajoRow[]

    const now = new Date()
    const todayISO = now.toISOString().slice(0, 10)
    const monthStartISO = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10)

    const works = trabajos.map((t) => {
      const piezas = t.piezas ?? []
      const typesSet = new Set<string>()
      piezas.forEach((p) => {
        const label = p.tipo ? TYPE_LABEL[p.tipo] : null
        if (label) typesSet.add(label)
      })

      const estado: Estado = isEstado(t.estado) ? t.estado : "CREADO"
      // Solo los trabajos aún en curso (en espera o en proceso) pueden estar
      // atrasados/urgentes; los terminados ya no se marcan como vencidos.
      const isOpen = estado === "CREADO" || estado === "INICIADO"
      const due = t.fecha_entrega
      const days = due ? daysDiff(due, todayISO) : 0
      const overdue = isOpen && !!due && days < 0
      const overdueDays = overdue ? -days : undefined
      const urgent = isOpen && (overdue || (due ? days <= 2 : false))

      const patientName = [
        t.pacientes?.nombre ?? null,
        t.pacientes?.apellido ?? null,
      ]
        .filter(Boolean)
        .join(" ")
        .trim()

      return {
        id: t.id,
        patient: patientName || "-",
        clinic: t.clinica?.nombre ?? "-",
        createdAt: formatDate(t.fecha_envio),
        dueDate: formatDate(t.fecha_entrega),
        pieces: piezas.length,
        urgent,
        overdue,
        overdueDays,
        types: Array.from(typesSet),
        estado,
      }
    })

    const enEspera = works.filter((w) => w.estado === "CREADO").length
    const enProceso = works.filter((w) => w.estado === "INICIADO").length
    const vencidos = works.filter((w) => w.overdue).length
    const ultimoRetraso = works.reduce(
      (max, w) => Math.max(max, w.overdueDays ?? 0),
      0
    )
    const delMes = trabajos.filter(
      (t) => t.fecha_envio && t.fecha_envio >= monthStartISO
    ).length

    return NextResponse.json({
      stats: { enEspera, enProceso, vencidos, ultimoRetraso, delMes },
      works,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: "Error cargando dashboard" },
      { status: 500 }
    )
  }
}
