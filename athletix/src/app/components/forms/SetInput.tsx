import React, { useEffect, useState } from "react";
import LightDangerButton from "../buttons/LightDangerButton";
import useDropdown from "@/app/hooks/useDropdown";
import { Set, setTypes } from "@/app/apiTypes";
import { getSetTypeClasses } from "@/app/apiUtils";
import icons from "@/app/icons";
import DurationInput from "./DurationInput";

interface SetInputProps {
    index: number;
    weight: {
        value: number;
        unit: string;
    };
    reps: number;
    duration: string;
    repsOrDuration: "reps" | "duration";
    typeSymbol: string;
    updateSet: (
        index: number,
        key: keyof Set,
        value: number | string | { value: number; unit: string }
    ) => void;
    removeSet: (index: number) => void;
}

export default function SetInput({
    index,
    weight,
    reps,
    duration,
    repsOrDuration,
    typeSymbol,
    updateSet,
    removeSet,
}: SetInputProps) {
    const [dropdownActive, toggleDropdown] = useDropdown("button");
    const [setTypeClasses, setSetTypeClasses] = useState("");

    const renderSetTypes = () => {
        return Object.keys(setTypes).map((type: string, i) => {
            const setType = setTypes[type as keyof typeof setTypes];

            return (
                <div
                    key={i}
                    onClick={() => updateSet(index, "type", setType.symbol)}
                    className={`flex items-center gap-x-4 px-5 py-4 ${setType.classes.text} ${setType.classes.hover} duration-300`}
                >
                    <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${setType.classes.bg} leading-none`}
                    >
                        {setType.symbol}
                    </div>
                    <div>
                        <p>{setType.label}</p>
                    </div>
                </div>
            );
        });
    };

    useEffect(() => {
        const classes = getSetTypeClasses(typeSymbol);
        setSetTypeClasses(classes);
    }, [typeSymbol]);

    useEffect(() => {
        console.log(weight);
    }, [weight]);

    return (
        <div className="mb-2 flex items-center gap-x-12">
            <button
                id="dropdown"
                className={`w-8 h-8 flex items-center justify-center rounded-full relative ${setTypeClasses}`}
                onClick={toggleDropdown}
            >
                {index + 1}

                <div
                    className={`absolute overflow-hidden rounded-xl bg-white shadow bottom-full left-0 flex flex-col duration-300 ${dropdownActive} ${
                        dropdownActive
                            ? "visible opacity-100 scale-100"
                            : "invisible opacity-0 scale-90"
                    }`}
                >
                    {renderSetTypes()}
                </div>
            </button>
            <div className="text-slate-600 flex items-center gap-x-6">
                <div className="max-w-14">
                    {index === 0 && <p>Weight</p>}
                    <input
                        type="number"
                        name="weight"
                        id="weight"
                        value={weight.value}
                        onChange={(e) =>
                            updateSet(index, "weight", {
                                value: Number(e.target.value),
                                unit: weight.unit,
                            })
                        }
                        className="w-full p-2 rounded-md"
                    />
                </div>
                <div className="">
                    {index === 0 && (
                        <p>{repsOrDuration === "reps" ? "Reps" : "Duration"}</p>
                    )}
                    {repsOrDuration === "reps" ? (
                        <input
                            type="number"
                            name="reps"
                            id="reps"
                            value={reps}
                            onChange={(e) =>
                                updateSet(index, "reps", Number(e.target.value))
                            }
                            className="w-full p-2 rounded-md max-w-14"
                        />
                    ) : (
                        <DurationInput
                            name={"duration" + index}
                            value={duration}
                            onChange={(value) =>
                                updateSet(index, "duration", value)
                            }
                            showLabel={false}
                        />
                    )}
                </div>
                {index > 0 && (
                    <LightDangerButton
                        variant="square"
                        className="self-start mt-2"
                        onClick={() => removeSet(index)}
                    >
                        {icons.trash}
                    </LightDangerButton>
                )}
            </div>
        </div>
    );
}
