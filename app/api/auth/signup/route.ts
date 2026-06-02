import { NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { Resend } from "resend"

export const runtime = "nodejs"

const admin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_APIKEY)

type SignupBody = {
  email?: string
  password?: string
  nombre?: string
  apellido?: string
  telefono?: number | null
  centro_medico?: string | null
  direccion?: string | null
  numero_registro?: string | null
}

export async function POST(request: Request) {
  let body: SignupBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const { email, password, nombre, apellido } = body

  if (!email || !password || !nombre || !apellido) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 8 caracteres" },
      { status: 400 }
    )
  }

  const origin = request.headers.get("origin") ?? ""

  // Crear el usuario con el cliente admin (service role). A diferencia de
  // signUp() con el cliente anónimo, esto NO está sujeto al toggle de registro
  // público del proyecto ("Signups not allowed for this instance").
  // generateLink crea el usuario sin confirmar y nos devuelve el token de
  // confirmación que enviaremos por correo.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { nombre, apellido },
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const userId = data.user?.id
  const tokenHash = data.properties?.hashed_token
  if (!userId || !tokenHash) {
    return NextResponse.json(
      { error: "No se pudo crear el usuario" },
      { status: 500 }
    )
  }

  const { error: profileError } = await admin.from("profiles").insert({
    user_id: userId,
    nombre,
    apellido,
    telefono: body.telefono ?? null,
    centro_medico: body.centro_medico ?? null,
    direccion: body.direccion ?? null,
    numero_registro: body.numero_registro ?? null,
    user_role: "ODONTOLOGO",
  })

  if (profileError) {
    await admin.auth.admin.deleteUser(userId)
    return NextResponse.json(
      { error: "No se pudo crear el perfil" },
      { status: 500 }
    )
  }

  // El enlace apunta a nuestra ruta /api/auth/confirm, que verifica el token con
  // verifyOtp({ token_hash, type }).
  const confirmUrl =
    `${origin}/api/auth/confirm` +
    `?token_hash=${encodeURIComponent(tokenHash)}` +
    `&type=signup&next=${encodeURIComponent("/dashboard-odontologo")}`

  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: email,
    subject: "Confirma tu cuenta en Digital Ceramic",
    text:
      `Hola ${nombre},\n\n` +
      `Confirma tu cuenta visitando el siguiente enlace:\n${confirmUrl}\n\n` +
      `Si no creaste esta cuenta, ignora este mensaje.`,
    html:
      `<p>Hola ${nombre},</p>` +
      `<p>Confirma tu cuenta en Digital Ceramic haciendo clic en el siguiente botón:</p>` +
      `<p><a href="${confirmUrl}" ` +
      `style="display:inline-block;background:#1C4880;color:#fff;` +
      `padding:12px 24px;border-radius:12px;text-decoration:none;` +
      `font-weight:600">Confirmar cuenta</a></p>` +
      `<p>O copia este enlace en tu navegador:<br/>` +
      `<a href="${confirmUrl}">${confirmUrl}</a></p>` +
      `<p style="color:#888;font-size:12px">Si no creaste esta cuenta, ignora este mensaje.</p>`,
  })

  if (emailError) {
    // El usuario quedó creado pero el correo falló: lo eliminamos para que
    // pueda reintentar el registro.
    await admin.auth.admin.deleteUser(userId)
    console.error("Error al enviar correo de confirmación:", emailError)
    return NextResponse.json(
      { error: "No se pudo enviar el correo de confirmación" },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
