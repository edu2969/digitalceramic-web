import { Fragment } from "react/jsx-runtime"
import { PiezaConfig, TIBASE_DIAMETERS, TIBASE_GINGIVAL_HEIGHTS, TIBASE_PLATFORM_HEIGHTS, UploadFormValues } from "../types"
import { useFormContext } from "react-hook-form"

export default function TiBaseTable({
  basePath,
  current,
  setValue,
}: {
  basePath: `piezas.${number}`
  current: PiezaConfig["tiBase"]
  setValue: ReturnType<typeof useFormContext<UploadFormValues>>["setValue"]
}) {
  // El guardado lo dispara el useEffect de StepPieceSelection (observa "piezas").
  const select = (gh: number, dia: number, plat: number) => {
    const tiBase = { gingivalHeight: gh, diameter: dia, platformHeight: plat }
    const fullPath = `${basePath}.tiBase`
    setValue(fullPath as any, tiBase, { shouldDirty: true })
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
                    <th className="px-3 py-0 border border-gray-300 bg-gray-100 font-semibold text-gray-700 leading-none whitespace-nowrap">
                      {dia}
                    </th>
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
              Plataforma <span className="font-bold">∅ {current.diameter}</span>
            </span>
            <span aria-hidden="true" className="opacity-60">·</span>
            <span>
              Cementado <span className="font-bold">{current.platformHeight} mm</span>
            </span>
            <span aria-hidden="true" className="opacity-60">·</span>
            <span>
              Gingival <span className="font-bold">{current.gingivalHeight} mm</span>
            </span>
          </p>
        </div>
      )}
    </div>
  )
}