"use client"

import { useCallback, useEffect, useRef } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import Autocomplete from "@/components/prefabs/Autocomplete"
import {
  AutocompleteOption,
  UploadFormValues,
  minDeliveryDate,
} from "@/components/upload-steps/types"
import { useAutoSaveContext } from "../form/provider/AutoSaveProvider"

const inputClass =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none transition"
const labelClass = "block text-lg font-semibold text-[#1C4880] mb-3"

type ProfileResponse = {
  profile: {
    nombre: string | null
    apellido: string | null
    centroMedico: string | null
    numeroRegistro: string | null
    rut: string | null
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

export default function StepBasicInformation({
  id
}: {
  id?: string
}) {
  const {
    getValues,
    register,
    control,
    setValue,
    formState
  } = useFormContext<UploadFormValues>();

  const { saveField, flush } = useAutoSaveContext()
  const receptionDate = useWatch({ control, name: "fecha_envio" })
  const watchedPatientId = useWatch({ control, name: "paciente.id" })
  const minDelivery = minDeliveryDate(receptionDate)
  const errors = formState.errors
  const creatingPatientRef = useRef<string | null>(null)
  const hasConfirmedPatient = Boolean(
    watchedPatientId &&
      String(watchedPatientId).trim() &&
      !String(watchedPatientId).startsWith("temp_")
  )

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
      setValue("profile.nombre", full, { shouldValidate: true })
    }
    if (profile.numeroRegistro) {
      setValue("profile.numero_registro", profile.numeroRegistro, {
        shouldValidate: true,
      })
    }
    if (profile.rut) {
      setValue("profile.rut", profile.rut, {
        shouldValidate: true,
      })
      saveField("profile.rut", profile.rut)
    }
    if (profile.centroMedico) {
      setValue("clinica.nombre", profile.centroMedico, {
        shouldValidate: true,
      })
    }
  }, [profile, setValue])

  const savePatientState = useCallback(
    (overrides: Partial<UploadFormValues["paciente"]> = {}) => {
      const currentPatient = getValues("paciente")
      saveField("paciente", {
        id: currentPatient?.id ?? null,
        nombre: currentPatient?.nombre ?? null,
        apellido: currentPatient?.apellido ?? null,
        edad: currentPatient?.edad ?? null,
        ...overrides,
      })
    },
    [getValues, saveField]
  )

  const saveClinicState = useCallback(
    (overrides: Partial<UploadFormValues["clinica"]> = {}) => {
      const currentClinic = getValues("clinica")
      saveField("clinica", {
        id: currentClinic?.id ?? null,
        nombre: currentClinic?.nombre ?? null,
        ...overrides,
      })
    },
    [getValues, saveField]
  )

  const saveProfileState = useCallback(
    (overrides: Partial<UploadFormValues["profile"]> = {}) => {
      const currentProfile = getValues("profile")
      saveField("profile", {
        id: currentProfile?.id ?? null,
        nombre: currentProfile?.nombre ?? null,
        rut: currentProfile?.rut ?? null,
        numero_registro: currentProfile?.numero_registro ?? null,
        ...overrides,
      })
    },
    [getValues, saveField]
  )

  const handlePatientSelect = useCallback(
    (option: AutocompleteOption | null, searchText?: string) => {
      if (option) {
        const patientId = option.id;

        setValue("paciente.nombre", option.label, {
          shouldDirty: true,
          shouldValidate: true,
        });

        setValue("paciente.id", patientId as never, {
          shouldDirty: true,
          shouldValidate: true,
        });

        savePatientState({ id: patientId, nombre: option.label })
        void flush()
        return;
      }

      if (searchText && searchText.trim().length > 0) {
        const tempId = `temp_${Date.now()}`;

        setValue("paciente.nombre", searchText.trim(), {
          shouldDirty: true,
          shouldValidate: true,
        });

        setValue("paciente.id", tempId as never, {
          shouldDirty: true,
          shouldValidate: true,
        });

        savePatientState({ id: tempId, nombre: searchText.trim() })
        void flush()
      }
    },
    [savePatientState, setValue]
  );

  const createClinicFromName = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const currentId = getValues("clinica.id");
    if (currentId && !String(currentId).startsWith("temp_")) {
      return null;
    }

    if (creatingPatientRef.current === trimmed) {
      return null;
    }

    creatingPatientRef.current = trimmed;

    try {
      const searchRes = await fetch(`/api/clinicas?q=${encodeURIComponent(trimmed)}&limit=5`);
      if (searchRes.ok) {
        const existing = await searchRes.json() as { clinicas?: Array<{ id: string; nombre: string; direccion?: string | null }> };
        const match = existing.clinicas?.find((clinic) => clinic.nombre?.toLowerCase() === trimmed.toLowerCase());

        if (match?.id) {
          setValue("clinica.id", match.id, { shouldDirty: true, shouldValidate: true });
          setValue("clinica.nombre", match.nombre, { shouldDirty: true, shouldValidate: true });
          saveClinicState({ id: match.id, nombre: match.nombre })
          return match;
        }
      }

      const res = await fetch("/api/clinicas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: trimmed }),
      });

      if (!res.ok) {
        throw new Error("No se pudo crear la clínica");
      }

      const json = await res.json() as { clinica?: { id: string; nombre: string; direccion?: string | null } };
      const createdClinic = json.clinica;

      if (createdClinic?.id) {
        setValue("clinica.id", createdClinic.id, { shouldDirty: true, shouldValidate: true });
        setValue("clinica.nombre", createdClinic.nombre ?? trimmed, { shouldDirty: true, shouldValidate: true });
        saveClinicState({ id: createdClinic.id, nombre: createdClinic.nombre ?? trimmed })
        return createdClinic;
      }
    } catch (error) {
      console.error("Error creando clínica desde autocompletado", error);
      saveClinicState({ nombre: trimmed })
    } finally {
      creatingPatientRef.current = null;
    }

    return null;
  }, [getValues, saveClinicState, setValue]);

  const createPatientFromName = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const currentId = getValues("paciente.id");
    if (currentId && !String(currentId).startsWith("temp_")) {
      return null;
    }

    if (creatingPatientRef.current === trimmed) {
      return null;
    }

    creatingPatientRef.current = trimmed;

    try {
      const searchRes = await fetch(`/api/pacientes?q=${encodeURIComponent(trimmed)}&limit=5`);
      if (searchRes.ok) {
        const existing = await searchRes.json() as { pacientes?: Array<{ id: string; nombre: string; apellido?: string | null }> };
        const match = existing.pacientes?.find((patient) => {
          const fullName = `${patient.nombre ?? ""} ${patient.apellido ?? ""}`.trim().toLowerCase();
          return fullName === trimmed.toLowerCase();
        });

        if (match?.id) {
          setValue("paciente.id", match.id, {
            shouldDirty: true,
            shouldValidate: true,
          });
          savePatientState({ id: match.id, nombre: trimmed })
          void flush()
          return match;
        }
      }

      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: trimmed }),
      });

      if (!res.ok) {
        throw new Error("No se pudo crear el paciente");
      }

      const json = await res.json() as { paciente?: { id: string; nombre: string; apellido?: string | null } };
      const createdPatient = json.paciente;

      if (createdPatient?.id) {
        setValue("paciente.id", createdPatient.id, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue("paciente.nombre", createdPatient.nombre ?? trimmed, {
          shouldDirty: true,
          shouldValidate: true,
        });
        savePatientState({ id: createdPatient.id, nombre: createdPatient.nombre ?? trimmed })
        void flush()
        return createdPatient;
      }
    } catch (error) {
      console.error("Error creando paciente desde autocompletado", error);
      savePatientState({ nombre: trimmed })
    } finally {
      creatingPatientRef.current = null;
    }

    return null;
  }, [flush, getValues, savePatientState, setValue]);

  // ✅ AGREGAR función helper para auto-guardado
  const handleAutoSave = (fieldName: string, value: string | number) => {
    const nextValue = String(value)

    if (fieldName === "paciente.apellido") {
      setValue("paciente.apellido", nextValue, {
        shouldDirty: true,
        shouldValidate: true,
      })
      savePatientState({ apellido: nextValue })
      void flush()
      return
    }

    if (fieldName === "paciente.edad") {
      setValue("paciente.edad", nextValue, {
        shouldDirty: true,
        shouldValidate: true,
      })
      savePatientState({ edad: nextValue })
      void flush()
      return
    }

    if (fieldName === "profile.nombre") {
      saveProfileState({ nombre: nextValue })
      saveField("enviado_por", nextValue)
      return
    }

    if (fieldName === "profile.rut") {
      saveProfileState({ rut: nextValue })
      return
    }

    if (fieldName === "profile.numero_registro") {
      saveProfileState({ numero_registro: nextValue })
      return
    }

    saveField(fieldName, value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre del paciente</label>
          <Controller
            control={control}
            name="paciente.nombre"
            rules={{ required: "El nombre del paciente es requerido" }}
            render={({ field, fieldState }) => (
              <>
                <Autocomplete
                  value={field.value ?? ""}
                  onChange={(value) => {
                    field.onChange(value);

                    savePatientState({ nombre: value })

                    const currentId = getValues("paciente.id");
                    if (currentId && !currentId.toString().startsWith("temp_")) {
                      setValue("paciente.id", null, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                  }}
                  onSelect={(option) => {
                    handlePatientSelect(option, field.value ?? undefined);
                  }}
                  onBlur={(value) => {
                    void createPatientFromName(value);
                  }}
                  fetchOptions={searchPacientes}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none transition"
                />
                {fieldState.error && (
                  <p className="text-sm text-red-600 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
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
            disabled={!hasConfirmedPatient}
            {...register("paciente.apellido")}
            onChange={(e) => {
              const field = register("paciente.apellido")
              field.onChange(e)
              handleAutoSave("paciente.apellido", e.target.value)
            }}
            onBlur={(e) => handleAutoSave("paciente.apellido", e.target.value)}
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
            disabled={!hasConfirmedPatient}
            {...register("paciente.edad", {
              required: true,
              min: 0,
              max: 120,
            })}
            onChange={(e) => {
              const field = register("paciente.edad")
              field.onChange(e)
              handleAutoSave("paciente.edad", e.target.value)
            }}
            onBlur={(e) => handleAutoSave("paciente.edad", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Fecha de recepción</label>
          <input
            type="date"
            className={inputClass}
            {...register("fecha_envio", { required: true })}
            onBlur={(e) => handleAutoSave("fecha_envio", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Fecha de entrega</label>
          <input
            type="date"
            min={minDelivery}
            className={inputClass}
            {...register("fecha_entrega", {
              required: true,
              validate: (value) =>
                !receptionDate ||
                new Date(value) >= new Date(minDelivery) ||
                "La entrega debe ser al menos 7 días después de la recepción",
            })}
            onBlur={(e) => handleAutoSave("fecha_entrega", e.target.value)}
          />
          {errors.fecha_entrega && (
            <p className="text-sm text-red-600 mt-1">
              {errors.fecha_entrega.message?.toString() ||
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
            {...register("profile.nombre", { required: true })}
            onBlur={(e) => handleAutoSave("profile.nombre", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>RUT del odontólogo</label>
          <input
            type="text"
            placeholder="Ej: 12.345.678-9"
            className={inputClass}
            {...register("profile.rut", { required: true })}
            onChange={(e) => handleAutoSave("profile.rut", e.target.value)}
            onBlur={(e) => handleAutoSave("profile.rut", e.target.value)}
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
            {...register("profile.numero_registro", { required: true })}
            readOnly={!!profile?.numeroRegistro}
            onBlur={(e) => handleAutoSave("profile.numero_registro", e.target.value)}
          />
          {!profile?.numeroRegistro && (
            <p className="text-xs text-gray-500 mt-1">
              Se guardará en tu perfil al enviar el caso.
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Nombre del centro médico</label>
          <Controller
            control={control}
            name="clinica.nombre"
            render={({ field, fieldState }) => (
              <>
                <Autocomplete
                  value={field.value ?? ""}
                  onChange={(value) => {
                    field.onChange(value)
                    saveClinicState({ nombre: value })

                    const currentId = getValues("clinica.id")
                    if (currentId && !String(currentId).startsWith("temp_")) {
                      setValue("clinica.id", null, { shouldDirty: true, shouldValidate: true })
                    }
                  }}
                  onSelect={(option) => {
                    if (option) {
                      field.onChange(option.label)
                      setValue("clinica.id", option.id, { shouldDirty: true, shouldValidate: true })
                      setValue("clinica.nombre", option.label, { shouldDirty: true, shouldValidate: true })
                      saveClinicState({ id: option.id, nombre: option.label })
                      return
                    }

                    const currentValue = field.value ?? ""
                    if (currentValue.trim()) {
                      setValue("clinica.id", `temp_${Date.now()}`, { shouldDirty: true, shouldValidate: true })
                      saveClinicState({ id: `temp_${Date.now()}` })
                    }
                  }}
                  onBlur={(value) => {
                    void createClinicFromName(value)
                  }}
                  fetchOptions={searchClinicas}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none transition"
                />
                {fieldState.error && (
                  <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
          <p className="text-xs text-gray-500 mt-1">
            Selecciona una existente o se creará una nueva al salir del campo.
          </p>
        </div>
      </div>
    </div>
  )
}
