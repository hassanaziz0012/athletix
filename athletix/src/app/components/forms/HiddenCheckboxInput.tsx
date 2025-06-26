import React from "react";

interface HiddenRadioInput {
    name: string;
    id: string;
    label: string;
    value: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function HiddenCheckboxInput({
    name,
    id,
    label,
    value,
    onChange,
}: HiddenRadioInput) {
    return (
        <fieldset>
            <input
                type="checkbox"
                name={name}
                id={id}
                value={id}
                className="peer hidden"
                onChange={onChange}
                checked={value}
            />
            <label
                htmlFor={id}
                className="px-3 py-3 rounded-md flex items-center justify-center border hover:cursor-pointer hover:bg-sky-200 peer-checked:bg-sky-500 peer-checked:text-white duration-300"
            >
                {label}
            </label>
        </fieldset>
    );
}
