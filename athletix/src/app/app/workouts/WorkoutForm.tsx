"use client";
import CheckboxInput from "@/app/components/forms/CheckboxInput";
import DateInput from "@/app/components/forms/DateInput";
import ExerciseInput from "@/app/components/forms/ExerciseInput";
import TextInput from "@/app/components/forms/TextInput";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import React, { FormEvent, useEffect, useState } from "react";
import LightButton from "@/app/components/buttons/LightButton";
import { AnimatePresence, motion } from "motion/react";
import { APIWorkout, WorkoutExercise } from "@/app/apiTypes";
import {
    getTodayDate,
    RequestMethod,
    sendRequest,
} from "@/app/apiUtils";
import icons, { animatedIcons } from "@/app/icons";
import notify from "@/app/notify";
import HiddenCheckboxInput from "@/app/components/forms/HiddenCheckboxInput";
import useDefaultWeightUnit from "@/app/hooks/useDefaultWeightUnit";

export type WorkoutFormBody = {
    name: string;
    performed_date: string;
    note: string;
    save_as_template: boolean;
    template_schedule: string;
    template_days: string[];
    exercises: WorkoutExercise[];
};

type TemplateSchedule = "daily" | "weekly" | "biweekly";

interface WorkoutFormProps {
    handleSubmit: (body: WorkoutFormBody) => void;
    submitBtnText: string;
    edit?: boolean;
    editedWorkout?: APIWorkout;
    is_template?: boolean;
    defaultTemplateDays?: string[];
    defaultTemplateSchedule?: TemplateSchedule;
}

