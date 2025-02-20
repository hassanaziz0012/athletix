"use client";
import React, { useState } from "react";
import { ExerciseItem } from "./ExercisesTable";
import icons from "@/app/icons";
import Modal from "@/app/components/Modal";
import Button from "@/app/components/buttons/Button";

export default function DeleteExerciseConfirmAction({
    exercise,
}: {
    exercise: ExerciseItem;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-1 text-red-500 bg-red-100 rounded"
            >
                {icons.trash}
            </button>
            <Modal modalState={[isOpen, setIsOpen]}>
                <div className="p-5 rounded bg-white shadow">
                    <h4 className="text-xl mb-6">
                        Are you sure you want to delete{" "}
                        <span className="text-red-500">{exercise.name}</span>?
                    </h4>
                    <div className="max-w-md text-wrap text-gray-600">
                        <p className="mb-2">
                            If you delete this exercise, you will also lose any
                            data associated with it, such as PRs, records, and
                            others.
                        </p>
                        <p className="mb-2">
                            Please be sure that you actually want to do this.
                            This action is irreversible.
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-x-6 mt-6 border-t pt-6">
                        <Button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                exercise.onDelete(exercise.id);
                                setIsOpen(false);
                            }}
                            className="bg-red-500 text-white"
                        >
                            Yes, Delete it.
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
