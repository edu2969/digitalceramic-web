"use client"

import { Fragment } from "react"
import { useFormContext, useFieldArray, useWatch, Controller } from "react-hook-form"
import {
  UploadFormValues,
  PieceConfig,
  ColorSelection,
  PaletteType,
  VITA_CLASSIC_CODES,
  VITA_3D_MASTER_CODES,
  TIBASE_GINGIVAL_HEIGHTS,
  TIBASE_DIAMETERS,
  TIBASE_PLATFORM_HEIGHTS,
  PIECE_TYPE_OPTIONS,
  materialForPieceType,
  getFdiForGridIndex,
  emptyPieceConfig,
  emptyColorSection,
} from "@/components/upload-steps/types"

const SECTION_LABELS: Record<number, string[]> = {
  1: ["Color"],
  2: ["Incisal", "Cervical"],
  3: ["Incisal", "Medio", "Cervical"],
}

export default function StepPieceSelection() {
  const { control, register, setValue } = useFormContext<UploadFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pieces",
    keyName: "_key",
  })

  const watchedPieces = useWatch({ control, name: "pieces" }) ?? []

  const togglePiece = (gridIndex: number) => {
    const pieceId = getFdiForGridIndex(gridIndex)
    const existingIdx = fields.findIndex((f) => f.gridIndex === gridIndex)
    if (existingIdx >= 0) {
      remove(existingIdx)
    } else {
      append(emptyPieceConfig(pieceId, gridIndex))
    }
  }

  const orderedFieldIndices = fields
    .map((f, idx) => ({ idx, gridIndex: f.gridIndex }))
    .sort((a, b) => a.gridIndex - b.gridIndex)

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-[#1C4880] mb-6">
          Selecciona la pieza que deseas (notación FDI)
        </h3>
        <div className="grid grid-cols-8 md:grid-cols-16 gap-3">
          {Array.from({ length: 32 }, (_, gridIndex) => {
            const row = gridIndex < 16 ? 1 : 2
            const col = (gridIndex % 16) + 1
            const fdiId = getFdiForGridIndex(gridIndex)
            const imagePath = `/dental_layout/row-${row}-column-${col}.png`
            const isSelected = fields.some((f) => f.gridIndex === gridIndex)

            return (
              <button
                key={gridIndex}
                type="button"
                onClick={() => togglePiece(gridIndex)}
                className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-[#1C4880] shadow-lg"
                    : "border-gray-200 hover:border-[#1C4880]"
                }`}
                style={{ aspectRatio: "1 / 2" }}
              >
                <img
                  src={imagePath}
                  alt={`Pieza FDI ${fdiId}`}
                  className={`w-full h-full object-cover transition-opacity ${
                    isSelected ? "opacity-100" : "opacity-70 hover:opacity-85"
                  }`}
                />
                <span className="absolute bottom-1 left-1 right-1 text-[10px] font-semibold text-center text-white bg-black/50 rounded">
                  {fdiId}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {fields.length === 0 && (
        <p className="text-gray-500 italic">
          Selecciona al menos una pieza para configurar su especificación.
        </p>
      )}

      {orderedFieldIndices.map(({ idx, gridIndex }) => {
        // Usamos gridIndex (posición FDI, única e inmutable por pieza) como key.
        // El _key de useFieldArray se regenera en cada setValue anidado dentro de
        // "pieces", lo que remontaría todas las PieceCard y resetearía el scroll.
        return (
          <PieceCard
            key={gridIndex}
            index={idx}
            piece={watchedPieces[idx] as PieceConfig | undefined}
            register={register}
            control={control}
            setValue={setValue}
          />
        )
      })}
    </div>
  )
}

type PieceCardProps = {
  index: number
  piece: PieceConfig | undefined
  register: ReturnType<typeof useFormContext<UploadFormValues>>["register"]
  control: ReturnType<typeof useFormContext<UploadFormValues>>["control"]
  setValue: ReturnType<typeof useFormContext<UploadFormValues>>["setValue"]
}

function PieceCard({ index, piece, register, control, setValue }: PieceCardProps) {
  if (!piece) return null
  const basePath = `pieces.${index}` as const
  const type = piece.type
  const subType = piece.subType
  const count = piece.colorSectionCount ?? 1

  const handleTypeChange = (newType: PieceConfig["type"]) => {
    setValue(`${basePath}.type`, newType, { shouldDirty: true })
    if (newType !== "CORONA_IMPLANTE") {
      setValue(`${basePath}.subType`, "", { shouldDirty: true })
      setValue(`${basePath}.tiBase`, null, { shouldDirty: true })
    }
  }

  const handleSubTypeChange = (newSub: PieceConfig["subType"]) => {
    setValue(`${basePath}.subType`, newSub, { shouldDirty: true })
    if (newSub !== "ATORNILLADA") {
      setValue(`${basePath}.tiBase`, null, { shouldDirty: true })
    }
  }

  const handleSectionCountChange = (next: 1 | 2 | 3) => {
    setValue(`${basePath}.colorSectionCount`, next, { shouldDirty: true })
    const current = piece.colors ?? []
    const resized: ColorSelection[] = Array.from(
      { length: next },
      (_, i) => current[i] ?? emptyColorSection(),
    )
    setValue(`${basePath}.colors`, resized, { shouldDirty: true })
  }

  const labels = SECTION_LABELS[count] ?? SECTION_LABELS[1]

  return (
    <div className="border-2 border-gray-200 rounded-xl p-5 space-y-5">
      <h4 className="text-lg font-bold text-[#1C4880]">
        Pieza FDI {piece.pieceId}
      </h4>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tipo de pieza
        </label>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <select
            value={type}
            onChange={(e) =>
              handleTypeChange(e.target.value as PieceConfig["type"])
            }
            className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none md:w-64"
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
                  handleSubTypeChange(opt.v as PieceConfig["subType"])
                }
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  subType === opt.v
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
              className={`px-4 py-2 rounded-lg font-medium transition ${
                count === n
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
            basePath={`${basePath}.colors.${i}` as const}
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

function TiBaseTable({
  basePath,
  current,
  setValue,
}: {
  basePath: `pieces.${number}`
  current: PieceConfig["tiBase"]
  setValue: ReturnType<typeof useFormContext<UploadFormValues>>["setValue"]
}) {
  const select = (gh: number, dia: number, plat: number) => {
    setValue(
      `${basePath}.tiBase`,
      { gingivalHeight: gh, diameter: dia, platformHeight: plat },
      { shouldDirty: true },
    )
  }

  const isActive = (gh: number, dia: number, plat: number) =>
    !!current &&
    current.gingivalHeight === gh &&
    current.diameter === dia &&
    current.platformHeight === plat

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        TiBase — selecciona plataforma (fila), cementado (grupo) y altura gingival (columna)
         
      </p>
      <div className="overflow-x-auto">
        <table className="border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-10" />

              <th className="px-3 py-0 text-gray-500 text-lg leading-none">
                ∅
              </th>

              {TIBASE_GINGIVAL_HEIGHTS.map((gh) => (
                <th
                  key={gh}
                  className="px-3 py-0 border border-gray-300 bg-gray-100 font-semibold text-gray-700 leading-none"
                >
                  {gh} mm
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIBASE_PLATFORM_HEIGHTS.map((plat, gIdx) => (
              <Fragment key={`group-${plat}`}>
                {TIBASE_DIAMETERS.map((dia, diaIdx) => (
                  <tr key={`${plat}-${dia}`}>
                    {/* Altura de muñón (platformHeight) vertical, una vez cada 2 filas */}
                    {diaIdx === 0 && (
                      <td
                        rowSpan={TIBASE_DIAMETERS.length}
                        className={`
                border border-gray-300
                relative
                min-w-10.5
                ${gIdx === 0
                            ? "bg-blue-50 text-[#1C4880]"
                            : "bg-amber-50 text-amber-800"
                          }
              `}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="-rotate-90 whitespace-nowrap text-xs font-bold tracking-wide">
                            {plat} mm
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Plataforma (diámetro ∅) */}
                    <th className="px-3 py-0 border border-gray-300 bg-gray-100 font-semibold text-gray-700 leading-none whitespace-nowrap">
                      {dia}
                    </th>

                    {/* Gingival */}
                    {TIBASE_GINGIVAL_HEIGHTS.map((gh) => {
                      const active = isActive(gh, dia, plat)

                      return (
                        <td
                          key={`${plat}-${dia}-${gh}`}
                          className="border border-gray-300 p-0"
                        >
                          <button
                            type="button"
                            onClick={() => select(gh, dia, plat)}
                            className={`w-full h-7 leading-none transition ${active
                                ? "bg-[#1C4880] text-white"
                                : "hover:bg-blue-50"
                              }`}
                          >
                            {active ? "✓" : ""}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {current && (
        <div className="mt-4 rounded-lg border-2 border-[#1C4880] bg-[#1C4880] text-white px-4 py-3 shadow-md">
          <p className="text-[10px] uppercase tracking-widest opacity-80">
            Seleccionado
          </p>
          <p className="text-base font-semibold flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <span>
              Plataforma{" "}
              <span className="font-bold">∅ {current.diameter}</span>
            </span>
            <span aria-hidden="true" className="opacity-60">
              ·
            </span>
            <span>
              Cementado{" "}
              <span className="font-bold">{current.platformHeight} mm</span>
            </span>
            <span aria-hidden="true" className="opacity-60">
              ·
            </span>
            <span>
              Gingival{" "}
              <span className="font-bold">{current.gingivalHeight} mm</span>
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

function ColorSectionEditor({
  basePath,
  label,
  piece,
  colorIndex,
  register,
  control,
  setValue,
}: {
  basePath: `pieces.${number}.colors.${number}`
  label: string
  piece: PieceConfig
  colorIndex: number
  register: ReturnType<typeof useFormContext<UploadFormValues>>["register"]
  control: ReturnType<typeof useFormContext<UploadFormValues>>["control"]
  setValue: ReturnType<typeof useFormContext<UploadFormValues>>["setValue"]
}) {
  const color = piece.colors?.[colorIndex] ?? emptyColorSection()
  const paletteType = color.paletteType

  const codesForPalette =
    paletteType === "VITA_CLASSIC"
      ? VITA_CLASSIC_CODES
      : paletteType === "VITA_3D"
      ? VITA_3D_MASTER_CODES
      : []

  const handlePaletteChange = (next: PaletteType) => {
    setValue(`${basePath}.paletteType`, next, { shouldDirty: true })
    setValue(`${basePath}.code`, "", { shouldDirty: true })
    if (next !== "OTRO") {
      setValue(`${basePath}.customPalette`, "", { shouldDirty: true })
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
      <p className="text-sm font-semibold text-gray-700">Tercio {label}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Controller
          control={control}
          name={`${basePath}.paletteType`}
          render={({ field }) => (
            <select
              value={field.value}
              onChange={(e) => handlePaletteChange(e.target.value as PaletteType)}
              className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none"
            >
              <option value="VITA_CLASSIC">VITA Classic</option>
              <option value="VITA_3D">VITA 3D Master</option>
              <option value="OTRO">Otro</option>
            </select>
          )}
        />

        {paletteType === "OTRO" ? (
          <input
            type="text"
            placeholder="Nombre paleta"
            className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none"
            {...register(`${basePath}.customPalette`, { required: true })}
          />
        ) : (
          <select
            className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none"
            {...register(`${basePath}.code`, { required: true })}
          >
            <option value="">-- Código --</option>
            {codesForPalette.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {paletteType === "OTRO" && (
          <input
            type="text"
            placeholder="Código color"
            className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none"
            {...register(`${basePath}.code`, { required: true })}
          />
        )}
      </div>
    </div>
  )
}
