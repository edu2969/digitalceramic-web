// app/api/trabajos/iniciar/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createSessionClient } from "@/lib/supabase/server";
import { sendOrderEmail } from "@/lib/orders/sendOrderEmail";
import { TrabajoCompleto } from "@/lib/orders/validateTrabajo";

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

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string[] }> }
) {
    try {
        const supabase = await createSessionClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return bad("No hay sesión activa", 401);
        }

        const { id: idArray } = await params;
        const trabajoId = idArray?.[0];

        if (!trabajoId) {
            return bad("ID de trabajo requerido");
        }

        // 1. Verificar que el trabajo existe y pertenece al usuario
        const { data: trabajo, error: trabajoError } = await supabase
            .from("trabajos")
            .select(`
        id, 
        estado, 
        url_superior, 
        url_inferior, 
        url_mordida, 
        url_gingival, 
        archivo_superior, 
        archivo_inferior, 
        archivo_mordida, 
        archivo_gingival, 
        notas, 
        enviado_por,
        monto,
        nombre_clinica, 
        direccion_despacho,
        paciente:paciente_id (
            id, 
            nombre, 
            apellido, 
            fecha_nacimiento
        ),
        profile:profile_id (
            id, 
            nombre, 
            apellido
        )
    `)
            .eq("id", trabajoId)
            .single();

        if (trabajoError || !trabajo) {
            console.log("Error", trabajoError, trabajo)
            return bad("Trabajo no encontrado", 404);
        }

        const { data: perfil, error: errorPerfil } = await supabase
            .from("profiles")
            .select("id, user_id, user_role")
            .eq("user_id", user.id)
            .single();

        if (!perfil || perfil.user_role !== "ADMINISTRADOR") {
            console.log("[POST] marcarPago", errorPerfil);
            return bad("No permitido " + errorPerfil, 403);
        }

        // 2. Verificar que el estado actual permite el cambio
        if (trabajo.estado !== "PAGADO" && trabajo.estado !== "PENDIENTE_PAGO") {
            return bad(
                `No se puede iniciar un trabajo en estado "${trabajo.estado}". Debe estar en "PAGADO" o "PENDIENTE_PAGO".`,
                422
            );
        }

        // 3. Calcular fechas (si no existen)
        const ahora = new Date();
        const fechaEnvio = ahora.toISOString().split('T')[0];
        const fechaEntregaCalc = new Date(ahora);
        fechaEntregaCalc.setDate(fechaEntregaCalc.getDate() + 7);
        const fechaEntrega = fechaEntregaCalc.toISOString().split('T')[0];

        // 4. Actualizar el trabajo (estado + fechas si no existen)
        const { error: updateError } = await supabase
            .from("trabajos")
            .update({
                estado: "INICIADO",
                fecha_envio: fechaEnvio,
                fecha_entrega: fechaEntrega,
                updated_at: new Date().toISOString(),
            })
            .eq("id", trabajoId);

        if (updateError) {
            console.error("Error actualizando trabajo:", updateError);
            return bad("Error al actualizar el trabajo", 500);
        }

        // 5. Registrar en trabajo_historico_estados
        const { error: historicoError } = await supabase
            .from("trabajo_historico_estados")
            .insert({
                trabajo_id: trabajoId,
                estado: "INICIADO",
                created_at: new Date().toISOString()
            });

        if (historicoError) {
            console.error("Error registrando historico:", historicoError);
            // No fallamos la operación, solo logueamos el error
        }

        // 6. Obtener el trabajo actualizado
        const { data: trabajoActualizado, error: fetchError } = await supabase
            .from("trabajos")
            .select("*")
            .eq("id", trabajoId)
            .single();

        if (fetchError) {
            console.error("Error obteniendo trabajo actualizado:", fetchError);
        }

        // 7. Preparar payload email
        // 7.1 Obtener piezas del trabajo
        const { data: piezas, error: errorPiezas } = await supabase
            .from("piezas")
            .select("id, trabajo_id, numero, paleta, colores, tipo, tibase_cementado, tibase_plataforma, tibase_gingival, conexion")
            .eq("trabajo_id", trabajo.id);

        if (!piezas || errorPiezas) {
            console.log("Error al obtener piezas: ", errorPiezas);
            return bad("Error al obtener las piezas", 500);
        }

        // El monto ya fue calculado y persistido al confirmar el trabajo (commit),
        // así el correo coincide exactamente con lo mostrado al odontólogo.
        const monto = trabajoActualizado?.monto ?? 0;

        const pacienteData = Array.isArray(trabajo.paciente)
            ? trabajo.paciente[0]
            : trabajo.paciente;

        const profileData = Array.isArray(trabajo.profile)
            ? trabajo.profile[0]
            : trabajo.profile;

        // ✅ Construir payload con los datos correctos
        const payload: TrabajoCompleto = {
            id: trabajo.id,
            estado: trabajo.estado,
            fecha_envio: fechaEnvio || null,
            fecha_entrega: fechaEntrega || null,
            url_superior: trabajo.url_superior || null,
            url_inferior: trabajo.url_inferior || null,
            url_mordida: trabajo.url_mordida || null,
            url_gingival: trabajo.url_gingival || null,
            archivo_superior: trabajo.archivo_superior || null,
            archivo_inferior: trabajo.archivo_inferior || null,
            archivo_mordida: trabajo.archivo_mordida || null,
            archivo_gingival: trabajo.archivo_gingival || null,
            notas: trabajo.notas || null,
            monto: trabajo.monto || 0,
            enviado_por: trabajo.enviado_por || null,
            centro_medico: trabajo.nombre_clinica,
            direccion_despacho: trabajo.direccion_despacho,

            paciente: pacienteData ? {
                id: pacienteData.id,
                nombre: pacienteData.nombre || null,
                apellido: pacienteData.apellido || null,
                fecha_nacimiento: pacienteData.fecha_nacimiento || null,
            } : null,

            profile: profileData ? {
                id: profileData.id,
                nombre: profileData.nombre || null,
                apellido: profileData.apellido || null
            } : null,

            piezas: (piezas || []).map((pieza: any) => ({
                id: pieza.id,
                numero: pieza.numero || null,
                tipo: pieza.tipo || null,
                paleta: pieza.paleta || null,
                colores: pieza.colores || null,
                tibase_cementado: pieza.tibase_cementado || null,
                tibase_plataforma: pieza.tibase_plataforma || null,
                tibase_gingival: pieza.tibase_gingival || null,
                conexion: pieza.conexion || null,
            })),
        };

        // 8. Enviar correo
        try {
            await sendOrderEmail(payload);
        } catch (error) {
            console.error("Error enviando correo:", error);
            // No fallamos la operación si el correo falla
        }

        return NextResponse.json({
            success: true,
            trabajoId,
            estado: "INICIADO",
            fecha_envio: fechaEnvio,
            fecha_entrega: fechaEntrega,
            trabajo: trabajoActualizado || null,
        });

    } catch (error) {
        console.error("Error al iniciar trabajo:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Error al iniciar el trabajo.",
            },
            {
                status: 500,
            }
        );
    }
}