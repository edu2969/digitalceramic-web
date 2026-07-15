// app/api/trabajos/confirmar/route.ts
import { NextResponse } from "next/server";
import { createClient as createSessionClient } from "@/lib/supabase/server";
import { validateTrabajo } from "@/lib/orders/validateTrabajo";
import { calcularMontoTotal } from "@/lib/calculos";

export const runtime = "nodejs";

function bad(
    message: string,
    status = 400,
    errors?: string[]
) {
    return NextResponse.json(
        {
            success: false,
            error: message,
            errors,
        },
        {
            status,
        }
    );
}

export async function POST(req: Request) {
    try {
        const supabase = await createSessionClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return bad("No hay sesión activa", 401);
        }

        const body = await req.json();
        const { trabajoId } = body;

        if (!trabajoId || typeof trabajoId !== "string") {
            return bad("trabajoId requerido");
        }

        // 1. Validar el trabajo completo
        const validation = await validateTrabajo({
            trabajoId,
            userId: user.id,
        });

        if (!validation.valid) {
            console.log("Errores:", validation.errors);
            return bad(
                "El trabajo contiene errores.",
                422,
                validation.errors
            );
        }

        // 2. Verificar que el trabajo está en estado BORRADOR
        if (validation.trabajo.estado !== "BORRADOR") {
            return bad(
                `El trabajo está en estado "${validation.trabajo.estado}". Solo se pueden confirmar trabajos en estado "BORRADOR".`,
                422
            );
        }

        // 3. Calcular el monto: las primeras 10 piezas del histórico del
        //    odontólogo van con descuento; el resto, a precio normal.
        const perfilId = validation.trabajo.profile?.id;
        const piezasNuevas = validation.trabajo.piezas.length;

        let piezasYaRealizadas = 0;
        if (perfilId) {
            const { data: trabajosPrevios } = await supabase
                .from("trabajos")
                .select("id")
                .eq("profile_id", perfilId)
                .neq("id", trabajoId);

            if (trabajosPrevios && trabajosPrevios.length > 0) {
                const { count } = await supabase
                    .from("piezas")
                    .select("*", { count: "exact", head: true })
                    .in("trabajo_id", trabajosPrevios.map((t) => t.id));
                piezasYaRealizadas = count ?? 0;
            }
        }

        const monto = calcularMontoTotal(piezasYaRealizadas, piezasNuevas).montoTotal;

        // 4. Actualizar estado a PENDIENTE_PAGO + monto (sin fechas)
        const { error: updateError } = await supabase
            .from("trabajos")
            .update({
                estado: "PENDIENTE_PAGO",
                monto,
                updated_at: new Date().toISOString(),
            })
            .eq("id", trabajoId);

        if (updateError) {
            console.error("Error actualizando trabajo:", updateError);
            return bad("Error al actualizar el trabajo", 500);
        }

        // 4. Registrar en trabajo_historico_estados
        const { error: historicoError } = await supabase
            .from("trabajo_historico_estados")
            .insert({
                trabajo_id: trabajoId,
                estado: "PENDIENTE_PAGO",
                created_at: new Date().toISOString(),
                created_by: user.id,
            });

        if (historicoError) {
            console.error("Error registrando historico:", historicoError);
        }

        // 5. Actualizar el objeto de validación para el email
        validation.trabajo.estado = "PENDIENTE_PAGO";        

        return NextResponse.json({
            success: true,
            trabajoId,
            estado: "PENDIENTE_PAGO",
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: "Error al confirmar el trabajo.",
            },
            {
                status: 500,
            }
        );
    }
}