import React from "react";

type TextInputProps = {
    label?: string;
    placeholder?: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error: string;
    type?: "text" | "email" | "password";
};

export default function TextInput({
    label,
    placeholder = "",
    type = "text",
    name,
    value,
    required = true,
    error,
    onChange,
}: TextInputProps) {
    return (
        <div className="relative flex flex-col gap-y-2 mb-4">
            <label htmlFor={name}>{label}</label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="p-2 border rounded-md bg-white"
            />
            <p className="text-red-400">{error}</p>
        </div>
    );
}
