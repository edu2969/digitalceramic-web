// lib/orders/validateTrabajo.ts

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Params = {
  trabajoId: string;
  userId: string;
};

export type TrabajoCompleto = {
  id: string;
  estado: string;
  fecha_envio: string | null;
  fecha_entrega: string | null;
  url_superior: string | null;
  url_inferior: string | null;
  url_mordida: string | null;
  url_gingival: string | null;
  archivo_superior: string | null;
  archivo_inferior: string | null;
  archivo_mordida: string | null;
  archivo_gingival: string | null;
  notas: string | null;
  monto: number | null;
  centro_medico: string | null;
  direccion_despacho: string | null;
  enviado_por: string | null;

  paciente: {
    id: string;
    nombre: string | null;
    apellido: string | null;
    fecha_nacimiento: string | null;
  } | null;

  profile: {
    id: string;
    nombre: string | null;
    apellido: string | null;
  } | null;

  piezas: {
    id: string;
    numero: number | null;
    tipo: string | null;
    paleta: string | null;
    colores: string | null;
    tibase_cementado: number | null;
    tibase_plataforma: number | null;
    tibase_gingival: number | null;
    conexion: string | null;
  }[];
};

export type ValidationResult =
  | {
      valid: true;
      trabajo: TrabajoCompleto;
    }
  | {
      valid: false;
      errors: string[];
    };

export async function validateTrabajo({
  trabajoId,
  userId,
}: Params): Promise<ValidationResult> {
  const errors: string[] = [];

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (profileError || !profile) {
    return {
      valid: false,
      errors: ["Perfil no encontrado."],
    };
  }

  const { data: trabajo, error } = await supabase
    .from("trabajos")
    .select(`
      *,
      paciente:pacientes(*),
      profile:profiles(*),
      piezas(*)
    `)
    .eq("id", trabajoId)
    .single<TrabajoCompleto>();

  if (error || !trabajo) {
    return {
      valid: false,
      errors: ["Trabajo no encontrado."],
    };
  }

  if (trabajo.profile?.id !== profile.id) {
    return {
      valid: false,
      errors: ["No autorizado."],
    };
  }

  if (trabajo.estado !== "BORRADOR")
    errors.push(`El trabajo está en estado ${trabajo.estado}.`);

  if (!trabajo.paciente)
    errors.push("Debe seleccionar un paciente.");

  if (
    trabajo.fecha_envio &&
    trabajo.fecha_entrega &&
    new Date(trabajo.fecha_entrega) < new Date(trabajo.fecha_envio)
  ) {
    errors.push("La fecha de entrega no puede ser anterior a la recepción.");
  }

  if (!trabajo.url_superior)
    errors.push("Debe subir el archivo superior.");

  if (!trabajo.url_inferior)
    errors.push("Debe subir el archivo inferior.");

  if (trabajo.piezas.length === 0) {
    errors.push("Debe agregar al menos una pieza.");
  }

  for (const pieza of trabajo.piezas) {
    if (!pieza.numero)
      errors.push("Existe una pieza sin número.");

    if (!pieza.tipo)
      errors.push(`La pieza ${pieza.numero} no tiene tipo.`);

    if (!pieza.paleta)
      errors.push(`La pieza ${pieza.numero} no tiene paleta.`);

    if (!pieza.colores)
      errors.push(`La pieza ${pieza.numero} no tiene colores.`);

    if (
      pieza.tipo === "CORONA_IMPLANTE" && pieza.conexion === "ATORNILLADA" &&
      (
        pieza.tibase_cementado == null ||
        pieza.tibase_plataforma == null ||
        pieza.tibase_gingival == null
      )
    ) {
      errors.push(
        `La pieza ${pieza.numero} tiene TiBase incompleta.`
      );
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    trabajo,
  };
}