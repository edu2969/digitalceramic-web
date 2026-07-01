"use client";

import { FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import AutoField from "./AutoField";

interface AutoInputProps<T extends FieldValues> {

    name: FieldPath<T>;

    label?: string;

    type?: React.HTMLInputTypeAttribute;

    placeholder?: string;

    rules?: RegisterOptions<T>;

    min?: number | string;

    max?: number | string;

    step?: number | string;

    readOnly?: boolean;

    disabled?: boolean;

}

export default function AutoInput<T extends FieldValues>({
    name,
    label,
    type = "text",
    placeholder,
    rules,
    min,
    max,
    step,
    readOnly,
    disabled
}: AutoInputProps<T>) {

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
                            type={type}
                            value={value ?? ""}
                            placeholder={placeholder}
                            min={min}
                            max={max}
                            step={step}
                            readOnly={readOnly}
                            disabled={disabled}
                            onChange={(e) => {

                                const val =
                                    type === "number"
                                        ? e.target.value === ""
                                            ? ""
                                            : Number(e.target.value)
                                        : e.target.value;

                                onChange(val);

                            }}
                            onBlur={onBlur}
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