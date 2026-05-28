export type Estado = "CRE" | "INI" | "DEV" | "ANU" | "FIN" | "REC" | "TRA"

export const ESTADO_LABEL: Record<Estado, string> = {
  CRE: "En espera",
  INI: "En proceso",
  FIN: "Terminado",
  TRA: "Enviado",
  REC: "Recibido",
  DEV: "Devuelto",
  ANU: "Anulado",
}

export const ESTADO_BADGE: Record<Estado, string> = {
  CRE: "bg-slate-100 text-slate-700 border-slate-200",
  INI: "bg-blue-50 text-[#1C4880] border-blue-200",
  FIN: "bg-emerald-50 text-emerald-700 border-emerald-200",
  TRA: "bg-indigo-50 text-indigo-700 border-indigo-200",
  REC: "bg-teal-50 text-teal-700 border-teal-200",
  DEV: "bg-orange-50 text-orange-700 border-orange-200",
  ANU: "bg-gray-100 text-gray-600 border-gray-200",
}

export function isEstado(value: unknown): value is Estado {
  return (
    value === "CRE" ||
    value === "INI" ||
    value === "DEV" ||
    value === "ANU" ||
    value === "FIN" ||
    value === "REC" ||
    value === "TRA"
  )
}
