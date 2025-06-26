"use client";
import React, { useEffect, useState } from "react";
import MeasurementGraph from "../dashboard/MeasurementGraph";
import MeasurementRecord from "./MeasurementRecord";
import { AnimatePresence, motion } from "motion/react";
import { displayWeightValue, RequestMethod, sendRequest } from "@/app/apiUtils";
import { APIMeasurement, APIMeasurementRecord } from "@/app/apiTypes";
import { animatedIcons } from "@/app/icons";
import LightButton from "@/app/components/buttons/LightButton";
import AddMeasurementRecord from "./AddMeasurementRecord";
import SetFavoriteMeasurement from "./SetFavoriteMeasurement";
import notify from "@/app/notify";
import useJoyride from "@/app/hooks/useJoyride";

interface MeasurementProps {
    heading: string;
    label: string;
    unit: string;
    showTutorial?: boolean;
}

export default function Measurement({
    heading,
    label,
    unit,
    showTutorial = false,
}: MeasurementProps) {
    const [measurement, setMeasurement] = useState<APIMeasurement>();
    // const [records, setRecords] = useState<APIMeasurementRecord[]>();
    const [showRecords, setShowRecords] = useState(false);
    const [latestRecord, setLatestRecord] = useState<APIMeasurementRecord>();

    const steps = [
        {
            target: ".add-measurement",
            content: "Add a new measurement record.",
        },
        {
            target: ".favorite-measurement",
            content:
                "Set this measurement as your favorite. This will then show up on your dashboard so you can track it easily.",
        },
    ];
    const [Joyride, startJoyride] = useJoyride("measurement-card", steps);

    useEffect(() => {
        if (showTutorial === true) {
            console.log("started joyride");
            startJoyride();
        }
    }, []);

    const getMeasurements = (showToast: boolean = false) => {
        let dismissToast = undefined;

        if (showToast) {
            dismissToast = notify({
                text: "Refreshing...",
            });
        }
        sendRequest(
            `/users/measurements?label=${label}`,
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data: APIMeasurement = await response.json();
                setMeasurement(data);
                // setRecords(data.records);
                setLatestRecord(data.records && data.records[0]);
                if (showToast && dismissToast) {
                    dismissToast();
                }
            },
            async (response: Response) => {
                console.log(response);
            }
        );
    };

    const refreshMeasurements = () => getMeasurements(true);

    useEffect(() => {
        getMeasurements();
    }, []);

    return (
        <div className="shadow rounded-xl bg-white">
            {showTutorial === true && <Joyride />}

            <div className="p-5 shadow rounded-xl flex justify-between flex-wrap gap-6">
                <div>
                    <p className="text-xl">{heading}</p>
                </div>
                <div className="flex items-center gap-x-6">
                    <AnimatePresence>
                        {latestRecord ? (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    translateY: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    translateY: 0,
                                    transition: {
                                        duration: 0.5,
                                    },
                                }}
                            >
                                <p className="text-xl">
                                    {displayWeightValue(
                                        latestRecord.value.value
                                    )}
                                    {latestRecord.value.unit}
                                </p>
                                <p className="text-slate-400">
                                    {latestRecord?.date &&
                                        new Date(
                                            latestRecord.date
                                        ).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                        })}
                                </p>
                            </motion.div>
                        ) : (
                            // if measurement has loaded, stop showing the spinner. bcos then it means that there are no records.
                            <>{!measurement && animatedIcons.spinner}</>
                        )}
                    </AnimatePresence>
                    <div className="flex items-center gap-x-4">
                        <div className="add-measurement">
                            <AddMeasurementRecord
                                label={label}
                                heading={heading}
                                unit={unit}
                                refreshMeasurements={refreshMeasurements}
                            />
                        </div>
                        <div className="favorite-measurement">
                            <SetFavoriteMeasurement
                                measurement={measurement}
                                refreshMeasurements={refreshMeasurements}
                            />
                        </div>
                    </div>
                </div>
                <div className="grow w-full mt-2">
                    <div className="relative top-full -my-5">
                        <LightButton
                            onClick={() => setShowRecords(!showRecords)}
                        >
                            {showRecords ? "Hide" : "Show all"}
                        </LightButton>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {measurement?.records && showRecords == true && (
                    <motion.div
                        initial={{ opacity: 0, marginTop: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            marginTop: "3rem",
                            height: "auto",
                            transition: {
                                duration: 0.3,
                                opacity: { delay: 0.2 },
                            },
                        }}
                        exit={{ opacity: 0, marginTop: 0, height: 0 }}
                        className="p-5 rounded-xl overflow-hidden"
                    >
                        {measurement?.records.length > 0 ? (
                            <>
                                <div className="mb-6">
                                    <MeasurementGraph
                                        records={measurement.records}
                                    />
                                </div>
                                <div className="flex flex-col gap-y-6">
                                    {measurement?.records?.map((m, i) => (
                                        <MeasurementRecord
                                            key={i}
                                            refreshMeasurements={
                                                refreshMeasurements
                                            }
                                            {...m}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div>
                                <p className="text-xl">
                                    No measurements available.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