export default function WorkoutForm({
    handleSubmit,
    submitBtnText,
    edit,
    editedWorkout,
    is_template,
    defaultTemplateDays = [],
    defaultTemplateSchedule = "daily",
}: WorkoutFormProps) {
    const [name, setName] = useState("");
    const [performedDate, setPerformedDate] = useState(getTodayDate());
    const [notes, setNotes] = useState("");
    const [saveAsTemplate, setSaveAsTemplate] = useState(false);

    const [templateSchedule, setTemplateSchedule] = useState<TemplateSchedule>(
        defaultTemplateSchedule
    );

    const [templateDays, setTemplateDays] =
        useState<string[]>(defaultTemplateDays);

    const defaultUnit = useDefaultWeightUnit();

    const [exercises, setExercises] = useState<WorkoutExercise[]>([
        {
            name: "",
            note: "",
            reps_or_duration: "reps",
            sets: [
                {
                    id: 0,
                    weight: {
                        value: 0,
                        unit: defaultUnit,
                    },
                    reps: 0,
                    duration: undefined,
                    type: "N",
                    tags: [],
                },
            ],
        },
    ]);

    const [exerciseSuggestions, setExerciseSuggestions] = useState();
    const [btnDisabled, setBtnDisabled] = useState(false);

    // useEffect(() => {
    //     console.log("deth");
    //     if (is_template === true) {
    //         setTemplateSchedule(defaultTemplateSchedule);
    //         setTemplateDays(defaultTemplateDays);
    //     }
    // }, [defaultTemplateDays, defaultTemplateSchedule]);

    useEffect(() => {
        if (edit && editedWorkout) {
            setName(editedWorkout.name);
            const parsedDate = new Date(editedWorkout.performed_date);
            setPerformedDate(parsedDate.toISOString().substring(0, 10) || "");
            setNotes(editedWorkout.note || "");

            setExercises(editedWorkout.exercises);
        }
    }, [edit, editedWorkout]);

    const handleTemplateDaysChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTemplateDays((prev) => {
            if (prev.includes(e.target.value)) {
                return prev.filter((day) => day !== e.target.value);
            } else {
                return [...prev, e.target.value];
            }
        });
    };

    const getExerciseSuggestions = () => {
        const dismissToast = notify({
            text: "Loading exercise suggestions...",
            icon: animatedIcons.spinner,
        });

        sendRequest(
            "/workouts/exercises?names=true",
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data = await response.json();
                setExerciseSuggestions(data);
                dismissToast();
            },
            async (response: Response) => {
                console.log(response);
            }
        );
    };

    useEffect(() => {
        getExerciseSuggestions();
    }, []);

    useEffect(() => {
        console.log(exercises);
    }, [exercises]);

    const addExercise = () => {
        setExercises([
            ...exercises,
            {
                name: "",
                note: "",
                reps_or_duration: "reps",
                sets: [
                    {
                        weight: {
                            value: 0,
                            unit: defaultUnit,
                        },
                        reps: 0,
                        duration: undefined,
                        type: "N",
                    },
                ],
            },
        ]);
    };

    const swapExerciseOrders = (index1: number, index2: number) => {
        const newExercises = [...exercises];
        const temp = newExercises[index1];
        newExercises[index1] = newExercises[index2];
        newExercises[index2] = temp;
        setExercises(newExercises);
    };

    const moveExerciseUp = (index: number) => {
        if (index > 0) {
            swapExerciseOrders(index, index - 1);
        }
    };

    const moveExerciseDown = (index: number) => {
        if (index < exercises.length - 1) {
            swapExerciseOrders(index, index + 1);
        }
    };

    const updateExercise = (index: number, exercise: WorkoutExercise) => {
        const newExercises = [...exercises];
        newExercises[index] = exercise;
        setExercises(newExercises);
    };

    const removeExercise = (index: number) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setBtnDisabled(true);

        notify({
            text: "Saving changes...",
            icon: animatedIcons.spinner,
        });
        const body: WorkoutFormBody = {
            name,
            performed_date: performedDate,
            note: notes,
            save_as_template: saveAsTemplate,
            template_schedule: templateSchedule,
            template_days: templateDays,
            exercises: exercises.map((exercise) => ({
                name: exercise.name,
                note: exercise.note,
                reps_or_duration: exercise.reps_or_duration,
                sets: exercise.sets.map((set) => ({
                    id: set.id,
                    weight: set.weight,
                    reps: set.reps,
                    duration: set.duration,
                    type: set.type,
                })),
            })),
        };
        handleSubmit(body);
    };

    return (
        <div>
            <form>
                <div className="flex pb-12 mb-12">
                    {/* <div className="basis-0 grow">Basics</div> */}
                    <div className="basis-0 grow-[2]">
                        <div className="mb-6">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={
                                    is_template
                                        ? "Enter Template Name"
                                        : "Enter Workout Name"
                                }
                                className="border-b block text-4xl font-semibold bg-transparent w-full"
                            />
                        </div>

                        {!is_template && (
                            <div className="inline-block">
                                <DateInput
                                    label={"When did you do this workout?"}
                                    name={"date"}
                                    value={performedDate}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setPerformedDate(e.target.value)}
                                    error={""}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex border-b pb-12 mb-12">
                    {/* <div className="basis-0 grow">Exercises</div> */}
                    <div className="grow">
                        <AnimatePresence>
                            {exercises.map((exercise, i) => (
                                <motion.div
                                    initial={{
                                        // no need to scale first exercise, as that loads with page load.
                                        scale:
                                            exercises.length === 1 ? 1 : 0.85,
                                        translateY:
                                            exercises.length === 1
                                                ? "0"
                                                : "-25%",
                                        opacity:
                                            exercises.length === 1 ? 1 : 0.05,
                                    }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        translateY: "0",
                                    }}
                                    exit={{
                                        opacity: 0.05,
                                        translateY: "-25%",
                                        scale: 0.85,
                                        transition: {
                                            duration: 0.5,
                                        },
                                    }}
                                    // layout
                                    // transition={{
                                    //     // duration: 0.5,
                                    //     type: "spring",
                                    //     stiffness: 300,
                                    //     damping: 20,
                                    // }}
                                    className="mb-6"
                                    // key={exercise.name}
                                    key={i}
                                >
                                    <ExerciseInput
                                        index={i}
                                        exerciseName={exercise.name}
                                        defaultSets={exercise.sets}
                                        defaultNote={exercise.note}
                                        defaultRepsOrDuration={
                                            exercise.reps_or_duration
                                        }
                                        updateExercise={updateExercise}
                                        removeExercise={removeExercise}
                                        moveUp={moveExerciseUp}
                                        moveDown={moveExerciseDown}
                                        exerciseSuggestions={
                                            exerciseSuggestions
                                        }
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <div>
                            <LightButton onClick={addExercise}>
                                <div className="flex items-center gap-x-2">
                                    {icons.add}
                                    Add Exercise
                                </div>
                            </LightButton>
                        </div>
                    </div>
                </div>

                <div className="flex border-b pb-12 mb-12">
                    <div className="w-full">
                        <TextInput
                            label="Notes"
                            name="notes"
                            placeholder="Enter notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            required={false}
                            error=""
                        />

                        {!is_template && (
                            <>
                                <CheckboxInput
                                    label={"Save this as a template?"}
                                    name={"saveAsTemplate"}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setSaveAsTemplate(e.target.checked)}
                                />
                            </>
                        )}
                        {saveAsTemplate ||
                            (is_template && (
                                <div className="mt-6 flex flex-col gap-y-2">
                                    <fieldset className="flex items-center gap-x-2 mb-6">
                                        <label htmlFor="schedule">Repeat</label>

                                        <select
                                            name="schedule"
                                            id="schedule"
                                            className="px-3 py-2 rounded-md border-r-8"
                                            onChange={(e) =>
                                                setTemplateSchedule(
                                                    e.target
                                                        .value as TemplateSchedule
                                                )
                                            }
                                            value={templateSchedule}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">
                                                Weekly
                                            </option>
                                            <option value="biweekly">
                                                Biweekly
                                            </option>
                                        </select>
                                    </fieldset>

                                    <AnimatePresence>
                                        {["weekly", "biweekly"].includes(
                                            templateSchedule
                                        ) && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    translateY: -50,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    translateY: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    translateY: -50,
                                                }}
                                            >
                                                <p className="mb-2">
                                                    On every...
                                                </p>
                                                <div className="flex gap-x-2">
                                                    <HiddenCheckboxInput
                                                        name="days"
                                                        id="monday"
                                                        label="Monday"
                                                        value={templateDays.includes(
                                                            "monday"
                                                        )}
                                                        onChange={
                                                            handleTemplateDaysChange
                                                        }
                                                    />
                                                    <HiddenCheckboxInput
                                                        name="days"
                                                        id="tuesday"
                                                        label="Tuesday"
                                                        value={templateDays.includes(
                                                            "tuesday"
                                                        )}
                                                        onChange={
                                                            handleTemplateDaysChange
                                                        }
                                                    />
                                                    <HiddenCheckboxInput
                                                        name="days"
                                                        id="wednesday"
                                                        label="Wednesday"
                                                        value={templateDays.includes(
                                                            "wednesday"
                                                        )}
                                                        onChange={
                                                            handleTemplateDaysChange
                                                        }
                                                    />
                                                    <HiddenCheckboxInput
                                                        name="days"
                                                        id="thursday"
                                                        label="Thursday"
                                                        value={templateDays.includes(
                                                            "thursday"
                                                        )}
                                                        onChange={
                                                            handleTemplateDaysChange
                                                        }
                                                    />
                                                    <HiddenCheckboxInput
                                                        name="days"
                                                        id="friday"
                                                        label="Friday"
                                                        value={templateDays.includes(
                                                            "friday"
                                                        )}
                                                        onChange={
                                                            handleTemplateDaysChange
                                                        }
                                                    />
                                                    <HiddenCheckboxInput
                                                        name="days"
                                                        id="saturday"
                                                        label="Saturday"
                                                        value={templateDays.includes(
                                                            "saturday"
                                                        )}
                                                        onChange={
                                                            handleTemplateDaysChange
                                                        }
                                                    />
                                                    <HiddenCheckboxInput
                                                        name="days"
                                                        id="sunday"
                                                        label="Sunday"
                                                        value={templateDays.includes(
                                                            "sunday"
                                                        )}
                                                        onChange={
                                                            handleTemplateDaysChange
                                                        }
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="my-6">
                    <PrimaryButton
                        type="submit"
                        onClick={onSubmit}
                        disabled={btnDisabled}
                    >
                        {submitBtnText}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
