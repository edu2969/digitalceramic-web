import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createSessionClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function requireUser() {
  const session = await createSessionClient()
  const {
    data: { user },
  } = await session.auth.getUser()
  return user
}

export async function GET(request: Request) {
  const user = await requireUser()
  if (!user) {
    return NextResponse.json({ error: "No hay sesión activa" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = (searchParams.get("q") ?? "").trim()
  const limit = Math.min(Number(searchParams.get("limit") ?? 10) || 10, 50)

  let query = admin
    .from("pacientes")
    .select("id, nombre, apellido, fecha_nacimiento")
    .order("nombre", { ascending: true })
    .limit(limit)

  if (q) {
    const like = `%${q}%`
    query = query.or(`nombre.ilike.${like},apellido.ilike.${like}`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: "Error buscando pacientes" },
      { status: 500 }
    )
  }

  return NextResponse.json({ pacientes: data ?? [] })
}

type CreatePacienteBody = {
  nombre?: string
  apellido?: string
  fecha_nacimiento?: string | null
}

export async function POST(request: Request) {
  const user = await requireUser()
  if (!user) {
    return NextResponse.json({ error: "No hay sesión activa" }, { status: 401 })
  }

  let body: CreatePacienteBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const nombre = body.nombre?.trim()
  const apellido = body.apellido?.trim()

  if (!nombre) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 })
  }

  const { data, error } = await admin
    .from("pacientes")
    .insert({
      nombre,
      apellido: apellido ?? null,
      fecha_nacimiento: body.fecha_nacimiento ?? null,
    })
    .select("id, nombre, apellido, fecha_nacimiento")
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: "No se pudo crear el paciente" },
      { status: 500 }
    )
  }

  return NextResponse.json({ paciente: data })
}
