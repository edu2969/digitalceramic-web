import { createClient as createSessionClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server";

// app/api/nuevo-caso/route.ts
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSessionClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { trabajoId, action } = body;

    if (!trabajoId) {
      return NextResponse.json({ error: "ID de trabajo requerido" }, { status: 400 });
    }

    // Verificar que el trabajo existe
    const { data: trabajo, error: trabajoError } = await supabase
      .from("trabajos")
      .select("id, profile_id")
      .eq("id", trabajoId)
      .single();

    if (trabajoError || !trabajo) {
      return NextResponse.json({ error: "Trabajo no encontrado" }, { status: 404 });
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

    // Verificar que el usuario es el dueño del trabajo
    if (!profile || trabajo.profile_id !== profile.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Actualizar solo el estado
    const { error: updateError } = await supabase
      .from("trabajos")
      .update({
        estado: action || "CREADO"
      })
      .eq("id", trabajoId);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      message: "Caso enviado exitosamente",
      trabajoId 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 }
    );
  }
}