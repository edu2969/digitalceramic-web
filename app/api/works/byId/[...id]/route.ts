import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createSessionClient } from "@/lib/supabase/server"
import { Estado, isEstado } from "@/lib/estado"

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

function pieceTypeLabel(tipo: string | null, hasTiBase: boolean): string {
  if (!tipo) return "-"
  if (tipo === "CORONA_IMPLANTE") {
    return hasTiBase ? "Corona atornillada" : "Corona cementada"
  }
  return TYPE_LABEL_BASE[tipo] ?? tipo
}

function ageFromBirthDate(iso: string | null): number | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const diffMs = Date.now() - d.getTime()
  const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000))
  return Number.isFinite(years) && years >= 0 ? years : null
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

type TrabajoRow = {
  id: string
  fecha_envio: string | null
  fecha_entrega: string | null
  monto: number | null
  notas: string | null
  estado: string | null
  enviado_por: string | null
  url_superior: string | null
  url_inferior: string | null
  url_mordida: string | null
  url_gingival: string | null
  pacientes: {
    nombre: string | null
    apellido: string | null
    fecha_nacimiento: string | null
  } | null
  clinica: { nombre: string | null } | null
  profiles: {
    user_id: string | null
    nombre: string | null
    apellido: string | null
    numero_registro: string | null
  } | null
  piezas: PiezaRow[] | null
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
    if (!trabajoId || typeof trabajoId !== "string") {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      )
    }

    const { data: trabajoData, error: trabajoError } = await supabase
      .from("trabajos")
      .select(
        "id, fecha_envio, fecha_entrega, monto, notas, estado, enviado_por, url_superior, url_inferior, url_mordida, url_gingival, pacientes (nombre, apellido, fecha_nacimiento), clinica (nombre), profiles (user_id, nombre, apellido, numero_registro), piezas (numero, paleta, colores, tipo, tibase_cementado, tibase_plataforma, tibase_gingival, conexion)"
      )
      .eq("id", trabajoId)
      .maybeSingle()

    if (trabajoError || !trabajoData) {
      return NextResponse.json(
        { success: false, error: "Trabajo no encontrado" },
        { status: 404 }
      )
    }

    const trabajo = trabajoData as unknown as TrabajoRow

    let sentByEmail: string | null = null
    const ownerUserId = trabajo.profiles?.user_id ?? null
    if (ownerUserId) {
      const { data: ownerData } = await supabase.auth.admin.getUserById(
        ownerUserId
      )
      sentByEmail = ownerData?.user?.email ?? null
    }

    const estado: Estado = isEstado(trabajo.estado) ? trabajo.estado : "CREADO"
    // Solo los trabajos aún en curso (en espera o en proceso) pueden estar
    // atrasados. Una vez terminados/enviados/recibidos/anulados ya no se marcan
    // como atrasados, aunque hayan pasado de la fecha de entrega.
    const isOpen = estado === "CREADO" || estado === "INICIADO"

    const todayISO = new Date().toISOString().slice(0, 10)
    const due = trabajo.fecha_entrega
    const days = due ? daysDiff(due, todayISO) : 0
    const overdue = isOpen && !!due && days < 0
    const overdueDays = overdue ? -days : 0
    const urgent = isOpen && (overdue || (due ? days <= 2 : false))
    const status = overdue ? "Atrasado" : urgent ? "Urgente" : "En tiempo"

    const piezasRaw = trabajo.piezas ?? []

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
                p.tibase_gingival !== null ? `${p.tibase_gingival} mm` : "-",
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
        label: codes.length === 1 ? labels[0] : labels[i],
        value: code,
        palette,
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
    ].filter((f): f is { name: string; href: string } => !!f.href)

    const profileName = [
      trabajo.profiles?.nombre,
      trabajo.profiles?.apellido,
    ]
      .filter(Boolean)
      .join(" ")
      .trim()
    const dentistName = trabajo.enviado_por || profileName || "-"

    const patientFullName = [
      trabajo.pacientes?.nombre ?? null,
      trabajo.pacientes?.apellido ?? null,
    ]
      .filter(Boolean)
      .join(" ")
      .trim()

    return NextResponse.json({
      id: trabajo.id,
      orderNumber: String(trabajo.id).slice(0, 8),
      status,
      overdue,
      overdueDays,
      patient: {
        name: patientFullName || "-",
        age: ageFromBirthDate(trabajo.pacientes?.fecha_nacimiento ?? null),
      },
      clinic: { name: trabajo.clinica?.nombre ?? "-" },
      dentist: {
        name: dentistName,
        registry: trabajo.profiles?.numero_registro ?? null,
      },
      sentBy: { name: dentistName, email: sentByEmail },
      issueDate: formatDateLong(trabajo.fecha_envio),
      dueDate: formatDateLong(trabajo.fecha_entrega),
      pieces,
      files,
      notes: trabajo.notas ?? "",
      monto: trabajo.monto,
      estado,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: "Error cargando trabajo" },
      { status: 500 }
    )
  }
}

const ALLOWED_TRANSITIONS: Record<Estado, Estado[]> = {
  CREADO: ["INICIADO", "ANULADO"],
  INICIADO: ["FINALIZADO", "ANULADO"],
  FINALIZADO: ["TRA"],
  TRA: ["RECIBIDO"],
  RECIBIDO: [],
  DEVUELTO: [],
  ANULADO: [],
}

export async function PATCH(
  req: Request,
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
    if (!trabajoId || typeof trabajoId !== "string") {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      )
    }

    let body: { to?: unknown }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Body inválido" },
        { status: 400 }
      )
    }

    if (!isEstado(body.to)) {
      return NextResponse.json(
        { success: false, error: "Estado destino inválido" },
        { status: 400 }
      )
    }
    const target = body.to

    const { data: current, error: readError } = await supabase
      .from("trabajos")
      .select("id, estado")
      .eq("id", trabajoId)
      .maybeSingle()

    if (readError || !current) {
      return NextResponse.json(
        { success: false, error: "Trabajo no encontrado" },
        { status: 404 }
      )
    }

    const from = (current.estado ?? "CREADO") as Estado
    if (!isEstado(from)) {
      return NextResponse.json(
        { success: false, error: "Estado actual desconocido" },
        { status: 409 }
      )
    }

    if (!ALLOWED_TRANSITIONS[from].includes(target)) {
      return NextResponse.json(
        { success: false, error: `Transición no permitida: ${from} → ${target}` },
        { status: 409 }
      )
    }

    const { data: updated, error: updateError } = await supabase
      .from("trabajos")
      .update({ estado: target })
      .eq("id", trabajoId)
      .eq("estado", from)
      .select("id, estado")
      .single()

    if (updateError || !updated) {
      return NextResponse.json(
        { success: false, error: "No se pudo actualizar el estado" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, estado: updated.estado })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: "Error actualizando estado" },
      { status: 500 }
    )
  }
}
