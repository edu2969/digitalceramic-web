import { useCallback } from "react"
import { PieceCardProps } from "./types"
import { ColorSelection, emptyColorSection, getFdiForGridIndex, materialForPieceType, PIECE_TYPE_OPTIONS, PiezaConfig } from "../types"
import ColorSectionEditor from "./ColorSectionEditor"
import TiBaseTable from "./TiBaseTable"

const SECTION_LABELS: Record<number, string[]> = {
  1: ["Color"],
  2: ["Incisal", "Cervical"],
  3: ["Incisal", "Medio", "Cervical"],
}

export default function PieceCard({
  index,
  piece,
  register,
  control,
  setValue,
  warnings,
  recommendations
}: PieceCardProps) {
  const basePath = `piezas.${index}` as const

  // Solo actualizamos el form; el guardado lo dispara el useEffect de
  // StepPieceSelection que observa "piezas" y persiste el array completo.
  const savePieceChange = useCallback((path: string, value: unknown) => {
    const fullPath = `${basePath}.${path}`
    setValue(fullPath as any, value, { shouldDirty: true })
  }, [basePath, setValue])

  if (!piece) return null
  const type = piece.tipo
  const subType = piece.subTipo
  const count = piece.cantidadColores ?? 1
  const hasWarnings = warnings.length > 0

  const handleTypeChange = (newType: PiezaConfig["tipo"]) => {
    savePieceChange("tipo", newType)
    if (newType !== "CORONA_IMPLANTE") {
      savePieceChange("subTipo", "")
      savePieceChange("tiBase", null)
    }
  }

  const handleSubTypeChange = (newSub: PiezaConfig["subTipo"]) => {
    savePieceChange("subTipo", newSub)
    if (newSub !== "ATORNILLADA") {
      savePieceChange("tiBase", null)
    }
  }

  const handleSectionCountChange = (next: 1 | 2 | 3) => {
    savePieceChange("cantidadColores", next)
    const current = piece.colores ?? []
    const resized: ColorSelection[] = Array.from(
      { length: next },
      (_, i) => current[i] ?? emptyColorSection(),
    )
    savePieceChange("colores", resized)
  }

  const labels = SECTION_LABELS[count] ?? SECTION_LABELS[1]

  return (
    <div className={`border-2 rounded-xl p-5 space-y-5 transition-all ${hasWarnings ? "border-amber-400 bg-amber-50/50" : "border-gray-200"
      }`}>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-[#1C4880]">
          Pieza FDI {getFdiForGridIndex(piece.numero)}
        </h4>
        {hasWarnings && (
          <span className="flex items-center gap-2 text-amber-600 text-sm font-semibold">
            <span className="text-lg">💡</span>
            Recomendación disponible
          </span>
        )}
      </div>

      {hasWarnings && (
        <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 space-y-3">
          <div className="space-y-2">
            <p className="text-amber-800 font-semibold text-sm flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              Consideraciones clínicas
            </p>
            <ul className="space-y-1">
              {warnings.map((warning, idx) => (
                <li key={idx} className="text-amber-700 text-sm">
                  {warning}
                </li>
              ))}
            </ul>
          </div>

          {recommendations.length > 0 && (
            <div className="border-t border-amber-200 pt-2 mt-2">
              <p className="text-amber-800 font-semibold text-sm flex items-center gap-2">
                <span className="text-lg">💡</span>
                Recomendaciones
              </p>
              <ul className="space-y-1 mt-1">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="text-amber-700 text-sm">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white/50 rounded p-2 mt-2">
            <p className="text-amber-600 text-xs">
              ℹ️ Puedes mantener esta selección si consideras que es clínicamente adecuada.
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tipo de pieza
        </label>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <select
            value={type}
            onChange={(e) =>
              handleTypeChange(e.target.value as PiezaConfig["tipo"])
            }
            className={`px-3 py-2 border-2 rounded-lg focus:border-[#1C4880] focus:outline-none md:w-64 ${hasWarnings ? "border-amber-400" : "border-gray-300"
              }`}
          >
            <option value="">-- Selecciona --</option>
            {PIECE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {type && (
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-[#1C4880] font-semibold">
              Material: {materialForPieceType(type)}
            </div>
          )}
        </div>
      </div>

      {type === "CORONA_IMPLANTE" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sub-tipo
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { v: "CEMENTADA", l: "Cementada" },
              { v: "ATORNILLADA", l: "Atornillada" },
            ].map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() =>
                  handleSubTypeChange(opt.v as PiezaConfig["subTipo"])
                }
                className={`px-4 py-2 rounded-lg font-medium transition ${subType === opt.v
                    ? "bg-[#1C4880] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {type === "CORONA_IMPLANTE" && subType === "ATORNILLADA" && (
        <TiBaseTable
          basePath={basePath}
          current={piece.tiBase}
          setValue={setValue}
        />
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Secciones de color
        </label>
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleSectionCountChange(n as 1 | 2 | 3)}
              className={`px-4 py-2 rounded-lg font-medium transition ${count === n
                  ? "bg-[#1C4880] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: count }, (_, i) => (
          <ColorSectionEditor
            key={i}
            basePath={`${basePath}.colores.${i}` as const}
            label={labels[i] ?? `Color ${i + 1}`}
            piece={piece}
            colorIndex={i}
            register={register}
            control={control}
            setValue={setValue}
          />
        ))}
      </div>
    </div>
  )
}