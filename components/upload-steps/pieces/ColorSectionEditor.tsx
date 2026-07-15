import { Controller, useFormContext } from "react-hook-form"
import { emptyColorSection, PaletteType, PiezaConfig, UploadFormValues, VITA_3D_MASTER_CODES, VITA_CLASSIC_CODES } from "../types"

export default function ColorSectionEditor({
  basePath,
  label,
  piece,
  colorIndex,
  register,
  control,
  setValue,
}: {
  basePath: `piezas.${number}.colores.${number}`
  label: string
  piece: PiezaConfig
  colorIndex: number
  register: ReturnType<typeof useFormContext<UploadFormValues>>["register"]
  control: ReturnType<typeof useFormContext<UploadFormValues>>["control"]
  setValue: ReturnType<typeof useFormContext<UploadFormValues>>["setValue"]
}) {
  const color = piece.colores?.[colorIndex] ?? emptyColorSection()
  const paletteType = color.paletteType

  const codesForPalette =
    paletteType === "VITA_CLASSIC"
      ? VITA_CLASSIC_CODES
      : paletteType === "VITA_3D"
        ? VITA_3D_MASTER_CODES
        : []

  // El guardado lo dispara el useEffect de StepPieceSelection que observa
  // "piezas" y persiste el array completo. Aquí solo actualizamos el form.
  const handlePaletteChange = (next: PaletteType) => {
    setValue(`${basePath}.paletteType`, next, { shouldDirty: true })
    setValue(`${basePath}.code`, "", { shouldDirty: true })
    if (next !== "OTRO") {
      setValue(`${basePath}.customPalette`, "", { shouldDirty: true })
    }
  }

  const handleInputChange = (field: string, value: unknown) => {
    const fullPath = `${basePath}.${field}`
    setValue(fullPath as any, value, { shouldDirty: true })
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
            {...register(`${basePath}.customPalette`, {
              required: true,
              onChange: (e) => handleInputChange("customPalette", e.target.value)
            })}
          />
        ) : (
          <select
            className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none"
            {...register(`${basePath}.code`, {
              required: true,
              onChange: (e) => handleInputChange("code", e.target.value)
            })}
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
            {...register(`${basePath}.code`, {
              required: true,
              onChange: (e) => handleInputChange("code", e.target.value)
            })}
          />
        )}
      </div>
    </div>
  )
}