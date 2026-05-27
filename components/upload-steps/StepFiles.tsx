"use client"

import React, { useRef, useState } from "react"
import { MdClose } from "react-icons/md"
import { useFormContext, useWatch } from "react-hook-form"
import { UploadFormValues } from "@/components/upload-steps/types"

const VALID_3D_EXTENSIONS = ["stl", "obj", "step", "stp", "ply"]

type Slot = {
  name: "fileSuperior" | "fileInferior" | "fileMordida" | "fileGingival"
  label: string
  optional?: boolean
}

const SLOTS: Slot[] = [
  { name: "fileSuperior", label: "Superior" },
  { name: "fileInferior", label: "Inferior" },
  { name: "fileMordida", label: "Mordida", optional: true },
  { name: "fileGingival", label: "Gingival", optional: true },
]

export default function StepFiles() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-[#1C4880]">
        Carga tus archivos 3D
      </h3>
      <p className="text-sm text-gray-500">
        Formatos válidos: {VALID_3D_EXTENSIONS.join(", ")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SLOTS.map((slot) => (
          <FileSlot key={slot.name} slot={slot} />
        ))}
      </div>
    </div>
  )
}

function FileSlot({ slot }: { slot: Slot }) {
  const { setValue, control } = useFormContext<UploadFormValues>()
  const file = useWatch({ control, name: slot.name })
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0]
    if (!next) return
    const ext = next.name.split(".").pop()?.toLowerCase()
    if (!ext || !VALID_3D_EXTENSIONS.includes(ext)) {
      setError(`Extensión no válida. Usa: ${VALID_3D_EXTENSIONS.join(", ")}`)
      setValue(slot.name, null, { shouldDirty: true, shouldValidate: true })
      return
    }
    setError("")
    setValue(slot.name, next, { shouldDirty: true, shouldValidate: true })
  }

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setError("")
    setValue(slot.name, null, { shouldDirty: true, shouldValidate: true })
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
      {file && !error && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={`Quitar archivo ${slot.label}`}
          className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition"
        >
          <MdClose className="w-4 h-4" />
        </button>
      )}

      <label className="cursor-pointer flex flex-col items-center gap-3 text-center">
        <span className="text-[#1C4880] text-4xl">⤓</span>
        <p className="font-semibold text-gray-700">
          {slot.label}
          {slot.optional && (
            <span className="ml-1 text-xs font-normal text-gray-400">
              (opcional)
            </span>
          )}
        </p>
        <p className="text-xs text-gray-500">Click o arrastra archivo</p>
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          accept=".stl,.obj,.step,.stp,.ply"
          className="hidden"
        />
      </label>

      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {file && !error && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
          <p className="text-green-700 font-semibold truncate">✓ {file.name}</p>
          <p className="text-green-600 text-xs">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}
    </div>
  )
}
