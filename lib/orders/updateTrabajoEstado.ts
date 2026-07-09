// lib/orders/updateTrabajoEstado.ts

import { createClient as createSessionClient } from "@/lib/supabase/server"

export type TrabajoEstado =
  | "CREADO"
  | "PENDIENTE_PAGO"
  | "PAGADO"
  | "EN_PRODUCCION"
  | "TERMINADO"
  | "ENVIADO"
  | "CANCELADO";

type Params = {
  trabajoId: string;
  estado: TrabajoEstado;
};

export async function updateTrabajoEstado({
  trabajoId,
  estado,
}: Params): Promise<void> {
  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("trabajos")
    .update({
      estado,
    })
    .eq("id", trabajoId);

  if (error) {
    throw error;
  }
}