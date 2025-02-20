import { APIWorkout } from "@/app/apiTypes";
import { getReadableDate } from "@/app/apiUtils";
import icons from "@/app/icons";
import React from "react";

type WorkoutProps = Partial<APIWorkout> & {
    id?: number;
    creation_date?: string;
    note?: string;
    templateSchedule?: string;
    templateDays?: string[];
};

export default function Workout({
    name,
    performed_date,
    exercises,
    volume,
    prs,
    templateSchedule,
    templateDays,
}: WorkoutProps) {
    const date = performed_date && new Date(performed_date);
    const readableDate = date && getReadableDate(date);

    return (
        <div
            className={`p-5 shadow rounded-xl text-slate-600 bg-white hover:bg-slate-100 duration-300 hover:cursor-pointer h-full`}
        >
            <div className="flex items-center justify-between mb-6">
                <p className="text-xl text-black">{name}</p>
                <button className="p-1 rounded-full bg-sky-500 text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-three-dots"
                        viewBox="0 0 16 16"
                    >
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                    </svg>
                </button>
            </div>
            {readableDate ? (
                <p className="mb-6">{readableDate}</p>
            ) : (
                <div className="flex items-center gap-x-2 mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 -960 960 960"
                    >
                        <path d="m612-292 56-56-148-148v-184h-80v216zM480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q133 0 226.5-93.5T800-480t-93.5-226.5T480-800t-226.5 93.5T160-480t93.5 226.5T480-160" />
                    </svg>

                    <p>
                        Repeats{" "}
                        <span className="px-2 py-1 rounded-md bg-sky-200">
                            {templateSchedule}
                        </span>{" "}
                        on every{" "}
                        <span className="px-2 py-1 rounded-md bg-sky-200">
                            {templateDays?.join(", ")}
                        </span>
                    </p>
                </div>
            )}
            <div className="mb-6 flex gap-x-4 items-center">
                <div className="flex items-center gap-x-1">
                    {icons.weight}
                    {volume?.value} {volume?.unit}
                </div>
                {prs && (
                    <div className="flex items-center gap-x-1">
                        {icons.trophy}
                        {prs} PRs
                    </div>
                )}
            </div>
            <ul className="flex flex-col gap-y-2">
                {exercises &&
                    exercises.map((exercise, i) => (
                        <li key={i} className="flex gap-x-6 justify-between">
                            <div className="flex gap-x-2">
                                <span>{exercise.sets.length}x</span>
                                <span>{exercise.name}</span>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
