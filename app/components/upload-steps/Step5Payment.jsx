export default function Step5Payment({ total, onPay }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#F5F9FF] border border-[#D9E5F3] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[#1C4880] font-semibold mb-4">
          Pago
        </p>
        <p className="text-4xl font-bold text-[#1C4880]">${total.toLocaleString("es-CL")}</p>
        <p className="text-gray-600 mt-2">Total a pagar por tu cotización</p>
      </div>

      <div className="text-center">
        <button
          onClick={onPay}
          className="inline-flex items-center justify-center px-10 py-4 bg-[#1C4880] text-white rounded-xl font-semibold text-lg hover:opacity-90 transition"
        >
          Ir a pagar
        </button>
      </div>
    </div>
  )
}
