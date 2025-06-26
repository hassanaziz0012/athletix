"use client";
import { APITemplate } from "@/app/apiTypes";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import Button from "@/app/components/buttons/Button";
import LightButton from "@/app/components/buttons/LightButton";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import icons, { animatedIcons } from "@/app/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ExerciseCard from "../../workouts/details/ExerciseCard";
import AnimatedLoader from "@/app/components/AnimatedLoader";
import notify from "@/app/notify";

export default function TemplateDetails({
    templateId,
}: {
    templateId: string;
}) {
    const [template, setTemplate] = useState<APITemplate | undefined>();
    const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(false);

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
                console.error("Error fetching template:", response);
            }
        );
    };

    const deleteTemplate = () => {
        setDeleteBtnDisabled(true);
        const dismissToast = notify({
            text: "Deleting template...",
            icon: animatedIcons.spinner,
        });
        sendRequest(
            `/workouts/templates?template_id=${templateId}`,
            RequestMethod.DELETE,
            null,
            async () => {
                setDeleteBtnDisabled(false);
                dismissToast();
                window.location.href = "/app/templates";
            },
            async (response: Response) => {
                console.error("Error deleting template:", response);
            }
        );
    };

    useEffect(() => {
        getTemplate();
    }, []);

    return (
        <AnimatedLoader show={template !== undefined}>
            {template && (
                <div>
                    <h1 className="text-4xl font-semibold mb-6">
                        {template.workout?.name}
                    </h1>
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
                            <div>
                                Repeats{" "}
                                <span className="capitalize font-semibold">
                                    {template.schedule}
                                </span>{" "}
                                {template.schedule != "daily" && (
                                    <>
                                        on every{" "}
                                        <span className="capitalize font-semibold">
                                            {template.days.join(", ")}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <p>{template.workout?.note}</p>
                    </div>

                    <div className="flex items-center justify-between gap-x-6">
                        <div className="flex gap-x-2">
                            <PrimaryButton
                                onClick={() => {}}
                                className="flex items-center gap-x-2"
                            >
                                {icons.repeat}
                                Perform again
                            </PrimaryButton>
                            <Link href={`/app/templates/edit?id=${templateId}`}>
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
                                onClick={deleteTemplate}
                                disabled={deleteBtnDisabled}
                                className="flex items-center gap-x-1 text-red-600 disabled:text-red-300 duration-300"
                            >
                                {icons.trash} Delete
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6">
                        {template.workout?.exercises.map((exercise, i) => (
                            <ExerciseCard key={i} {...exercise} />
                        ))}
                    </div>
                </div>
            )}
        </AnimatedLoader>
    );
}
