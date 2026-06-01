import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { createClient } from "@supabase/supabase-js";
import { createClient as createSessionClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const TRABAJO_MONTO_DEFAULT = 79990;
const DOWNLOAD_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

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
  patientId: string | null;
  patientName: string;
  patientLastName: string;
  patientAge: string;
  receptionDate: string;
  deliveryDate: string;
  dentistName: string;
  dentistRut: string;
  dentistRegistry: string;
  clinicId: string | null;
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

type CommitPayload = {
  orderId: string;
  patientInfo: PatientInfo;
  pieces: PiecePayload[];
  notes: string;
  paths: {
    fileSuperior: string;
    fileInferior: string;
    fileMordida: string | null;
    fileGingival: string | null;
    photos: string[];
  };
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

function bad(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

async function verifyPathsExist(bucket: string, paths: string[]) {
  const byFolder = new Map<string, string[]>();
  for (const p of paths) {
    const slash = p.lastIndexOf("/");
    const folder = slash === -1 ? "" : p.slice(0, slash);
    const file = slash === -1 ? p : p.slice(slash + 1);
    const arr = byFolder.get(folder) ?? [];
    arr.push(file);
    byFolder.set(folder, arr);
  }
  const missing: string[] = [];
  for (const [folder, files] of byFolder) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, { limit: 1000 });
    if (error) throw error;
    const present = new Set((data ?? []).map((f) => f.name));
    for (const f of files) {
      if (!present.has(f)) missing.push(`${folder}/${f}`);
    }
  }
  return missing;
}

async function signDownload(bucket: string, path: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, DOWNLOAD_URL_TTL_SECONDS);
  if (error || !data) throw error ?? new Error("signed URL failed");
  return data.signedUrl;
}

function approxBirthDateFromAge(ageStr: string): string | null {
  const age = Number(ageStr);
  if (!Number.isFinite(age) || age < 0 || age > 120) return null;
  const year = new Date().getFullYear() - Math.floor(age);
  return `${year}-01-01`;
}

async function resolvePaciente(info: PatientInfo): Promise<string> {
  if (info.patientId) {
    return info.patientId;
  }
  const { data, error } = await supabase
    .from("pacientes")
    .insert({
      nombre: info.patientName.trim(),
      apellido: info.patientLastName?.trim() || null,
      fecha_nacimiento: approxBirthDateFromAge(info.patientAge),
    })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("paciente insert failed");
  return data.id;
}

async function resolveClinica(info: PatientInfo): Promise<string> {
  if (info.clinicId) {
    return info.clinicId;
  }
  const { data, error } = await supabase
    .from("clinica")
    .insert({ nombre: info.medicalCenter.trim() })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("clinica insert failed");
  return data.id;
}

async function resolveProfile(
  userId: string,
  dentistRegistry: string
): Promise<string> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, numero_registro")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!profile) throw new Error("Perfil no encontrado para el usuario");

  if (
    dentistRegistry &&
    dentistRegistry.trim() &&
    profile.numero_registro !== dentistRegistry.trim()
  ) {
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ numero_registro: dentistRegistry.trim() })
      .eq("id", profile.id);
    if (updateErr) throw updateErr;
  }

  return profile.id;
}

