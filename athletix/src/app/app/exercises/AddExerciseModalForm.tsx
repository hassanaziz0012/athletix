"use client";
import { BodyPart } from "@/app/apiTypes";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import SelectInput from "@/app/components/forms/SelectInput";
import TextInput from "@/app/components/forms/TextInput";
import React, { useState } from "react";

interface AddExerciseModalFormProps {
    closeModal: () => void;
    onSubmit?: () => void;
}

export default function AddExerciseModalForm({
    closeModal,
    onSubmit
}: AddExerciseModalFormProps) {
    const bodyPartOptions = Object.keys(BodyPart).map((key) => ({
        value: (BodyPart[key as keyof typeof BodyPart] as string).toLowerCase(),
        label: BodyPart[key as keyof typeof BodyPart] as string,
    }));

    const [name, setName] = useState("");
    const [bodyPart, setBodyPart] = useState(bodyPartOptions[0].value);

    const addExercise = () => {
        sendRequest(
            "/workouts/exercises",
            RequestMethod.POST,
            JSON.stringify({
                name: name,
                body_part: bodyPart,
            }),
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    closeModal();
                }

                if (onSubmit) {
                    onSubmit();
                }
            },
            async (response: Response) => {
                console.log(response);
            }
        )
    }

    return (
        <div className="p-5 bg-white shadow rounded-xl">
            <h2 className="text-xl mb-6">Add Exercise</h2>

            <form action="#">
                <TextInput
                    name="name"
                    label="Name"
                    error=""
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Name"
                />

                <SelectInput
                    name="body_part"
                    label="Body Part"
                    value={bodyPart}
                    onChange={(e) => setBodyPart(e.target.value)}
                    options={bodyPartOptions}
                />
            </form>

            <div className="mt-6 flex items-center justify-between gap-x-4">
                <PrimaryButton onClick={addExercise}>Save</PrimaryButton>
                <button
                    onClick={closeModal}
                    className="text-gray-600 underline"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
