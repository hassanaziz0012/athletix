import React from "react";

interface CheckboxInputProps {
    label: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckboxInput({ label, name, onChange }: CheckboxInputProps) {
    return (
        <div className="flex gap-x-2">
            <input
                type="checkbox"
                name={name}
                id={name}
                onChange={onChange}
                className="p-2 border rounded-xl bg-slate-50"
            />
            <label htmlFor={name}>{label}</label>
        </div>
    );
}
