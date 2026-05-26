import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createSessionClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MONTHS_ES_LONG = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const TYPE_LABEL_BASE: Record<string, string> = {
  INLAY: "Inlay",
  ONLAY: "Onlay",
  CARILLA: "Carilla",
  CORONA: "Corona unitaria",
  CORONA_IMPLANTE: "Corona sobre implante",
}

const PALETTE_LABEL: Record<string, string> = {
  VITA_CLASSIC: "VITA Classic",
  VITA_3D: "VITA 3D Master",
}

const SECTION_LABELS: Record<number, string[]> = {
  1: ["Color"],
  2: ["Incisal", "Cervical"],
  3: ["Incisal", "Medio", "Cervical"],
}

function formatDateLong(iso: string | null): string {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getDate()} ${MONTHS_ES_LONG[d.getMonth()]} ${d.getFullYear()}`
}

function daysDiff(targetISO: string, fromISO: string): number {
  const target = new Date(targetISO)
  const from = new Date(fromISO)
  if (Number.isNaN(target.getTime()) || Number.isNaN(from.getTime())) return 0
  const ms = target.getTime() - from.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

function formatTooth(numero: number | string | null): string {
  if (numero === null || numero === undefined) return "-"
  return String(numero)
}

function paletteLabel(paleta: string | null): string {
  if (!paleta) return ""
  return PALETTE_LABEL[paleta] ?? paleta
}

function pieceTypeLabel(
  tipo: string | null,
  hasTiBase: boolean
): string {
  if (!tipo) return "-"
  if (tipo === "CORONA_IMPLANTE") {
    return hasTiBase ? "Corona atornillada" : "Corona cementada"
  }
  return TYPE_LABEL_BASE[tipo] ?? tipo
}

function orderNumber(id: number, fechaEnvio: string | null): string {
  const year = fechaEnvio
    ? new Date(fechaEnvio).getFullYear()
    : new Date().getFullYear()
  return `${year}-${String(id).padStart(5, "0")}`
}

type PiezaRow = {
  numero: number | string | null
  paleta: string | null
  colores: string | null
  tipo: string | null
  tibase_cementado: number | null
  tibase_plataforma: number | null
  tibase_gingival: number | null
  conexion: string | null
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string[] }> }
) {
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

    const { id } = await ctx.params
    const trabajoId = Array.isArray(id) ? id[0] : id
    const trabajoIdNum = Number(trabajoId)

    if (!Number.isFinite(trabajoIdNum)) {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      )
    }

    const { data: trabajo, error: trabajoError } = await supabase
      .from("mood_trabajos")
      .select(
        "id, usuario_id, paciente, edad, clinica, nombre_odontologo, fecha_envio, fecha_entrega, monto, notas, url_superior, url_inferior, url_mordida, url_gingival, mood_piezas (numero, paleta, colores, tipo, tibase_cementado, tibase_plataforma, tibase_gingival, conexion)"
      )
      .eq("id", trabajoIdNum)
      .single()

    if (trabajoError || !trabajo) {
      return NextResponse.json(
        { success: false, error: "Trabajo no encontrado" },
        { status: 404 }
      )
    }

    let sentByName: string | null = null
    let sentByEmail: string | null = null
    if (trabajo.usuario_id) {
      const { data: ownerData } = await supabase.auth.admin.getUserById(
        trabajo.usuario_id
      )
      sentByEmail = ownerData?.user?.email ?? null
      const meta = (ownerData?.user?.user_metadata ?? {}) as {
        full_name?: string
        name?: string
      }
      sentByName = meta.full_name ?? meta.name ?? null
    }

    const todayISO = new Date().toISOString().slice(0, 10)
    const due = trabajo.fecha_entrega
    const days = due ? daysDiff(due, todayISO) : 0
    const overdue = due ? days < 0 : false
    const overdueDays = overdue ? -days : 0
    const urgent = overdue || (due ? days <= 2 : false)
    const status = overdue ? "Atrasado" : urgent ? "Urgente" : "En tiempo"

    const piezasRaw = (trabajo.mood_piezas as PiezaRow[] | null) ?? []

    const pieces = piezasRaw.map((p) => {
      const hasTiBase =
        p.tibase_cementado !== null ||
        p.tibase_plataforma !== null ||
        p.tibase_gingival !== null

      const tiBase =
        p.tipo === "CORONA_IMPLANTE" && hasTiBase
          ? {
              cementado:
                p.tibase_cementado !== null
                  ? `${p.tibase_cementado} mm`
                  : "-",
              plataforma:
                p.tibase_plataforma !== null
                  ? `${p.tibase_plataforma} mm`
                  : "-",
              gingival:
                p.tibase_gingival !== null
                  ? `${p.tibase_gingival} mm`
                  : "-",
            }
          : null

      const codes = (p.colores ?? "")
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
      const labels =
        SECTION_LABELS[codes.length as 1 | 2 | 3] ?? SECTION_LABELS[1]
      const palette = paletteLabel(p.paleta)

      const colors = codes.map((code, i) => ({
        label: codes.length === 1 ? palette || labels[0] : labels[i],
        value: code,
      }))

      return {
        tooth: formatTooth(p.numero),
        type: pieceTypeLabel(p.tipo, hasTiBase),
        tiBase,
        colors,
      }
    })

    const files = [
      { name: "Superior", href: trabajo.url_superior },
      { name: "Inferior", href: trabajo.url_inferior },
      { name: "Mordida", href: trabajo.url_mordida },
      { name: "Gingival", href: trabajo.url_gingival },
    ]
      .filter((f): f is { name: string; href: string } => !!f.href)

    return NextResponse.json({
      id: trabajo.id,
      orderNumber: orderNumber(trabajo.id, trabajo.fecha_envio),
      status,
      overdue,
      overdueDays,
      patient: {
        name: trabajo.paciente ?? "-",
        age: trabajo.edad,
      },
      clinic: { name: trabajo.clinica ?? "-" },
      dentist: { name: trabajo.nombre_odontologo ?? "-" },
      sentBy: { name: sentByName, email: sentByEmail },
      issueDate: formatDateLong(trabajo.fecha_envio),
      dueDate: formatDateLong(trabajo.fecha_entrega),
      pieces,
      files,
      notes: trabajo.notas ?? "",
      monto: trabajo.monto,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: "Error cargando trabajo" },
      { status: 500 }
    )
  }
}
