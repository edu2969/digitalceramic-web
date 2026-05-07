"use client"

import React, { useState } from "react"
import { MdCheckCircle, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import Step1PieceSelection from "@/app/components/upload-steps/Step1PieceSelection"
import Step2Material from "@/app/components/upload-steps/Step2Material"
import Step3Notes from "@/app/components/upload-steps/Step3Notes"
import Step4File from "@/app/components/upload-steps/Step4File"
import Step5Payment from "@/app/components/upload-steps/Step5Payment"

export default function UploadWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [successMessage, setSuccessMessage] = useState(false)
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [shades, setShades] = useState(1)
  const [vitaPalette, setVitaPalette] = useState("A")
  const [selectedColors, setSelectedColors] = useState({})
  const [notes, setNotes] = useState("")
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileError, setFileError] = useState("")

  const totalAmount = 79990

  const steps = [
    { id: 0, title: "Selección de pieza", completed: selectedPiece !== null },
    { id: 1, title: "Material", completed: Object.keys(selectedColors).length === shades },
    { id: 2, title: "Notas", completed: true },
    { id: 3, title: "Archivo", completed: uploadedFile !== null && !fileError },
    { id: 4, title: "Pago", completed: uploadedFile !== null && !fileError },
  ]

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePieceSelect = (pieceId) => {
    setSelectedPiece(pieceId)
  }

  const handleColorChange = (shadeIndex, color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [shadeIndex]: color,
    }))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const extension = file.name.split(".").pop().toLowerCase()
    const validExtensions = ["stl", "obj", "step", "stp"]

    if (!validExtensions.includes(extension)) {
      setFileError(`Extensión no válida. Usa: ${validExtensions.join(", ")}`)
      setUploadedFile(null)
      return
    }

    setFileError("")
    setUploadedFile(file)
  }

  const handleSubmit = () => {
    setSuccessMessage(true)
    setTimeout(() => {
      setSuccessMessage(false)
      setCurrentStep(0)
      setSelectedPiece(null)
      setShades(1)
      setVitaPalette("A")
      setSelectedColors({})
      setNotes("")
      setUploadedFile(null)
      setFileError("")
    }, 3000)
  }

  return (
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
        <h1 className="text-4xl font-bold text-[#1C4880] mb-12 text-center">Envíanos tu caso</h1>

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="border rounded-lg overflow-hidden">
              <button
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
                  {step.id === 0 && <Step1PieceSelection selectedPiece={selectedPiece} onSelectPiece={handlePieceSelect} />}
                  {step.id === 1 && (
                    <Step2Material
                      shades={shades}
                      onShadesChange={setShades}
                      vitaPalette={vitaPalette}
                      onVitaPaletteChange={setVitaPalette}
                      selectedColors={selectedColors}
                      onColorChange={handleColorChange}
                    />
                  )}
                  {step.id === 2 && <Step3Notes notes={notes} onNotesChange={setNotes} />}
                  {step.id === 3 && <Step4File uploadedFile={uploadedFile} onFileUpload={handleFileUpload} fileError={fileError} />}
                  {step.id === 4 && <Step5Payment total={totalAmount} onPay={handleSubmit} />}

                  <div className="flex gap-4 mt-8">
                    {step.id > 0 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex-1 px-6 py-3 border-2 border-[#1C4880] text-[#1C4880] font-semibold rounded-lg hover:bg-gray-50 transition"
                      >
                        Anterior
                      </button>
                    )}
                    {step.id < 4 && (
                      <button
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
        </div>
      </div>
    </div>
  )
}
