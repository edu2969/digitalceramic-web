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
    .from("clinica")
    .select("id, nombre, direccion")
    .order("nombre", { ascending: true })
    .limit(limit)

  if (q) {
    const like = `%${q}%`
    query = query.or(`nombre.ilike.${like},direccion.ilike.${like}`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: "Error buscando clínicas" },
      { status: 500 }
    )
  }

  return NextResponse.json({ clinicas: data ?? [] })
}

type CreateClinicaBody = {
  nombre?: string
  direccion?: string | null
}

export async function POST(request: Request) {
  const user = await requireUser()
  if (!user) {
    return NextResponse.json({ error: "No hay sesión activa" }, { status: 401 })
  }

  let body: CreateClinicaBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const nombre = body.nombre?.trim()
  if (!nombre) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 })
  }

  const { data, error } = await admin
    .from("clinica")
    .insert({
      nombre,
      direccion: body.direccion?.trim() || null,
    })
    .select("id, nombre, direccion")
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: "No se pudo crear la clínica" },
      { status: 500 }
    )
  }

  return NextResponse.json({ clinica: data })
}
