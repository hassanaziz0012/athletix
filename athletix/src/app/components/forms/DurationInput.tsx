import React, { useEffect, useState } from "react";

export default function DurationInput({
    name,
    value,
    onChange,
    showLabel = false,
}: {
    name: string;
    value: string,
    onChange: (value: string) => void;
    showLabel?: boolean;
}) {
    const [normalized, setNormalized] = useState(value || "00:00");

    useEffect(() => {
        onChange(normalized);
    }, [normalized]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value.toLowerCase().trim();

        // Remove invalid characters (allow only digits, h, m, s, :, and spaces)
        input = input.replace(/[^0-9hms:\s]/g, "");

        // Ensure 'h', 'm', and 's' appear only once
        input = input.replace(/(h.*)h|m.*m|s.*s/g, "$1");

        e.target.value = input;

        let hours = 0,
            minutes = 0,
            seconds = 0;

        if (/^\d+:([0-5]?\d):([0-5]?\d)$/.test(input)) {
            // Format: HH:MM:SS
            [hours, minutes, seconds] = input.split(":").map(Number);
        } else if (/^\d+:([0-5]?\d)$/.test(input)) {
            // Format: HH:MM
            [hours, minutes] = input.split(":").map(Number);
        } else {
            // Match '1h 30m 45s' or '90m 30s' format
            const match = input.match(
                /(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/
            );
            if (match) {
                hours = match[1] ? parseInt(match[1]) : 0;
                minutes = match[2] ? parseInt(match[2]) : 0;
                seconds = match[3] ? parseInt(match[3]) : 0;
            }
        }

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const normalized = `${String(Math.floor(totalSeconds / 3600)).padStart(
            2,
            "0"
        )}:${String(Math.floor((totalSeconds % 3600) / 60)).padStart(
            2,
            "0"
        )}:${String(totalSeconds % 60).padStart(2, "0")}`;

        setNormalized(normalized);
    };

    return (
        <div className="flex flex-col gap-y-2">
            {showLabel === true && (
                <label htmlFor="duration">Enter Duration:</label>
            )}
            <div className="flex items-center gap-x-2">
                <input
                    type="text"
                    name={name}
                    id={name}
                    defaultValue={value}
                    placeholder="1h 30m 45s or 00:45:30"
                    onInput={handleInput}
                    className="p-2 border rounded-md bg-white"
                />
                <p className="text-slate-600">{normalized}</p>
            </div>
        </div>
    );
}
