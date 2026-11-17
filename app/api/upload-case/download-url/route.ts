import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createSessionClient } from "@/lib/supabase/server";
import { getStorageObjectPath } from "@/lib/orders/storagePath";

export const runtime = "nodejs";

type DownloadUrlRequest = {
  path?: string;
  trabajoId?: string;
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

  const bucket = process.env.SUPABASE_BUCKET;
  const path = body.path?.trim();

  if (!bucket || !path || !body.trabajoId) {
    return NextResponse.json({ error: "Faltan datos para firmar la descarga" }, { status: 400 });
  }
  if (!path.startsWith("orders/")) {
    return NextResponse.json({ error: "Ruta de archivo inválida" }, { status: 400 });
  }

  const { data: trabajo, error: trabajoError } = await sessionClient
    .from("trabajos")
    .select("url_superior, url_inferior, url_mordida, url_gingival")
    .eq("id", body.trabajoId)
    .maybeSingle();

  if (trabajoError) {
    console.error("[upload-case/download-url] error consultando trabajo:", trabajoError);
    return NextResponse.json({ error: "No se pudo validar el trabajo" }, { status: 500 });
  }
  if (!trabajo) {
    return NextResponse.json({ error: "Trabajo no encontrado" }, { status: 404 });
  }

  const authorizedPaths = Object.values(trabajo)
    .map((value) => getStorageObjectPath(value, bucket))
    .filter((value): value is string => value !== null);
  if (!authorizedPaths.includes(path)) {
    return NextResponse.json({ error: "No autorizado para descargar este archivo" }, { status: 403 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message ?? "No se pudo firmar la URL de descarga" },
      { status: 500 }
    );
  }

  return NextResponse.json({ signedUrl: data.signedUrl });
}
