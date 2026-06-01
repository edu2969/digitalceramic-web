export type PaletteType = "VITA_CLASSIC" | "VITA_3D" | "OTRO"

export type ColorSelection = {
  paletteType: PaletteType
  customPalette: string
  code: string
}

export type PieceType =
  | ""
  | "INLAY"
  | "ONLAY"
  | "CARILLA"
  | "CORONA"
  | "CORONA_IMPLANTE"
export type PieceSubType = "" | "CEMENTADA" | "ATORNILLADA"

export const PIECE_TYPE_OPTIONS: { value: Exclude<PieceType, "">; label: string }[] = [
  { value: "INLAY", label: "Inlay" },
  { value: "ONLAY", label: "Onlay" },
  { value: "CARILLA", label: "Carilla" },
  { value: "CORONA", label: "Corona" },
  { value: "CORONA_IMPLANTE", label: "Corona sobre implante" },
]

export function materialForPieceType(type: PieceType): string {
  if (!type) return ""
  return type === "CORONA_IMPLANTE" ? "Zirconia" : "Disilicato"
}

export type TiBase = {
  gingivalHeight: number
  diameter: number
  platformHeight: number
} | null

export type PieceConfig = {
  pieceId: string
  gridIndex: number
  type: PieceType
  subType: PieceSubType
  tiBase: TiBase
  colorSectionCount: 1 | 2 | 3
  colors: ColorSelection[]
}

export type UploadFormValues = {
  patientId: string | null
  patientName: string
  patientLastName: string
  patientAge: string
  receptionDate: string
  deliveryDate: string
  dentistName: string
  dentistRut: string
  dentistRegistry: string
  clinicId: string | null
  medicalCenter: string
  pieces: PieceConfig[]
  notes: string
  photos: File[]
  fileSuperior: File | null
  fileInferior: File | null
  fileMordida: File | null
  fileGingival: File | null
}

export const VITA_CLASSIC_CODES = [
  "A1", "A2", "A3", "A3.5", "A4",
  "B1", "B2", "B3", "B4",
  "C1", "C2", "C3", "C4",
  "D2", "D3", "D4",
]

export const VITA_3D_MASTER_CODES = [
  "0M1", "0M2", "0M3",
  "1M1", "1M2",
  "2L1.5", "2L2.5", "2M1", "2M2", "2M3", "2R1.5", "2R2.5",
  "3L1.5", "3L2.5", "3M1", "3M2", "3M3", "3R1.5", "3R2.5",
  "4L1.5", "4L2.5", "4M1", "4M2", "4M3", "4R1.5", "4R2.5",
  "5M1", "5M2", "5M3",
]

export const TIBASE_GINGIVAL_HEIGHTS = [0.8, 1.5, 2.5, 3.5, 4.5]
export const TIBASE_DIAMETERS = [3.5, 4.5, 5.5]
export const TIBASE_PLATFORM_HEIGHTS = [4, 6]

export function getFdiForGridIndex(index: number): string {
  if (index < 8) {
    return `1.${8 - index}`
  }
  if (index < 16) {
    return `2.${index - 7}`
  }
  if (index < 24) {
    return `4.${24 - index}`
  }
  return `3.${index - 23}`
}

export function emptyColorSection(): ColorSelection {
  return { paletteType: "VITA_CLASSIC", customPalette: "", code: "" }
}

export function emptyPieceConfig(pieceId: string, gridIndex: number): PieceConfig {
  return {
    pieceId,
    gridIndex,
    type: "",
    subType: "",
    tiBase: null,
    colorSectionCount: 1,
    colors: [emptyColorSection()],
  }
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function minDeliveryDate(receptionISO: string): string {
  if (!receptionISO) return ""
  const reception = new Date(receptionISO)
  if (Number.isNaN(reception.getTime())) return ""
  return toISODate(addDays(reception, 8))
}
