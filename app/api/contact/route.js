import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_APIKEY);

export async function POST(req) {
  const data = await req.json();

  console.log("Recibido POST /api/contact con datos:", data);

  const from = process.env.RESEND_FROM;
  const to = process.env.CONTACT_EMAIL_TO;

  if (!process.env.RESEND_APIKEY || !from || !to) {
    console.error(
      "Contacto mal configurado:",
      JSON.stringify({
        RESEND_APIKEY: !!process.env.RESEND_APIKEY,
        RESEND_FROM: !!from,
        CONTACT_EMAIL_TO: !!to,
      })
    );
    return NextResponse.json(
      { ok: false, error: "El envío de correos no está configurado." },
      { status: 500 }
    );
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      // Solo seteamos replyTo si el email es válido; un valor vacío hace que
      // Resend responda 400 "Invalid `reply_to`".
      ...(data.email ? { replyTo: data.email } : {}),
      subject: "Nueva consulta desde el formulario",
      text: `Nombre: ${data.nombre}\nEmail: ${data.email}\nTeléfono: ${data.telefono}\nMensaje: ${data.mensaje}`,
      html: `<b>Nombre:</b> ${data.nombre}<br/><b>Email:</b> ${data.email}<br/><b>Teléfono:</b> ${data.telefono}<br/><b>Mensaje:</b> ${data.mensaje}`,
    });

    if (error) {
      console.error("Error enviando email:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando email:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}