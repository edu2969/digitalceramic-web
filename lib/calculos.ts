// lib/pricing/pricingUtils.ts

/**
 * Constantes de precios
 */
export const PRECIOS = {
    /** Precio normal por pieza */
    NORMAL: 71250,
    /** Precio con descuento por pieza (aplica a las primeras piezas del histórico) */
    DESCUENTO: 59000,
    /** Cantidad de primeras piezas (histórico) que van con descuento */
    UMBRAL_DESCUENTO: 10,
} as const;

/**
 * Calcula el monto total a pagar basado en piezas ya trabajadas y nuevas piezas.
 * 
 * @param piezasYaRealizadas - Número de piezas que ya se han trabajado anteriormente
 * @param piezasNuevas - Número de piezas nuevas a calcular
 * @param precioNormal - Precio normal por pieza (opcional, por defecto 59990)
 * @param precioDescuento - Precio con descuento por pieza (opcional, por defecto PRECIO_DESCUENTO)
 * @param umbral - Número de piezas a partir del cual aplica descuento (opcional, por defecto 10)
 * 
 * @returns Objeto con el detalle del cálculo
 * 
 * @example
 * // 8 ya realizadas, 4 nuevas: quedan 2 cupos de descuento (10 - 8)
 * calcularMontoTotal(8, 4)
 * // => { totalPiezas: 12, piezasConDescuento: 2, piezasSinDescuento: 2, montoTotal: 271400, detalle: [...] }
 *
 * @example
 * // 2 ya realizadas, 4 nuevas: las 4 caen dentro de las primeras 10 → todas con descuento
 * calcularMontoTotal(2, 4)
 * // => { totalPiezas: 6, piezasConDescuento: 4, piezasSinDescuento: 0, montoTotal: 236000, detalle: [...] }
 */
export function calcularMontoTotal(
    piezasYaRealizadas: number,
    piezasNuevas: number,
    precioNormal: number = PRECIOS.NORMAL,
    precioDescuento: number = PRECIOS.DESCUENTO,
    umbral: number = PRECIOS.UMBRAL_DESCUENTO
): {
    totalPiezas: number;
    piezasConDescuento: number;
    piezasSinDescuento: number;
    montoTotal: number;
    detalle: Array<{
        tipo: 'NORMAL' | 'DESCUENTO';
        cantidad: number;
        precioUnitario: number;
        subtotal: number;
    }>;
} {
    // Validar que los números sean válidos
    if (piezasYaRealizadas < 0 || piezasNuevas < 0) {
        throw new Error('El número de piezas no puede ser negativo');
    }

    if (!Number.isInteger(piezasYaRealizadas) || !Number.isInteger(piezasNuevas)) {
        throw new Error('El número de piezas debe ser un número entero');
    }

    const totalPiezas = piezasYaRealizadas + piezasNuevas;

    // Si no hay piezas nuevas, el monto total es 0
    if (piezasNuevas === 0) {
        return {
            totalPiezas,
            piezasConDescuento: 0,
            piezasSinDescuento: 0,
            montoTotal: 0,
            detalle: [],
        };
    }

    // Las primeras `umbral` piezas del histórico (ya realizadas + nuevas) van
    // con descuento; una vez alcanzado el umbral, el resto va a precio normal.
    const cuposDescuentoRestantes = Math.max(0, umbral - piezasYaRealizadas);
    const piezasConDescuento = Math.min(piezasNuevas, cuposDescuentoRestantes);
    const piezasSinDescuento = piezasNuevas - piezasConDescuento;

    // Calcular montos
    const montoNormal = piezasSinDescuento * precioNormal;
    const montoDescuento = piezasConDescuento * precioDescuento;
    const montoTotal = montoNormal + montoDescuento;

    // Construir detalle
    const detalle: Array<{ tipo: 'NORMAL' | 'DESCUENTO'; cantidad: number; precioUnitario: number; subtotal: number }> = [];

    if (piezasSinDescuento > 0) {
        detalle.push({
            tipo: 'NORMAL',
            cantidad: piezasSinDescuento,
            precioUnitario: precioNormal,
            subtotal: montoNormal,
        });
    }

    if (piezasConDescuento > 0) {
        detalle.push({
            tipo: 'DESCUENTO',
            cantidad: piezasConDescuento,
            precioUnitario: precioDescuento,
            subtotal: montoDescuento,
        });
    }

    return {
        totalPiezas,
        piezasConDescuento,
        piezasSinDescuento,
        montoTotal,
        detalle,
    };
}

/**
 * Versión simplificada que solo retorna el monto total.
 * 
 * @param piezasYaRealizadas - Número de piezas ya trabajadas
 * @param piezasNuevas - Número de piezas nuevas
 * @returns Monto total a pagar
 * 
 * @example
 * calcularMontoTotalSimple(8, 4) // => 219960
 */
export function calcularMontoTotalSimple(
    piezasYaRealizadas: number,
    piezasNuevas: number
): number {
    return calcularMontoTotal(piezasYaRealizadas, piezasNuevas).montoTotal;
}