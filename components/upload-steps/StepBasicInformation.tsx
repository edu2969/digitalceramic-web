"use client"

import { ChangeEvent, useCallback, useEffect, useRef } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import Autocomplete from "@/components/prefabs/Autocomplete"
import {
  AutocompleteOption,
  UploadFormValues
} from "@/components/upload-steps/types"
import { useAutoSaveContext } from "../form/provider/AutoSaveProvider"
import { useQuery } from "@tanstack/react-query"
import { splitFullName } from "@/lib/names"

const inputClass =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none transition"
const labelClass = "block text-lg font-semibold text-[#1C4880] mb-3"

/** Calcula la edad (años) a partir de una fecha de nacimiento ISO. */
function ageFromBirthDate(fechaNacimiento?: string | null): string {
  if (!fechaNacimiento) return ""
  const birth = new Date(fechaNacimiento)
  if (Number.isNaN(birth.getTime())) return ""
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age >= 0 && age <= 120 ? String(age) : ""
}

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
  return await res.json();
}

async function searchPacientes(q: string) {
  const url = q ? `/api/pacientes?q=${encodeURIComponent(q)}` : "/api/pacientes"
  const res = await fetch(url)
  if (!res.ok) return []
  const json = (await res.json()) as {
    pacientes: { id: string; nombre: string; apellido: string | null; fecha_nacimiento: string | null }[]
  }
  return json.pacientes.map((p) => ({
    id: p.id,
    label: `${p.nombre} ${p.apellido ?? ""}`.trim(),
    sublabel: undefined,
    fechaNacimiento: p.fecha_nacimiento,
  }))
}

