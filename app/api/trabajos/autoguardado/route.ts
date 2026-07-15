import { NextRequest, NextResponse } from "next/server";
import { createClient as createSessionClient } from "@/lib/supabase/server";

type RelationOptions = {
    table: "pacientes";
    foreignKey: "paciente_id";
    trabajoId: string;
    currentId: string | null;
    incomingId?: string | null;
    values: Record<string, unknown>;
};

type PieceDraftInput = {
    numero?: number | null;
    colores?: Array<{
        code?: string | null;
        paletteType?: string | null;
        customPalette?: string | null;
    }> | null;
    tipo?: string | null;
    subTipo?: string | null;
    tiBase?: {
        platformHeight?: number | null;
        diameter?: number | null;
        gingivalHeight?: number | null;
    } | null;
};

function birthDateFromAge(age: number) {
    const today = new Date();
    return new Date(
        today.getFullYear() - age,
        today.getMonth(),
        today.getDate()
    ).toISOString().substring(0, 10);
}

async function replaceTrabajoPiezas(
    trabajoId: string,
    piezas: Array<Record<string, unknown>>
) {
    const supabase = await createSessionClient();
    // Usar transacción para consistencia
    const { error: deleteError } = await supabase
        .from("piezas")
        .delete()
        .eq("trabajo_id", trabajoId);

    if (deleteError) throw deleteError;

    if (!piezas.length) return;

    const { error: insertError } = await supabase
        .from("piezas")
        .insert(
            piezas.map((pieza) => ({
                trabajo_id: trabajoId,
                numero: pieza.numero,
                paleta: pieza.paleta ?? null,
                colores: pieza.colores ?? null,
                tipo: pieza.tipo ?? null,
                tibase_cementado: pieza.tibase_cementado ?? null,
                tibase_plataforma: pieza.tibase_plataforma ?? null,
                tibase_gingival: pieza.tibase_gingival ?? null,
                conexion: pieza.conexion ?? "NONE",
            }))
        );

    if (insertError) throw insertError;
}

