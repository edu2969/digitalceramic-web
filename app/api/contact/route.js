import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const data = await req.json();

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  console.log("Recibido POST /api/contact con datos:", data);

  if (!smtpUser || !smtpPass) {
    return NextResponse.json(
      { ok: false, error: "Faltan credenciales SMTP. Define SMTP_USER y SMTP_PASSWORD en .env.local." },
      { status: 500 }
    );
  }

  // Configuración del transporter (¡debes poner credenciales reales!)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // o el SMTP de tu proveedor
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.sendMail({
      from: `Web Contact <${process.env.SMTP_USER}>`,
      to: "ygadev0@gmail.com",
      subject: "Nueva consulta desde el formulario",
      text: `Nombre: ${data.nombre}\nEmail: ${data.email}\nTeléfono: ${data.telefono}\nMensaje: ${data.mensaje}`,
      html: `<b>Nombre:</b> ${data.nombre}<br/><b>Email:</b> ${data.email}<br/><b>Teléfono:</b> ${data.telefono}<br/><b>Mensaje:</b> ${data.mensaje}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.log("Error enviando email:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}