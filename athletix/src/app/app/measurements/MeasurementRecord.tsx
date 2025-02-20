"use client";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import LightButton from "@/app/components/buttons/LightButton";
import LightDangerButton from "@/app/components/buttons/LightDangerButton";
import useDefaultWeightUnit from "@/app/hooks/useDefaultWeightUnit";
import icons from "@/app/icons";
import React, { useState } from "react";

interface MeasurementRecordProps {
    id: number;
    date: string;
    value: {
        value: number;
        unit: string;
    };
    refreshMeasurements: () => void;
}

export default function MeasurementRecord({
    id,
    date,
    value,
    refreshMeasurements,
}: MeasurementRecordProps) {
    const [editOn, setEditOn] = useState(false);
    const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(false);

    const defaultUnit = useDefaultWeightUnit();

    const editMeasurementValue = (value: number, unit: string) => {
        setEditOn(false);
        sendRequest(
            `/users/measurements`,
            RequestMethod.PATCH,
            JSON.stringify({
                id,
                value: {
                    value,
                    unit,
                },
            }),
            async (response: Response) => {
                if (response.ok) {
                    refreshMeasurements();
                }
            },
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
            }
        );
    };

    const deleteMeasurement = () => {
        setDeleteBtnDisabled(true);
        sendRequest(
            `/users/measurements?id=${id}`,
            RequestMethod.DELETE,
            null,
            async (response: Response) => {
                if (response.ok) {
                    refreshMeasurements();
                }
            },
            async (response: Response) => {
                console.log(response);
            }
        );
    };

    return (
        <div className="flex items-center flex-wrap justify-between gap-8 shadow-sm p-5 rounded-xl">
            <div>
                {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
            </div>
            <div className="grow">
                <div className="font-semibold text-gray-600 border rounded-md px-4 py-2 inline-block">
                    {editOn === true ? (
                        <input
                            type="number"
                            name="value"
                            id="value"
                            className="inline-block min-w-16"
                            defaultValue={value.value}
                            onBlur={(e) =>
                                editMeasurementValue(
                                    Number.parseFloat(e.target.value),
                                    defaultUnit
                                )
                            }
                            autoFocus={editOn}
                        />
                    ) : (
                        <div onClick={() => setEditOn(true)}>
                            {value.value}
                            {value.unit}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-x-2">
                <LightButton variant="square" onClick={() => setEditOn(true)}>
                    {icons.edit}
                </LightButton>
                <LightDangerButton
                    variant="square"
                    disabled={deleteBtnDisabled}
                    onClick={deleteMeasurement}
                >
                    {icons.trash}
                </LightDangerButton>
            </div>
        </div>
    );
}
