"use client";
import { APIWorkout } from "@/app/apiTypes";
import {
    getReadableDate,
    getWorkout,
    RequestMethod,
    sendRequest,
} from "@/app/apiUtils";
import LightButton from "@/app/components/buttons/LightButton";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ExerciseCard from "./ExerciseCard";
import icons from "@/app/icons";
import Button from "@/app/components/buttons/Button";
import AnimatedLoader from "@/app/components/AnimatedLoader";

export default function WorkoutDetails({ id }: { id: string }) {
    const [workout, setWorkout] = useState<APIWorkout | undefined>();
    const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(false);

    const deleteWorkout = () => {
        setDeleteBtnDisabled(true);
        sendRequest(
            `/workouts/delete?workout_id=${id}`,
            RequestMethod.DELETE,
            null,
            async () => {
                setDeleteBtnDisabled(false);
                window.location.href = "/app/workouts";
            },
            async (response: Response) => {
                console.error("Error deleting workout:", response);
            }
        );
    };

    const performedDate =
        workout?.performed_date &&
        getReadableDate(new Date(workout.performed_date));

    useEffect(() => {
        getWorkout(id, setWorkout);
    }, []);

    return (
        <AnimatedLoader show={workout !== undefined}>
            {workout && (
            <div>
                <h1 className="text-4xl font-semibold mb-6">{workout?.name}</h1>
                <div className="text-gray-600 mb-12">
                    <div className="mb-2 flex gap-x-2 items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-calendar"
                            viewBox="0 0 16 16"
                        >
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                        </svg>
                        {performedDate}
                    </div>
                    <p>{workout?.note}</p>
                </div>

                <div className="flex items-center justify-between gap-x-6">
                    <div className="flex gap-x-2">
                        <Link href={`/app/workouts/add?workout=${workout.id}`}>
                            <PrimaryButton
                                onClick={() => {}}
                                className="flex items-center gap-x-2"
                            >
                                {icons.repeat}
                                Perform again
                            </PrimaryButton>
                        </Link>
                        <Link href={`/app/workouts/edit?id=${id}`}>
                            <LightButton
                                onClick={() => {}}
                                className="flex items-center gap-x-2"
                            >
                                {icons.edit}
                                Edit
                            </LightButton>
                        </Link>
                    </div>
                    <div>
                        <Button
                            onClick={deleteWorkout}
                            disabled={deleteBtnDisabled}
                            className="flex items-center gap-x-1 text-red-600 disabled:text-red-300 duration-300"
                        >
                            {icons.trash} Delete
                        </Button>
                    </div>
                </div>

                <div className="mt-6">
                    {workout?.exercises.map((exercise, i) => (
                        <ExerciseCard key={i} {...exercise} />
                    ))}
                </div>
            </div>
            )}
        </AnimatedLoader>
    );
}
