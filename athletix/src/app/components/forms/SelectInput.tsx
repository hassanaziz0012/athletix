import React from "react";

interface SelectInputProps {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: {
        value: string;
        label: string;
    }[];
}

export default function SelectInput({
    name,
    label,
    value,
    onChange,
    options,
}: SelectInputProps) {
    return (
        <div>
            {/* <div></div> */}
            <div className="flex flex-col gap-y-2">
                <label htmlFor={name}>{label}</label>
                <select
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e)}
                    className="p-2 rounded-md bg-slate-50 border"
                >
                    {options.map((option, i) => (
                        <option key={i} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
