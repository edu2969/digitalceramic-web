import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // =========================
    // DATOS DEL FORMULARIO
    // =========================

    const paciente = formData.get("paciente") as string;
    const dentista = formData.get("dentista") as string;

    // =========================
    // ARCHIVOS
    // =========================

    const foto1 = formData.get("foto1") as File;
    const foto2 = formData.get("foto2") as File;
    const modelo3d = formData.get("modelo3d") as File;

    const files = [foto1, foto2, modelo3d];

    // Carpeta única del caso
    const caseId = crypto.randomUUID();

    // =========================
    // SUBIR ARCHIVOS
    // =========================

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filePath = `cases/${caseId}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("dental-files")
          .upload(filePath, buffer, {
            contentType: file.type,
          });

        if (uploadError) {
          throw uploadError;
        }

        // =========================
        // GENERAR LINK FIRMADO
        // =========================

        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from("dental-files")
            .createSignedUrl(
              filePath,
              60 * 60 * 24 * 7 // 7 días
            );

        if (signedUrlError) {
          throw signedUrlError;
        }

        return {
          name: file.name,
          url: signedUrlData.signedUrl,
        };
      })
    );

    // =========================
    // ENVIAR EMAIL
    // =========================

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: "laboratorio@midominio.com",
      subject: `Nuevo caso dental - ${paciente}`,

      html: `
        <h1>Nuevo caso dental</h1>

        <p>
          <strong>Paciente:</strong>
          ${paciente}
        </p>

        <p>
          <strong>Dentista:</strong>
          ${dentista}
        </p>

        <h2>Archivos</h2>

        <ul>
          ${uploadedFiles
            .map(
              (file) => `
                <li>
                  <a href="${file.url}">
                    ${file.name}
                  </a>
                </li>
              `
            )
            .join("")}
        </ul>
      `,
    });

    // =========================
    // RESPUESTA
    // =========================

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error procesando solicitud",
      },
      {
        status: 500,
      }
    );
  }
}