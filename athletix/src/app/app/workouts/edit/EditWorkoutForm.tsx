"use client";
import React, { useEffect, useState } from "react";
import WorkoutForm, { WorkoutFormBody } from "../WorkoutForm";
import { getWorkout, RequestMethod, sendRequest } from "@/app/apiUtils";
import { APIWorkout } from "@/app/apiTypes";
import AnimatedLoader from "@/app/components/AnimatedLoader";

type EditWorkoutFormBody = Partial<WorkoutFormBody> & {
    workout_id?: string;
};

export default function EditWorkoutForm({ workoutId }: { workoutId: string }) {
    const [workout, setWorkout] = useState<APIWorkout>();

    useEffect(() => {
        if (workoutId) {
            getWorkout(workoutId, setWorkout);
        }
    }, []);

    const editWorkout = (body: EditWorkoutFormBody) => {
        body["workout_id"] = workoutId;

        sendRequest(
            "/workouts/edit",
            RequestMethod.PUT,
            JSON.stringify(body),
            async (response: Response) => {
                const data = await response.json();
                if (data.success === true) {
                    window.location.href = `/app/workouts/details?id=${workoutId}`;
                }
            },
            async (response: Response) => {
                console.error("Error adding workout:", response);
            }
        );
    };

    return (
        <div>
            <AnimatedLoader show={workout !== undefined}>
                {workout && (
                    <WorkoutForm
                        handleSubmit={editWorkout}
                        submitBtnText="Save Changes"
                        edit={true}
                        editedWorkout={workout}
                        is_template={false}
                    />
                )}
            </AnimatedLoader>
        </div>
    );
}