export async function POST(req: Request) {
  try {
    const sessionClient = await createSessionClient();
    const {
      data: { user },
    } = await sessionClient.auth.getUser();
    if (!user) return bad("No hay sesión activa", 401);

    let body: CommitPayload;
    try {
      body = await req.json();
    } catch {
      return bad("Body inválido");
    }

    const { orderId, patientInfo, pieces, notes, paths } = body;
    if (!orderId || typeof orderId !== "string") return bad("orderId requerido");
    if (!paths?.fileSuperior || !paths?.fileInferior) {
      return bad("Faltan archivos 3D requeridos");
    }

    const allPaths: string[] = [
      paths.fileSuperior,
      paths.fileInferior,
      ...(paths.fileMordida ? [paths.fileMordida] : []),
      ...(paths.fileGingival ? [paths.fileGingival] : []),
      ...(Array.isArray(paths.photos) ? paths.photos : []),
    ];

    const prefix = `orders/${orderId}/`;
    for (const p of allPaths) {
      if (typeof p !== "string" || !p.startsWith(prefix)) {
        return bad(`Path fuera del pedido: ${p}`);
      }
    }

    const bucket = process.env.SUPABASE_BUCKET!;
    const missing = await verifyPathsExist(bucket, allPaths);
    if (missing.length > 0) {
      return bad(`Archivos no subidos: ${missing.join(", ")}`);
    }

    const [upSuperior, upInferior, upMordida, upGingival, photoUrls] =
      await Promise.all([
        signDownload(bucket, paths.fileSuperior),
        signDownload(bucket, paths.fileInferior),
        paths.fileMordida ? signDownload(bucket, paths.fileMordida) : Promise.resolve(null),
        paths.fileGingival ? signDownload(bucket, paths.fileGingival) : Promise.resolve(null),
        Promise.all((paths.photos ?? []).map((p) => signDownload(bucket, p))),
      ]);

    const [pacienteId, clinicaId, profileId] = await Promise.all([
      resolvePaciente(patientInfo),
      resolveClinica(patientInfo),
      resolveProfile(user.id, patientInfo.dentistRegistry),
    ]);

    const { data: trabajo, error: trabajoError } = await supabase
      .from("trabajos")
      .insert({
        paciente_id: pacienteId,
        clinica_id: clinicaId,
        profile_id: profileId,
        enviado_por: patientInfo.dentistName,
        fecha_envio: patientInfo.receptionDate,
        fecha_entrega: patientInfo.deliveryDate,
        monto: TRABAJO_MONTO_DEFAULT,
        notas: notes,
        url_superior: upSuperior,
        url_inferior: upInferior,
        url_mordida: upMordida,
        url_gingival: upGingival,
      })
      .select("id")
      .single();

    if (trabajoError || !trabajo) throw trabajoError;

    if (pieces.length > 0) {
      const piezasRows = pieces.map((piece) => {
        const visibleColors = piece.colors.slice(0, piece.colorSectionCount);
        const firstColor = visibleColors[0];
        const paleta = firstColor
          ? firstColor.paletteType === "OTRO"
            ? firstColor.customPalette
            : firstColor.paletteType
          : null;
        const colores = visibleColors.map((c) => c.code).join(",");
        const numeroParsed = Number(piece.pieceId);

        return {
          trabajo_id: trabajo.id,
          numero: Number.isFinite(numeroParsed) ? numeroParsed : null,
          paleta,
          colores,
          tipo: piece.type,
          tibase_cementado: piece.tiBase?.diameter ?? null,
          tibase_plataforma: piece.tiBase?.platformHeight ?? null,
          tibase_gingival: piece.tiBase?.gingivalHeight ?? null,
          conexion: "NONE",
        };
      });

      const { error: piezasError } = await supabase
        .from("piezas")
        .insert(piezasRows);

      if (piezasError) throw piezasError;
    }

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

    const fileHtml = (label: string, url: string | null) =>
      url
        ? `<li>${label}: <a href="${url}">Descargar</a></li>`
        : `<li>${label}: (no entregado)</li>`;

    const html = `
      <div style="font-family: Arial; max-width: 700px;">
        <h1>Nuevo Pedido Dental</h1>
        <hr />
        <h2>Información del paciente</h2>
        <p><strong>Paciente:</strong> ${patientInfo.patientName} ${patientInfo.patientLastName} (${patientInfo.patientAge} años)</p>
        <p><strong>Recepción:</strong> ${patientInfo.receptionDate}</p>
        <p><strong>Entrega:</strong> ${patientInfo.deliveryDate}</p>
        <p><strong>Odontólogo:</strong> ${patientInfo.dentistName} (${patientInfo.dentistRut}) · Reg ${patientInfo.dentistRegistry}</p>
        <p><strong>Centro:</strong> ${patientInfo.medicalCenter}</p>

        <h2>Piezas</h2>
        ${piecesHtml || "<p>(sin piezas)</p>"}

        <h2>Notas</h2>
        <p>${notes || "(sin notas)"}</p>

        <h2>Fotos</h2>
        <ul>
          ${photoUrls
            .map((url, index) => `<li><a href="${url}">Foto ${index + 1}</a></li>`)
            .join("")}
        </ul>

        <h2>Archivos 3D</h2>
        <ul>
          ${fileHtml("Superior", upSuperior)}
          ${fileHtml("Inferior", upInferior)}
          ${fileHtml("Mordida", upMordida)}
          ${fileHtml("Gingival", upGingival)}
        </ul>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.DENTAL_EMAIL_TO,
      subject: `Nuevo pedido dental #${orderId}`,
      html,
    });

    return NextResponse.json({ success: true, orderId, trabajoId: trabajo.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Error creando pedido" },
      { status: 500 }
    );
  }
}
