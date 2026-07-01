"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Autocomplete from "@/components/prefabs/Autocomplete";
import { useAutoSaveContext } from "./provider/AutoSaveProvider";

interface Option {
    id: string;
    label: string;
    sublabel?: string;
}

interface AutoAutocompleteProps {
    name: string;
    label?: string;
    placeholder?: string;
    fetchOptions: (q: string) => Promise<Option[]>;
    idField?: string;
    className?: string;
    saveDelay?: number;
}

export default function AutoAutocomplete({
    name,
    label,
    placeholder,
    fetchOptions,
    idField,
    className,
    saveDelay = 500,
}: AutoAutocompleteProps) {

    const { setValue, getValues } = useFormContext();
    const autoSave = useAutoSaveContext();
    const save = autoSave?.saveField;
    
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [localValue, setLocalValue] = useState(getValues(name) ?? "");
    const isSelectingRef = useRef(false);

    // Sincronizar con el formulario cuando cambie externamente
    useEffect(() => {
        const formValue = getValues(name) ?? "";
        if (formValue !== localValue && !isSelectingRef.current) {
            setLocalValue(formValue);
        }
    }, [getValues, name]);

    const saveWithDebounce = useCallback(
        (fieldName: string, value: any) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                save?.(fieldName, value);
                timeoutRef.current = null;
            }, saveDelay);
        },
        [save, saveDelay]
    );

    const handleChange = useCallback((text: string) => {
        setLocalValue(text);
        setValue(name, text, {
            shouldDirty: true,
            shouldValidate: true,
        });
        saveWithDebounce(name, text);
    }, [name, setValue, saveWithDebounce]);

    const handleSelect = useCallback((option: Option | null) => {
        if (!option) {
            return;
        }
        
        isSelectingRef.current = true;
        
        const label = option.label;
        setLocalValue(label);
        setValue(name, label, {
            shouldDirty: true,
            shouldValidate: true,
        });

        if (idField) {
            setValue(idField, option.id, {
                shouldDirty: true,
                shouldValidate: true,
            });
            save?.(idField, option.id);
        }

        save?.(name, label);

        setTimeout(() => {
            isSelectingRef.current = false;
        }, 200);
    }, [name, idField, setValue, save]);

    return (
        <div className="w-full">
            {label && (
                <label className="block text-lg font-semibold text-[#1C4880] mb-3">
                    {label}
                </label>
            )}

            <Autocomplete
                key={`autocomplete-${name}`}
                value={localValue}
                onChange={handleChange}
                onSelect={handleSelect}
                fetchOptions={fetchOptions}
                placeholder={placeholder}
                className={className}
            />
        </div>
    );
}