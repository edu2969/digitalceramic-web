import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createClient as createSessionClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_3D_SIZE = 50 * 1024 * 1024;
const MAX_PHOTO_SIZE = 15 * 1024 * 1024;
const MAX_PHOTOS = 20;

const VALID_3D_EXTENSIONS = new Set(["stl", "obj", "step", "stp", "ply"]);

type Slot3D = "fileSuperior" | "fileInferior" | "fileMordida" | "fileGingival";

const REQUIRED_3D_SLOTS: Slot3D[] = ["fileSuperior", "fileInferior"];

const SLOT_FOLDER: Record<Slot3D, string> = {
  fileSuperior: "superior",
  fileInferior: "inferior",
  fileMordida: "mordida",
  fileGingival: "gingival",
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type SignRequest = {
  files3d?: Array<{ slot: Slot3D; name: string; size: number; type: string }>;
  photos?: Array<{ name: string; size: number; type: string }>;
};

type SignedTarget = {
  path: string;
  signedUrl: string;
  token: string;
};

type SignResponse = {
  orderId: string;
  bucket: string;
  files3d: Array<SignedTarget & { slot: Slot3D }>;
  photos: SignedTarget[];
};

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file";
}

function extOf(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx === -1 ? "" : name.slice(idx + 1).toLowerCase();
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  const sessionClient = await createSessionClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();
  if (!user) return bad("No hay sesión activa", 401);

  let body: SignRequest;
  try {
    body = await req.json();
  } catch {
    return bad("Body inválido");
  }

  const files3d = Array.isArray(body.files3d) ? body.files3d : [];
  const photos = Array.isArray(body.photos) ? body.photos : [];

  if (files3d.length === 0) return bad("Faltan archivos 3D");
  if (photos.length > MAX_PHOTOS) return bad("Demasiadas fotos");

  const seen = new Set<Slot3D>();
  for (const f of files3d) {
    if (!(f.slot in SLOT_FOLDER)) return bad(`Slot 3D inválido: ${f.slot}`);
    if (seen.has(f.slot)) return bad(`Slot 3D duplicado: ${f.slot}`);
    seen.add(f.slot);
    if (!Number.isFinite(f.size) || f.size <= 0 || f.size > MAX_3D_SIZE) {
      return bad(`Tamaño 3D inválido (${f.slot})`);
    }
    if (!VALID_3D_EXTENSIONS.has(extOf(f.name))) {
      return bad(`Extensión 3D inválida (${f.slot})`);
    }
  }
  for (const required of REQUIRED_3D_SLOTS) {
    if (!seen.has(required)) return bad(`Falta archivo 3D requerido: ${required}`);
  }

  for (const p of photos) {
    if (!Number.isFinite(p.size) || p.size <= 0 || p.size > MAX_PHOTO_SIZE) {
      return bad("Tamaño de foto inválido");
    }
    if (!p.type?.startsWith("image/")) return bad("Tipo de foto inválido");
  }

  const orderId = randomUUID();
  const bucket = process.env.SUPABASE_BUCKET!;

  const signOne = async (path: string): Promise<SignedTarget> => {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(path);
    if (error || !data) {
      throw new Error(`createSignedUploadUrl failed: ${error?.message ?? "unknown"}`);
    }
    return { path: data.path, signedUrl: data.signedUrl, token: data.token };
  };

  try {
    const signed3d = await Promise.all(
      files3d.map(async (f) => {
        const path = `orders/${orderId}/3d/${SLOT_FOLDER[f.slot]}/${randomUUID()}-${sanitizeFileName(f.name)}`;
        const target = await signOne(path);
        return { slot: f.slot, ...target };
      })
    );

    const signedPhotos = await Promise.all(
      photos.map(async (p) => {
        const path = `orders/${orderId}/photos/${randomUUID()}-${sanitizeFileName(p.name)}`;
        return signOne(path);
      })
    );

    const response: SignResponse = {
      orderId,
      bucket,
      files3d: signed3d,
      photos: signedPhotos,
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("sign error", err);
    return bad("No se pudieron generar URLs de subida", 500);
  }
}
