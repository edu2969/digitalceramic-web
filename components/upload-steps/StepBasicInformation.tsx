"use client"

import { useFormContext, useWatch } from "react-hook-form"
import {
  UploadFormValues,
  minDeliveryDate,
} from "@/components/upload-steps/types"

const inputClass =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none transition"
const labelClass = "block text-lg font-semibold text-[#1C4880] mb-3"

export default function StepBasicInformation() {
  const { register, control, formState } = useFormContext<UploadFormValues>()
  const receptionDate = useWatch({ control, name: "receptionDate" })
  const minDelivery = minDeliveryDate(receptionDate)
  const errors = formState.errors

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Nombre completo del paciente</label>
        <input
          type="text"
          placeholder="Ej: Juan Pérez"
          className={inputClass}
          {...register("patientName", { required: true })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Edad del paciente</label>
          <input
            type="number"
            min={0}
            max={120}
            placeholder="Ej: 35"
            className={inputClass}
            {...register("patientAge", {
              required: true,
              min: 0,
              max: 120,
            })}
          />
        </div>

        <div>
          <label className={labelClass}>Fecha de recepción</label>
          <input
            type="date"
            className={inputClass}
            {...register("receptionDate", { required: true })}
          />
        </div>

        <div>
          <label className={labelClass}>Fecha de entrega</label>
          <input
            type="date"
            min={minDelivery}
            className={inputClass}
            {...register("deliveryDate", {
              required: true,
              validate: (value) =>
                !receptionDate ||
                new Date(value) >= new Date(minDelivery) ||
                "La entrega debe ser al menos 7 días después de la recepción",
            })}
          />
          {errors.deliveryDate && (
            <p className="text-sm text-red-600 mt-1">
              {errors.deliveryDate.message?.toString() ||
                "Fecha de entrega inválida"}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Mínimo: {minDelivery || "selecciona recepción primero"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre del odontólogo</label>
          <input
            type="text"
            placeholder="Ej: Dra. María González"
            className={inputClass}
            {...register("dentistName", { required: true })}
          />
        </div>

        <div>
          <label className={labelClass}>RUT del odontólogo</label>
          <input
            type="text"
            placeholder="Ej: 12.345.678-9"
            className={inputClass}
            {...register("dentistRut", { required: true })}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Centro médico / clínica</label>
        <input
          type="text"
          placeholder="Ej: Clínica Dental Sonrisa"
          className={inputClass}
          {...register("medicalCenter", { required: true })}
        />
      </div>
    </div>
  )
}
