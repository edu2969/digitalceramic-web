import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createSessionClient } from "@/lib/supabase/server"
import { isUserRole, UserRole } from "@/lib/userRole"

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

function serializeProfile(
  row: {
    id: string
    user_id: string | null
    nombre: string | null
    apellido: string | null
    telefono: number | null
    centro_medico: string | null
    direccion: string | null
    numero_registro: string | null
    user_role: string | null
  },
  email: string | null
) {
  const role: UserRole | null = isUserRole(row.user_role)
    ? row.user_role
    : null

  return {
    id: row.id,
    userId: row.user_id,
    email,
    nombre: row.nombre,
    apellido: row.apellido,
    telefono: row.telefono,
    centroMedico: row.centro_medico,
    direccion: row.direccion,
    numeroRegistro: row.numero_registro,
    userRole: role,
  }
}

const PROFILE_COLUMNS =
  "id, user_id, nombre, apellido, telefono, centro_medico, direccion, numero_registro, user_role"

export async function GET() {
  const user = await requireUser()
  if (!user) {
    return NextResponse.json({ error: "No hay sesión activa" }, { status: 401 })
  }

  const { data, error } = await admin
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json(
      { error: "Error cargando perfil" },
      { status: 500 }
    )
  }

  if (!data) {
    return NextResponse.json({ profile: null })
  }

  return NextResponse.json({ profile: serializeProfile(data, user.email ?? null) })
}

type PatchBody = {
  nombre?: string
  apellido?: string
  telefono?: number | null
  centro_medico?: string | null
  direccion?: string | null
  numero_registro?: string | null
}

export async function PATCH(request: Request) {
  const user = await requireUser()
  if (!user) {
    return NextResponse.json({ error: "No hay sesión activa" }, { status: 401 })
  }

  let body: PatchBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const updates: Record<string, unknown> = {}
  if (typeof body.nombre === "string") updates.nombre = body.nombre.trim()
  if (typeof body.apellido === "string") updates.apellido = body.apellido.trim()
  if (body.telefono === null || typeof body.telefono === "number") {
    updates.telefono = body.telefono
  }
  if (typeof body.centro_medico === "string" || body.centro_medico === null) {
    updates.centro_medico = body.centro_medico
      ? body.centro_medico.trim()
      : null
  }
  if (typeof body.direccion === "string" || body.direccion === null) {
    updates.direccion = body.direccion ? body.direccion.trim() : null
  }
  if (
    typeof body.numero_registro === "string" ||
    body.numero_registro === null
  ) {
    updates.numero_registro = body.numero_registro
      ? body.numero_registro.trim()
      : null
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin cambios" }, { status: 400 })
  }

  const { data, error } = await admin
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select(PROFILE_COLUMNS)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json(
      { error: "No se pudo actualizar el perfil" },
      { status: 500 }
    )
  }

  return NextResponse.json({ profile: serializeProfile(data, user.email ?? null) })
}
