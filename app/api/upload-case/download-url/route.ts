import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createSessionClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type DownloadUrlRequest = {
  path?: string;
  bucket?: string;
  ttlSeconds?: number;
};

export async function POST(req: Request) {
  const sessionClient = await createSessionClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No hay sesión activa" }, { status: 401 });
  }

  let body: DownloadUrlRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const bucket = body.bucket ?? process.env.SUPABASE_BUCKET;
  const path = body.path?.trim();
  const ttlSeconds = body.ttlSeconds ?? 60 * 60 * 24 * 7;

  if (!bucket || !path) {
    return NextResponse.json({ error: "Faltan datos para firmar la descarga" }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, ttlSeconds);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message ?? "No se pudo firmar la URL de descarga" },
      { status: 500 }
    );
  }

  return NextResponse.json({ signedUrl: data.signedUrl });
}
