"use client";

import {
    FieldPath,
    FieldValues,
    RegisterOptions,
    useFormContext,
    useWatch
} from "react-hook-form";

import { ReactNode, useCallback, useId, useMemo } from "react";
import { useAutoSaveContext } from "@/components/form/context/AutoSaveContext";

export interface AutoFieldRenderProps {

    id: string;

    value: unknown;

    error?: string;

    required: boolean;

    onChange(value: unknown): void;

    onBlur(): void;

}

interface AutoFieldProps<T extends FieldValues> {

    name: FieldPath<T>;

    label?: ReactNode;

    rules?: RegisterOptions<T>;

    defaultValue?: unknown;

    children(props: AutoFieldRenderProps): ReactNode;

}

function splitPath(path: string) {

    const parts = path.split(".");

    if (parts.length === 1) {

        return {

            grupo: "trabajo",

            campo: parts[0]

        };

    }

    return {

        grupo: parts[0],

        campo: parts.slice(1).join(".")

    };

}

function buildObject(path: string, value: unknown) {

    const keys = path.split(".");

    const root: Record<string, unknown> = {};

    let current: Record<string, unknown> = root;

    keys.forEach((key, index) => {

        if (index === keys.length - 1) {

            current[key] = value;

            return;

        }

        current[key] = {};

        current = current[key];

    });

    return root;

}

export default function AutoField<T extends FieldValues>({
    name,
    rules,
    defaultValue,
    children
}: AutoFieldProps<T>) {

    const {
        register,
        setValue,
        formState
    } = useFormContext<T>();

    const { saveField } = useAutoSaveContext();

    const id = useId();

    const value = useWatch({

        name,

        defaultValue

    });

    register(name, rules);

    const error = useMemo(() => {

        const parts = String(name).split(".");

        let current: Record<string, unknown> | undefined = formState.errors as Record<string, unknown> | undefined;

        for (const p of parts) {

            current = current?.[p];

        }

        return current?.message?.toString();

    }, [formState.errors, name]);

    const save = useCallback((value: unknown) => {

        const { grupo, campo } = splitPath(String(name));

        saveField(

            grupo,

            buildObject(

                campo,

                value

            )

        );

    }, [name, saveField]);

    const handleChange = useCallback((value: unknown) => {

        setValue(

            name,

            value,

            {

                shouldDirty: true,

                shouldValidate: true

            }

        );

        save(value);

    }, [name, save, setValue]);

    const handleBlur = useCallback(() => {

        save(value);

    }, [save, value]);

    return children({

        id,

        value,

        error,

        required: !!rules?.required,

        onChange: handleChange,

        onBlur: handleBlur

    });

}