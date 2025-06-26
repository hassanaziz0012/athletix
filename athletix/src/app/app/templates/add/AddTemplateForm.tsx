"use client";
import React from "react";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import WorkoutForm, { WorkoutFormBody } from "../../workouts/WorkoutForm";

export default function AddTemplateForm() {
    const addTemplate = (body: WorkoutFormBody) => {
        const reqBody = {
            schedule: body.template_schedule,
            days: body.template_days,
            workout: body
        }

        sendRequest(
            "/workouts/templates",
            RequestMethod.POST,
            JSON.stringify(reqBody),
            async (response: Response) => {
                const data = await response.json();
                if (data.success === true) {
                    window.location.href = "/app/templates";
                }
            },
            async (response: Response) => {
                console.error("Error adding template:", response);
            }
        );
    };

    return (
        <div>
            <WorkoutForm
                handleSubmit={addTemplate}
                is_template={true}
                submitBtnText="Add Template"
            />
        </div>
    );
}
