import React from "react";

interface DateInputProps {
    label: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string;
    value: string;
}

export default function DateInput({ label, name, onChange, error, value }: DateInputProps) {
    return (
        <div className="flex flex-col gap-y-2">
            <label htmlFor={name}>{label}</label>
            <input
                type="date"
                name={name}
                id={name}
                onChange={onChange}
                value={value}
                required
                className="p-2 border rounded-md bg-white"
            />
            <p className="text-red-400">{error}</p>
        </div>
    );
}
