"use client";

import { FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import AutoField from "./AutoField";

interface AutoDateProps<T extends FieldValues> {

    name: FieldPath<T>;

    label?: string;

    rules?: RegisterOptions<T>;

    min?: string;

    max?: string;

    placeholder?: string;

}

export default function AutoDate<T extends FieldValues>({
    name,
    label,
    rules,
    min,
    max,
    placeholder
}: AutoDateProps<T>) {

    return (
        <AutoField
            name={name}
            rules={rules}
        >
            {({
                value,
                error,
                onChange,
                onBlur,
                required
            }) => {

                return (
                    <div className="w-full">

                        {label && (
                            <label className="block text-lg font-semibold text-[#1C4880] mb-3">
                                {label}
                                {required && " *"}
                            </label>
                        )}

                        <input
                            type="date"
                            value={value as string}
                            min={min}
                            max={max}
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none transition"
                        />

                        {error && (
                            <p className="text-sm text-red-600 mt-1">
                                {error}
                            </p>
                        )}

                    </div>
                );
            }}
        </AutoField>
    );
}