import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createSessionClient } from "@/lib/supabase/server"
import { isUserRole, UserRole } from "@/lib/userRole"

export const runtime = "nodejs"

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const AVATAR_URL_TTL_SECONDS = 60 * 60 * 24 * 7

async function requireUser() {
  const session = await createSessionClient()
  const {
    data: { user },
  } = await session.auth.getUser()
  return user
}

// avatar_url guarda la RUTA del objeto en el bucket; la URL firmada (que expira)
// se genera bajo demanda en cada lectura.
async function signAvatar(path: string | null): Promise<string | null> {
  if (!path) return null
  const { data, error } = await admin.storage
    .from(process.env.SUPABASE_BUCKET!)
    .createSignedUrl(path, AVATAR_URL_TTL_SECONDS)
  if (error || !data) {
    console.error("[profile/me] error firmando avatar:", error)
    return null
  }
  return data.signedUrl
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
    avatar_url: string | null
    user_role: string | null
  },
  email: string | null,
  avatarUrl: string | null
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
    avatarUrl,
    userRole: role,
  }
}

const PROFILE_COLUMNS =
  "id, user_id, nombre, apellido, telefono, centro_medico, direccion, numero_registro, avatar_url, user_role"

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
    console.error("[profile/me GET] error consultando profiles:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return NextResponse.json(
      { error: "Error cargando perfil" },
      { status: 500 }
    )
  }

  if (!data) {
    return NextResponse.json({ profile: null })
  }

  const avatarUrl = await signAvatar(data.avatar_url)
  return NextResponse.json({
    profile: serializeProfile(data, user.email ?? null, avatarUrl),
  })
}

type PatchBody = {
  nombre?: string
  apellido?: string
  telefono?: number | null
  centro_medico?: string | null
  direccion?: string | null
  numero_registro?: string | null
  avatar_url?: string | null
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
  if (typeof body.avatar_url === "string" || body.avatar_url === null) {
    if (typeof body.avatar_url === "string") {
      const prefix = `avatars/${user.id}/`
      if (!body.avatar_url.startsWith(prefix)) {
        return NextResponse.json(
          { error: "Ruta de avatar inválida" },
          { status: 400 }
        )
      }
    }
    updates.avatar_url = body.avatar_url
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin cambios" }, { status: 400 })
  }

  // Si se cambia el avatar, recuperamos la ruta anterior para borrarla del
  // bucket tras actualizar (evita acumular objetos huérfanos).
  let oldAvatarPath: string | null = null
  if ("avatar_url" in updates) {
    const { data: current } = await admin
      .from("profiles")
      .select("avatar_url")
      .eq("user_id", user.id)
      .maybeSingle()
    oldAvatarPath = current?.avatar_url ?? null
  }

  const { data, error } = await admin
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select(PROFILE_COLUMNS)
    .maybeSingle()

  if (error) {
    console.error("[profile/me PATCH] error actualizando profiles:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return NextResponse.json(
      { error: "No se pudo actualizar el perfil" },
      { status: 500 }
    )
  }

  if (!data) {
    // No existe perfil para este user_id (p. ej. cuenta nueva sin perfil).
    return NextResponse.json(
      { error: "Perfil no encontrado" },
      { status: 404 }
    )
  }

  if (oldAvatarPath && oldAvatarPath !== data.avatar_url) {
    const { error: removeError } = await admin.storage
      .from(process.env.SUPABASE_BUCKET!)
      .remove([oldAvatarPath])
    if (removeError) {
      console.error("[profile/me PATCH] no se pudo borrar avatar previo:", removeError)
    }
  }

  const avatarUrl = await signAvatar(data.avatar_url)
  return NextResponse.json({
    profile: serializeProfile(data, user.email ?? null, avatarUrl),
  })
}
