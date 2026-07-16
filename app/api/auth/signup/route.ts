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
  rut?: string;
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

  const { email, rut, password, nombre, apellido } = body

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
    rut: body.rut,
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
    `&type=signup&next=${encodeURIComponent("/panel/odontologo")}`

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#EEF2F7; font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7; padding:40px 20px;">
  <tr>
    <td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(10,19,48,0.08);">
        
        <!-- HEADER -->
        <tr>
          <td style="background:#0A1330; padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <!-- Logo de la empresa -->
                  <div style="display:flex; align-items:center; gap:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                      <img 
                        src="${process.env.NEXT_PUBLIC_SITE_URL}/logo_02.png" 
                        alt="Digital Ceramic" 
                        style="height:48px; width:auto; border-radius:8px;"
                      />
                      <div>
                        <span style="font-size:20px; font-weight:700; color:#ffffff; letter-spacing:-0.5px;">Digital Ceramic</span>
                        <span style="display:block; font-size:11px; color:rgba(255,255,255,0.6); font-weight:300;">Laboratorio Dental</span>
                      </div>
                    </div>                    
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px 36px;">

            <!-- Título -->
            <h1 style="font-size:22px; font-weight:700; color:#0A1330; margin:0 0 8px 0; letter-spacing:-0.5px;">
              ¡Confirma tu cuenta! 🎉
            </h1>
            <p style="font-size:14px; color:#16213E; margin:0 0 24px 0; line-height:1.6;">
              Hola <strong style="color:#0A1330;">${nombre}</strong>,
            </p>

            <!-- Mensaje principal -->
            <div style="background:#F5F9FF; border:1px solid #D9E5F3; border-radius:10px; padding:20px 24px; margin-bottom:24px;">
              <p style="font-size:14px; color:#16213E; margin:0 0 16px 0; line-height:1.6;">
                Confirma tu cuenta en <strong style="color:#0A1330;">Digital Ceramic</strong> para comenzar a utilizar nuestros servicios.
              </p>
              <p style="font-size:13px; color:#16213E/70; margin:0; line-height:1.5;">
                ⏱️ Este enlace expirará en <strong style="color:#0A1330;">24 horas</strong>.
              </p>
            </div>

            <!-- Botón CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td align="center">
                  <a href="${confirmUrl}" style="
                    display: inline-block;
                    background: #7C3AED;
                    color: #ffffff;
                    padding: 14px 48px;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 16px;
                    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
                  ">
                    ✅ Confirmar cuenta
                  </a>
                </td>
              </tr>
            </table>

            <!-- Enlace alternativo -->
            <div style="background:#EEF2F7; border-radius:8px; padding:14px 18px; margin-bottom:24px;">
              <p style="font-size:12px; color:#16213E/60; margin:0 0 6px 0; font-weight:600;">
                🔗 O copia este enlace en tu navegador:
              </p>
              <a href="${confirmUrl}" style="
                display: block;
                font-size:12px;
                color: #7C3AED;
                word-break: break-all;
                text-decoration: underline;
              ">
                ${confirmUrl}
              </a>
            </div>

            <!-- Aviso de seguridad -->
            <div style="background:#FFF8E6; border-left:4px solid #F4C20D; border-radius:6px; padding:12px 16px;">
              <p style="font-size:12px; color:#16213E/70; margin:0; line-height:1.5;">
                🔒 <strong>¿No creaste esta cuenta?</strong> Ignora este mensaje y no se realizará ningún cambio.
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align:center; margin-top:28px; font-size:11px; color:#999; border-top:1px solid #EEF2F7; padding-top:18px;">
              <p style="margin:0 0 4px 0;">
                <strong style="color:#0A1330;">Digital Ceramic</strong> · Laboratorio Dental
              </p>
              <p style="margin:0; color:#999; font-size:10px;">
                Este correo fue enviado automáticamente. Por favor, no respondas a este mensaje.
              </p>
              <p style="margin:8px 0 0 0; color:#ccc; font-size:10px;">
                ${new Date().getFullYear()} Digital Ceramic. Todos los derechos reservados.
              </p>
            </div>

          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

</body>
</html>
`;

  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: email,
    subject: "Confirma tu cuenta en Digital Ceramic",
    text:
      `Hola ${nombre},\n\n` +
      `Confirma tu cuenta visitando el siguiente enlace:\n${confirmUrl}\n\n` +
      `Si no creaste esta cuenta, ignora este mensaje.`,
    html
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

  return NextResponse.json({ ok: true })
}
