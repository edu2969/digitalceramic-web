"use client"

import React, { useRef, useState, useCallback, useEffect } from "react"
import { MdClose } from "react-icons/md"
import { useFormContext, useWatch } from "react-hook-form"
import { UploadFormValues } from "@/components/upload-steps/types"
import { useAutoSaveContext } from "../form/provider/AutoSaveProvider"

const VALID_3D_EXTENSIONS = ["stl", "obj", "step", "stp", "ply"]

const SLOT_TO_URL_FIELD: Record<"fileSuperior" | "fileInferior" | "fileMordida" | "fileGingival", string> = {
  fileSuperior: "url_superior",
  fileInferior: "url_inferior",
  fileMordida: "url_mordida",
  fileGingival: "url_gingival",
}

const SLOT_TO_FORM_URL_FIELD: Record<"fileSuperior" | "fileInferior" | "fileMordida" | "fileGingival", `fileUrls.${"superior" | "inferior" | "mordida" | "gingival"}`> = {
  fileSuperior: "fileUrls.superior",
  fileInferior: "fileUrls.inferior",
  fileMordida: "fileUrls.mordida",
  fileGingival: "fileUrls.gingival",
}

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

// Hook personalizado para manejar el progreso de upload
function useUploadProgress() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'complete' | 'error'>('idle')
  const [estimatedTime, setEstimatedTime] = useState('')
  const [uploadedSize, setUploadedSize] = useState(0)
  const [totalSize, setTotalSize] = useState(0)
  const startTimeRef = useRef<number>(0)
  const lastProgressRef = useRef<number>(0)

  const startUpload = useCallback((total: number) => {
    setStatus('uploading')
    setProgress(0)
    setTotalSize(total)
    setUploadedSize(0)
    setEstimatedTime('Calculando...')
    startTimeRef.current = Date.now()
    lastProgressRef.current = 0
  }, [])

  const updateProgress = useCallback((uploaded: number) => {
    const progressPercent = totalSize > 0 ? Math.round((uploaded / totalSize) * 100) : 0
    setProgress(progressPercent)
    setUploadedSize(uploaded)

    // Calcular tiempo estimado
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    if (uploaded > 0 && progressPercent > 0) {
      const remaining = (elapsed / progressPercent) * (100 - progressPercent)
      
      if (remaining > 0) {
        if (remaining < 60) {
          setEstimatedTime(`${Math.round(remaining)}s`)
        } else if (remaining < 3600) {
          const mins = Math.floor(remaining / 60)
          const secs = Math.round(remaining % 60)
          setEstimatedTime(`${mins}m ${secs}s`)
        } else {
          const hours = Math.floor(remaining / 3600)
          const mins = Math.round((remaining % 3600) / 60)
          setEstimatedTime(`${hours}h ${mins}m`)
        }
      }
    }
  }, [totalSize])

  const complete = useCallback(() => {
    setStatus('complete')
    setProgress(100)
    setEstimatedTime('Completado')
  }, [])

  const error = useCallback(() => {
    setStatus('error')
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setProgress(0)
    setEstimatedTime('')
    setUploadedSize(0)
    setTotalSize(0)
    startTimeRef.current = 0
    lastProgressRef.current = 0
  }, [])

  return {
    progress,
    status,
    estimatedTime,
    uploadedSize,
    totalSize,
    startUpload,
    updateProgress,
    complete,
    error,
    reset,
  }
}

