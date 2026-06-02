import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_APIKEY);

export async function POST(req) {
  const data = await req.json();

  console.log("Recibido POST /api/contact con datos:", data);

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.CONTACT_EMAIL_TO,
      replyTo: data.email,
      subject: "Nueva consulta desde el formulario",
      text: `Nombre: ${data.nombre}\nEmail: ${data.email}\nTeléfono: ${data.telefono}\nMensaje: ${data.mensaje}`,
      html: `<b>Nombre:</b> ${data.nombre}<br/><b>Email:</b> ${data.email}<br/><b>Teléfono:</b> ${data.telefono}<br/><b>Mensaje:</b> ${data.mensaje}`,
    });

    if (error) {
      console.log("Error enviando email:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.log("Error enviando email:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}