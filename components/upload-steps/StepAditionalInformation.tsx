"use client";

import React, { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { UploadFormValues } from "@/components/upload-steps/types";
import { AutoTextarea } from "@/components/form";
import { useAutoSaveContext } from "../form/provider/AutoSaveProvider";

export default function StepAditionalInformation({
  id
}: {
  id?: string;
}) {
  const { setValue, control } = useFormContext<UploadFormValues>();
  const { saveField } = useAutoSaveContext();

  const photos = useWatch({ control, name: "photos" }) ?? [];

  const previews = useMemo(
    () =>
      photos.map((photo) => ({
        file: photo,
        url: URL.createObjectURL(photo),
      })),
    [photos]
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));

    if (!imageFiles.length) return;

    const nextPhotos = [...photos, ...imageFiles];
    setValue("photos", nextPhotos, {
      shouldDirty: true,
      shouldValidate: true,
    });
    saveField("photos", nextPhotos);
  };

  const handleRemovePhoto = (index: number) => {
    const nextPhotos = photos.filter((_, i) => i !== index);
    setValue(
      "photos",
      nextPhotos,
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
    saveField("photos", nextPhotos);
  };

  return (
    <div>

      <label className="block text-lg font-semibold text-[#1C4880] mb-3">
        Fotos y Notas
      </label>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">

          {previews.map((p, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
            >
              <img
                src={p.url}
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
            <p className="font-semibold text-gray-700">
              Sube fotos de tu caso
            </p>

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

      <AutoTextarea
        name="notes"
        label="Observaciones"
        placeholder="Ingresa cualquier observación o nota importante sobre tu caso..."
        rows={6}
      />

    </div>
  );
}