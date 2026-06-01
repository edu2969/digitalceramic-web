"use client"

import { useCallback, useEffect } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import Autocomplete from "@/components/upload-steps/Autocomplete"
import {
  UploadFormValues,
  minDeliveryDate,
} from "@/components/upload-steps/types"

const inputClass =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none transition"
const labelClass = "block text-lg font-semibold text-[#1C4880] mb-3"

type ProfileResponse = {
  profile: {
    nombre: string | null
    apellido: string | null
    centroMedico: string | null
    numeroRegistro: string | null
  } | null
}

async function fetchProfile(): Promise<ProfileResponse> {
  const res = await fetch("/api/profile/me")
  if (!res.ok) throw new Error("Error cargando perfil")
  return res.json()
}

async function searchPacientes(q: string) {
  const url = q ? `/api/pacientes?q=${encodeURIComponent(q)}` : "/api/pacientes"
  const res = await fetch(url)
  if (!res.ok) return []
  const json = (await res.json()) as {
    pacientes: { id: string; nombre: string; apellido: string | null }[]
  }
  return json.pacientes.map((p) => ({
    id: p.id,
    label: `${p.nombre} ${p.apellido ?? ""}`.trim(),
    sublabel: undefined,
  }))
}

async function searchClinicas(q: string) {
  const url = q ? `/api/clinicas?q=${encodeURIComponent(q)}` : "/api/clinicas"
  const res = await fetch(url)
  if (!res.ok) return []
  const json = (await res.json()) as {
    clinicas: { id: string; nombre: string; direccion: string | null }[]
  }
  return json.clinicas.map((c) => ({
    id: c.id,
    label: c.nombre,
    sublabel: c.direccion ?? undefined,
  }))
}

export default function StepBasicInformation() {
  const { register, control, setValue, formState } =
    useFormContext<UploadFormValues>()
  const receptionDate = useWatch({ control, name: "receptionDate" })
  const minDelivery = minDeliveryDate(receptionDate)
  const errors = formState.errors

  const { data: profileData } = useQuery({
    queryKey: ["profile-me"],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  })

  const profile = profileData?.profile

  useEffect(() => {
    if (!profile) return
    if (profile.nombre || profile.apellido) {
      const full = `${profile.nombre ?? ""} ${profile.apellido ?? ""}`.trim()
      setValue("dentistName", full, { shouldValidate: true })
    }
    if (profile.numeroRegistro) {
      setValue("dentistRegistry", profile.numeroRegistro, {
        shouldValidate: true,
      })
    }
    if (profile.centroMedico) {
      setValue("medicalCenter", profile.centroMedico, {
        shouldValidate: true,
      })
    }
  }, [profile, setValue])

  const handlePatientSelect = useCallback(
    (option: { id: string; label: string } | null) => {
      setValue("patientId", option?.id ?? null, { shouldValidate: true })
    },
    [setValue]
  )

  const handleClinicSelect = useCallback(
    (option: { id: string; label: string } | null) => {
      setValue("clinicId", option?.id ?? null, { shouldValidate: true })
    },
    [setValue]
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre del paciente</label>
          <Controller
            control={control}
            name="patientName"
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                value={field.value ?? ""}
                onChange={field.onChange}
                onSelect={handlePatientSelect}
                fetchOptions={searchPacientes}
                placeholder="Ej: Juan"
                className={inputClass}
              />
            )}
          />
          <p className="text-xs text-gray-500 mt-1">
            Selecciona uno existente o se creará uno nuevo al enviar.
          </p>
        </div>

        <div>
          <label className={labelClass}>Apellido del paciente</label>
          <input
            type="text"
            placeholder="Ej: Pérez"
            className={inputClass}
            {...register("patientLastName")}
          />
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Número de registro</label>
          <input
            type="text"
            placeholder="Tu número de registro"
            className={inputClass}
            {...register("dentistRegistry", { required: true })}
            readOnly={!!profile?.numeroRegistro}
          />
          {!profile?.numeroRegistro && (
            <p className="text-xs text-gray-500 mt-1">
              Se guardará en tu perfil al enviar el caso.
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Centro médico / clínica</label>
          <Controller
            control={control}
            name="medicalCenter"
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                value={field.value ?? ""}
                onChange={field.onChange}
                onSelect={handleClinicSelect}
                fetchOptions={searchClinicas}
                placeholder="Ej: Clínica Dental Sonrisa"
                className={inputClass}
              />
            )}
          />
          <p className="text-xs text-gray-500 mt-1">
            Selecciona una existente o se creará una nueva al enviar.
          </p>
        </div>
      </div>
    </div>
  )
}
