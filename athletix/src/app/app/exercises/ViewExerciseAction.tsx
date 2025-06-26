"use client";
import React, { useEffect, useState } from "react";
import { ExerciseItem } from "./ExercisesTable";
import ExerciseVolumeGraph from "./ExerciseVolumeGraph";
import ExerciseMaxRecordGraph from "./ExerciseMaxRecordGraph";
import { displayWeightValue, RequestMethod, sendRequest } from "@/app/apiUtils";
import icons from "@/app/icons";
import Modal from "@/app/components/Modal";
import Button from "@/app/components/buttons/Button";

interface ViewExerciseActionProps {
    exercise: ExerciseItem;
}

type RecordsResponse = {
    records: Record[];
};

type Record = {
    performed_date: string;
    volume: number;
    best_est_1rm: number;
};

type VolumeRecord = {
    date: string;
    volume: number;
};

type MaxRecord = {
    date: string;
    record: number;
};

export default function ViewExerciseAction({
    exercise,
}: ViewExerciseActionProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [volumeRecords, setVolumeRecords] = useState<VolumeRecord[]>();
    const [maxRecords, setMaxRecords] = useState<MaxRecord[]>();

    const getRecords = () => {
        sendRequest(
            `/workouts/exercises/historical?id=${exercise.id}`,
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data: RecordsResponse = await response.json();
                setVolumeRecords(parseVolumeRecords(data));
                setMaxRecords(parseMaxRecords(data));
            },
            async (response: Response) => {
                console.log(response);
            }
        );
    };

    const parseVolumeRecords = (data: RecordsResponse) => {
        return data.records.map((record) => {
            const dateStr = new Date(record.performed_date).toLocaleDateString(
                "default",
                {
                    month: "short",
                    day: "2-digit",
                }
            );
            return {
                date: dateStr,
                volume: record.volume,
            };
        });
    };

    const parseMaxRecords = (data: RecordsResponse) => {
        return data.records.map((record) => {
            const dateStr = new Date(record.performed_date).toLocaleDateString(
                "default",
                {
                    month: "short",
                    day: "2-digit",
                }
            );
            return {
                date: dateStr,
                record: record.best_est_1rm,
            };
        });
    };

    useEffect(() => {
        if (isOpen === true && !volumeRecords) {
            getRecords();
        }
    }, [isOpen, volumeRecords]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-1 text-emerald-500 bg-emerald-100 rounded"
            >
                {icons.view}
            </button>
            <Modal modalState={[isOpen, setIsOpen]}>
                <div className="p-5 rounded bg-white shadow">
                    <h4 className="text-xl mb-6">{exercise.name}</h4>
                    <div className="text-slate-600 flex flex-col gap-y-4">
                        <div>
                            <span className="font-semibold">
                                Estimated 1RM:{" "}
                            </span>
                            <span>
                                {displayWeightValue(
                                    exercise.stats?.estimated_1rm.value || 0
                                )}{" "}
                                {exercise.stats?.estimated_1rm.unit}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold">Max Volume: </span>
                            <span>
                                {displayWeightValue(
                                    exercise.stats?.max_vol.value || 0
                                )}{" "}
                                {exercise.stats?.max_vol.unit}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold">Max Weight: </span>
                            <span>
                                {displayWeightValue(
                                    exercise.stats?.max_weight.value || 0
                                )}{" "}
                                {exercise.stats?.max_weight.unit}
                            </span>
                        </div>
                    </div>

                    <div className="my-6">
                        {volumeRecords && volumeRecords.length > 0 && (
                            <ExerciseVolumeGraph records={volumeRecords} />
                        )}
                    </div>
                    <div className="my-6">
                        {maxRecords && maxRecords.length > 0 && (
                            <ExerciseMaxRecordGraph records={maxRecords} />
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-x-6 mt-6 border-t pt-6">
                        <Button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-600"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
