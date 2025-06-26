import React, { useState } from "react";
import { ExerciseItem } from "./ExercisesTable";
import { BodyPart } from "@/app/apiTypes";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import icons from "@/app/icons";
import Modal from "@/app/components/Modal";
import TextInput from "@/app/components/forms/TextInput";
import SelectInput from "@/app/components/forms/SelectInput";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";

interface EditExerciseActionProps {
    exercise: ExerciseItem;
    refreshExercises: () => void;
}

export default function EditExerciseAction({
    exercise,
    refreshExercises,
}: EditExerciseActionProps) {
    const [isOpen, setIsOpen] = useState(false);

    const bodyPartOptions = Object.keys(BodyPart).map((key) => ({
        value: (BodyPart[key as keyof typeof BodyPart] as string).toLowerCase(),
        label: BodyPart[key as keyof typeof BodyPart] as string,
    }));

    const [name, setName] = useState(exercise.name);
    const [bodyPart, setBodyPart] = useState(exercise.body_part);

    const editExercise = () => {
        console.log(name, bodyPart);
        sendRequest(
            "/workouts/exercises",
            RequestMethod.PUT,
            JSON.stringify({
                id: exercise.id,
                name: name,
                body_part: bodyPart,
            }),
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setIsOpen(false);
                    refreshExercises();
                }
            },
            async (response: Response) => {
                console.log(response);
            }
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-1 text-sky-500 bg-sky-100 rounded"
            >
                {icons.edit}
            </button>
            <Modal modalState={[isOpen, setIsOpen]}>
                <div className="p-5 bg-white shadow rounded-xl">
                    <h2 className="text-xl mb-6">Edit {exercise.name}</h2>

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
                            onChange={(e) =>
                                setBodyPart(e.target.value as BodyPart)
                            }
                            options={bodyPartOptions}
                        />
                    </form>

                    <div className="mt-6 flex items-center justify-between gap-x-4">
                        <PrimaryButton onClick={editExercise}>
                            Save
                        </PrimaryButton>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-600 underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
