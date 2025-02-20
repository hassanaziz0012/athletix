import {
    RequestMethod,
    sendRequest,
    setDefaultWeightUnit,
} from "@/app/apiUtils";
import SelectInput from "@/app/components/forms/SelectInput";
import useDefaultWeightUnit from "@/app/hooks/useDefaultWeightUnit";
import React, { useEffect, useState } from "react";

export default function Settings() {
    const weightUnits = [
        {
            value: "kg",
            label: "Kilogram (kg)",
        },
        {
            value: "lb",
            label: "Pound (lb)",
        },
    ];
    const defaultUnit = useDefaultWeightUnit();
    const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");

    // defaultUnit can take a second to load, and it doesn't refresh weightUnit, so we manually set it here.
    useEffect(() => {
        if (defaultUnit) {
            setWeightUnit(defaultUnit);
        }
    }, [defaultUnit]);

    const saveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        sendRequest(
            "/users/profile",
            RequestMethod.PATCH,
            JSON.stringify({
                use_kg: weightUnit === "kg",
            }),
            async (response: Response) => {
                const data = await response.json();
                if (data.success === true) {
                    setDefaultWeightUnit(weightUnit);
                }
            },
            async (response: Response) => {
                console.error("Error saving profile:", response);
            }
        );
    };

    return (
        <div className="p-5 bg-white shadow rounded-xl">
            <h2 className="text-xl">Settings</h2>

            <div className="flex flex-col gap-y-3 my-8 text-slate-600">
                <form action="#">
                    <div>
                        <SelectInput
                            label="Unit for Weight"
                            name="weightUnit"
                            value={weightUnit}
                            options={weightUnits}
                            onChange={(e) =>
                                setWeightUnit(e.target.value as "kg" | "lb")
                            }
                        />
                        <p className="mt-2 text-slate-500">Some records may not update immediately. I recommend setting your local units first, and not changing them often.</p>
                    </div>
                </form>
            </div>

            <button
                onClick={saveProfile}
                className="px-6 py-3 bg-black text-white rounded-md"
            >
                Save
            </button>
        </div>
    );
}
