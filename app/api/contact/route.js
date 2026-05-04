import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const data = await req.json();

  // Configuración del transporter (¡debes poner credenciales reales!)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // o el SMTP de tu proveedor
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER, // Debes definir estas variables de entorno
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `Web Contact <${process.env.SMTP_USER}>`,
      to: data.para || "contacto@yopmail.com",
      subject: "Nueva consulta desde el formulario",
      text: `Nombre: ${data.nombre}\nEmail: ${data.email}\nTeléfono: ${data.telefono}\nMensaje: ${data.mensaje}`,
      html: `<b>Nombre:</b> ${data.nombre}<br/><b>Email:</b> ${data.email}<br/><b>Teléfono:</b> ${data.telefono}<br/><b>Mensaje:</b> ${data.mensaje}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// Faltaría para producción:
// - Definir las variables de entorno SMTP_USER y SMTP_PASS con credenciales válidas
// - Usar un proveedor SMTP confiable (Gmail, SendGrid, etc.)
// - Manejar límites de envío y errores de spam
// - Validar y sanitizar los datos recibidos
// - (Opcional) Usar un servicio de email transaction como Resend, Mailgun, etc.
