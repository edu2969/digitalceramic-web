"use client";

import { useEffect, useRef, useState } from "react";
import {
  MdCheckCircle,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";

import StepBasicInformation from "@/components/upload-steps/StepBasicInformation";
import StepPieceSelection from "@/components/upload-steps/StepPieceSelection";
import StepAditionalInformation from "@/components/upload-steps/StepAditionalInformation";
import StepFiles from "@/components/upload-steps/StepFiles";
import StepSend from "@/components/upload-steps/StepSend";

import { useMutation, useQuery } from "@tanstack/react-query";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import {
  UploadFormValues,
  todayISO,
  minDeliveryDate,
} from "@/components/upload-steps/types";

import { AutoSaveProvider } from "./form/provider/AutoSaveProvider";

type ProfileMeResponse = {
  profile: {
    nombre: string | null;
    apellido: string | null;
    centroMedico: string | null;
    numeroRegistro: string | null;
    rut: string | null;
  } | null;
};

type WorkDetailsResponse = {
  patient: {
    name: string | null;
    firstName: string | null;
    surname: string | null;
    age: number | null;
  } | null;
  clinic: {
    name: string | null;
  } | null;
  dentist: {
    name: string | null;
    registry: string | null;
    rut: string | null;
  } | null;
  fecha_envio?: string | null;
  fecha_entrega?: string | null;
  enviado_por?: string | null;
  draft?: {
    piezas: UploadFormValues["piezas"];
    notes: string;
    fecha_envio?: string | null;
    fecha_entrega?: string | null;
    enviado_por?: string | null;
    urls?: {
      superior?: string | null;
      inferior?: string | null;
      mordida?: string | null;
      gingival?: string | null;
    };
  } | null;
};

async function fetchProfileMe(): Promise<ProfileMeResponse> {
  const res = await fetch("/api/profile/me");
  if (!res.ok) throw new Error("Error cargando perfil");
  return res.json();
}

async function fetchWorkDetails(trabajoId: string): Promise<WorkDetailsResponse> {
  const res = await fetch(`/api/works/byId/${trabajoId}`);
  if (!res.ok) throw new Error("Error cargando trabajo");
  return res.json();
}

function defaultValues(): UploadFormValues {
  const reception = todayISO();

  return {
    paciente: {
      id: null,
      nombre: "",
      apellido: "",
      edad: "",
    },

    enviado_por: "",
    yo_mismo: false,

    fecha_envio: reception,
    fecha_entrega: minDeliveryDate(reception),

    clinica: {
      id: null,
      nombre: "",
    },

    piezas: [],

    notes: "",

    photos: [],

    fileUrls: {
      superior: null,
      inferior: null,
      mordida: null,
      gingival: null,
    },

    fileSuperior: null,
    fileInferior: null,
    fileMordida: null,
    fileGingival: null,
  };
}

export default function UploadWizard({ trabajoId }: { trabajoId?: string }) {
  const methods = useForm<UploadFormValues>({
    defaultValues: defaultValues(),
    mode: "onChange",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [successMessage, setSuccessMessage] = useState(false);

  const values = useWatch({ control: methods.control });

  const profilePrefilledRef = useRef(false);
  const draftPrefilledRef = useRef(false);

  const { data: profileData } = useQuery({
    queryKey: ["profile-me"],
    queryFn: fetchProfileMe,
  });

  const { data: workData } = useQuery({
    queryKey: ["work-details", trabajoId],
    queryFn: () => fetchWorkDetails(trabajoId!),
    enabled: Boolean(trabajoId),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const profile = profileData?.profile;
    if (!profile || profilePrefilledRef.current) return;

    profilePrefilledRef.current = true;

    if (profile.centroMedico) {
      methods.setValue(
        "clinica.nombre",
        profile.centroMedico,
        {
          shouldDirty: false,
          shouldValidate: false,
        }
      );
    }
  }, [profileData, methods]);

  useEffect(() => {
    if (!trabajoId || !workData || draftPrefilledRef.current) return;

    draftPrefilledRef.current = true;

    const defaults = defaultValues();
    const profile = profileData?.profile;
    const fileUrls = {
      superior: workData.draft?.urls?.superior ?? null,
      inferior: workData.draft?.urls?.inferior ?? null,
      mordida: workData.draft?.urls?.mordida ?? null,
      gingival: workData.draft?.urls?.gingival ?? null,
    };
    const clinicName = workData.clinic?.name ?? profile?.centroMedico ?? "";
    methods.reset({
      ...defaults,
      enviado_por: workData.enviado_por ?? workData.draft?.enviado_por ?? defaults.enviado_por,
      yo_mismo: (workData.enviado_por === (profileData?.profile?.nombre + " " + profileData?.profile?.apellido)),
      fecha_envio: workData.fecha_envio ?? workData.draft?.fecha_envio ?? defaults.fecha_envio,
      fecha_entrega: workData.fecha_entrega ?? workData.draft?.fecha_entrega ?? defaults.fecha_entrega,
      paciente: {
        ...defaults.paciente,
        nombre: workData.patient?.firstName ?? "",
        apellido: workData.patient?.surname ?? "",
        edad: workData.patient?.age != null ? String(workData.patient.age) : "",
      },
      clinica: {
        ...defaults.clinica,
        nombre: clinicName,
      },
      piezas: workData.draft?.piezas ?? defaults.piezas,
      notes: workData.draft?.notes ?? defaults.notes,
      fileUrls,
    });
  }, [trabajoId, workData, profileData, methods]);

  const mutation = useMutation({
    mutationFn: async () => {
      // Solo cambiamos el estado del trabajo a CREADO
      const response = await fetch("/api/caso/nuevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trabajoId: trabajoId,
          action: "CREADO",
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Error al enviar el caso");
      }

      return response.json();
    },

    onSuccess: () => {
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        setCurrentStep(0);
        methods.reset(defaultValues());
      }, 3000);
    },

    onError: (error) => {
      console.error(error);
      alert("Error al enviar el caso.");
    },
  });

  const handleSubmit = methods.handleSubmit(() =>
    mutation.mutate()
  );

  const basicComplete =
    !!values?.paciente?.nombre?.trim() &&
    !!values?.paciente?.apellido?.trim() &&
    !!values?.paciente?.edad?.toString().trim() &&
    !!values?.clinica?.nombre?.trim() &&
    !!values?.fecha_envio &&
    !!values?.fecha_entrega &&
    new Date(values?.fecha_entrega ?? "") >=
    new Date(minDeliveryDate(values?.fecha_envio ?? ""));

  // Validación de piezas
  const piecesComplete =
    !!values?.piezas &&
    values.piezas.length > 0 &&
    values.piezas.every((p) => {
      if (!p?.tipo) return false;
      if (p.tipo === "CORONA_IMPLANTE") {
        if (!p.subTipo) return false;
        if (p.subTipo === "ATORNILLADA" && !p.tiBase) return false;
      }
      const count = p.cantidadColores ?? 1;
      if (!p.colores || p.colores.length < count) return false;
      for (let i = 0; i < count; i++) {
        const c = p.colores[i];
        if (!c) return false;
        if (!c.code?.trim()) return false;
        if (c.paletteType === "OTRO" && !c.customPalette?.trim()) return false;
      }
      return true;
    });

  const filesComplete =
    (!!values?.fileSuperior || !!values?.fileUrls?.superior) &&
    (!!values?.fileInferior || !!values?.fileUrls?.inferior);

  const steps = [
    { id: 0, title: "Información básica", completed: basicComplete },
    { id: 1, title: "Especificación de pieza", completed: piecesComplete },
    { id: 2, title: "Archivos 3D", completed: filesComplete },
    { id: 3, title: "Fotos y Notas (opcional)", completed: true },
    { id: 4, title: "Pago / Envío", completed: false },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Función para toggle del collapse
  const toggleStep = (stepId: number) => {
    // Si el step ya está abierto, lo cerramos (seteamos a -1)
    // Si está cerrado, lo abrimos
    setCurrentStep(currentStep === stepId ? -1 : stepId);
  };

  return (
    <AutoSaveProvider id={trabajoId}>
      <FormProvider {...methods}>
        <div className="min-h-screen bg-white py-12 px-4 md:px-8">
          {successMessage && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg text-center max-w-md">
                <MdCheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#1C4880] mb-2">
                  ¡Éxito!
                </h3>
                <p className="text-gray-600">
                  Tu caso ha sido enviado exitósamente
                </p>
              </div>
            </div>
          )}

          <div className="w-full md:w-3/4 mx-auto">
            <h1 className="text-4xl font-bold text-[#1C4880] mb-12 text-center">
              Envíanos tu caso
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {steps.map((step) => {
                const isOpen = currentStep === step.id;

                return (
                  <div key={step.id} className="border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className={`w-full px-6 py-4 flex items-center justify-between font-semibold text-lg transition-colors ${step.completed
                          ? "bg-green-50 text-green-700"
                          : isOpen
                            ? "bg-[#1C4880] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {step.completed ? (
                          <MdCheckCircle className="w-6 h-6" />
                        ) : (
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm ${isOpen ? "border-white" : "border-current"
                            }`}>
                            {step.id + 1}
                          </div>
                        )}
                        {step.title}
                      </div>
                      {isOpen ? (
                        <MdKeyboardArrowUp className="w-5 h-5" />
                      ) : (
                        <MdKeyboardArrowDown className="w-5 h-5" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-6 py-8 bg-white border-t border-gray-200">
                        {step.id === 0 && <StepBasicInformation id={trabajoId} />}
                        {step.id === 1 && <StepPieceSelection id={trabajoId} />}
                        {step.id === 2 && <StepFiles />}
                        {step.id === 3 && <StepAditionalInformation />}
                        {step.id === 4 && (
                          <StepSend isSubmitting={mutation.isPending} />
                        )}

                        <div className="flex gap-4 mt-8">
                          {step.id > 0 && (
                            <button
                              type="button"
                              onClick={() => setCurrentStep(step.id - 1)}
                              className="flex-1 px-6 py-3 border-2 border-[#1C4880] text-[#1C4880] font-semibold rounded-lg hover:bg-gray-50 transition"
                            >
                              Anterior
                            </button>
                          )}
                          {step.id < steps.length - 1 && (
                            <button
                              type="button"
                              onClick={handleNextStep}
                              disabled={!step.completed}
                              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition ${step.completed
                                  ? "bg-[#1C4880] text-white hover:opacity-90"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                              Siguiente
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </form>
          </div>
        </div>
      </FormProvider>
    </AutoSaveProvider>
  );
}