// Componente de barra de progreso
function UploadProgress({ 
  progress, 
  status, 
  estimatedTime, 
  uploadedSize, 
  totalSize,
  fileName 
}: { 
  progress: number
  status: 'idle' | 'uploading' | 'complete' | 'error'
  estimatedTime: string
  uploadedSize: number
  totalSize: number
  fileName: string
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(prev => {
        if (prev < progress) {
          return Math.min(prev + 1, progress)
        }
        return prev
      })
    }, 30)
    return () => clearTimeout(timer)
  }, [progress])

  if (status === 'idle') return null

  const isComplete = status === 'complete'
  const isError = status === 'error'
  const isUploading = status === 'uploading'

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className="w-full bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {isComplete ? (
            <span className="text-green-500 text-xl">✅</span>
          ) : isError ? (
            <span className="text-red-500 text-xl">❌</span>
          ) : (
            <div className="w-5 h-5 border-2 border-[#1C4880] border-t-transparent rounded-full animate-spin" />
          )}
          <span className="font-semibold text-gray-700">
            {isComplete ? '¡Subida completada!' : 
             isError ? 'Error en la subida' : 
             `Subiendo: ${fileName}`}
          </span>
        </div>
        {isUploading && (
          <span className="text-sm font-semibold text-[#1C4880]">
            {progress}%
          </span>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-out rounded-full ${
            isComplete ? 'bg-green-500' :
            isError ? 'bg-red-500' :
            'bg-[#1C4880]'
          }`}
          style={{ width: `${animatedProgress}%` }}
        />
      </div>

      {/* Detalles */}
      {isUploading && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>
            <span className="text-gray-400">Subido:</span>
            <span className="ml-1 font-medium">
              {formatSize(uploadedSize)} / {formatSize(totalSize)}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Tiempo estimado:</span>
            <span className="ml-1 font-medium">{estimatedTime}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StepFiles({
  id
}: {
  id?: string;
}) {
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
  const { saveField } = useAutoSaveContext()
  const file = useWatch({ control, name: slot.name })
  const uploadedUrl = useWatch({ control, name: SLOT_TO_FORM_URL_FIELD[slot.name] })
  const [error, setError] = useState("")
  const [currentFileName, setCurrentFileName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Estado de progreso
  const {
    progress,
    status,
    estimatedTime,
    uploadedSize,
    totalSize,
    startUpload,
    updateProgress,
    complete,
    error: setUploadError,
    reset,
  } = useUploadProgress()

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0]
    if (!next) return

    const ext = next.name.split(".").pop()?.toLowerCase()
    if (!ext || !VALID_3D_EXTENSIONS.includes(ext)) {
      setError(`Extensión no válida. Usa: ${VALID_3D_EXTENSIONS.join(", ")}`)
      setValue(slot.name, null, { shouldDirty: true, shouldValidate: true })
      setValue(SLOT_TO_FORM_URL_FIELD[slot.name], null, { shouldDirty: true, shouldValidate: true })
      saveField(SLOT_TO_URL_FIELD[slot.name], null)
      return
    }

    setError("")
    setCurrentFileName(next.name)
    reset()
    startUpload(next.size)

    try {
      const signRes = await fetch("/api/upload-case/sign", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    files3d: [
      {
        slot: slot.name,
        name: next.name,
        size: next.size,
        type: next.type || "application/octet-stream",
      },
    ],
    photos: [],
  }),
})

if (!signRes.ok) {
  throw new Error("No se pudieron preparar las URLs de subida")
}

const signed = (await signRes.json()) as {
  bucket: string  // ← Añadir bucket al tipo
  files3d?: Array<{
    slot: Slot["name"]
    path: string
    signedUrl: string
    token: string
    downloadUrl?: string | null
  }>
}

const target = signed.files3d?.find((item) => item.slot === slot.name)
if (!target?.signedUrl) {
  throw new Error("No se recibió la URL de subida")
}

      // Subir con progreso usando XMLHttpRequest
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            updateProgress(event.loaded)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response)
          } else {
            reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Error de red al subir el archivo'))
        })

        xhr.addEventListener('abort', () => {
          reject(new Error('Subida cancelada'))
        })

        xhr.open('PUT', target.signedUrl)
        xhr.setRequestHeader('Content-Type', next.type || 'application/octet-stream')
        xhr.send(next)
      })

      // Obtener URL de descarga
      const downloadRes = await fetch("/api/upload-case/download-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: target.path,
          bucket: signed.bucket,
        }),
      })

      const downloadJson = await downloadRes.json().catch(() => ({})) as { signedUrl?: string }
      if (!downloadRes.ok || !downloadJson.signedUrl) {
        throw new Error("No se pudo obtener la URL de descarga")
      }

      complete()
      setValue(slot.name, next, { shouldDirty: true, shouldValidate: true })
      setValue(SLOT_TO_FORM_URL_FIELD[slot.name], downloadJson.signedUrl, { shouldDirty: true, shouldValidate: true })
      saveField(SLOT_TO_URL_FIELD[slot.name], downloadJson.signedUrl)

      // Resetear progreso después de 2 segundos
      setTimeout(reset, 2000)

    } catch (err) {
      console.error("Error subiendo archivo 3D", err)
      setUploadError()
      setError("No se pudo subir el archivo. Inténtalo de nuevo.")
      setValue(slot.name, null, { shouldDirty: true, shouldValidate: true })
      setValue(SLOT_TO_FORM_URL_FIELD[slot.name], null, { shouldDirty: true, shouldValidate: true })
      saveField(SLOT_TO_URL_FIELD[slot.name], null)
    } finally {
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setError("")
    reset()
    setValue(slot.name, null, { shouldDirty: true, shouldValidate: true })
    setValue(SLOT_TO_FORM_URL_FIELD[slot.name], null, { shouldDirty: true, shouldValidate: true })
    saveField(SLOT_TO_URL_FIELD[slot.name], null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const isUploading = status === 'uploading'

  return (
    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
      {/* Botón de limpiar */}
      {file && !error && !isUploading && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={`Quitar archivo ${slot.label}`}
          className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition"
        >
          <MdClose className="w-4 h-4" />
        </button>
      )}

      {/* Input oculto */}
      <label className={`cursor-pointer flex flex-col items-center gap-3 text-center ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
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
          disabled={isUploading}
        />
      </label>

      {/* Barra de progreso */}
      {status !== 'idle' && (
        <div className="mt-3">
          <UploadProgress
            progress={progress}
            status={status}
            estimatedTime={estimatedTime}
            uploadedSize={uploadedSize}
            totalSize={totalSize}
            fileName={currentFileName}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Archivo cargado (desde backend) */}
      {!file && uploadedUrl && !error && !isUploading && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
          <p className="text-blue-700 font-semibold">Archivo cargado</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-xs underline break-all"
          >
            Abrir archivo
          </a>
        </div>
      )}

      {/* Archivo local subido */}
      {file && !error && status !== 'uploading' && status !== 'idle' && (
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