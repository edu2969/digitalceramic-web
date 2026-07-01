"use client";

import { FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import AutoField from "./AutoField";

interface AutoTextareaProps<T extends FieldValues> {
    name: FieldPath<T>;
    label?: string;
    placeholder?: string;
    rules?: RegisterOptions<T>;
    rows?: number;
    disabled?: boolean;
    readOnly?: boolean;
}

export default function AutoTextarea<T extends FieldValues>({
    name,
    label,
    placeholder,
    rules,
    rows = 4,
    disabled,
    readOnly
}: AutoTextareaProps<T>) {

    return (
        <AutoField name={name} rules={rules}>
            {({
                value,
                error,
                onChange,
                required
            }) => (
                <div className="w-full">

                    {label && (
                        <label className="block text-lg font-semibold text-[#1C4880] mb-3">
                            {label}
                            {required && " *"}
                        </label>
                    )}

                    <textarea
                        value={value ?? ""}
                        placeholder={placeholder}
                        rows={rows}
                        disabled={disabled}
                        readOnly={readOnly}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none transition resize-none"
                    />

                    {error && (
                        <p className="text-sm text-red-600 mt-1">
                            {error}
                        </p>
                    )}

                </div>
            )}
        </AutoField>
    );
}