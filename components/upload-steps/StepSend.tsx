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
          Pago y Envío
        </p>
        <p className="text-lg font-bold text-[#1C4880]">
          Éste trabajo tiene un costo de          
        </p>
        <p className="text-6xl font-bold text-[#1C4880]">
          $ 59.900
        </p>
        <p className="text-lg text-[#1C4880]">
          Deposita el monto a:          
        </p>
        <p className="w-xl grid grid-cols-3 gap-x-4 border-2 border-[#1C4880]/30 bg-[#1C4880]/10 rounded-lg mx-auto my-4 p-4 text-left">
          <span className="font-semibold text-[#1C4880]">Banco</span>
          <span className="col-span-2 font-bold text-[#1C4880]">: Banco Itaú</span>
          <span className="font-semibold text-[#1C4880]">Tipo de cuenta</span>
          <span className="col-span-2 font-bold text-[#1C4880]">: Cuenta Corriente</span>
          <span className="font-semibold text-[#1C4880]">Número de cuenta</span>
          <span className="col-span-2 font-bold text-[#1C4880]">: 0214175664</span>
          <span className="font-semibold text-[#1C4880]">Rut</span>
          <span className="col-span-2 font-bold text-[#1C4880]">: 76.809.468-3</span>
          <span className="font-semibold text-[#1C4880]">e-mail comprobante</span>
          <span className="col-span-2 font-bold text-[#1C4880]">: facturacion@digitalceramic.cl</span>
        </p>        
        <p className="text-2xl font-bold text-[#1C4880]">
          Revisa bien la información de tu caso antes de enviarlo.          
        </p>
        <p className="text-gray-600 mt-2">
          Al enviarnos el comprobante de depósito, iniciaremos la elaboración de tu trabajo, mientras, quedará registrado en estado <b>PENDIENTE DE PAGO</b>
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
