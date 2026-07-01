// hooks/usePieceAutoSave.ts
import { useCallback, useRef, useEffect } from "react";
import { useAutoSaveContext } from "../provider/AutoSaveProvider";

export function usePieceAutoSave(delay: number = 500) {
    const autoSave = useAutoSaveContext();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingChangesRef = useRef<Record<string, unknown>>({});

    // Guardar con debounce
    const saveField = useCallback(
        (field: string, value: unknown) => {
            // Acumular cambios
            pendingChangesRef.current[field] = value;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                // Enviar todos los cambios acumulados
                Object.entries(pendingChangesRef.current).forEach(([key, val]) => {
                    autoSave?.saveField(key, val);
                });
                pendingChangesRef.current = {};
                timeoutRef.current = null;
            }, delay);
        },
        [autoSave, delay]
    );

    // Guardar inmediatamente (sin debounce)
    const saveFieldImmediate = useCallback(
        (field: string, value: unknown) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            // Limpiar pendientes
            pendingChangesRef.current = {};
            autoSave?.saveField(field, value);
        },
        [autoSave]
    );

    // Limpiar al desmontar
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                // Guardar cambios pendientes al desmontar
                Object.entries(pendingChangesRef.current).forEach(([key, val]) => {
                    autoSave?.saveField(key, val);
                });
            }
        };
    }, [autoSave]);

    return { saveField, saveFieldImmediate };
}