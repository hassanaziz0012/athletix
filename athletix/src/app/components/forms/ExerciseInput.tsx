"use client";
import React, { useEffect, useState } from "react";
import { WorkoutExercise, Set } from "@/app/apiTypes";
import LightButton from "../buttons/LightButton";
import SetInput from "./SetInput";
import icons from "@/app/icons";
import { AnimatePresence, motion } from "motion/react";
import SwitchInput from "./SwitchInput";
import useDefaultWeightUnit from "@/app/hooks/useDefaultWeightUnit";

type ExerciseInputProps = {
    index: number;
    exerciseName: string;
    isCardio?: boolean;
    defaultSets: Set[];
    defaultNote?: string;
    defaultRepsOrDuration: "reps" | "duration";
    updateExercise: (index: number, exercise: WorkoutExercise) => void;
    removeExercise: (index: number) => void;
    moveUp: (index: number) => void;
    moveDown: (index: number) => void;
    exerciseSuggestions?: string[];
};

export default function ExerciseInput({
    index,
    exerciseName,
    defaultSets,
    defaultNote,
    defaultRepsOrDuration,
    updateExercise,
    removeExercise,
    moveUp,
    moveDown,
    exerciseSuggestions,
}: ExerciseInputProps) {
    const [exercise, setExercise] = useState<string>(exerciseName);
    const [sets, setSets] = useState<Set[]>(defaultSets);
    const [note, setNote] = useState(defaultNote);

    const [exerciseNameFocused, setExerciseNameFocused] = useState(false);
    const [suggestionsFocused, setSuggestionsFocused] = useState(false);

    const [repsOrDuration, setRepsOrDuration] = useState<"reps" | "duration">(
        defaultRepsOrDuration || "reps"
    );

    const defaultUnit = useDefaultWeightUnit();

    useEffect(() => {
        const exerciseObj = {
            name: exercise,
            note: note,
            reps_or_duration: repsOrDuration,
            sets: sets,
        };
        updateExercise(index, exerciseObj);
    }, [exercise, sets, note]);

    const getSuggestions = () => {
        return exerciseSuggestions?.filter((suggestion) =>
            suggestion.toLowerCase().startsWith(exercise.toLowerCase())
        );
    };

    const pickSuggestion = (suggestion: string) => {
        setExercise(suggestion);
    };

    useEffect(() => {
        setExercise(exerciseName);
        setSets(defaultSets);
        setNote(defaultNote);
        setRepsOrDuration(defaultRepsOrDuration);
    }, [exerciseName, defaultSets, defaultNote, defaultRepsOrDuration]);

    const updateSet = (
        index: number,
        field: keyof Set,
        value: number | string | { value: number; unit: string }
    ) => {
        console.log(field, value);
        const newSets = [...sets];
        newSets[index][field] = value as never;
        setSets(newSets);
    };

    const addSet = (e: React.FormEvent) => {
        e.preventDefault();
        const lastSet = sets.at(-1);
        const newSets = [
            ...sets,
            {
                weight: lastSet?.weight || {
                    value: 0,
                    unit: defaultUnit || "kg",
                },
                reps: lastSet?.reps || 0,
                duration: lastSet?.duration || "",
                type: lastSet?.type || "N",
                tags: [],
            },
        ];
        // setSets([...sets, { weight: 0, reps: 0, type: "N", tags: [] }]);
        setSets(newSets);
    };

    const removeSet = (index: number) => {
        const newSets = [...sets];
        newSets.splice(index, 1);
        setSets(newSets);
    };

    return (
        <div className="flex items-center gap-x-4">
            <div className="p-5 bg-white rounded-2xl w-full shadow">
                <div className="p-5 bg-slate-50 rounded-2xl mb-6 shadow">
                    <input
                        type="text"
                        name="exercise"
                        id="exercise"
                        value={exerciseName}
                        placeholder="Enter exercise"
                        onChange={(e) => setExercise(e.target.value)}
                        onFocus={() => setExerciseNameFocused(true)}
                        onBlur={() => setExerciseNameFocused(false)}
                        className="text-2xl font-semibold block w-full bg-transparent"
                    />
                    <div className="relative">
                        <ul
                            className="absolute top-0 left-0 right-0 bg-white z-10"
                            onMouseEnter={() => setSuggestionsFocused(true)}
                            onMouseLeave={() => setSuggestionsFocused(false)}
                        >
                            {(exerciseNameFocused || suggestionsFocused) &&
                                exercise.length > 2 &&
                                getSuggestions()?.map((suggestion, i) => (
                                    <button
                                        key={i}
                                        className="p-5 block shadow-sm hover:cursor-pointer"
                                        type="button"
                                        onClick={() => {
                                            pickSuggestion(suggestion);
                                        }}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                        </ul>
                    </div>
                </div>

                <SwitchInput
                    state={[
                        repsOrDuration,
                        setRepsOrDuration as React.Dispatch<
                            React.SetStateAction<string>
                        >,
                    ]}
                    option1={{ label: "Reps", value: "reps" }}
                    option2={{ label: "Duration", value: "duration" }}
                />

                <AnimatePresence>
                    {sets?.map((set, i) => (
                        <motion.div
                            initial={{
                                opacity: 0,
                                translateY: "-100%",
                                scale: 0.95,
                                height: 0,
                            }}
                            animate={{
                                opacity: 1,
                                translateY: "0",
                                scale: 1,
                                height: "100%",
                            }}
                            exit={{
                                opacity: 0,
                                translateY: "-100%",
                                scale: 0.95,
                                height: 0,
                            }}
                            key={i}
                        >
                            <SetInput
                                index={i}
                                weight={set.weight}
                                reps={set.reps}
                                duration={set.duration || ""}
                                repsOrDuration={repsOrDuration}
                                typeSymbol={set.type}
                                updateSet={updateSet}
                                removeSet={removeSet}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                <div className="mb-6">
                    <LightButton onClick={addSet}>
                        <div className="flex items-center gap-x-2">
                            {icons.add}
                            Set
                        </div>
                    </LightButton>
                </div>

                <div className="mb-6">
                    <textarea
                        className="w-full rounded-md px-6 py-2 border"
                        placeholder="Any notes?"
                        value={defaultNote}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                </div>

                <button
                    className="text-rose-500"
                    onClick={() => removeExercise(index)}
                    type="button"
                >
                    Remove Exercise
                </button>
            </div>
            <div className="flex flex-col gap-y-2">
                <button
                    type="button"
                    onClick={() => moveUp(index)}
                    className="p-3 rounded-full bg-slate-700 text-white"
                >
                    {icons.arrowUp}
                </button>
                <button
                    type="button"
                    onClick={() => moveDown(index)}
                    className="p-3 rounded-full bg-slate-700 text-white"
                >
                    {icons.arrowDown}
                </button>
            </div>
        </div>
    );
}
