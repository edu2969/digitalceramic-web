import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createClient as createSessionClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type SignRequest = {
  name?: string;
  size?: number;
  type?: string;
};

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file";
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

  const { name, size, type } = body;
  if (!name || typeof name !== "string") return bad("Nombre inválido");
  if (!Number.isFinite(size) || (size as number) <= 0 || (size as number) > MAX_AVATAR_SIZE) {
    return bad("Tamaño inválido (máximo 5MB)");
  }
  if (!type || !VALID_TYPES.has(type)) return bad("Tipo de imagen inválido");

  const bucket = process.env.SUPABASE_BUCKET!;
  // La carpeta va keyeada por user.id: el cliente nunca puede firmar la subida
  // de otro usuario, y /api/profile/me valida el mismo prefijo al persistir.
  const path = `avatars/${user.id}/${randomUUID()}-${sanitizeFileName(name)}`;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUploadUrl(path);
  if (error || !data) {
    console.error("avatar sign error", error);
    return bad("No se pudo generar URL de subida", 500);
  }

  return NextResponse.json({
    bucket,
    path: data.path,
    signedUrl: data.signedUrl,
    token: data.token,
  });
}
