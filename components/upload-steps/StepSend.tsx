"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { getFdiForGridIndex, UploadFormValues } from "@/components/upload-steps/types"
import { useEffect } from "react"

export default function StepSend({
  isSubmitting,
  formInvalid,
  club
}: {
  isSubmitting: boolean
  formInvalid: boolean
  club?: {
    piezasConDescuento: number
    precioDescuento: number
    precioNormal: number
  } 
}) {
  const { control } = useFormContext<UploadFormValues>()
  // Contar las piezas ACTUALMENTE seleccionadas en el formulario (estado en vivo),
  // no las del borrador que llega del route.
  const piezasSeleccionadas = useWatch({ control, name: "piezas" }) ?? []
  const piezas = piezasSeleccionadas.length
  const piezasConDescuento = club?.piezasConDescuento ?? 0
  const precioDescuento = club?.precioDescuento ?? 0
  const precioNormal = club?.precioNormal ?? 0

  // Las primeras `piezasConDescuento` piezas van con descuento; el resto, a precio normal.
  const conDescuento = Math.min(piezas, piezasConDescuento)
  const aPrecioNormal = Math.max(0, piezas - piezasConDescuento)
  const total = conDescuento * precioDescuento + aPrecioNormal * precioNormal

  useEffect(() => {
    console.log("Piezas seleccionadas", piezasSeleccionadas)
  }, [piezasSeleccionadas])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#F5F9FF] border border-[#D9E5F3] p-8 text-center">
        <div className="rounded-3xl bg-gradient-to-br from-[#F5F9FF] to-[#E8F0FE] border border-[#D9E5F3] shadow-sm overflow-hidden">
  {/* Header del resumen */}
  <div className="bg-[#0A1330] px-8 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📋</span>
        <h3 className="text-white font-semibold text-lg tracking-wide">
          Resumen de Pago
        </h3>
      </div>
      <span className="bg-[#7C3AED] text-white text-xs font-bold px-4 py-1.5 rounded-full">
        {piezasSeleccionadas.length} {piezasSeleccionadas.length === 1 ? 'pieza' : 'piezas'}
      </span>
    </div>
  </div>

  {/* Cuerpo */}
  <div className="p-8">
    {/* Tabla de piezas */}
    <div className="overflow-hidden rounded-xl border border-[#D9E5F3] mb-6">
      <table className="w-full text-sm">
        <thead className="bg-[#EEF2F7]">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-[#0A1330] text-xs uppercase tracking-wider">
              Pieza
            </th>
            <th className="text-left px-4 py-3 font-semibold text-[#0A1330] text-xs uppercase tracking-wider">
              Tipo
            </th>
            <th className="text-left px-4 py-3 font-semibold text-[#0A1330] text-xs uppercase tracking-wider">
              Sub-tipo
            </th>
            <th className="text-right px-4 py-3 font-semibold text-[#0A1330] text-xs uppercase tracking-wider">
              Precio
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEF2F7]">
          {piezasSeleccionadas.map((pieza, index) => {
            const esDescuento = index < 10; // Ejemplo: primeras 10 con descuento
            return (
              <tr key={`pieza_${index}`} className="hover:bg-[#F5F9FF] transition-colors">
                <td className="px-4 py-3 font-medium text-[#0A1330]">
                  {getFdiForGridIndex(pieza.numero)}
                </td>
                <td className="px-4 py-3 text-[#16213E]">
                  {pieza.tipo || '-'}
                </td>
                <td className="px-4 py-3 text-[#16213E]">
                  {pieza.subTipo || '-'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-[#0A1330]">
                      ${(esDescuento ? 49990 : 59990).toLocaleString()}
                    </span>
                    {esDescuento && (
                      <span className="text-[10px] text-[#22B35E] font-semibold">
                        🔹 Precio especial
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Detalle de descuentos */}
    <div className="bg-[#EEF2F7] rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-[#0A1330] font-medium">🏷️ Descuento aplicado</span>
          <span className="bg-[#F4C20D] text-[#0A1330] text-[10px] font-bold px-2 py-0.5 rounded">
            1/10
          </span>
        </div>
        <p className="text-[#16213E]">
          {piezasSeleccionadas.sort((a, b) => b.numero - a.numero).length > 10 
            ? `Primeras 10 piezas: descuento especial, el resto a precio normal`
            : `Todas las piezas con descuento especial`}
        </p>
      </div>
    </div>

    {/* TOTAL */}
    <div className="bg-[#0A1330] rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-xs uppercase tracking-wider font-semibold">
            Total a pagar
          </p>
          <p className="text-white/50 text-xs mt-0.5">
            {piezasSeleccionadas.length} pieza{piezasSeleccionadas.length !== 1 ? 's' : ''} incluidas
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-white">
            ${total.toLocaleString()}
          </p>
          <p className="text-[#F4C20D] text-xs font-medium">
            {total > 100000 ? '✓ Apto para pago con tarjeta' : '✓ Pago en efectivo o transferencia'}
          </p>
        </div>
      </div>
    </div>

    {/* Información adicional */}
    <div className="mt-4 flex items-center justify-between text-xs text-[#16213E]/60">
      <span>🔒 Pago seguro a través de nuestra plataforma</span>
      <span>⏱️ Tiempo estimado de entrega: 7 días hábiles</span>
    </div>
  </div>
</div>
        
        <div className="space-y-6">
  {/* Título */}
  <div className="flex items-center gap-3 mt-6">
    <span className="text-2xl">🏦</span>
    <h3 className="text-xl font-bold text-[#0A1330]">Datos de Depósito</h3>
    <span className="ml-auto bg-[#F4C20D] text-[#0A1330] text-[10px] font-bold px-3 py-1 rounded-full">
      Transferencia
    </span>
  </div>

  {/* Datos bancarios */}
  <div className="rounded-2xl bg-[#F5F9FF] border border-[#D9E5F3] overflow-hidden shadow-sm">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-6">
      <div className="flex items-center gap-2">
        <span className="text-[#16213E]/60 text-sm font-semibold min-w-25">Banco</span>
        <span className="text-[#0A1330] font-bold">Banco Itaú</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#16213E]/60 text-sm font-semibold min-w-25">Nombre</span>
        <span className="text-[#0A1330] font-bold">VIA CAPACITACION LTDA.</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#16213E]/60 text-sm font-semibold min-w-25">Tipo de cuenta</span>
        <span className="text-[#0A1330] font-bold">Cuenta Corriente</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#16213E]/60 text-sm font-semibold min-w-25">N° de cuenta</span>
        <span className="text-[#0A1330] font-bold font-mono">0214175664</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#16213E]/60 text-sm font-semibold min-w-25">RUT</span>
        <span className="text-[#0A1330] font-bold font-mono">76.809.468-3</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#16213E]/60 text-sm font-semibold min-w-25">E-mail comprobante</span>
        <span className="text-[#0A1330] font-bold text-sm">facturacion@digitalceramic.cl</span>
      </div>
    </div>
    
  </div>

  {/* Información adicional */}
  <div className="rounded-2xl bg-[#F5F9FF] border border-[#D9E5F3] p-6 space-y-3">
    <div className="flex items-start gap-3">
      <span className="text-[#7C3AED] text-lg mt-0.5">📌</span>
      <p className="text-[#16213E] text-sm leading-relaxed">
        <span className="font-semibold">Importante:</span> Al recibir tu comprobante de pago, 
        iniciaremos la producción de tu trabajo.
      </p>
    </div>
    <div className="flex items-start gap-3">
      <span className="text-[#F4C20D] text-lg mt-0.5">⚠️</span>
      <p className="text-[#16213E] text-sm leading-relaxed">
        <span className="font-semibold">Revisa bien</span> la información de tu caso antes de 
        confirmar el envío.
      </p>
    </div>
    <div className="flex items-start gap-3">
      <span className="text-[#22B35E] text-lg mt-0.5">⏱️</span>
      <p className="text-[#16213E] text-sm leading-relaxed">
        <span className="font-semibold">Plazo de entrega:</span> El trabajo estará listo en 
        <span className="font-bold text-[#0A1330]"> 7 días corridos</span> a partir del día 
        de confirmación del depósito.
      </p>
    </div>
  </div>

  {/* Botón de acción */}
      <div className="text-center">
        <button
          type="submit"
          disabled={formInvalid || isSubmitting}
          className={`inline-flex items-center justify-center px-10 py-4 ${(formInvalid || isSubmitting) ? 'bg-gray-500' : 'bg-[#1C4880]'} text-white rounded-xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-60`}
        >
          {isSubmitting ? "Enviando..." : "Enviar trabajo"}
        </button>
      </div>
</div>
      </div>


    </div>
  )
}