export default function StepBasicInformation() {
  const {
    getValues,
    register,
    control,
    setValue
  } = useFormContext<UploadFormValues>();

  const { saveField, flush } = useAutoSaveContext()
  const watchedPatientId = useWatch({ control, name: "paciente.id" })
  const enviadoPorCheckbox = useWatch({ control, name: "yo_mismo" })
  const enviadoPor = useWatch({ control, name: "enviado_por" })
  const creatingPatientRef = useRef<string | null>(null)
  const hasConfirmedPatient = Boolean(
    watchedPatientId &&
    String(watchedPatientId).trim() &&
    !String(watchedPatientId).startsWith("temp_")
  )
  const yoMismoField = register("yo_mismo");

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

  const handlePatientSelect = useCallback(
    (option: AutocompleteOption | null, searchText?: string) => {
      if (option) {
        const patientId = option.id;
        const nombreCompleto = splitFullName(option.label);
        const nombres = nombreCompleto.nombre;
        const apellidos = nombreCompleto.apellido;
        const edad = ageFromBirthDate(option.fechaNacimiento);

        setValue("paciente.nombre", nombres, {
          shouldDirty: true,
          shouldValidate: true,
        });

        setValue("paciente.apellido", apellidos, {
          shouldDirty: true,
          shouldValidate: true,
        });

        setValue("paciente.edad", edad, {
          shouldDirty: true,
          shouldValidate: true,
        });

        setValue("paciente.id", patientId as never, {
          shouldDirty: true,
          shouldValidate: true,
        });

        savePatientState({ id: patientId })
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

  const handleBlur = async () => {
    const name = getValues("paciente.nombre");
    if (name?.trim()) {
      await createPatientFromName(name);
    }
  };

  const createPatientFromName = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const currentId = getValues("paciente.id");
    if (currentId && !String(currentId).startsWith("temp_")) {
      return null;
    }

    // Evitar duplicados en creación
    if (creatingPatientRef.current === trimmed) {
      return null;
    }

    creatingPatientRef.current = trimmed;

    try {
      // 1. Buscar paciente existente
      const searchRes = await fetch(`/api/pacientes?q=${encodeURIComponent(trimmed)}&limit=5`);
      if (searchRes.ok) {
        const existing = await searchRes.json() as { pacientes?: Array<{ id: string; nombre: string; apellido?: string | null; fecha_nacimiento?: string | null }> };
        const match = existing.pacientes?.find((patient) => {
          const fullName = `${patient.nombre ?? ""}`.trim().toLowerCase();
          return fullName === trimmed.toLowerCase();
        });

        if (match?.id) {
          // Paciente encontrado - actualizar formulario y estado
          setValue("paciente.id", match.id, {
            shouldDirty: true,
            shouldValidate: true,
          });
          const edad = ageFromBirthDate(match.fecha_nacimiento);
          if (edad) {
            setValue("paciente.edad", edad, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
          savePatientState({ id: match.id, nombre: trimmed });
          await flush();
          return match;
        }
      }

      // 2. Crear nuevo paciente
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
        // Paciente creado exitosamente - actualizar formulario y estado
        setValue("paciente.id", createdPatient.id, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue("paciente.nombre", createdPatient.nombre ?? trimmed, {
          shouldDirty: true,
          shouldValidate: true,
        });
        savePatientState({ id: createdPatient.id, nombre: createdPatient.nombre ?? trimmed });
        await flush();
        return createdPatient;
      } else {
        // Error: no se recibió ID - guardar solo nombre sin ID
        savePatientState({ nombre: trimmed });
        await flush();
        return null;
      }
    } catch (error) {
      console.error("Error creando paciente desde autocompletado", error);
      // Solo guardar nombre en caso de error, sin ID
      savePatientState({ nombre: trimmed });
      await flush();
      return null;
    } finally {
      creatingPatientRef.current = null;
    }
  }, [flush, getValues, savePatientState, setValue]);

  const { data: odontologo, isLoading: isProfileLoading } = useQuery<ProfileResponse, Error>({
    queryKey: ["profile"],
    queryFn: fetchProfile
  });

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
    saveField(fieldName, value);
  };

  const handleToggleSoyYo = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked;

    if (!odontologo?.profile) return;

    const nombre =
      `${odontologo.profile.nombre ?? ""} ${odontologo.profile.apellido ?? ""}`.trim();

    const valor = checked ? nombre : "";

    setValue("enviado_por", valor, {
      shouldDirty: true,
      shouldValidate: true,
    });

    handleAutoSave("enviado_por", valor);
  };

  useEffect(() => {
    if (!odontologo?.profile) return;

    const nombrePerfil =
      `${odontologo.profile.nombre ?? ""} ${odontologo.profile.apellido ?? ""}`.trim();

    const coincide =
      (enviadoPor ?? "").trim().toLowerCase() ===
      nombrePerfil.toLowerCase();

    if (coincide !== enviadoPorCheckbox) {
      setValue("yo_mismo", coincide, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [
    enviadoPor,
    enviadoPorCheckbox,
    odontologo,
    setValue,
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
        <div className="md:col-span-3">
          <label className={labelClass}>Nombre del paciente</label>
          <Controller
            control={control}
            name="paciente.nombre"
            rules={{ required: "El nombre del paciente es requerido" }}
            render={({ field, fieldState }) => (
              <>
                <Autocomplete
                  value={field.value ?? ""}
                  tabIndex={1}
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
                  onBlur={handleBlur}
                  fetchOptions={searchPacientes}
                  placeholder="Ej. Andrea María"
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

        <div className="md:col-span-3">
          <label className={labelClass}>Apellido del paciente</label>
          <input
            type="text"
            placeholder="Ej: Pérez Sañartu"
            className={inputClass}
            disabled={!hasConfirmedPatient}
            {...register("paciente.apellido")}
            onChange={(e) => {
              const field = register("paciente.apellido")
              field.onChange(e)
              handleAutoSave("paciente.apellido", e.target.value)
            }}
            onBlur={(e) => handleAutoSave("paciente.apellido", e.target.value)}
            tabIndex={2}
          />
        </div>
        <div className="md:col-span-2 col-span-1">
          <label className={labelClass}>Edad del paciente</label>
          <input
            type="number"
            min={0}
            max={120}
            placeholder="Ej: 35"
            className={inputClass}
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
            tabIndex={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Nombre del centro médico</label>
          <input
            type="text"
            placeholder="Ej: Clínica del Oeste"
            className={inputClass}
            disabled={!hasConfirmedPatient}
            {...register("centro_medico")}
            onBlur={(e) => handleAutoSave("centro_medico", e.target.value)}
            tabIndex={2}
          />

        </div>
        <div className="col-span-2">
          <div>
            <label className={labelClass}>Dirección de despacho</label>
            <input
              type="text"
              placeholder="Ej: Alameda 5678, Santiago"
              className={inputClass}
              disabled={!hasConfirmedPatient}
              {...register("direccion")}
              onBlur={(e) => handleAutoSave("direccion", e.target.value)}
              tabIndex={2}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Selecciona una existente o se creará una nueva al salir del campo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Enviado por</label>
          <input
            type="text"
            placeholder="Ej: Dra. María González"
            className={inputClass}
            required
            {...register("enviado_por", { required: true })}
            onBlur={(e) => handleAutoSave("enviado_por", e.target.value)}
            disabled={enviadoPorCheckbox}
            tabIndex={4}
          />
        </div>
        <div className="mt-14 ml-4 col-span-2">
          <input
            type="checkbox"
            {...yoMismoField}
            className="w-6 h-6 mr-2"
            onChange={(e) => {
              yoMismoField.onChange(e);
              handleToggleSoyYo(e);
            }}
            tabIndex={5}
          />
          <span className="relative -top-1.5">Enviado por mí</span>
        </div>
      </div>
    </div>
  )
}
