import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";

import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

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

type PatientInfo = {
  patientName: string;
  patientAge: string;
  receptionDate: string;
  deliveryDate: string;
  dentistName: string;
  dentistRut: string;
  medicalCenter: string;
};

type ColorPayload = {
  paletteType: "VITA_CLASSIC" | "VITA_3D" | "OTRO";
  customPalette: string;
  code: string;
};

type PiecePayload = {
  pieceId: string;
  type: "INLAY" | "ONLAY" | "CARILLA" | "CORONA" | "CORONA_IMPLANTE" | "";
  subType: "CEMENTADA" | "ATORNILLADA" | "";
  tiBase: {
    gingivalHeight: number;
    diameter: number;
    platformHeight: number;
  } | null;
  colorSectionCount: 1 | 2 | 3;
  colors: ColorPayload[];
};

const SECTION_LABELS: Record<number, string[]> = {
  1: ["Color"],
  2: ["Incisal", "Cervical"],
  3: ["Incisal", "Medio", "Cervical"],
};

const TYPE_LABELS: Record<string, string> = {
  INLAY: "Inlay",
  ONLAY: "Onlay",
  CARILLA: "Carilla",
  CORONA: "Corona",
  CORONA_IMPLANTE: "Corona sobre implante",
};

const MATERIAL_BY_TYPE: Record<string, string> = {
  INLAY: "Disilicato",
  ONLAY: "Disilicato",
  CARILLA: "Disilicato",
  CORONA: "Disilicato",
  CORONA_IMPLANTE: "Zirconia",
};

const SUBTYPE_LABELS: Record<string, string> = {
  CEMENTADA: "Cementada",
  ATORNILLADA: "Atornillada",
};

const PALETTE_LABELS: Record<string, string> = {
  VITA_CLASSIC: "VITA Classic",
  VITA_3D: "VITA 3D Master",
  OTRO: "Otro",
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const patientInfo: PatientInfo = JSON.parse(
      (formData.get("patientInfo") as string) || "{}"
    );
    const pieces: PiecePayload[] = JSON.parse(
      (formData.get("pieces") as string) || "[]"
    );
    const notes = (formData.get("notes") as string) || "";

    const photos = formData.getAll("photos") as File[];
    const fileSuperior = formData.get("fileSuperior") as File | null;
    const fileInferior = formData.get("fileInferior") as File | null;
    const fileMordida = formData.get("fileMordida") as File | null;

    const orderId = randomUUID();

    const uploadedPhotos = await Promise.all(
      photos.map(async (photo) =>
        uploadAndSignFile({
          file: photo,
          folder: `orders/${orderId}/photos`,
        })
      )
    );

    const upload3D = async (file: File | null, name: string) => {
      if (!file) return null;
      return uploadAndSignFile({
        file,
        folder: `orders/${orderId}/3d/${name}`,
      });
    };

    const [upSuperior, upInferior, upMordida] = await Promise.all([
      upload3D(fileSuperior, "superior"),
      upload3D(fileInferior, "inferior"),
      upload3D(fileMordida, "mordida"),
    ]);

    const piecesHtml = pieces
      .map((piece) => {
        const lines: string[] = [
          `<strong>Pieza FDI ${piece.pieceId}</strong>`,
          `Tipo: ${TYPE_LABELS[piece.type] || "-"}`,
          `Material: ${MATERIAL_BY_TYPE[piece.type] || "-"}`,
        ];
        if (piece.type === "CORONA_IMPLANTE" && piece.subType) {
          lines.push(`Sub-tipo: ${SUBTYPE_LABELS[piece.subType] || "-"}`);
        }
        if (piece.tiBase) {
          lines.push(
            `TiBase: plataforma ${piece.tiBase.platformHeight} mm · cementado ${piece.tiBase.diameter} mm · gingival ${piece.tiBase.gingivalHeight} mm`
          );
        }
        const labels =
          SECTION_LABELS[piece.colorSectionCount] || SECTION_LABELS[1];
        const colorsHtml = piece.colors
          .slice(0, piece.colorSectionCount)
          .map((c, i) => {
            const palette =
              c.paletteType === "OTRO"
                ? c.customPalette
                : PALETTE_LABELS[c.paletteType] || c.paletteType;
            return `<li>${labels[i]}: ${palette} — ${c.code}</li>`;
          })
          .join("");
        return `
          <div style="border:1px solid #ddd;padding:12px;border-radius:8px;margin-bottom:8px;">
            ${lines.map((l) => `<div>${l}</div>`).join("")}
            <ul>${colorsHtml}</ul>
          </div>
        `;
      })
      .join("");

    const fileHtml = (label: string, item: { url: string } | null) =>
      item
        ? `<li>${label}: <a href="${item.url}">Descargar</a></li>`
        : `<li>${label}: (no entregado)</li>`;

    const html = `
      <div style="font-family: Arial; max-width: 700px;">
        <h1>Nuevo Pedido Dental</h1>
        <hr />
        <h2>Información del paciente</h2>
        <p><strong>Paciente:</strong> ${patientInfo.patientName} (${patientInfo.patientAge} años)</p>
        <p><strong>Recepción:</strong> ${patientInfo.receptionDate}</p>
        <p><strong>Entrega:</strong> ${patientInfo.deliveryDate}</p>
        <p><strong>Odontólogo:</strong> ${patientInfo.dentistName} (${patientInfo.dentistRut})</p>
        <p><strong>Centro:</strong> ${patientInfo.medicalCenter}</p>

        <h2>Piezas</h2>
        ${piecesHtml || "<p>(sin piezas)</p>"}

        <h2>Notas</h2>
        <p>${notes || "(sin notas)"}</p>

        <h2>Fotos</h2>
        <ul>
          ${uploadedPhotos
            .map(
              (photo, index) =>
                `<li><a href="${photo.url}">Foto ${index + 1}</a></li>`
            )
            .join("")}
        </ul>

        <h2>Archivos 3D</h2>
        <ul>
          ${fileHtml("Superior", upSuperior)}
          ${fileHtml("Inferior", upInferior)}
          ${fileHtml("Mordida", upMordida)}
        </ul>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.DENTAL_EMAIL_TO,
      subject: `Nuevo pedido dental #${orderId}`,
      html,
    });

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Error creando pedido" },
      { status: 500 }
    );
  }
}

async function uploadAndSignFile({
  file,
  folder,
}: {
  file: File;
  folder: string;
}) {
  const fileName = `${Date.now()}-${file.name}`;
  const path = `${folder}/${fileName}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: uploadError } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .upload(path, buffer, { contentType: file.type });

  if (uploadError) throw uploadError;

  const { data, error: signedError } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .createSignedUrl(path, 60 * 60 * 24 * 7);

  if (signedError) throw signedError;

  return { key: path, url: data.signedUrl };
}