async function upsertRelation({
    table,
    foreignKey,
    trabajoId,
    currentId,
    incomingId,
    values,
}: RelationOptions) {
    const data = { ...values };
    delete data.id;

    const relationId = incomingId ?? currentId;
    const supabase = await createSessionClient();

    if (relationId) {
        const { error } = await supabase
            .from(table)
            .update(data)
            .eq("id", relationId);

        if (error) throw error;

        if (relationId !== currentId) {
            const { error: trabajoError } = await supabase
                .from("trabajos")
                .update({ [foreignKey]: relationId })
                .eq("id", trabajoId);

            if (trabajoError) throw trabajoError;
        }

        return relationId;
    }

    const { data: inserted, error } = await supabase
        .from(table)
        .insert(data)
        .select("id")
        .single();

    if (error) throw error;

    const { error: trabajoError } = await supabase
        .from("trabajos")
        .update({ [foreignKey]: inserted.id })
        .eq("id", trabajoId);

    if (trabajoError) throw trabajoError;

    return inserted.id;
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createSessionClient();
        
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("id, user_role")
            .eq("user_id", user.id)
            .single();

        if (!profile || profile.user_role !== "ODONTOLOGO") {
            return NextResponse.json(
                { error: "Acceso denegado" },
                { status: 403 }
            );
        }

        const { id, changes, timestamp } = await req.json();

        if (!changes || Object.keys(changes).length === 0) {
            console.warn("No changes detected");
            return NextResponse.json({ 
                ok: true, 
                message: "No changes to save",
                timestamp: new Date().toISOString()
            });
        }

        console.log("DETECTED CHANGES", id, changes)

        if (!id) {
            return NextResponse.json(
                { error: "Id requerido" },
                { status: 400 }
            );
        }

        // Verificar que el trabajo existe y pertenece al usuario
        const { data: trabajo, error: trabajoError } = await supabase
            .from("trabajos")
            .select(`
                id,
                paciente_id,
                profile_id,
                updated_at
            `)
            .eq("id", id)
            .single();

        if (trabajoError || !trabajo) {
            console.log("Error?!", trabajo, trabajoError)
            return NextResponse.json(
                { error: "Trabajo no encontrado" },
                { status: 404 }
            );
        }

        // Verificar conflictos (opcional pero recomendado)
        if (timestamp && trabajo.updated_at) {
            const lastUpdate = new Date(trabajo.updated_at).getTime();
            const clientTimestamp = new Date(timestamp).getTime();
            if (clientTimestamp < lastUpdate) {
                return NextResponse.json(
                    { 
                        error: "Conflicto de datos",
                        serverVersion: trabajo.updated_at
                    },
                    { status: 409 }
                );
            }
        }

        // Campos permitidos para trabajo
        const allowedTrabajoFields = new Set([
            'enviado_por', 
            'url_superior', 'url_inferior', 'url_mordida', 'url_gingival',
            'archivo_superior', 'archivo_inferior', 'archivo_mordida', 'archivo_gingival',
            'notas'
        ]);

        // Procesar cambios del trabajo
        const trabajoUpdates: Record<string, unknown> = {};
        
        for (const [key, value] of Object.entries(changes)) {
            if (allowedTrabajoFields.has(key) && value !== undefined) {
                trabajoUpdates[key] = value;
            }
        }

        // Actualizar trabajo si hay cambios
        if (Object.keys(trabajoUpdates).length > 0) {
            const { error } = await supabase
                .from("trabajos")
                .update({
                    ...trabajoUpdates,
                    updated_at: new Date().toISOString()
                })
                .eq("id", trabajo.id);

            if (error) throw error;
        }

        /****************************************
         * PACIENTE
         ****************************************/
        if (changes.paciente) {
            const paciente = { ...changes.paciente };

            console.log("Changes paciente ----->", paciente);
            
            // Solo procesar si hay campos definidos
            const hasValidData = Object.values(paciente).some(v => v !== undefined && v !== null);
            
            if (hasValidData) {
                if (paciente.edad !== undefined) {
                    paciente.fecha_nacimiento = birthDateFromAge(Number(paciente.edad));
                    delete paciente.edad;
                }

                await upsertRelation({
                    table: "pacientes",
                    foreignKey: "paciente_id",
                    trabajoId: trabajo.id,
                    currentId: trabajo.paciente_id,
                    incomingId: paciente.id ?? null,
                    values: paciente,
                });
            }
        }

        /****************************************
         * PIEZAS
         ****************************************/
        if (changes.piezas !== undefined) {
            const piezas = Array.isArray(changes.piezas) ? changes.piezas : [];
            
            // Solo procesar si hay piezas
            if (piezas.length > 0) {
                const rows = piezas.map((pieza: PieceDraftInput) => {
                    const colores = Array.isArray(pieza?.colores)
                        ? pieza.colores
                            .map((color) => color?.code ?? "")
                            .filter(Boolean)
                            .join(",")
                        : "";

                    const paletteValue = (() => {
                        const palette = pieza?.colores?.[0]?.paletteType;
                        if (palette === "VITA_3D") return "VITA_3D";
                        if (palette === "OTRO") {
                            return pieza?.colores?.[0]?.customPalette || "OTRO";
                        }
                        return "VITA_CLASSIC";
                    })();

                    const subTipo = pieza?.subTipo ?? null;
                    const conexion =
                        subTipo === "ATORNILLADA" ? "ATORNILLADA"
                        : subTipo === "CEMENTADA" ? "CEMENTADA"
                        : pieza?.tipo === "CORONA_IMPLANTE" &&
                          (pieza?.tiBase?.platformHeight != null ||
                           pieza?.tiBase?.diameter != null ||
                           pieza?.tiBase?.gingivalHeight != null) ? "ATORNILLADA"
                        : "NONE";

                    return {
                        numero: pieza?.numero ?? null,
                        paleta: paletteValue,
                        colores,
                        tipo: pieza?.tipo ?? null,
                        tibase_cementado: pieza?.tiBase?.platformHeight ?? null,
                        tibase_plataforma: pieza?.tiBase?.diameter ?? null,
                        tibase_gingival: pieza?.tiBase?.gingivalHeight ?? null,
                        conexion,
                    };
                });

                await replaceTrabajoPiezas(trabajo.id, rows);
            } else {
                // Si no hay piezas, eliminar todas
                const { error: deleteError } = await supabase
                    .from("piezas")
                    .delete()
                    .eq("trabajo_id", trabajo.id);
                    
                if (deleteError) throw deleteError;
            }
        }

        // Obtener el trabajo actualizado para retornar
        const { data: updatedTrabajo, error: fetchError } = await supabase
            .from("trabajos")
            .select(`
                id,
                paciente_id,
                profile_id,
                updated_at,
                pacientes: paciente_id (*),
                piezas (*)
            `)
            .eq("id", trabajo.id)
            .single();

        if (fetchError) {
            console.error("Error fetching updated trabajo:", fetchError);
        }

        return NextResponse.json({
            ok: true,
            data: updatedTrabajo || null,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error en autoguardado:", error);

        const message = error instanceof Error
            ? error.message
            : "Error interno del servidor";

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}