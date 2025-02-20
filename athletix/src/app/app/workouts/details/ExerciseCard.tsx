"use client";
import { WorkoutExercise } from "@/app/apiTypes";
import { displayWeightValue, getSetTypeClasses } from "@/app/apiUtils";
import icons from "@/app/icons";
import React from "react";

export default function ExerciseCard({
    name,
    reps_or_duration,
    sets,
}: WorkoutExercise) {
    return (
        <div className="mb-4 p-5 bg-white rounded-2xl shadow">
            <div className="p-5 bg-slate-50 rounded-2xl mb-6 shadow">
                <h2 className="text-2xl font-semibold">{name}</h2>
            </div>
            <ul>
                {sets
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((set, i) => (
                        <li key={i} className="mb-2 flex items-center gap-x-4">
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full 
                                    ${getSetTypeClasses(set.type)}`}
                            >
                                {i + 1}
                            </div>
                            <div className="text-slate-600">
                                {reps_or_duration === "reps"
                                    ? `${
                                          set.weight.value > 0
                                              ? displayWeightValue(set.weight.value) +
                                                " " +
                                                set.weight.unit +
                                                " x "
                                              : ""
                                      }${set.reps}`
                                    : `${
                                          set.weight.value > 0
                                              ? displayWeightValue(set.weight.value) +
                                                " " +
                                                set.weight.unit +
                                                " x "
                                              : ""
                                      }${set.duration}`}
                            </div>
                            <div className="flex gap-x-2">
                                {set.tags?.map((tag, i) => (
                                    <div
                                        key={i}
                                        className="px-2 py-1 flex gap-x-2 items-center rounded-full bg-pink-100 text-pink-700"
                                    >
                                        {icons.trophySmall}

                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
