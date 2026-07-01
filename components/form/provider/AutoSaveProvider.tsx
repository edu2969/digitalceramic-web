"use client";

import { createContext, useContext } from "react";
import { useAutoSave } from "../hooks/useAutoSave";

type AutoSaveContextType = {
    saveField: (field: string, value: unknown) => void;
    flush: () => Promise<void>;
};

export const AutoSaveContext = createContext<AutoSaveContextType | null>(null);

export function AutoSaveProvider({
    children,
    id,
}: {
    children: React.ReactNode;
    id?: string;
}) {
    const saveFn = async (payload: { changes: Record<string, unknown> }) => {
        await fetch("/api/trabajos/autoguardado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id,
                changes: payload.changes,
            }),
        });
    };

    const autoSave = useAutoSave(saveFn);

    return (
        <AutoSaveContext.Provider value={autoSave}>
            {children}
        </AutoSaveContext.Provider>
    );
}

export function useAutoSaveContext() {
    const ctx = useContext(AutoSaveContext);

    if (!ctx) {
        throw new Error("useAutoSaveContext must be used inside AutoSaveProvider");
    }

    return ctx;
}