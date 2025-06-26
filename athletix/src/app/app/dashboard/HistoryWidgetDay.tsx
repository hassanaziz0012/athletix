import React, { useEffect, useState } from "react";
import Link from "next/link";
import { APIWorkout } from "@/app/apiTypes";
import Workout from "../workouts/Workout";

type SplitDay = {
    dateStr: string;
    workouts: APIWorkout[];
};

export default function HistoryWidgetDay({ dateStr, workouts }: SplitDay) {
    const [date, setDate] = useState(new Date(dateStr));

    useEffect(() => {
        setDate(new Date(dateStr));
    }, [dateStr]);

    const displayDate = () => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const displayDay = () => {
        return date.toLocaleDateString("en-US", { weekday: "long" });
    };

    return (
        <div className="flex flex-col gap-6 items-stretch pb-4 h-full">
            <div className="bg-slate-50 shadow p-5 rounded-xl min-w-32">
                <p className="text-xl mb-2">{displayDate()}</p>
                <p className="text-gray-600">{displayDay()}</p>
            </div>
            <div className="flex flex-wrap gap-3 grow">
                {workouts.map((workout, i) => (
                    <div key={i} className="grow basis-0">
                        <Link key={i} href={`/workouts/details?id=${workout.id}`}>
                            <Workout
                                key={i}
                                id={workout.id}
                                name={workout.name}
                                volume={workout.volume}
                                prs={workout.prs}
                                performed_date={workout.performed_date}
                                exercises={workout.exercises}
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
