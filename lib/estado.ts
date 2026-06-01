export type Estado =
  | "CREADO"
  | "INICIADO"
  | "DEVUELTO"
  | "ANULADO"
  | "FINALIZADO"
  | "RECIBIDO"
  | "TRA"

export const ESTADO_LABEL: Record<Estado, string> = {
  CREADO: "En espera",
  INICIADO: "En proceso",
  FINALIZADO: "Terminado",
  TRA: "Enviado",
  RECIBIDO: "Recibido",
  DEVUELTO: "Devuelto",
  ANULADO: "Anulado",
}

export const ESTADO_BADGE: Record<Estado, string> = {
  CREADO: "bg-slate-100 text-slate-700 border-slate-200",
  INICIADO: "bg-blue-50 text-[#1C4880] border-blue-200",
  FINALIZADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  TRA: "bg-indigo-50 text-indigo-700 border-indigo-200",
  RECIBIDO: "bg-teal-50 text-teal-700 border-teal-200",
  DEVUELTO: "bg-orange-50 text-orange-700 border-orange-200",
  ANULADO: "bg-gray-100 text-gray-600 border-gray-200",
}

export function isEstado(value: unknown): value is Estado {
  return (
    value === "CREADO" ||
    value === "INICIADO" ||
    value === "DEVUELTO" ||
    value === "ANULADO" ||
    value === "FINALIZADO" ||
    value === "RECIBIDO" ||
    value === "TRA"
  )
}
