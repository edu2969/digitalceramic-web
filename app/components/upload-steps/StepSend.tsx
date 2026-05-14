"use client"

export default function StepSend({
  isSubmitting,
}: {
  isSubmitting: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#F5F9FF] border border-[#D9E5F3] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[#1C4880] font-semibold mb-4">
          Envío
        </p>
        <h3 className="text-2xl font-bold text-[#1C4880]">
          Revisa tu caso antes de enviarlo
        </h3>
        <p className="text-gray-600 mt-2">
          Al enviar, recibiremos toda la información y archivos para iniciar la
          cotización de tu trabajo.
        </p>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-10 py-4 bg-[#1C4880] text-white rounded-xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : "Enviar trabajo"}
        </button>
      </div>
    </div>
  )
}
