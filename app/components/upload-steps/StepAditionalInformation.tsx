"use client"

import React, { useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { UploadFormValues } from "@/app/components/upload-steps/types"

export default function StepAditionalInformation() {
  const { register, setValue, control } = useFormContext<UploadFormValues>()
  const photos = useWatch({ control, name: "photos" }) ?? []

  const previews = useMemo(
    () =>
      photos.map((photo) => ({
        file: photo,
        url: URL.createObjectURL(photo),
      })),
    [photos],
  )

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [previews])

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))
    if (imageFiles.length) {
      setValue("photos", [...photos, ...imageFiles], {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }

  const handleRemovePhoto = (index: number) => {
    setValue(
      "photos",
      photos.filter((_, i) => i !== index),
      { shouldDirty: true, shouldValidate: true },
    )
  }

  return (
    <div>
      <label className="block text-lg font-semibold text-[#1C4880] mb-3">
        Fotos y Notas
      </label>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
            >
              <img
                src={preview.url}
                alt={`Foto ${index + 1}`}
                className="object-cover w-full h-32"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 mb-6">
        <label className="cursor-pointer flex flex-col items-center gap-4 text-center">
          <span className="text-[#1C4880] text-4xl">📷</span>
          <div>
            <p className="font-semibold text-gray-700">Sube fotos de tu caso</p>
            <p className="text-sm text-gray-500 mt-1">
              Al menos una foto es obligatoria. Puedes adjuntar varias imágenes en JPG o PNG.
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </div>

      <textarea
        placeholder="Ingresa cualquier observación o nota importante sobre tu caso..."
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none resize-none"
        rows={6}
        {...register("notes")}
      />
    </div>
  )
}
