"use client";
import React, { useEffect, useState } from "react";
import WorkoutForm from "../WorkoutForm";
import { getWorkout, RequestMethod, sendRequest } from "@/app/apiUtils";
import { APIWorkout } from "@/app/apiTypes";
import { useSearchParams } from "next/navigation";
import { animatedIcons } from "@/app/icons";
import notify from "@/app/notify";

export default function AddWorkoutForm() {
    const [templateWorkout, setTemplateWorkout] = useState<APIWorkout>();
    const searchParams = useSearchParams();
    const templateId = searchParams.get("template") || undefined;
    const workoutId = searchParams.get("workout") || undefined;

    const addWorkout = (body: object) => {
        sendRequest(
            "/workouts/add",
            RequestMethod.POST,
            JSON.stringify(body),
            async (response: Response) => {
                const data = await response.json();
                if (data.success === true) {
                    window.location.href = "/app/workouts";
                }
            },
            async (response: Response) => {
                console.error("Error adding workout:", response);
            }
        );
    };

    const getTemplateWorkout = () => {
        const dismissToast = notify({
            text: "Loading from template...",
            icon: animatedIcons.spinner,
        });
        sendRequest(
            `/workouts/templates?template_id=${templateId}`,
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
                setTemplateWorkout(data.workout);
                dismissToast();
            },
            async (response: Response) => {
                console.error("Error fetching template:", response);
            }
        );
    };

    const [loadWorkoutToastDismisser, setLoadWorkoutToastDismisser] =
        useState<() => void>();

    useEffect(() => {
        if (templateId) {
            getTemplateWorkout();
        }
        if (workoutId) {
            const dismissToast = notify({
                text: "Loading from workout...",
                icon: animatedIcons.spinner,
            });
            setLoadWorkoutToastDismisser(() => () => dismissToast());
            getWorkout(String(workoutId), setTemplateWorkout);
        }
    }, [templateId, workoutId]);

    useEffect(() => {
        if (templateWorkout && loadWorkoutToastDismisser) {
            loadWorkoutToastDismisser();
        }
    }, [templateWorkout, loadWorkoutToastDismisser]);

    return (
        <div>
            <WorkoutForm
                handleSubmit={addWorkout}
                edit={templateWorkout !== undefined}
                editedWorkout={templateWorkout}
                submitBtnText="Add Workout"
            />
        </div>
    );
}
