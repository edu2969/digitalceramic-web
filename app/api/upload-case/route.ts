import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";

import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// =========================
// SUPABASE
// =========================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =========================
// SMTP
// =========================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: Number(process.env.SMTP_PORT),

  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// =========================
// ROUTE
// =========================

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // =========================
    // DATOS
    // =========================

    const piece =
      formData.get("piece");

    const shades =
      formData.get("shades");

    const vitaPalette =
      formData.get("vitaPalette");

    const notes =
      formData.get("notes");

    const selectedColors = JSON.parse(
      formData.get(
        "selectedColors"
      ) as string
    );

    // =========================
    // ARCHIVOS
    // =========================

    const photos =
      formData.getAll(
        "photos"
      ) as File[];

    const uploadedFile =
      formData.get(
        "uploadedFile"
      ) as File;

    // =========================
    // ID CASO
    // =========================

    const orderId =
      randomUUID();

    // =========================
    // SUBIR FOTOS
    // =========================

    const uploadedPhotos =
      await Promise.all(
        photos.map(async (photo) => {
          return await uploadAndSignFile({
            file: photo,

            folder:
              `orders/${orderId}/photos`,
          });
        })
      );

    // =========================
    // SUBIR ARCHIVO 3D
    // =========================

    const uploaded3D =
      await uploadAndSignFile({
        file: uploadedFile,

        folder:
          `orders/${orderId}/3d`,
      });

    // =========================
    // EMAIL HTML
    // =========================

    const html = `
      <div
        style="
          font-family: Arial;
          max-width: 700px;
        "
      >
        <h1>
          Nuevo Pedido Dental
        </h1>

        <hr />

        <h2>
          Información General
        </h2>

        <p>
          <strong>Pieza:</strong>
          ${piece}
        </p>

        <p>
          <strong>Shades:</strong>
          ${shades}
        </p>

        <p>
          <strong>Vita Palette:</strong>
          ${vitaPalette}
        </p>

        <p>
          <strong>Notas:</strong>
          ${notes}
        </p>

        <h2>
          Colores
        </h2>

        <ul>
          ${Object.entries(
            selectedColors
          )
            .map(
              ([key, value]) => `
                <li>
                  Shade ${key}: ${value}
                </li>
              `
            )
            .join("")}
        </ul>

        <h2>
          Fotos
        </h2>

        <ul>
          ${uploadedPhotos
            .map(
              (photo, index) => `
                <li>
                  <a href="${photo.url}">
                    Foto ${index + 1}
                  </a>
                </li>
              `
            )
            .join("")}
        </ul>

        <h2>
          Archivo 3D
        </h2>

        <p>
          <a href="${uploaded3D.url}">
            Descargar archivo 3D
          </a>
        </p>
      </div>
    `;

    // =========================
    // ENVIAR EMAIL
    // =========================

    await transporter.sendMail({
      from:
        process.env.SMTP_FROM,

      to:
        process.env
          .DENTAL_EMAIL_TO,

      subject:
        `Nuevo pedido dental #${orderId}`,

      html,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        error:
          "Error creando pedido",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// HELPERS
// =========================

async function uploadAndSignFile({
  file,
  folder,
}: {
  file: File;
  folder: string;
}) {
  const fileName =
    `${Date.now()}-${file.name}`;

  const path =
    `${folder}/${fileName}`;

  const bytes =
    await file.arrayBuffer();

  const buffer =
    Buffer.from(bytes);

  // =========================
  // UPLOAD
  // =========================

  const {
    error: uploadError,
  } =
    await supabase.storage
      .from(
        process.env
          .SUPABASE_BUCKET!
      )
      .upload(path, buffer, {
        contentType:
          file.type,
      });

  if (uploadError) {
    throw uploadError;
  }

  // =========================
  // SIGNED URL
  // =========================

  const {
    data,
    error: signedError,
  } =
    await supabase.storage
      .from(
        process.env
          .SUPABASE_BUCKET!
      )
      .createSignedUrl(
        path,
        60 * 60 * 24 * 7
      );

  if (signedError) {
    throw signedError;
  }

  return {
    key: path,

    url: data.signedUrl,
  };
}