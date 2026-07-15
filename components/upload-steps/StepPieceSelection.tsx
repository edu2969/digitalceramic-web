"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import { useFormContext, useFieldArray, useWatch } from "react-hook-form"
import {
  UploadFormValues,
  PiezaConfig,
  getFdiForGridIndex,
  emptyPieceConfig,
} from "@/components/upload-steps/types"
import { usePieceAutoSave } from "../form/hooks/usePieceAutoSave"
import PieceCard from "./pieces/PieceCard"

// Función para obtener las piezas contiguas
const getAdjacentPieces = (gridIndex: number): number[] => {
  const row = gridIndex < 16 ? 0 : 1 // 0: maxilar, 1: mandibular
  const col = gridIndex % 16

  const adjacents: number[] = []

  // Misma fila, columna izquierda
  if (col > 0) {
    adjacents.push(row * 16 + (col - 1))
  }
  // Misma fila, columna derecha
  if (col < 15) {
    adjacents.push(row * 16 + (col + 1))
  }

  return adjacents
}

// Verificar si una pieza está en un extremo de la mandíbula
const isExtremePiece = (gridIndex: number): boolean => {
  const col = gridIndex % 16
  return col === 0 || col === 15
}

export default function StepPieceSelection() {
  const { control, register, setValue, getValues } = useFormContext<UploadFormValues>()
  const { saveField } = usePieceAutoSave(500)

  const { fields, append, remove } = useFieldArray({
    control,
    name: "piezas",
    keyName: "_key",
  })

  const watchedPieces = useWatch({ control, name: "piezas" }) ?? []
  const lastSavedRef = useRef<string>('')
  const isInitialLoadRef = useRef(true)

  // Obtener todos los índices de piezas seleccionadas
  const selectedGridIndices = useMemo(() => {
    return fields.map(f => f.numero)
  }, [fields])

  // Validar cada pieza seleccionada (solo informativo)
  const validationWarnings = useMemo(() => {
    const warnings: Record<number, string[]> = {}

    fields.forEach((field) => {
      const gridIndex = field.numero
      const piece = watchedPieces.find(p => p.numero === gridIndex)
      if (!piece) return

      const type = piece.tipo
      const warningsForPiece: string[] = []

      // Advertencia para PÓNTICO
      if (type === "PONTICO") {
        // Verificar si es extremo
        if (isExtremePiece(gridIndex)) {
          warningsForPiece.push(
            "⚠️ Un póntico en un extremo requiere un diseño especial. Considera usar un cantilever o corona."
          )
        }

        // Verificar piezas contiguas
        const adjacents = getAdjacentPieces(gridIndex)
        const adjacentsSelected = adjacents.filter(adj =>
          selectedGridIndices.includes(adj)
        )

        if (adjacentsSelected.length === 0) {
          warningsForPiece.push(
            "⚠️ No hay piezas contiguas seleccionadas. Un póntico requiere soporte de piezas adyacentes."
          )
        } else if (adjacentsSelected.length === 1) {
          warningsForPiece.push(
            "⚠️ Solo hay una pieza contigua seleccionada. Un póntico necesita soporte bilateral para mayor estabilidad."
          )
        }
      }

      // Advertencia para CANTILEVER
      if (type === "CANTILEVER") {
        // Verificar si tiene al menos una pieza contigua
        const adjacents = getAdjacentPieces(gridIndex)
        const hasAdjacent = adjacents.some(adj =>
          selectedGridIndices.includes(adj)
        )

        if (!hasAdjacent) {
          warningsForPiece.push(
            "⚠️ No hay piezas contiguas seleccionadas. Un cantilever requiere al menos una pieza de soporte."
          )
        }
      }

      // Advertencia para ausencia de selección
      if (!type) {
        warningsForPiece.push(
          "ℹ️ Selecciona el tipo de pieza para continuar con la configuración."
        )
      }

      if (warningsForPiece.length > 0) {
        warnings[gridIndex] = warningsForPiece
      }
    })

    return warnings
  }, [fields, watchedPieces, selectedGridIndices])

  // Obtener recomendaciones de tipo para cada pieza (sugerencias, no restricciones)
  const getTypeRecommendations = useCallback((gridIndex: number): string[] => {
    const recommendations: string[] = []
    const isExtreme = isExtremePiece(gridIndex)
    const adjacents = getAdjacentPieces(gridIndex)
    const adjacentsSelected = adjacents.filter(adj => selectedGridIndices.includes(adj))

    if (isExtreme) {
      recommendations.push("💡 Para piezas en extremos, se recomienda CORONA o CANTILEVER")
    }

    if (adjacentsSelected.length === 0) {
      recommendations.push("💡 Sin piezas contiguas, solo es posible CORONA o IMPLANTE")
    } else if (adjacentsSelected.length === 1) {
      recommendations.push("💡 Con una pieza contigua, puedes usar CORONA, IMPLANTE o CANTILEVER")
    } else {
      recommendations.push("💡 Con soporte bilateral, todos los tipos son posibles")
    }

    return recommendations
  }, [selectedGridIndices])

  useEffect(() => {
    // Saltar la carga inicial
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false
      lastSavedRef.current = JSON.stringify(getValues("piezas") || [])
      return
    }

    const pieces = getValues("piezas")
    if (!pieces) return

    const currentHash = JSON.stringify(pieces)
    if (currentHash === lastSavedRef.current) return

    lastSavedRef.current = currentHash
    saveField("piezas", pieces)
  }, [watchedPieces, saveField, getValues])

  const togglePiece = useCallback((gridIndex: number) => {
    const pieceId = getFdiForGridIndex(gridIndex)
    const existingIdx = fields.findIndex((f) => f.numero === gridIndex)

    if (existingIdx >= 0) {
      remove(existingIdx)
    } else {
      const newPiece = emptyPieceConfig(pieceId, gridIndex)
      append(newPiece)
    }

    // No guardamos aquí: append/remove modifican "piezas", lo que dispara el
    // useEffect que observa watchedPieces y persiste el array completo.
  }, [fields, remove, append])

  const orderedFieldIndices = fields
    .map((f, idx) => ({ idx, gridIndex: f.numero }))
    .sort((a, b) => a.idx - b.idx)

  const hasWarnings = Object.keys(validationWarnings).length > 0

  return (
    <div className="space-y-8">
      {hasWarnings && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-4">
          <h4 className="text-amber-800 font-semibold mb-2 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Recomendaciones clínicas
          </h4>
          <p className="text-amber-700 text-sm mb-3">
            Estas son sugerencias basadas en principios protésicos. Puedes continuar con tu selección si consideras que es clínicamente adecuada.
          </p>
          <ul className="space-y-2">
            {Object.entries(validationWarnings).map(([gridIndex, warnings]) => (
              <li key={gridIndex} className="text-amber-700">
                <span className="font-bold">Pieza FDI {getFdiForGridIndex(Number(gridIndex))}:</span>
                <ul className="ml-4 list-disc">
                  {warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold text-[#1C4880] mb-6">
          Selecciona la pieza que deseas (notación FDI)
        </h3>
        <div className="grid grid-cols-8 md:grid-cols-16 gap-1">
          {Array.from({ length: 32 }, (_, gridIndex) => {
            const row = gridIndex < 16 ? 1 : 2
            const col = (gridIndex % 16) + 1
            const fdiId = getFdiForGridIndex(gridIndex)
            const isSelected = fields.some((f) => f.numero === gridIndex)
            const hasWarning = validationWarnings[gridIndex]?.length > 0

            // Construir la ruta de la imagen con sufijo _on si está seleccionada
            const baseImagePath = `/dental_layout/row-${row}-column-${col}`
            const imagePath = isSelected
              ? `${baseImagePath}_2_on.png`
              : `${baseImagePath}_2.png`

            return (
              <button
                key={gridIndex}
                type="button"
                onClick={() => togglePiece(gridIndex)}
                className={`
            relative overflow-hidden
            border-2 rounded-lg transition-all
            flex flex-col
            ${isSelected
                    ? hasWarning
                      ? "border-amber-500 shadow-lg shadow-amber-200"
                      : "border-[#1C4880] shadow-lg"
                    : "border-gray-200 hover:border-[#1C4880]"
                  }
          `}
              >
                {/* Contenedor de la imagen - aspecto 1:1 */}
                <div
                  className={`
              relative w-full
              transition-opacity duration-200 h-16
              ${isSelected ? "opacity-100" : "opacity-80 hover:opacity-95"}
            `}
                >
                  <img
                    src={imagePath}
                    alt={`Pieza FDI ${fdiId}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay de advertencia */}
                  {hasWarning && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center pointer-events-none">
                      <span className="text-amber-600 text-2xl font-bold drop-shadow-md">
                        ?
                      </span>
                    </div>
                  )}
                </div>

                {/* Etiqueta del nombre - solo altura del texto */}
                <div
                  className={`
              w-full px-1 text-center
              transition-colors
              ${isSelected
                      ? hasWarning
                        ? "border-amber-500 bg-amber-100 text-amber-800"
                        : "text-[#16213E]"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                    }
            `}
                >
                  <span className="text-[12px] font-bold tracking-wide leading-none">
                    {fdiId}
                  </span>
                </div>
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
        return (
          <PieceCard
            key={gridIndex}
            index={idx}
            piece={watchedPieces[idx] as PiezaConfig | undefined}
            register={register}
            control={control}
            setValue={setValue}
            warnings={validationWarnings[gridIndex] || []}
            recommendations={getTypeRecommendations(gridIndex)}
          />
        )
      })}
    </div>
  )
}





