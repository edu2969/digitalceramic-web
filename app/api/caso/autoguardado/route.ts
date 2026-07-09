import { createClient as createSessionClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        console.log("[actualizarFicha] Iniciando petición");
        
        const supabase = await createSessionClient();
        const { data } = await supabase.auth.getUser();
        if (!data || !data.user) {
            console.warn("[actualizarFicha] No autorizado");
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        const user = data.user;
        const { data: usuario, error: userError } = await supabase
            .from("usuarios")
            .select("id, rol, email")
            .eq("id", user.id)
            .single();

        if (userError || !usuario || usuario.rol !== "ODONTOLOGO") {
            console.warn("[actualizarCaso] Acceso denegado para usuario:", usuario?.email);
            return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
        }

        const body = await req.json();
        const { id, changes } = body;
        console.log("[actualizarFicha] Body recibido:", body);

        if (!id || !changes || typeof changes !== 'object') {
            console.warn("[actualizarFicha] pacienteId/fichaId o changes faltante");
            return NextResponse.json({ error: "pacienteId y changes requeridos" }, { status: 400 });
        }

        // Categorizar y aplicar cambios
        const casoUpdates = {};

        const updatePromises = [];

        console.log("[actualizarCaso] ids:", id, casoUpdates);

        // Actualizaciones de paciente (sin partos)
        if (Object.keys(casoUpdates).length > 0) {
            updatePromises.push(
                supabase
                    .from("trabajos")
                    .update(casoUpdates)
                    .eq("id", id)
            );
        }

        return NextResponse.json({ ok: true, updatedFields: Object.keys(changes) });
    } catch (error) {
        console.error("[actualizarFicha] Error:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
