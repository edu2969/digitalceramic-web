import { NextResponse } from "next/server";

import { createClient as createSessionClient } from "@/lib/supabase/server";

import { validateTrabajo } from "@/lib/orders/validateTrabajo";
import { updateTrabajoEstado } from "@/lib/orders/updateTrabajoEstado";
import { sendOrderEmail } from "@/lib/orders/sendOrderEmail";

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
        const sessionClient = await createSessionClient();

        const {
            data: { user },
        } = await sessionClient.auth.getUser();

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
            console.log("Errores?!", validation.errors);
            return bad(
                "El trabajo contiene errores.",
                422,
                validation.errors
            );
        }

        await updateTrabajoEstado({
            trabajoId,
            estado: "PENDIENTE_PAGO",
        });

        validation.trabajo.estado = "PENDIENTE_PAGO";

        try {
            await sendOrderEmail(validation.trabajo);
        } catch (error) {
            console.error("Error enviando correo:", error);
        }

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