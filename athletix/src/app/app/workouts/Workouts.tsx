"use client";
import React, { useEffect, useState } from "react";
import WorkoutsCardLayout from "./WorkoutsCardLayout";
import WorkoutsTableLayout from "./WorkoutsTableLayout";
import { motion } from "motion/react";
import { APIWorkout } from "@/app/apiTypes";
import Layouts from "@/app/dataLayouts";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import Container from "@/app/components/Container";
import icons from "@/app/icons";
import AnimatedLoader from "@/app/components/AnimatedLoader";
import AddWorkoutBtns from "./AddWorkoutBtns";
import WorkoutsEmptyState from "./WorkoutsEmptyState";

export default function Workouts() {
    const [workouts, setWorkouts] = useState<APIWorkout[]>();
    const [layout, setLayout] = useState<Layouts>(Layouts.TABLE);

    const getWorkouts = async () => {
        sendRequest(
            "/workouts/list",
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data = await response.json();
                setWorkouts(data);
            },
            async (response: Response) => {
                console.error("Error fetching workouts:", response);
            }
        );
    };

    useEffect(() => {
        getWorkouts();
    }, []);

    return (
        <Container>
            <div className="flex flex-wrap items-center justify-between gap-8 mb-12">
                <h1 className="text-2xl font-semibold grow">My Workouts</h1>
                <div>
                    <div className="flex gap-x-2 items-center border rounded p-2">
                        <button
                            onClick={() => setLayout(Layouts.TABLE)}
                            className={`${
                                layout === Layouts.TABLE ? "active" : ""
                            } [&.active]:bg-sky-500 [&.active]:text-white p-1 rounded`}
                        >
                            {icons.tableLayout}
                        </button>
                        <button
                            onClick={() => setLayout(Layouts.CARD)}
                            className={`${
                                layout === Layouts.CARD ? "active" : ""
                            } [&.active]:bg-sky-500 [&.active]:text-white p-1 rounded`}
                        >
                            {icons.cardLayout}
                        </button>
                    </div>
                </div>
                <AddWorkoutBtns />
            </div>

            <AnimatedLoader show={workouts !== undefined}>
                {workouts?.length === 0 && (
                    <WorkoutsEmptyState />
                )}

                {workouts && workouts.length > 0 && (
                    <>
                        {layout === Layouts.TABLE && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: { duration: 0.5 },
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                    transition: { duration: 0.5 },
                                }}
                            >
                                <WorkoutsTableLayout
                                    workouts={workouts || []}
                                />
                            </motion.div>
                        )}
                        {layout === Layouts.CARD && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: { duration: 0.5 },
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                    transition: { duration: 0.5 },
                                }}
                            >
                                <WorkoutsCardLayout workouts={workouts || []} />
                            </motion.div>
                        )}
                    </>
                )}
            </AnimatedLoader>
        </Container>
    );
}
