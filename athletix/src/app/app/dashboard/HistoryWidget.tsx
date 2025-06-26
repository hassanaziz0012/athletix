"use client";
import { APIWorkout } from "@/app/apiTypes";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import React, { useEffect, useState } from "react";
import WorkoutsTableLayout from "../workouts/WorkoutsTableLayout";
import WorkoutsEmptyState from "../workouts/WorkoutsEmptyState";
import AnimatedLoader from "@/app/components/AnimatedLoader";

export default function HistoryWidget() {
    const [workouts, setWorkouts] = useState<APIWorkout[]>();

    const getSplit = () => {
        sendRequest(
            "/workouts/list",
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data = await response.json();
                setWorkouts(data);
            },
            async (response: Response) => {
                console.error("Error fetching split:", response);
            }
        );
    };

    useEffect(() => {
        getSplit();
    }, []);

    return (
        <div className="rounded-xl p-5 bg-white shadow">
            <h2 className="text-xl mb-12">History</h2>
            <AnimatedLoader show={workouts !== undefined}>
                {workouts && (
                    <>
                        {workouts.length > 0 && (
                            <WorkoutsTableLayout workouts={workouts} />
                        )}

                        {workouts.length === 0 && (
                            <WorkoutsEmptyState />
                        )}
                    </>
                )}
            </AnimatedLoader>
        </div>
    );
}
