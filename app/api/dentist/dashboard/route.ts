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

const TYPE_LABEL: Record<string, string> = {
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

type TrabajoRow = {
  id: string
  fecha_envio: string | null
  estado: string | null
  pacientes: { nombre: string | null; apellido: string | null } | null
  piezas: { numero: number | string | null; tipo: string | null }[] | null
}

export async function GET() {
  const sessionClient = await createSessionClient()
  const {
    data: { user },
  } = await sessionClient.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "No hay sesión activa" },
      { status: 401 }
    )
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Perfil no encontrado" },
      { status: 404 }
    )
  }

  const { data, error } = await supabase
    .from("trabajos")
    .select(
      "id, fecha_envio, estado, pacientes (nombre, apellido), piezas (numero, tipo)"
    )
    .eq("profile_id", profile.id)
    .order("fecha_envio", { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: "Error cargando trabajos" },
      { status: 500 }
    )
  }

  const trabajos = (data ?? []) as unknown as TrabajoRow[]

  const works = trabajos.map((t) => {
    const piezas = t.piezas ?? []
    const patient = [t.pacientes?.nombre ?? null, t.pacientes?.apellido ?? null]
      .filter(Boolean)
      .join(" ")
      .trim()

    return {
      id: t.id,
      patient: patient || "-",
      sentAt: formatDate(t.fecha_envio),
      pieces: piezas.map((p) => ({
        tooth: p.numero !== null && p.numero !== undefined ? String(p.numero) : "-",
        type: p.tipo ? TYPE_LABEL[p.tipo] ?? p.tipo : "-",
      })),
      estado: (isEstado(t.estado) ? t.estado : "CREADO") as Estado,
    }
  })

  return NextResponse.json({ works })
}
