// app/api/trabajos/confirmar/route.ts
import { NextResponse } from "next/server";
import { createClient as createSessionClient } from "@/lib/supabase/server";
import { TrabajoCompleto, validateTrabajo } from "@/lib/orders/validateTrabajo";
import { calcularMontoTotal } from "@/lib/calculos";
import { sendOrdenReceptionMail } from "@/lib/orders/sendOrdenReceptionMail";

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
                created_at: new Date().toISOString()
            });

        if (historicoError) {
            console.error("Error registrando historico:", historicoError);
        }

        // 5. Actualizar el objeto de validación para el email
        validation.trabajo.estado = "PENDIENTE_PAGO";


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
        
                // 3. Calcular fechas (si no existen)
                const ahora = new Date();
                const fechaEnvio = ahora.toISOString().split('T')[0];
                const fechaEntregaCalc = new Date(ahora);
                fechaEntregaCalc.setDate(fechaEntregaCalc.getDate() + 7);
                const fechaEntrega = fechaEntregaCalc.toISOString().split('T')[0];                

                const { data: piezas, error: errorPiezas } = await supabase
                    .from("piezas")
                    .select("id, trabajo_id, numero, paleta, colores, tipo, tibase_cementado, tibase_plataforma, tibase_gingival, conexion")
                    .eq("trabajo_id", trabajo.id);
        
                if (!piezas || errorPiezas) {
                    console.log("Error al obtener piezas: ", errorPiezas);
                    return bad("Error al obtener las piezas", 500);
                }
        
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

        const senderEmail = user.email || "";
        
        try {
            console.log("SENDER", senderEmail);
            console.log("HTML", payload)
            await sendOrdenReceptionMail(senderEmail, payload);
        } catch (error) {
            console.error("Error enviando correo:", error);
            // No fallamos la operación si el correo falla
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