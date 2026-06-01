"use client"

import { useState } from "react"
import { MdCheckCircle, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import StepBasicInformation from "@/components/upload-steps/StepBasicInformation"
import StepPieceSelection from "@/components/upload-steps/StepPieceSelection"
import StepAditionalInformation from "@/components/upload-steps/StepAditionalInformation"
import StepFiles from "@/components/upload-steps/StepFiles"
import StepSend from "@/components/upload-steps/StepSend"
import { useMutation } from "@tanstack/react-query"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import {
  UploadFormValues,
  todayISO,
  minDeliveryDate,
} from "@/components/upload-steps/types"
import { createClient } from "@/lib/supabase/client"

type Slot3D = "fileSuperior" | "fileInferior" | "fileMordida" | "fileGingival"

type SignedTarget = { path: string; signedUrl: string; token: string }

type SignResponse = {
  orderId: string
  bucket: string
  files3d: Array<SignedTarget & { slot: Slot3D }>
  photos: SignedTarget[]
}

function defaultValues(): UploadFormValues {
  const reception = todayISO()
  return {
    patientId: null,
    patientName: "",
    patientLastName: "",
    patientAge: "",
    receptionDate: reception,
    deliveryDate: minDeliveryDate(reception),
    dentistName: "",
    dentistRut: "",
    dentistRegistry: "",
    clinicId: null,
    medicalCenter: "",
    pieces: [],
    notes: "",
    photos: [],
    fileSuperior: null,
    fileInferior: null,
    fileMordida: null,
    fileGingival: null,
  }
}

export default function UploadWizard() {
  const methods = useForm<UploadFormValues>({
    defaultValues: defaultValues(),
    mode: "onChange",
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [successMessage, setSuccessMessage] = useState(false)

  const values = useWatch({ control: methods.control })

  const mutation = useMutation({
    mutationFn: async (data: UploadFormValues) => {
      const slotFiles: Array<{ slot: Slot3D; file: File }> = (
        [
          ["fileSuperior", data.fileSuperior],
          ["fileInferior", data.fileInferior],
          ["fileMordida", data.fileMordida],
          ["fileGingival", data.fileGingival],
        ] as const
      )
        .filter((entry): entry is [Slot3D, File] => entry[1] instanceof File)
        .map(([slot, file]) => ({ slot, file }))

      const signRes = await fetch("/api/upload-case/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files3d: slotFiles.map(({ slot, file }) => ({
            slot,
            name: file.name,
            size: file.size,
            type: file.type,
          })),
          photos: data.photos.map((p) => ({
            name: p.name,
            size: p.size,
            type: p.type,
          })),
        }),
      })
      if (!signRes.ok) {
        const err = await signRes.json().catch(() => ({}))
        throw new Error(err?.error || "No se pudo iniciar la subida")
      }
      const signed = (await signRes.json()) as SignResponse

      const supabase = createClient()

      const slotByName = new Map(slotFiles.map((s) => [s.slot, s.file]))

      await Promise.all([
        ...signed.files3d.map(async (t) => {
          const file = slotByName.get(t.slot)
          if (!file) throw new Error(`Archivo no encontrado para ${t.slot}`)
          const { error } = await supabase.storage
            .from(signed.bucket)
            .uploadToSignedUrl(t.path, t.token, file, { contentType: file.type })
          if (error) throw error
        }),
        ...signed.photos.map(async (t, i) => {
          const photo = data.photos[i]
          if (!photo) throw new Error(`Foto no encontrada en índice ${i}`)
          const { error } = await supabase.storage
            .from(signed.bucket)
            .uploadToSignedUrl(t.path, t.token, photo, { contentType: photo.type })
          if (error) throw error
        }),
      ])

      const piecesPayload = data.pieces.map((p) => ({
        pieceId: p.pieceId,
        type: p.type,
        subType: p.subType,
        tiBase: p.tiBase,
        colorSectionCount: p.colorSectionCount,
        colors: p.colors.slice(0, p.colorSectionCount),
      }))

      const pathFor = (slot: Slot3D) =>
        signed.files3d.find((t) => t.slot === slot)?.path ?? null

      const commitRes = await fetch("/api/upload-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: signed.orderId,
          patientInfo: {
            patientId: data.patientId,
            patientName: data.patientName,
            patientLastName: data.patientLastName,
            patientAge: data.patientAge,
            receptionDate: data.receptionDate,
            deliveryDate: data.deliveryDate,
            dentistName: data.dentistName,
            dentistRut: data.dentistRut,
            dentistRegistry: data.dentistRegistry,
            clinicId: data.clinicId,
            medicalCenter: data.medicalCenter,
          },
          pieces: piecesPayload,
          notes: data.notes,
          paths: {
            fileSuperior: pathFor("fileSuperior"),
            fileInferior: pathFor("fileInferior"),
            fileMordida: pathFor("fileMordida"),
            fileGingival: pathFor("fileGingival"),
            photos: signed.photos.map((p) => p.path),
          },
        }),
      })
      if (!commitRes.ok) {
        const err = await commitRes.json().catch(() => ({}))
        throw new Error(err?.error || "Error registrando el pedido")
      }
      return commitRes.json()
    },
    onSuccess: () => {
      setSuccessMessage(true)
      setTimeout(() => {
        setSuccessMessage(false)
        setCurrentStep(0)
        methods.reset(defaultValues())
      }, 3000)
    },
    onError: (error) => {
      console.error("Upload failed:", error)
      alert("Error al enviar el caso. Intenta nuevamente.")
    },
  })

  const handleSubmit = methods.handleSubmit((data) => {
    mutation.mutate(data)
  })

  const basicComplete =
    !!values.patientName?.trim() &&
    !!values.patientAge?.toString().trim() &&
    !!values.dentistName?.trim() &&
    !!values.dentistRut?.trim() &&
    !!values.dentistRegistry?.trim() &&
    !!values.medicalCenter?.trim() &&
    !!values.receptionDate &&
    !!values.deliveryDate &&
    new Date(values.deliveryDate) >=
      new Date(minDeliveryDate(values.receptionDate || todayISO()))

  const piecesComplete =
    !!values.pieces &&
    values.pieces.length > 0 &&
    values.pieces.every((p) => {
      if (!p?.type) return false
      if (p.type === "CORONA_IMPLANTE") {
        if (!p.subType) return false
        if (p.subType === "ATORNILLADA" && !p.tiBase) return false
      }
      const count = p.colorSectionCount ?? 1
      if (!p.colors || p.colors.length < count) return false
      for (let i = 0; i < count; i++) {
        const c = p.colors[i]
        if (!c) return false
        if (!c.code?.trim()) return false
        if (c.paletteType === "OTRO" && !c.customPalette?.trim()) return false
      }
      return true
    })

  const filesComplete = !!values.fileSuperior && !!values.fileInferior

  const steps = [
    { id: 0, title: "Información básica", completed: basicComplete },
    { id: 1, title: "Especificación de pieza", completed: piecesComplete },
    { id: 2, title: "Archivos 3D", completed: filesComplete },
    { id: 3, title: "Fotos y Notas (opcional)", completed: true },
    { id: 4, title: "Envío", completed: false },
  ]

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-white py-12 px-4 md:px-8">
        {successMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
            <div className="bg-white p-8 rounded-lg text-center max-w-md">
              <MdCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#1C4880] mb-2">¡Éxito!</h3>
              <p className="text-gray-600">Tu caso ha sido enviado exitósamente</p>
            </div>
          </div>
        )}

        <div className="w-full md:w-3/4 mx-auto">
          <h1 className="text-4xl font-bold text-[#1C4880] mb-12 text-center">
            Envíanos tu caso
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full px-6 py-4 flex items-center justify-between font-semibold text-lg transition-colors ${
                    step.completed
                      ? "bg-green-50 text-green-700"
                      : currentStep === step.id
                      ? "bg-[#1C4880] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {step.completed ? (
                      <MdCheckCircle className="w-6 h-6" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm">
                        {step.id + 1}
                      </div>
                    )}
                    {step.title}
                  </div>
                  {currentStep === step.id ? (
                    <MdKeyboardArrowUp className="w-5 h-5" />
                  ) : (
                    <MdKeyboardArrowDown className="w-5 h-5" />
                  )}
                </button>

                {currentStep === step.id && (
                  <div className="px-6 py-8 bg-white border-t border-gray-200">
                    {step.id === 0 && <StepBasicInformation />}
                    {step.id === 1 && <StepPieceSelection />}
                    {step.id === 2 && <StepFiles />}
                    {step.id === 3 && <StepAditionalInformation />}
                    {step.id === 4 && (
                      <StepSend isSubmitting={mutation.isPending} />
                    )}

                    <div className="flex gap-4 mt-8">
                      {step.id > 0 && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(currentStep - 1)}
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
                          className={`flex-1 px-6 py-3 font-semibold rounded-lg transition ${
                            step.completed
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
            ))}
          </form>
        </div>
      </div>
    </FormProvider>
  )
}
