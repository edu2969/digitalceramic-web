import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createSessionClient } from "@/lib/supabase/server";

const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type RelationOptions = {
    table: "pacientes" | "clinica";
    foreignKey: "paciente_id" | "clinica_id";
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
    )
        .toISOString()
        .substring(0, 10);
}

function normalizeTrabajoChanges(changes: Record<string, unknown>) {
    const trabajoChanges = changes.trabajo;

    if (!trabajoChanges || typeof trabajoChanges !== "object" || Array.isArray(trabajoChanges)) {
        return {};
    }

    return Object.fromEntries(
        Object.entries(trabajoChanges as Record<string, unknown>).map(([key, value]) => [
            key === "notes" ? "notas" : key,
            value,
        ])
    );
}

async function replaceTrabajoPiezas(
    trabajoId: string,
    piezas: Array<Record<string, unknown>>
) {
    const { error: deleteError } = await adminSupabase
        .from("piezas")
        .delete()
        .eq("trabajo_id", trabajoId);

    if (deleteError) throw deleteError;

    if (!piezas.length) return;

    const { error: insertError } = await adminSupabase
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

    if (relationId) {

        const { error } = await adminSupabase
            .from(table)
            .update(data)
            .eq("id", relationId);

        if (error) throw error;

        if (relationId !== currentId) {

            const { error: trabajoError } = await adminSupabase
                .from("trabajos")
                .update({
                    [foreignKey]: relationId,
                })
                .eq("id", trabajoId);

            if (trabajoError) throw trabajoError;

        }

        return relationId;

    }

    const { data: inserted, error } = await adminSupabase
        .from(table)
        .insert(data)
        .select("id")
        .single();

    if (error) throw error;

    const { error: trabajoError } = await adminSupabase
        .from("trabajos")
        .update({
            [foreignKey]: inserted.id,
        })
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

        const { id, changes } = await req.json();

        console.log("ID", id);
        console.log("Changes", changes);

        if (!id) {
            return NextResponse.json(
                { error: "Id requerido" },
                { status: 400 }
            );
        }

        const { data: trabajo, error: trabajoError } = await supabase
            .from("trabajos")
            .select(`
                id,
                paciente_id,
                clinica_id,
                profile_id
            `)
            .eq("id", id)
            .single();

        if (trabajoError || !trabajo) {
            return NextResponse.json(
                { error: "Trabajo no encontrado" },
                { status: 404 }
            );
        }

        /****************************************
         * TRABAJO
         ****************************************/

        const rawChanges = changes as Record<string, unknown>;

        const trabajoUpdates: Record<string, unknown> = {};
        const normalizedTrabajoChanges = normalizeTrabajoChanges(rawChanges);

        if (Object.keys(normalizedTrabajoChanges).length) {

            const { error } = await adminSupabase
                .from("trabajos")
                .update(normalizedTrabajoChanges)
                .eq("id", trabajo.id);

            if (error) throw error;

        }

        for (const [sourceField, targetField] of [
            ["enviado_por", "enviado_por"],
            ["fecha_envio", "fecha_envio"],
            ["fecha_entrega", "fecha_entrega"],
            ["url_superior", "url_superior"],
            ["url_inferior", "url_inferior"],
            ["url_mordida", "url_mordida"],
            ["url_gingival", "url_gingival"],
            ["fileSuperior", "url_superior"],
            ["fileInferior", "url_inferior"],
            ["fileMordida", "url_mordida"],
            ["fileGingival", "url_gingival"],
            ["notas", "notas"],
            ["notes", "notas"],
        ] as const) {
            if (rawChanges[sourceField] !== undefined) {
                trabajoUpdates[targetField] = rawChanges[sourceField] ?? null;
            }
        }

        if (Object.keys(trabajoUpdates).length) {
            const { error } = await adminSupabase
                .from("trabajos")
                .update(trabajoUpdates)
                .eq("id", trabajo.id);

            if (error) throw error;
        }

        /****************************************
         * PACIENTE
         ****************************************/

        if (changes.paciente) {

            const paciente = { ...changes.paciente };

            if (paciente.edad !== undefined) {

                paciente.fecha_nacimiento = birthDateFromAge(
                    Number(paciente.edad)
                );

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

        /****************************************
         * CLINICA
         ****************************************/

        if (changes.clinica) {

            await upsertRelation({
                table: "clinica",
                foreignKey: "clinica_id",
                trabajoId: trabajo.id,
                currentId: trabajo.clinica_id,
                incomingId: changes.clinica.id ?? null,
                values: changes.clinica,
            });

        }

        /****************************************
         * PIEZAS
         ****************************************/

        if (changes.piezas !== undefined) {
            const piezas = Array.isArray(changes.piezas) ? changes.piezas : [];
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
                    subTipo === "ATORNILLADA"
                        ? "ATORNILLADA"
                        : subTipo === "CEMENTADA"
                            ? "CEMENTADA"
                            : pieza?.tipo === "CORONA_IMPLANTE" &&
                                (pieza?.tiBase?.platformHeight != null ||
                                    pieza?.tiBase?.diameter != null ||
                                    pieza?.tiBase?.gingivalHeight != null)
                                ? "ATORNILLADA"
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
        }

        return NextResponse.json({
            ok: true,
        });

    } catch (error) {

        console.error(error);

        const message =
            error instanceof Error
                ? error.message
                : "Error interno del servidor";

        return NextResponse.json(
            {
                error: message,
            },
            {
                status: 500,
            }
        );

    }

}