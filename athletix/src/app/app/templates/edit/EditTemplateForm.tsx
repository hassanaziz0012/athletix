"use client";
import React, { useEffect, useState } from "react";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import { APITemplate } from "@/app/apiTypes";
import WorkoutForm, { WorkoutFormBody } from "../../workouts/WorkoutForm";
import AnimatedLoader from "@/app/components/AnimatedLoader";

export default function EditTemplateForm({
    templateId,
}: {
    templateId: string;
}) {
    const [template, setTemplate] = useState<APITemplate | undefined>();

    const getTemplate = () => {
        sendRequest(
            `/workouts/templates?template_id=${templateId}`,
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data = await response.json();
                setTemplate(data);
            },
        async (response: Response) => {
                console.error("Error adding template:", response);
            }
        );
    };

    useEffect(() => {
        getTemplate()
    }, []);

    const editTemplate = (body: WorkoutFormBody) => {
        const reqBody = {
            template_id: templateId,
            schedule: body.template_schedule,
            days: body.template_days,
            workout: body,
        };

        sendRequest(
            "/workouts/templates",
            RequestMethod.PUT,
            JSON.stringify(reqBody),
            async (response: Response) => {
                const data = await response.json();
                if (data.success === true) {
                    window.location.href = `/app/templates/details?id=${templateId}`;
                }
            },
            async (response: Response) => {
                console.error("Error adding template:", response);
            }
        );
    };

    return (
        <div>
            <AnimatedLoader show={template !== undefined}>
                {template && (
                    <WorkoutForm
                        handleSubmit={editTemplate}
                        is_template={true}
                        submitBtnText="Save Changes"
                        edit={true}
                        editedWorkout={template?.workout}
                        defaultTemplateDays={template?.days}
                        defaultTemplateSchedule={template?.schedule}
                    />
                )}
            </AnimatedLoader>
        </div>
    );
}
